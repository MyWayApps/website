import { pickUnseen } from "@/lib/question-history"
import type { MCQQuestion } from "@/components/math-topics/visual-mcq-game"
import type { FractionTarget } from "@/components/math-topics/shade-fraction-game"

export type FractionLevel = "simple" | "mixed"

interface SimpleFraction {
  numerator: number
  denominator: number
}

const SIMPLE_FRACTIONS: SimpleFraction[] = [
  { numerator: 1, denominator: 2 },
  { numerator: 1, denominator: 3 },
  { numerator: 2, denominator: 3 },
  { numerator: 1, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 1, denominator: 5 },
  { numerator: 2, denominator: 5 },
  { numerator: 3, denominator: 5 },
  { numerator: 4, denominator: 5 },
]

function fractionLabel(f: SimpleFraction): string {
  return `${f.numerator}/${f.denominator}`
}

export interface MixedNumber extends SimpleFraction {
  whole: number
}

const MIXED_NUMBERS: MixedNumber[] = [
  { whole: 1, numerator: 1, denominator: 2 },
  { whole: 1, numerator: 1, denominator: 4 },
  { whole: 1, numerator: 3, denominator: 4 },
  { whole: 1, numerator: 1, denominator: 3 },
  { whole: 1, numerator: 2, denominator: 3 },
  { whole: 2, numerator: 1, denominator: 2 },
]

function mixedLabel(m: MixedNumber): string {
  return `${m.whole} ${m.numerator}/${m.denominator}`
}

function randomChoices(correct: string, pool: string[], count = 4): string[] {
  const choices = new Set([correct])
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (const c of shuffled) {
    if (choices.size >= count) break
    choices.add(c)
  }
  return [...choices].sort(() => Math.random() - 0.5)
}

/** For "Identify the Fraction" — returns the circle(s) to draw plus MCQ choices. */
export function generateIdentifyFractionQuestion(
  level: FractionLevel,
  gameKey: string,
): MCQQuestion & { circles: SimpleFraction[] } {
  if (level === "simple") {
    const f = pickUnseen(gameKey, SIMPLE_FRACTIONS, fractionLabel)
    return {
      circles: [f],
      prompt: null,
      choices: randomChoices(fractionLabel(f), SIMPLE_FRACTIONS.map(fractionLabel)),
      correctChoice: fractionLabel(f),
    }
  }
  const m = pickUnseen(gameKey, MIXED_NUMBERS, mixedLabel)
  const circles: SimpleFraction[] = [
    ...Array.from({ length: m.whole }, () => ({ numerator: 1, denominator: 1 })),
    { numerator: m.numerator, denominator: m.denominator },
  ]
  return {
    circles,
    prompt: null,
    choices: randomChoices(mixedLabel(m), MIXED_NUMBERS.map(mixedLabel)),
    correctChoice: mixedLabel(m),
  }
}

const COMPARE_CHOICES = ["A is bigger", "B is bigger", "They are equal"]

/** For "Compare Fractions" — two simple fractions, compared via cross-multiplication. */
export function generateCompareFractionsQuestion(gameKey: string): MCQQuestion & { a: SimpleFraction; b: SimpleFraction } {
  const a = SIMPLE_FRACTIONS[Math.floor(Math.random() * SIMPLE_FRACTIONS.length)]
  let b = a
  let attempts = 0
  while (b === a && attempts < 10) {
    b = SIMPLE_FRACTIONS[Math.floor(Math.random() * SIMPLE_FRACTIONS.length)]
    attempts++
  }
  const cross = a.numerator * b.denominator - b.numerator * a.denominator
  const correctChoice = cross > 0 ? "A is bigger" : cross < 0 ? "B is bigger" : "They are equal"
  return { a, b, prompt: null, choices: COMPARE_CHOICES, correctChoice }
}

const SHADE_POOL: FractionTarget[] = SIMPLE_FRACTIONS.map((f) => ({ numerator: f.numerator, denominator: f.denominator }))

export function generateShadeFractionTarget(gameKey: string): FractionTarget {
  return pickUnseen(gameKey, SHADE_POOL, (f) => `${f.numerator}/${f.denominator}`)
}
