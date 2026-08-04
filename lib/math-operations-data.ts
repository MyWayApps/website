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
      const quotientMin = Math.max(1, Math.ceil(min / divisor))
      const quotientMax = Math.max(quotientMin, Math.floor(max / divisor))
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
const WORD_PROBLEM_OBJECTS = [
  "mangoes", "marbles", "pencils", "stickers", "candies", "balloons", "apples", "toy cars", "flowers", "cookies",
]

export interface WordProblem extends NumericalQuestion {
  text: string
}

export function generateWordProblem(operation: Operation, digitLevel: DigitLevel, gameKey: string): WordProblem {
  const q = generateNumericalQuestion(operation, digitLevel, gameKey)
  const name = WORD_PROBLEM_NAMES[randInt(0, WORD_PROBLEM_NAMES.length - 1)]
  const name2 = WORD_PROBLEM_NAMES[randInt(0, WORD_PROBLEM_NAMES.length - 1)]
  const object = WORD_PROBLEM_OBJECTS[randInt(0, WORD_PROBLEM_OBJECTS.length - 1)]

  const templates: Record<Operation, string> = {
    add: `${name} has ${q.a} ${object}. ${name2} gives ${name} ${q.b} more ${object}. How many ${object} does ${name} have now?`,
    subtract: `${name} has ${q.a} ${object}. ${name} gives away ${q.b} ${object}. How many ${object} does ${name} have left?`,
    multiply: `There are ${q.a} boxes with ${q.b} ${object} in each box. How many ${object} are there in total?`,
    divide: `${name} has ${q.a} ${object} to share equally among ${q.b} friends. How many ${object} does each friend get?`,
  }

  return { ...q, text: templates[operation] }
}
