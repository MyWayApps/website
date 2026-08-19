import { malayalamConsonants } from "./malayalam-letters-data"

export const chertthezhuthuConsonants: string[] = malayalamConsonants.map((c) => c.letter)

export interface ChertthezhuthuMatra {
  matra: string
  name: string
}

// Matches the 12 vowels in malayalam-letters-data.ts (no ഋ, no separate
// anusvara/visarga rows there either).
export const chertthezhuthuMatraData: ChertthezhuthuMatra[] = [
  { matra: "", name: "അകാരം" },
  { matra: "ാ", name: "ആകാരം" },
  { matra: "ി", name: "ഇകാരം" },
  { matra: "ീ", name: "ഈകാരം" },
  { matra: "ു", name: "ഉകാരം" },
  { matra: "ൂ", name: "ഊകാരം" },
  { matra: "െ", name: "എകാരം" },
  { matra: "േ", name: "ഏകാരം" },
  { matra: "ൈ", name: "ഐകാരം" },
  { matra: "ൊ", name: "ഒകാരം" },
  { matra: "ോ", name: "ഓകാരം" },
  { matra: "ൗ", name: "ഔകാരം" },
]

export const chertthezhuthuMatraSequence: string[] = chertthezhuthuMatraData.map((m) => m.matra)
export const chertthezhuthuMatraNames: string[] = chertthezhuthuMatraData.map((m) => m.name)

export function chertthezhuthuFormula(consonant: string, matra: string, name: string, result: string): string {
  return matra === ""
    ? `${consonant}് + (${name}) = ${result}`
    : `${consonant}് + ${matra} (${name}) = ${result}`
}

export function chertthezhuthuOptionText(consonant: string, matra: string, name: string): string {
  return matra === ""
    ? `${consonant}് + (${name})`
    : `${consonant}് + ${matra} (${name})`
}
