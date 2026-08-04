// Sanskrit has no browser voice and no espeak voice (verified — neither
// espeak, espeak-ng, festival, flite, nor macOS `say` ship one). Cloud
// providers don't support it natively either: Google Cloud TTS and India's
// own Bhashini API both lack a Sanskrit voice, and the two open-source
// Sanskrit-TTS projects that exist (avinashvarna/sanskrit_tts,
// SameeraMurthy/sanskrit-tts) independently converge on the same workaround —
// transliterate to Kannada script and speak it with a Kannada voice, since
// Kannada's script maps closely enough to Sanskrit's phonemes to be
// intelligible. We do the same thing here, reusing the Kannada TTS pipeline
// (browser voice → espeak "kn" fallback) already built in hooks/use-tts.ts.

import Sanscript from "@indic-transliteration/sanscript"

export function transliterateToKannada(sanskritText: string): string {
  return Sanscript.t(sanskritText, "devanagari", "kannada")
}
