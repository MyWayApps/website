// Plain, diacritic-free phonetic romanization for native-script words, so a
// reader who can't read Telugu/Hindi/Kannada/Tamil/Malayalam/Sanskrit script
// can still sound the word out (e.g. Telugu "తేలు" -> "teelu", Hindi
// "रविवार" -> "ravivaara"). Deliberately NOT strict IAST/ITRANS output —
// those use diacritics (ā, ṇ, ś, …) or capital-letter conventions most
// readers won't know how to pronounce, so we generate IAST via the existing
// @indic-transliteration/sanscript dependency (already used for Sanskrit TTS
// in lib/sanskrit-tts.ts) and then simplify its diacritics down to plain
// ASCII digraphs a non-reader can sound out unaided.

import Sanscript from "@indic-transliteration/sanscript"

export type NativeScript = "devanagari" | "telugu" | "kannada" | "tamil" | "malayalam"

// Order matters: longer/composed patterns before the plain "c" -> "ch" rule,
// which must not double up aspirated consonants IAST already spells "ch".
const DIACRITIC_REPLACEMENTS: [RegExp, string][] = [
  [/ā/g, "aa"],
  [/ī/g, "ee"],
  [/ū/g, "oo"],
  [/ē/g, "ee"],
  [/ō/g, "oo"],
  // Anusvara (ṃ) is a nasal that takes the sound of whatever consonant
  // follows it ("n" before most consonants, "m" before labials/at word
  // end/before a vowel) — handled before the other rules so it sees the
  // original consonant, not an already-simplified one.
  [/ṃ(?=[pbm])/g, "m"],
  [/ṃ(?=[^aeiouāīūṛṝḷḹ])/g, "n"],
  [/ṃ/g, "m"],
  [/ṅ/g, "ng"],
  [/ñ/g, "ny"],
  [/ṭ/g, "t"],
  [/ḍ/g, "d"],
  [/ṇ/g, "n"],
  [/ś/g, "sh"],
  [/ṣ/g, "sh"],
  [/ṛ/g, "ri"],
  [/ḷ/g, "li"],
  [/ḻ/g, "zh"], // Tamil/Malayalam retroflex approximant, e.g. தமிழ் "tamiḻ" -> "tamizh"
  [/c(?!h)/g, "ch"],
]

function simplifyIast(iast: string): string {
  const withDigraphs = DIACRITIC_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    iast
  )
  // Safety net for any diacritic not explicitly handled above (including
  // decomposed combining-mark forms some scripts fall back to, e.g.
  // Malayalam's retroflex ள often renders as a bare "l" + combining ring
  // below rather than a precomposed character) — strip to plain ASCII
  // rather than leak an unreadable mark into the UI.
  return withDigraphs.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

const romanizeCache = new Map<string, string>()

/**
 * Romanizes a native-script word/phrase into plain, sound-it-out English
 * letters. Falls back to returning the original text if transliteration
 * fails for any reason (e.g. mixed-script or punctuation-only input).
 */
export function romanize(text: string, script: NativeScript): string {
  if (!text || !text.trim()) return ""

  const cacheKey = `${script}:${text}`
  const cached = romanizeCache.get(cacheKey)
  if (cached !== undefined) return cached

  try {
    const iast = Sanscript.t(text, script, "iast")
    const simplified = simplifyIast(iast)
    romanizeCache.set(cacheKey, simplified)
    return simplified
  } catch {
    return text
  }
}
