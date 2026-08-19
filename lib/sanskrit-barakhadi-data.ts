import { sanskritConsonants } from "./sanskrit-letters-data"

export const barakhadiConsonants: string[] = sanskritConsonants.map((c) => c.letter)

export interface BarakhadiMatra {
  matra: string
  name: string
}

// Sanskrit's cycle has 13 forms (includes ऋ), matching the 13 vowels in
// sanskrit-letters-data.ts — one more than Hindi's 12-form बारहखड़ी.
export const barakhadiMatraData: BarakhadiMatra[] = [
  { matra: "", name: "अकारः" },
  { matra: "ा", name: "आकारः" },
  { matra: "ि", name: "इकारः" },
  { matra: "ी", name: "ईकारः" },
  { matra: "ु", name: "उकारः" },
  { matra: "ू", name: "ऊकारः" },
  { matra: "ृ", name: "ऋकारः" },
  { matra: "े", name: "एकारः" },
  { matra: "ै", name: "ऐकारः" },
  { matra: "ो", name: "ओकारः" },
  { matra: "ौ", name: "औकारः" },
  { matra: "ं", name: "अनुस्वारः" },
  { matra: "ः", name: "विसर्गः" },
]

export const barakhadiMatraSequence: string[] = barakhadiMatraData.map((m) => m.matra)
export const barakhadiMatraNames: string[] = barakhadiMatraData.map((m) => m.name)

export function barakhadiFormula(consonant: string, matra: string, name: string, result: string): string {
  return matra === ""
    ? `${consonant}् + (${name}) = ${result}`
    : `${consonant}् + ${matra} (${name}) = ${result}`
}

export function barakhadiOptionText(consonant: string, matra: string, name: string): string {
  return matra === ""
    ? `${consonant}् + (${name})`
    : `${consonant}् + ${matra} (${name})`
}
