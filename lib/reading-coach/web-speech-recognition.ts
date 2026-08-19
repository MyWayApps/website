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

import type { ReadingSession, ReadingSessionCallbacks, UtteranceResult } from "./types"
import { normalize, diffWords } from "./word-diff"
import { getSpeechRecognitionCtor, ensureMicrophoneAccess } from "./browser-speech-utils"

export type { ReadingSession, ReadingSessionCallbacks } from "./types"

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

  const CtorOrNull = getSpeechRecognitionCtor()
  if (!CtorOrNull) {
    throw new Error("Speech recognition isn't supported in this browser — please use Chrome, Edge, or Safari.")
  }
  const Ctor = CtorOrNull

  await ensureMicrophoneAccess()
  log("microphone access granted")

  const expectedWords = passageText.trim().split(/\s+/)
  let pointer = 0
  let manuallyStopped = false
  // Set once retries are exhausted (see MAX_QUICK_FAILURES below) so no
  // further restart attempts happen — without this, a persistently broken
  // recognizer would otherwise retry forever with the user seeing nothing
  // but "listening" and no way to know it's actually stuck.
  let gaveUp = false
  // Interim transcripts get revised as more audio arrives (the recognizer
  // can shrink or change its guess mid-utterance), which would otherwise
  // make the live "how far has the reader gotten" pointer visibly jump
  // backward — track the best match seen so far for the utterance in
  // progress and only ever report forward. Reset once that utterance
  // finalizes, since the next one starts from a clean slate.
  let bestInterimMatch = 0

  let lastEventAt = Date.now()
  let startedAt = Date.now()
  // If recognition keeps ending almost immediately after starting (seen in
  // the wild as an "aborted" error firing right after onaudiostart, over
  // and over), creating a brand-new instance on every single restart can
  // itself be the cause — the browser hasn't released the previous
  // instance's session yet, so the new one gets aborted on contact,
  // forever. Reusing the same instance (like a plain .start() retry) is
  // what actually recovers in that case; a fresh instance is only a
  // fallback if restarting the existing one throws outright.
  let consecutiveQuickFailures = 0
  const MAX_QUICK_FAILURES = 6
  const QUICK_FAILURE_WINDOW_MS = 1200

  let recognition = new Ctor()

  function attachHandlers(r: any) {
    r.continuous = true
    r.interimResults = true
    r.lang = locale

    r.onstart = () => {
      startedAt = Date.now()
      lastEventAt = Date.now()
      log("recognition started — listening")
      callbacks.onStatus?.("listening")
    }

    // These two fire purely from local audio/VAD, before any network round
    // trip to recognize words — they're the clearest proof the mic itself is
    // being read, independent of whether recognition ever resolves any text.
    r.onaudiostart = () => {
      lastEventAt = Date.now()
      log("mic audio capture started")
      callbacks.onProgress?.(0)
    }
    r.onspeechstart = () => {
      lastEventAt = Date.now()
      log("speech detected (browser heard sound that looks like speech)")
      callbacks.onStatus?.("speech-detected")
    }
    r.onspeechend = () => {
      lastEventAt = Date.now()
      log("speech ended, waiting for recognition result")
      callbacks.onStatus?.("processing")
    }
    r.onnomatch = () => {
      lastEventAt = Date.now()
      log("recognition ran but could not match any words")
    }

    r.onresult = (event: any) => {
      lastEventAt = Date.now()
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript: string = result[0].transcript

        if (!result.isFinal) {
          log("interim transcript:", transcript)
          const said: string[] = transcript.trim().split(/\s+/).filter(Boolean)
          const remaining = expectedWords.slice(pointer)
          // Simple left-to-right prefix match (not the full LCS diff) — good
          // enough for a live "how far has the reader gotten" pointer, and
          // deliberately cheap/stable since this runs on every interim event.
          let matchedCount = 0
          while (
            matchedCount < said.length &&
            matchedCount < remaining.length &&
            normalize(remaining[matchedCount]) === normalize(said[matchedCount])
          ) {
            matchedCount++
          }
          bestInterimMatch = Math.max(bestInterimMatch, matchedCount)
          callbacks.onProgress?.(bestInterimMatch)
          continue
        }

        log("final transcript:", transcript)
        const said: string[] = transcript.trim().split(/\s+/).filter(Boolean)
        bestInterimMatch = 0
        if (said.length === 0) continue

        // Diff against a small window past the pointer, not the entire rest
        // of the passage — diffWords marks everything in `expected` that it
        // couldn't align as Omission, so handing it the whole remaining book
        // against one short utterance made a single final result skip-mark
        // (and advance the pointer past) every word left to read. A few
        // words of slack still tolerates the reader skipping or adding a
        // word or two without under-sizing the window.
        const WINDOW_SLACK = 6
        const remaining = expectedWords.slice(pointer)
        const window = remaining.slice(0, said.length + WINDOW_SLACK)
        // fillTrailingOmissions: false — Chrome routinely finalizes a chunk
        // mid-sentence (a brief pause is enough), so `said` running out
        // before `window` does usually just means this chunk ended early,
        // not that the reader skipped the rest of the window. Only commit
        // words the diff actually found real evidence for (matches, plus
        // omissions sandwiched between two real matches); leave the
        // uncommitted tail for the next chunk's window to pick up, instead
        // of permanently marking words the reader hasn't even reached yet
        // as wrong — that one-way "ratchet" was what made later sentences
        // cascade into false red marks after any early chunk cutoff.
        const words = diffWords(window, said, { fillTrailingOmissions: false })
        pointer += words.filter((w) => w.errorType !== "Insertion").length
        log("diff vs expected:", words)

        callbacks.onProgress?.(0)
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

    r.onerror = (event: any) => {
      lastEventAt = Date.now()
      log("error event:", event.error)
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        gaveUp = true
        callbacks.onError(new Error("Microphone access was blocked — allow the microphone for this site and try again."))
        return
      }
      // Everything else (aborted, no-speech, network hiccups, ...) is
      // handled uniformly by onend's restart/backoff/give-up logic below —
      // onend always fires after onerror, so there's nothing extra to do here.
    }

    // Chrome's "continuous" mode still stops itself after a stretch of
    // silence or after a single utterance in some versions — restart
    // automatically unless the user actually pressed Stop, so a real pause
    // between sentences doesn't silently end the session. If restarts keep
    // failing almost instantly, back off and eventually give up loudly
    // instead of retrying forever.
    r.onend = () => {
      const sessionLengthMs = Date.now() - startedAt
      log(
        "recognition ended",
        manuallyStopped ? "(stop requested)" : `(unexpected after ${sessionLengthMs}ms — restarting)`
      )
      if (manuallyStopped || gaveUp) {
        callbacks.onEnded?.()
        return
      }

      consecutiveQuickFailures = sessionLengthMs < QUICK_FAILURE_WINDOW_MS ? consecutiveQuickFailures + 1 : 0

      if (consecutiveQuickFailures > MAX_QUICK_FAILURES) {
        gaveUp = true
        log("giving up after repeated immediate restart failures")
        callbacks.onError(
          new Error(
            "Speech recognition keeps stopping right after it starts. Try reloading the page, make sure no other tab/app is using the microphone, or try a different browser (Chrome tends to be most reliable)."
          )
        )
        return
      }

      callbacks.onStatus?.("listening")
      // Gentle backoff as failures pile up, so a flaky browser gets a real
      // chance to release the previous session instead of hammering it.
      const delay = 250 + Math.min(consecutiveQuickFailures, 5) * 400
      setTimeout(() => {
        if (manuallyStopped || gaveUp) return
        try {
          recognition.start()
        } catch (err) {
          log("restart on the same instance failed, trying a fresh one:", err)
          try {
            recognition = new Ctor()
            attachHandlers(recognition)
            recognition.start()
          } catch (err2) {
            log("fresh-instance restart also failed:", err2)
            gaveUp = true
            callbacks.onError(new Error("Couldn't restart speech recognition — try reloading the page."))
          }
        }
      }, delay)
    }
  }

  attachHandlers(recognition)
  recognition.start()

  // Stall watchdog: if a browser ever goes quiet without firing onend at
  // all (observed in the wild — the session just stops responding, mic
  // indicator included, with no further event to react to), abort it
  // ourselves so the onend handler above takes over normal recovery.
  const WATCHDOG_CHECK_MS = 4000
  const WATCHDOG_STALL_MS = 12000
  const watchdog = setInterval(() => {
    if (manuallyStopped || gaveUp) return
    if (Date.now() - lastEventAt > WATCHDOG_STALL_MS) {
      log("watchdog: no recognition events for a while — aborting to trigger a restart")
      lastEventAt = Date.now()
      try {
        recognition.abort()
      } catch (err) {
        log("watchdog abort failed:", err)
      }
    }
  }, WATCHDOG_CHECK_MS)

  // Live chunk diffs deliberately leave uncertain trailing words uncommitted
  // (see fillTrailingOmissions above) so a later chunk gets a chance to
  // confirm them — but once the session is actually over, nothing more is
  // coming, so flush whatever's left as genuinely skipped. Without this,
  // words near wherever the reader happened to stop would sit at "pending"
  // forever and never count toward the end-of-session summary.
  function flushRemaining() {
    const remaining = expectedWords.slice(pointer)
    if (remaining.length === 0) return
    const words = diffWords(remaining, [], { fillTrailingOmissions: true })
    pointer += words.length
    callbacks.onUtterance({
      words,
      accuracyScore: 0,
      fluencyScore: 0,
      completenessScore: 0,
      pronunciationScore: 0,
    })
  }

  return {
    stop: () =>
      new Promise<void>((resolve) => {
        manuallyStopped = true
        clearInterval(watchdog)
        recognition.onend = () => {
          log("recognition ended (stop requested)")
          flushRemaining()
          callbacks.onEnded?.()
          resolve()
        }
        try {
          recognition.stop()
        } catch {
          flushRemaining()
          callbacks.onEnded?.()
          resolve()
        }
      }),
  }
}
