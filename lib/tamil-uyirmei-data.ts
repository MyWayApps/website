// உயிர்மெய் எழுத்துக்கள் (Uyirmei) data — Tamil's equivalent of Telugu's
// Gunintaalu: each of the 18 pure consonants (மெய் எழுத்து) combined with
// each of the 12 vowels (உயிர் எழுத்து), 18 x 12 = 216 combined letters.
// Shared by all 4 tamil-uyirmei game routes so the vowel/matra table and
// consonant list exist in exactly one place (unlike the Telugu gunintaalu
// pages, which each hardcode their own copies).

import { tamilConsonants } from "./tamil-letters-data"

export const uyirmeiConsonants: string[] = tamilConsonants.map((c) => c.letter)

export interface UyirmeiMatra {
  matra: string
  name: string
}

// Matra sign (empty for the inherent "அ" vowel) paired with the vowel's own
// independent letter — Tamil doesn't use a separate grammatical suffix for
// this the way Telugu's matra names take "... కారము".
export const uyirmeiMatraData: UyirmeiMatra[] = [
  { matra: "", name: "அ" },
  { matra: "ா", name: "ஆ" },
  { matra: "ி", name: "இ" },
  { matra: "ீ", name: "ஈ" },
  { matra: "ு", name: "உ" },
  { matra: "ூ", name: "ஊ" },
  { matra: "ெ", name: "எ" },
  { matra: "ே", name: "ஏ" },
  { matra: "ை", name: "ஐ" },
  { matra: "ொ", name: "ஒ" },
  { matra: "ோ", name: "ஓ" },
  { matra: "ௌ", name: "ஔ" },
]

export const uyirmeiMatraSequence: string[] = uyirmeiMatraData.map((m) => m.matra)
export const uyirmeiMatraNames: string[] = uyirmeiMatraData.map((m) => m.name)

/** "க் + (அ) = க" / "க் + ா (ஆ) = கா" — the half-letter formula shown on the learn and match screens. */
export function uyirmeiFormula(consonant: string, matra: string, name: string, result: string): string {
  return matra === ""
    ? `${consonant}் + (${name}) = ${result}`
    : `${consonant}் + ${matra} (${name}) = ${result}`
}

/** Same formula without the "= result" tail, for the match game's draggable option labels. */
export function uyirmeiOptionText(consonant: string, matra: string, name: string): string {
  return matra === ""
    ? `${consonant}் + (${name})`
    : `${consonant}் + ${matra} (${name})`
}
