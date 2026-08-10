/**
 * Client-side reading-assessment engine built on the browser's built-in Web
 * Speech API (webkitSpeechRecognition / SpeechRecognition) instead of Azure
 * — free, no API key, no server round-trip. Supported in Chrome, Edge, and
 * Safari; not Firefox.
 *
 * Unlike Azure Pronunciation Assessment, the browser only returns a plain
 * transcript with no phoneme-level scoring, so mistakes are detected by
 * diffing the recognized words against the expected passage (skipped/wrong/
 * added words) rather than true pronunciation-quality scoring — there is no
 * "said the right word but mispronounced it" detection with this engine.
 */

import type { ReadingSession, ReadingSessionCallbacks, UtteranceResult, WordResult } from "./types"

export type { ReadingSession, ReadingSessionCallbacks } from "./types"

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "")
}

/**
 * LCS-based word diff: aligns `said` against `expected`, marking matches
 * None, expected words the child didn't say Omission, and extra said words
 * Insertion — emitted in expected-word order with insertions interleaved
 * where they occurred, matching the shape Azure's miscue detection used to
 * produce so the rest of the pipeline (session-aggregator, UI) needs no
 * changes.
 */
function diffWords(expected: string[], said: string[]): WordResult[] {
  const n = expected.length
  const m = said.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        normalize(expected[i]) === normalize(said[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const result: WordResult[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (normalize(expected[i]) === normalize(said[j])) {
      result.push({ word: expected[i], errorType: "None", accuracyScore: 100 })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ word: expected[i], errorType: "Omission", accuracyScore: 0 })
      i++
    } else {
      result.push({ word: said[j], errorType: "Insertion", accuracyScore: 0 })
      j++
    }
  }
  while (i < n) {
    result.push({ word: expected[i], errorType: "Omission", accuracyScore: 0 })
    i++
  }
  while (j < m) {
    result.push({ word: said[j], errorType: "Insertion", accuracyScore: 0 })
    j++
  }
  return result
}

function getSpeechRecognitionCtor(): (new () => any) | null {
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

async function ensureMicrophoneAccess(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone access isn't available in this browser (requires HTTPS or localhost).")
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
 * Starts a continuous, whole-passage reading session using the device
 * microphone and the browser's own speech recognizer. Resolves once
 * recognition has started; results stream in via callbacks.onUtterance as
 * the child reads each recognized phrase, and the caller decides when to
 * stop (e.g. a "Stop Reading" button).
 */
export async function startContinuousReadingAssessment(
  passageText: string,
  locale: string,
  callbacks: ReadingSessionCallbacks
): Promise<ReadingSession> {
  const log = (...args: any[]) => console.log("[ReadingCoach]", ...args)

  const Ctor = getSpeechRecognitionCtor()
  if (!Ctor) {
    throw new Error("Speech recognition isn't supported in this browser — please use Chrome, Edge, or Safari.")
  }

  await ensureMicrophoneAccess()
  log("microphone access granted")

  const expectedWords = passageText.trim().split(/\s+/)
  let pointer = 0
  let manuallyStopped = false

  const recognition = new Ctor()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = locale

  recognition.onstart = () => {
    log("recognition started — listening")
    callbacks.onStatus?.("listening")
  }

  // These two fire purely from local audio/VAD, before any network round
  // trip to recognize words — they're the clearest proof the mic itself is
  // being read, independent of whether recognition ever resolves any text.
  recognition.onaudiostart = () => log("mic audio capture started")
  recognition.onspeechstart = () => {
    log("speech detected (browser heard sound that looks like speech)")
    callbacks.onStatus?.("speech-detected")
  }
  recognition.onspeechend = () => {
    log("speech ended, waiting for recognition result")
    callbacks.onStatus?.("processing")
  }
  recognition.onnomatch = () => log("recognition ran but could not match any words")

  recognition.onresult = (event: any) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      const transcript: string = result[0].transcript

      if (!result.isFinal) {
        log("interim transcript:", transcript)
        callbacks.onInterim?.(transcript)
        continue
      }

      log("final transcript:", transcript)
      const said: string[] = transcript.trim().split(/\s+/).filter(Boolean)
      if (said.length === 0) continue

      const remaining = expectedWords.slice(pointer)
      const words = diffWords(remaining, said)
      pointer += words.filter((w) => w.errorType !== "Insertion").length
      log("diff vs expected:", words)

      const utterance: UtteranceResult = {
        words,
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
      }
      callbacks.onUtterance(utterance)
    }
  }

  recognition.onerror = (event: any) => {
    log("error event:", event.error)
    if (event.error === "no-speech" || event.error === "aborted") return
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      callbacks.onError(new Error("Microphone access was blocked — allow the microphone for this site and try again."))
      return
    }
    callbacks.onError(new Error(`Speech recognition error: ${event.error}`))
  }

  // Chrome's "continuous" mode still stops itself after a stretch of
  // silence or after a single utterance in some versions — restart
  // automatically unless the user actually pressed Stop, so a real pause
  // between sentences doesn't silently end the session.
  recognition.onend = () => {
    log("recognition ended", manuallyStopped ? "(stop requested)" : "(unexpected — restarting)")
    if (manuallyStopped) {
      callbacks.onEnded?.()
      return
    }
    callbacks.onStatus?.("listening")
    setTimeout(() => {
      if (!manuallyStopped) {
        try {
          recognition.start()
        } catch (err) {
          log("restart failed:", err)
        }
      }
    }, 250)
  }

  recognition.start()

  return {
    stop: () =>
      new Promise<void>((resolve) => {
        manuallyStopped = true
        recognition.onend = () => {
          log("recognition ended (stop requested)")
          callbacks.onEnded?.()
          resolve()
        }
        recognition.stop()
      }),
  }
}
