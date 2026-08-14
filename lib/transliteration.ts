// Plain, diacritic-free phonetic romanization for native-script words, so a
// reader who can't read Telugu/Hindi/Kannada/Tamil/Malayalam/Sanskrit script
// can still sound the word out (e.g. Telugu "తేలు" -> "teelu", Hindi
// "रविवार" -> "ravivaara"). Deliberately NOT strict IAST/ITRANS output —
// those use diacritics (ā, ṇ, ś, …) or capital-letter conventions most
// readers won't know how to pronounce, so we generate IAST via the existing
// @indic-transliteration/sanscript dependency (already used for Sanskrit TTS
// in lib/sanskrit-tts.ts) and then simplify its diacritics down to plain
// ASCII digraphs a non-reader can sound out unaided.
//
// Tamil is handled separately (see romanizeTamil below) instead of through
// Sanscript. Tamil script uses one letter (e.g. ப) for what Devanagari spells
// with four (प/फ/ब/भ), so Sanscript's Tamil->IAST direction — built by
// reversing its Devanagari->Tamil table — resolves every such letter to
// whichever Devanagari variant was last in that table (always the voiced
// aspirate: bha/dha/jha/gha), producing "bhoonai" for பூனை instead of
// "poonai". Tamil also has no aspirated consonants at all, so that reversal
// is wrong regardless of which variant it picked.

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

const TAMIL_VIRAMA = "்" // ் (pulli) — marks a consonant as bare (no inherent vowel)
const TAMIL_AYTHAM = "ஃ"

// ே/ோ (long e/o) stay "e"/"o" rather than doubling like ீ/ூ (long i/u) do —
// casual Tamil romanization doesn't lengthen e/o (தேங்காய் -> "thengai", not
// "theengai"; மேல் -> "mel", not "meel"), only i/u get the doubled-letter
// treatment (தீ -> "thee", தூங்கு -> "thoongu").
const TAMIL_VOWEL_SIGNS: Record<string, string> = {
  "ா": "aa", "ி": "i", "ீ": "ee", "ு": "u", "ூ": "oo",
  "ெ": "e", "ே": "e", "ை": "ai", "ொ": "o", "ோ": "o", "ௌ": "au",
}

const TAMIL_INDEPENDENT_VOWELS: Record<string, string> = {
  "அ": "a", "ஆ": "aa", "இ": "i", "ஈ": "ee", "உ": "u", "ஊ": "oo",
  "எ": "e", "ஏ": "e", "ஐ": "ai", "ஒ": "o", "ஓ": "o", "ஔ": "au",
}

// வல்லினம் (vallinam) stops: unvoiced word-initial/geminate, voiced between
// vowels or after a nasal — e.g. இது -> "idhu", பூனை -> "poonai".
const TAMIL_STOPS: Record<string, [unvoiced: string, voiced: string]> = {
  "க": ["k", "g"],
  "ச": ["ch", "s"],
  "ட": ["t", "d"],
  "த": ["th", "dh"],
  "ப": ["p", "b"],
}

// Geminate (doubled) forms. க/ட/ப double the letter (kk/tt/pp); ச/த
// conventionally stay single (ch/th) rather than doubling to "chch"/"thth".
const TAMIL_GEMINATE_FORMS: Record<string, string> = {
  "க": "kk", "ட": "tt", "ப": "pp", "ச": "ch", "த": "th",
}

const TAMIL_NASALS: Record<string, string> = {
  "ங": "ng", "ஞ": "ny", "ண": "n", "ந": "n", "ம": "m", "ன": "n",
}

const TAMIL_OTHER_CONSONANTS: Record<string, string> = {
  "ய": "y", "ர": "r", "ல": "l", "வ": "v", "ழ": "zh", "ள": "l", "ற": "r",
  "ஜ": "j", "ஷ": "sh", "ஸ": "s", "ஹ": "h", "ஶ": "sh",
}

type TamilSoundContext = "start" | "vowel" | "nasal" | "consonant"

/**
 * Romanizes Tamil script directly (bypassing Sanscript — see the comment at
 * the top of this file for why) using Tamil's own consonant-voicing rule
 * instead of a lossy round trip through Devanagari.
 */
function romanizeTamil(text: string): string {
  const chars = Array.from(text)
  let result = ""
  let prev: TamilSoundContext = "start"

  let i = 0
  while (i < chars.length) {
    const ch = chars[i]

    if (TAMIL_INDEPENDENT_VOWELS[ch]) {
      result += TAMIL_INDEPENDENT_VOWELS[ch]
      prev = "vowel"
      i++
      continue
    }

    if (ch === TAMIL_AYTHAM) {
      result += "h"
      prev = "consonant"
      i++
      continue
    }

    if (ch === TAMIL_VIRAMA) {
      // Orphaned virama (malformed input) — nothing sensible to consume.
      i++
      continue
    }

    // ன்ற -> "ndr", ற்ற -> "tr": fixed sandhi clusters, not plain gemination
    // (e.g. இன்று -> "indru", மற்று -> "matru").
    if ((ch === "ன" || ch === "ற") && chars[i + 1] === TAMIL_VIRAMA && chars[i + 2] === "ற") {
      const cluster = ch === "ன" ? "ndr" : "tr"
      const next = chars[i + 3]
      if (TAMIL_VOWEL_SIGNS[next]) {
        result += cluster + TAMIL_VOWEL_SIGNS[next]
        prev = "vowel"
        i += 4
      } else if (next === TAMIL_VIRAMA) {
        result += cluster
        prev = "consonant"
        i += 4
      } else {
        result += cluster + "a"
        prev = "vowel"
        i += 3
      }
      continue
    }

    const stop = TAMIL_STOPS[ch]
    const nasal = TAMIL_NASALS[ch]
    const other = TAMIL_OTHER_CONSONANTS[ch]

    if (!stop && !nasal && !other) {
      // Not a Tamil letter we know how to sound out (space, punctuation,
      // digit, other script) — pass through unchanged; it's a word break.
      result += ch
      prev = "start"
      i++
      continue
    }

    const isGeminate = !!stop && chars[i + 1] === TAMIL_VIRAMA && chars[i + 2] === ch
    if (isGeminate) {
      const base = TAMIL_GEMINATE_FORMS[ch]
      const next = chars[i + 3]
      if (TAMIL_VOWEL_SIGNS[next]) {
        result += base + TAMIL_VOWEL_SIGNS[next]
        prev = "vowel"
        i += 4
      } else if (next === TAMIL_VIRAMA) {
        result += base
        prev = "consonant"
        i += 4
      } else {
        result += base + "a"
        prev = "vowel"
        i += 3
      }
      continue
    }

    const isBare = chars[i + 1] === TAMIL_VIRAMA
    const voice = !!stop && (prev === "vowel" || prev === "nasal")
    const sound = stop ? (voice ? stop[1] : stop[0]) : nasal || other

    if (isBare) {
      result += sound
      prev = nasal ? "nasal" : "consonant"
      i += 2
      continue
    }

    const vowelSignChar = chars[i + 1]
    if (TAMIL_VOWEL_SIGNS[vowelSignChar]) {
      result += sound + TAMIL_VOWEL_SIGNS[vowelSignChar]
      i += 2
    } else {
      result += sound + "a" // inherent vowel
      i += 1
    }
    prev = "vowel"
  }

  return result
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
    const simplified =
      script === "tamil" ? romanizeTamil(text) : simplifyIast(Sanscript.t(text, script, "iast"))
    romanizeCache.set(cacheKey, simplified)
    return simplified
  } catch {
    return text
  }
}
