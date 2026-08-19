/**
 * Non-continuous, one-sentence-at-a-time speech recognition for browsers
 * (Safari, chiefly) whose SpeechRecognition implementation doesn't reliably
 * support the continuous, auto-restarting whole-passage session used by
 * `web-speech-recognition.ts` — every restart there happens inside a
 * `setTimeout`, with no user gesture, which Safari's stricter activation
 * requirements reject outright.
 *
 * `recognizeOneSentence` is self-contained per call — no running `pointer`
 * across sentences, so there's no cross-chunk drift to manage the way the
 * continuous engine has to. Call it fresh, directly inside a click handler,
 * for every sentence the child is about to read.
 *
 * IMPORTANT: unlike the continuous engine, this file deliberately does NOT
 * request microphone permission itself (that's an `await`, which would
 * break the synchronous click-to-`.start()` chain Safari requires). Callers
 * must `await ensureMicrophoneAccess()` from browser-speech-utils.ts once,
 * up front, before the first call — see app/english-reading's Safari flow.
 */

import type { UtteranceResult } from "./types"
import { normalize, diffWords } from "./word-diff"
import { getSpeechRecognitionCtor } from "./browser-speech-utils"

export { ensureMicrophoneAccess } from "./browser-speech-utils"

export interface SingleUtteranceCallbacks {
  /** Live left-to-right prefix match within the sentence, before it finalizes. */
  onProgress?: (matchedCount: number) => void
  onStatus?: (status: string) => void
}

function emptyResult(expectedWords: string[]): UtteranceResult {
  return {
    words: diffWords(expectedWords, [], { fillTrailingOmissions: true }),
    accuracyScore: 0,
    fluencyScore: 0,
    completenessScore: 0,
    pronunciationScore: 0,
  }
}

/**
 * Listens for exactly one sentence's worth of speech and resolves with its
 * word-level diff against `sentenceText`. Must be invoked directly inside a
 * user-gesture handler (e.g. a button's onClick) — the executor below calls
 * `.start()` synchronously, with no `await` in front of it, so the call
 * itself (not just something awaited inside it) has to happen on the click.
 */
export function recognizeOneSentence(
  sentenceText: string,
  locale: string,
  callbacks: SingleUtteranceCallbacks = {}
): Promise<UtteranceResult> {
  const expectedWords = sentenceText.trim().split(/\s+/).filter(Boolean)

  return new Promise<UtteranceResult>((resolve, reject) => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      reject(new Error("Speech recognition isn't supported in this browser."))
      return
    }

    const recognition = new Ctor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = locale

    let settled = false
    let bestInterimMatch = 0

    const settleResolve = (result: UtteranceResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }
    const settleReject = (err: Error) => {
      if (settled) return
      settled = true
      reject(err)
    }

    recognition.onstart = () => callbacks.onStatus?.("listening")
    recognition.onspeechstart = () => callbacks.onStatus?.("speech-detected")
    recognition.onspeechend = () => callbacks.onStatus?.("processing")

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript: string = result[0].transcript

        if (!result.isFinal) {
          const said: string[] = transcript.trim().split(/\s+/).filter(Boolean)
          let matchedCount = 0
          while (
            matchedCount < said.length &&
            matchedCount < expectedWords.length &&
            normalize(expectedWords[matchedCount]) === normalize(said[matchedCount])
          ) {
            matchedCount++
          }
          bestInterimMatch = Math.max(bestInterimMatch, matchedCount)
          callbacks.onProgress?.(bestInterimMatch)
          continue
        }

        const said: string[] = transcript.trim().split(/\s+/).filter(Boolean)
        // Single self-contained utterance against just this sentence — safe
        // to trust trailing Omissions here, unlike the continuous engine's
        // windowed mid-passage chunks, since there's nothing more coming
        // for this sentence.
        const words = diffWords(expectedWords, said, { fillTrailingOmissions: true })
        settleResolve({ words, accuracyScore: 0, fluencyScore: 0, completenessScore: 0, pronunciationScore: 0 })
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        settleReject(new Error("Microphone access was blocked — allow the microphone for this site and try again."))
        return
      }
      if (event.error === "no-speech" || event.error === "aborted") {
        // Nothing recognized — treat as "read nothing" rather than an app error.
        settleResolve(emptyResult(expectedWords))
        return
      }
      settleReject(new Error(`Speech recognition error: ${event.error}`))
    }

    recognition.onend = () => {
      // Ended without ever getting a final result (e.g. immediate silence) —
      // resolve rather than hang forever.
      settleResolve(emptyResult(expectedWords))
    }

    try {
      recognition.start()
    } catch (err) {
      settleReject(err instanceof Error ? err : new Error(String(err)))
    }
  })
}
