"use client"

/**
 * Speaks a full sentence for the dictation ("Listen and Type") game. Uses
 * the same Azure-first pipeline as everywhere else via lib/static-tts.ts,
 * but sentences are arbitrary/user-added text with no pre-generated static
 * cache (unlike the fixed spelling word lists), so this always goes through
 * the live Azure /api/tts call, falling back to the browser voice only if
 * that's unreachable. `silent: true` skips the floating "Play audio"
 * autoplay-fallback button — this game already has its own replay icon.
 */

import { playStaticTTS } from "./static-tts"

export function speakSentence(sentence: string): Promise<void> {
  return playStaticTTS(sentence, "sentences", "en", "en-US", { silent: true })
}
