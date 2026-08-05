// Pure question-generation functions for the Math Operations suite
// (Addition/Subtraction/Multiplication/Division). No React/DOM — easy to
// reason about and unit-test independently of the components that render it.

import { pickUnseenRandom } from "@/lib/question-history"

export type Operation = "add" | "subtract" | "multiply" | "divide"
export type DigitLevel = "1" | "2" | "3"
export type Format = "numerical" | "word-problem"
export type Mechanic = "number-line" | "mcq" | "typed" | "column" | "missing-operand" | "matching"

export const OPERATION_SYMBOLS: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
}

export const DIGIT_LEVEL_LABELS: Record<DigitLevel, string> = {
  "1": "1-digit",
  "2": "2-digit",
  "3": "3+ digit",
}

const DIGIT_RANGES: Record<DigitLevel, [number, number]> = {
  "1": [1, 9],
  "2": [10, 99],
  "3": [100, 999],
}

export interface NumericalQuestion {
  a: number
  b: number
  answer: number
}

/**
 * Curated mechanics per digit level (numerical format only — word-problem
 * format always uses typed/mcq, handled separately by the caller). Matching
 * is offered as a bonus mode at every level. Number-line only makes sense
 * for addition/subtraction (hopping forward/back), not multiply/divide.
 */
export function mechanicsForLevel(digitLevel: DigitLevel, operation: Operation): Mechanic[] {
  const canUseNumberLine = operation === "add" || operation === "subtract"
  const base: Mechanic[] =
    digitLevel === "1"
      ? canUseNumberLine
        ? ["number-line", "mcq"]
        : ["mcq"]
      : digitLevel === "2"
        ? ["typed", "column"]
        : ["typed", "column", "missing-operand"]
  return [...base, "matching"]
}

export function generateNumericalQuestion(operation: Operation, digitLevel: DigitLevel, gameKey: string): NumericalQuestion {
  const [min, max] = DIGIT_RANGES[digitLevel]

  switch (operation) {
    case "add": {
      const a = pickUnseenRandom(`${gameKey}:a`, min, max)
      const b = pickUnseenRandom(`${gameKey}:b`, min, max)
      return { a, b, answer: a + b }
    }
    case "subtract": {
      // Never let the answer go negative — kids at this level haven't met negatives yet.
      const x = pickUnseenRandom(`${gameKey}:a`, min, max)
      const y = pickUnseenRandom(`${gameKey}:b`, min, max)
      const a = Math.max(x, y)
      const b = Math.min(x, y)
      return { a, b, answer: a - b }
    }
    case "multiply": {
      // Multi-digit × single-digit is the standard elementary step for this
      // level — multi-digit × multi-digit would produce unwieldy products.
      const a = pickUnseenRandom(`${gameKey}:a`, min, max)
      const b = pickUnseenRandom(`${gameKey}:b`, 2, 9)
      return { a, b, answer: a * b }
    }
    case "divide": {
      // Build up from the answer so it always divides evenly — a remainder
      // would need fraction/decimal handling this game doesn't offer.
      const divisor = pickUnseenRandom(`${gameKey}:divisor`, 2, 9)
      // At level 1, "digit level" describes the division fact's complexity
      // (basic times-table facts, quotient 1-9) rather than the dividend's
      // digit count — deriving it from DIGIT_RANGES["1"] = [1,9] would cap
      // the dividend at 9 and force the quotient to almost always be 1.
      const quotientMin = digitLevel === "1" ? 1 : Math.max(1, Math.ceil(min / divisor))
      const quotientMax = digitLevel === "1" ? 9 : Math.max(quotientMin, Math.floor(max / divisor))
      const quotient = pickUnseenRandom(`${gameKey}:quotient`, quotientMin, quotientMax)
      return { a: divisor * quotient, b: divisor, answer: quotient }
    }
  }
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

/** Distractor choices spread around the correct answer, never negative, never duplicated. */
export function generateChoices(correct: number, spread: number, numChoices = 4): number[] {
  const choices = new Set<number>([correct])
  let attempts = 0
  while (choices.size < numChoices && attempts < 50) {
    attempts++
    const delta = randInt(-spread, spread)
    const candidate = correct + delta
    if (candidate >= 0 && candidate !== correct) choices.add(candidate)
  }
  while (choices.size < numChoices) choices.add(choices.size + correct + 1)
  return shuffle([...choices])
}

const WORD_PROBLEM_NAMES = ["Ravi", "Meera", "Arjun", "Priya", "Kabir", "Ananya", "Dev", "Isha", "Vikram", "Sara"]

interface WordProblemObject {
  label: string
  emoji: string
}

const WORD_PROBLEM_OBJECTS: WordProblemObject[] = [
  { label: "mangoes", emoji: "🥭" },
  { label: "marbles", emoji: "🔵" },
  { label: "pencils", emoji: "✏️" },
  { label: "stickers", emoji: "⭐" },
  { label: "candies", emoji: "🍬" },
  { label: "balloons", emoji: "🎈" },
  { label: "apples", emoji: "🍎" },
  { label: "toy cars", emoji: "🚗" },
  { label: "flowers", emoji: "🌸" },
  { label: "cookies", emoji: "🍪" },
]

export interface WordProblem extends NumericalQuestion {
  text: string
  emoji: string
}

export function generateWordProblem(operation: Operation, digitLevel: DigitLevel, gameKey: string): WordProblem {
  const q = generateNumericalQuestion(operation, digitLevel, gameKey)
  const name = WORD_PROBLEM_NAMES[randInt(0, WORD_PROBLEM_NAMES.length - 1)]
  // A second character is only used in some templates, but always pick someone
  // different from `name` so sentences never read "Vikram gives Vikram...".
  let name2 = name
  while (name2 === name) {
    name2 = WORD_PROBLEM_NAMES[randInt(0, WORD_PROBLEM_NAMES.length - 1)]
  }
  const object = WORD_PROBLEM_OBJECTS[randInt(0, WORD_PROBLEM_OBJECTS.length - 1)]

  const templates: Record<Operation, string> = {
    add: `${name} has ${q.a} ${object.label}. ${name2} gives ${name} ${q.b} more ${object.label}. How many ${object.label} does ${name} have now?`,
    subtract: `${name} has ${q.a} ${object.label}. ${name} gives ${q.b} ${object.label} to ${name2}. How many ${object.label} does ${name} have left?`,
    multiply: `There are ${q.a} boxes with ${q.b} ${object.label} in each box. How many ${object.label} are there in total?`,
    divide: `${name} has ${q.a} ${object.label} to share equally among ${q.b} friends. How many ${object.label} does each friend get?`,
  }

  return { ...q, text: templates[operation], emoji: object.emoji }
}
