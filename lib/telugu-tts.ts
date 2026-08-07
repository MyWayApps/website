/**
 * Telugu TTS: browser neural voice first, pre-generated Azure static audio
 * as backup, live /api/tts as last resort for text with no pre-generated
 * file. Thin wrapper around lib/static-tts.ts — kept as a separate module
 * (rather than inlined at call sites) so hooks/use-language-speak.ts's
 * existing `playTeluguTTS`/`generateTeluguTTS` imports don't need to change.
 */

import { playStaticTTS } from './static-tts'

export async function playTeluguTTS(text: string): Promise<void> {
  return playStaticTTS(text, 'telugu', 'te', 'te')
}

/**
 * Legacy function for compatibility
 */
export async function generateTeluguTTS(text: string): Promise<string> {
  await playTeluguTTS(text)
  return ''
}
