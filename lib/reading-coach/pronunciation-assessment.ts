/**
 * Client-side wrapper around the Azure Speech SDK for the Reading Coach
 * feature only. Deliberately kept in its own folder/module, separate from
 * lib/azure-tts-voices.ts (which uses plain REST and is used by unrelated,
 * already-working TTS features) — this is the one place in the app that
 * needs the actual `microsoft-cognitiveservices-speech-sdk` package, loaded
 * dynamically so it's never pulled into server-side rendering.
 *
 * Uses continuous recognition + Azure's "miscue" detection: the whole
 * passage is given as reference text once, Azure segments the child's
 * speech into utterances by natural pauses, and each utterance's result
 * includes per-word Omission/Insertion/Mispronunciation classification
 * against that reference — this is what makes uninterrupted, whole-passage
 * reading feasible without building our own audio segmentation.
 */

import type { WordResult, UtteranceResult, ReadingSessionCallbacks, ReadingSession } from "./types"
export type { WordResult, UtteranceResult, ReadingSessionCallbacks, ReadingSession } from "./types"

async function fetchAuthToken(): Promise<{ token: string; region: string }> {
  const res = await fetch("/api/speech-token")
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Failed to fetch speech token (${res.status})`)
  }
  return res.json()
}

/**
 * Requests mic access up front and immediately releases the tracks. The SDK's
 * own AudioConfig acquires the mic lazily when recognition starts, and if
 * that acquisition fails (permission denied, no device, insecure context)
 * the SDK surfaces it as an opaque WebSocket close (e.g. "StatusCode: 1006")
 * instead of a clear permission error — checking here first gives callers an
 * actionable message instead.
 */
async function ensureMicrophoneAccess(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error(
      "Microphone access isn't available in this browser (requires HTTPS or localhost)."
    )
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((t) => t.stop())
  } catch (err) {
    const name = err instanceof Error ? err.name : ""
    if (name === "NotAllowedError" || name === "SecurityError") {
      throw new Error("Microphone access was blocked — allow the microphone for this site and try again.")
    }
    if (name === "NotFoundError") {
      throw new Error("No microphone was found on this device.")
    }
    throw new Error(`Couldn't access the microphone: ${err instanceof Error ? err.message : String(err)}`)
  }
}

/**
 * Starts a continuous, whole-passage pronunciation assessment session using
 * the device microphone. Resolves once recognition has actually started;
 * results stream in via callbacks.onUtterance as the child reads, and the
 * caller decides when to stop (e.g. a "Stop Reading" button).
 */
export async function startContinuousReadingAssessment(
  passageText: string,
  locale: string,
  callbacks: ReadingSessionCallbacks
): Promise<ReadingSession> {
  await ensureMicrophoneAccess()

  const SpeechSDK = await import("microsoft-cognitiveservices-speech-sdk")
  const { token, region } = await fetchAuthToken()

  const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region)
  speechConfig.speechRecognitionLanguage = locale
  // Required to get the detailed NBest[].Words[] JSON (word-level ErrorType /
  // AccuracyScore) that the miscue-detection parsing above depends on.
  speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()

  const pronunciationConfig = new SpeechSDK.PronunciationAssessmentConfig(
    passageText,
    SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
    SpeechSDK.PronunciationAssessmentGranularity.Word,
    /* enableMiscue */ true
  )

  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)
  pronunciationConfig.applyTo(recognizer)

  recognizer.recognized = (_sender, event) => {
    if (event.result.reason !== SpeechSDK.ResultReason.RecognizedSpeech) return

    try {
      const raw = event.result.properties.getProperty(
        SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
      )
      const parsed = JSON.parse(raw)
      const nBest = parsed?.NBest?.[0]
      if (!nBest) return

      const words: WordResult[] = (nBest.Words || []).map((w: any) => ({
        word: w.Word,
        errorType: w.PronunciationAssessment?.ErrorType || "None",
        accuracyScore: w.PronunciationAssessment?.AccuracyScore ?? 0,
      }))

      const assessment = nBest.PronunciationAssessment || {}
      callbacks.onUtterance({
        words,
        accuracyScore: assessment.AccuracyScore ?? 0,
        fluencyScore: assessment.FluencyScore ?? 0,
        completenessScore: assessment.CompletenessScore ?? 0,
        pronunciationScore: assessment.PronScore ?? 0,
      })
    } catch (err) {
      callbacks.onError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  recognizer.canceled = (_sender, event) => {
    if (event.reason === SpeechSDK.CancellationReason.Error) {
      const details = event.errorDetails || "Recognition canceled"
      const hint = details.includes("1006")
        ? " (the connection to Azure Speech was dropped before it could start — check your network/firewall isn't blocking WebSocket connections to *.speech.microsoft.com, and that the speech token hasn't expired)"
        : ""
      callbacks.onError(new Error(details + hint))
    }
  }

  await new Promise<void>((resolve, reject) => {
    recognizer.startContinuousRecognitionAsync(resolve, reject)
  })

  let stopped = false
  return {
    stop: async () => {
      if (stopped) return
      stopped = true
      await new Promise<void>((resolve, reject) => {
        recognizer.stopContinuousRecognitionAsync(() => {
          recognizer.close()
          callbacks.onEnded?.()
          resolve()
        }, reject)
      })
    },
  }
}
