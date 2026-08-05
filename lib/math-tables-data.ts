import { pickUnseenRandom } from "@/lib/question-history"

export type TableOperation = "add" | "subtract" | "multiply" | "divide"

export interface Fact {
  a: number
  b: number
  answer: number
}

/** Random 1-10 fact for the Animated and Number Line Hop modes (no fixed table). */
export function generateRandomFact(operation: TableOperation, gameKey: string): Fact {
  switch (operation) {
    case "add": {
      const a = pickUnseenRandom(`${gameKey}:a`, 1, 10)
      const b = pickUnseenRandom(`${gameKey}:b`, 1, 10)
      return { a, b, answer: a + b }
    }
    case "subtract": {
      const x = pickUnseenRandom(`${gameKey}:a`, 1, 10)
      const y = pickUnseenRandom(`${gameKey}:b`, 1, 10)
      const a = Math.max(x, y)
      const b = Math.min(x, y)
      return { a, b, answer: a - b }
    }
    case "multiply": {
      const a = pickUnseenRandom(`${gameKey}:a`, 1, 10)
      const b = pickUnseenRandom(`${gameKey}:b`, 1, 10)
      return { a, b, answer: a * b }
    }
    case "divide": {
      const divisor = pickUnseenRandom(`${gameKey}:divisor`, 1, 10)
      const quotient = pickUnseenRandom(`${gameKey}:quotient`, 1, 10)
      return { a: divisor * quotient, b: divisor, answer: quotient }
    }
  }
}

/**
 * A fixed "table" fact for Multiple Choice mode — tableNumber is the fixed
 * operand, position (1-10) is the varying one, matching classic times-table
 * drilling ("3 times table": 3×1, 3×2, ... 3×10). For subtraction, the
 * subtrahend is fixed and the minuend varies so the answer is always
 * positive ("subtract 3" table: 4-3, 5-3, ... 13-3).
 */
export function generateTableFact(operation: "add" | "subtract" | "multiply", tableNumber: number, position: number): Fact {
  switch (operation) {
    case "add":
      return { a: tableNumber, b: position, answer: tableNumber + position }
    case "subtract":
      return { a: tableNumber + position, b: tableNumber, answer: position }
    case "multiply":
      return { a: tableNumber, b: position, answer: tableNumber * position }
  }
}

/**
 * A random (not sequential) fact scoped to one chosen table — for Animated
 * and Number Line Hop, which are explore/practice modes rather than the
 * strict 1→10 drill Multiple Choice does. Still no-repeat within the table
 * until every position 1-10 has come up once.
 */
export function generateRandomFactInTable(
  operation: "add" | "subtract" | "multiply",
  tableNumber: number,
  gameKey: string,
): Fact {
  const position = pickUnseenRandom(`${gameKey}:table-${tableNumber}`, 1, 10)
  return generateTableFact(operation, tableNumber, position)
}

export function generateFactChoices(correct: number, spread: number, count = 4): number[] {
  const choices = new Set([correct])
  let attempts = 0
  while (choices.size < count && attempts < 50) {
    attempts++
    const delta = Math.floor(Math.random() * spread * 2) - spread
    const candidate = correct + delta
    if (candidate >= 0 && candidate !== correct) choices.add(candidate)
  }
  while (choices.size < count) choices.add(choices.size + correct + 1)
  return [...choices].sort(() => Math.random() - 0.5)
}

export const TABLE_OPERATION_SYMBOLS: Record<TableOperation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
}

export interface AnimatedTheme {
  emoji: string
  recipientEmoji?: string
}

export const ANIMATED_THEME: Record<TableOperation, AnimatedTheme> = {
  add: { emoji: "🐟" },
  subtract: { emoji: "🐥" },
  multiply: { emoji: "🍎" },
  divide: { emoji: "🍪", recipientEmoji: "🧒" },
}
