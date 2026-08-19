import { kannadaConsonants } from "./kannada-letters-data"

export const gunitaksharaConsonants: string[] = kannadaConsonants.map((c) => c.letter)

export interface GunitaksharaMatra {
  matra: string
  name: string
}

// Kannada's vowel-sign (matra) set mirrors Telugu's 16-item cycle — the two
// scripts share the same Kadamba-derived vowel-sign system.
export const gunitaksharaMatraData: GunitaksharaMatra[] = [
  { matra: "", name: "ಅಕಾರ" },
  { matra: "ಾ", name: "ಆಕಾರ" },
  { matra: "ಿ", name: "ಇಕಾರ" },
  { matra: "ೀ", name: "ಈಕಾರ" },
  { matra: "ು", name: "ಉಕಾರ" },
  { matra: "ೂ", name: "ಊಕಾರ" },
  { matra: "ೃ", name: "ಋಕಾರ" },
  { matra: "ೆ", name: "ಎಕಾರ" },
  { matra: "ೇ", name: "ಏಕಾರ" },
  { matra: "ೈ", name: "ಐಕಾರ" },
  { matra: "ೊ", name: "ಒಕಾರ" },
  { matra: "ೋ", name: "ಓಕಾರ" },
  { matra: "ೌ", name: "ಔಕಾರ" },
  { matra: "ಂ", name: "ಅನುಸ್ವಾರ" },
  { matra: "ಃ", name: "ವಿಸರ್ಗ" },
]

export const gunitaksharaMatraSequence: string[] = gunitaksharaMatraData.map((m) => m.matra)
export const gunitaksharaMatraNames: string[] = gunitaksharaMatraData.map((m) => m.name)

export function gunitaksharaFormula(consonant: string, matra: string, name: string, result: string): string {
  return matra === ""
    ? `${consonant}್ + (${name}) = ${result}`
    : `${consonant}್ + ${matra} (${name}) = ${result}`
}

export function gunitaksharaOptionText(consonant: string, matra: string, name: string): string {
  return matra === ""
    ? `${consonant}್ + (${name})`
    : `${consonant}್ + ${matra} (${name})`
}
