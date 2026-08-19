import { hindiConsonants } from "./hindi-letters-data"

export const barakhadiConsonants: string[] = hindiConsonants.map((c) => c.letter)

export interface BarakhadiMatra {
  matra: string
  name: string
}

// The traditional 12-form बारहखड़ी cycle — matches the 12 vowels in
// hindi-letters-data.ts (no ऋ, unlike Sanskrit's 13-form cycle).
export const barakhadiMatraData: BarakhadiMatra[] = [
  { matra: "", name: "अकार" },
  { matra: "ा", name: "आकार" },
  { matra: "ि", name: "इकार" },
  { matra: "ी", name: "ईकार" },
  { matra: "ु", name: "उकार" },
  { matra: "ू", name: "ऊकार" },
  { matra: "े", name: "एकार" },
  { matra: "ै", name: "ऐकार" },
  { matra: "ो", name: "ओकार" },
  { matra: "ौ", name: "औकार" },
  { matra: "ं", name: "अनुस्वार" },
  { matra: "ः", name: "विसर्ग" },
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
