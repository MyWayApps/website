/**
 * Tamil TTS: pre-generated Azure static audio first, live /api/tts as
 * backup, browser voice as last resort. Thin wrapper around
 * lib/static-tts.ts, matching the lib/telugu-tts.ts pattern — kept as a
 * separate module so call sites read `playTamilTTS(text)` rather than
 * repeating the static-tts arguments everywhere.
 */

import { playStaticTTS } from './static-tts'

export async function playTamilTTS(text: string): Promise<void> {
  return playStaticTTS(text, 'tamil', 'ta', 'ta-IN')
}
