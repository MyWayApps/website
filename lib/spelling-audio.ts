"use client"

/**
 * Speaks an English spelling-practice word: pre-generated Azure static file
 * first (public/audio/spelling/<hash>.mp3, covering the fixed WORD_LISTS
 * vocabulary), then a live Azure call for anything not pre-generated (custom
 * user-typed words, AI-generated words), and the browser's own voice only
 * as a last resort — same priority as every other language in the app,
 * via the shared lib/static-tts.ts. Replaces the 7 copy-pasted
 * `new SpeechSynthesisUtterance()` implementations previously duplicated
 * across the Spelling Game Suite's games.
 */

import { playStaticTTS } from "./static-tts"

export function speakSpellingWord(word: string): Promise<void> {
  return playStaticTTS(word, "spelling", "en", "en-US")
}
