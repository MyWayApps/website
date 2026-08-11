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
export function generateTableFact(operation: TableOperation, tableNumber: number, position: number): Fact {
  switch (operation) {
    case "add":
      return { a: tableNumber, b: position, answer: tableNumber + position }
    case "subtract":
      return { a: tableNumber + position, b: tableNumber, answer: position }
    case "multiply":
      return { a: tableNumber, b: position, answer: tableNumber * position }
    case "divide":
      return { a: tableNumber * position, b: tableNumber, answer: position }
  }
}

/**
 * A random (not sequential) fact scoped to one chosen table — for Animated
 * and Number Line Hop, which are explore/practice modes rather than the
 * strict 1→10 drill Multiple Choice does. Still no-repeat within the table
 * until every position 1-10 has come up once.
 */
export function generateRandomFactInTable(
  operation: TableOperation,
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
  /** Division only: what the items get shared into/between, e.g. "basket", "friend". */
  recipientNoun?: string
  recipientPluralNoun?: string
  noun: string
  pluralNoun: string
  /** How the group arrives (addition) or leaves (subtraction), e.g. "swim in", "run away". */
  actionVerb: string
}

// One theme per table number, so each table gets its own little scene
// (Table 1 = fish, Table 2 = tigers, ...) instead of always showing the same
// character — cycles via getAnimatedTheme() if there are ever more than 10
// tables. Multiply/divide keep a single theme (array of length 1), which
// getAnimatedTheme() naturally falls back to either way.
export const ANIMATED_THEMES: Record<TableOperation, AnimatedTheme[]> = {
  add: [
    { emoji: "🐟", noun: "fish", pluralNoun: "fish", actionVerb: "swim in" },
    { emoji: "🐯", noun: "tiger", pluralNoun: "tigers", actionVerb: "run in" },
    { emoji: "🐰", noun: "rabbit", pluralNoun: "rabbits", actionVerb: "hop in" },
    { emoji: "🐶", noun: "puppy", pluralNoun: "puppies", actionVerb: "run in" },
    { emoji: "🦋", noun: "butterfly", pluralNoun: "butterflies", actionVerb: "flutter in" },
    { emoji: "🐸", noun: "frog", pluralNoun: "frogs", actionVerb: "hop in" },
    { emoji: "🐢", noun: "turtle", pluralNoun: "turtles", actionVerb: "crawl in" },
    { emoji: "🐝", noun: "bee", pluralNoun: "bees", actionVerb: "buzz in" },
    { emoji: "🐦", noun: "bird", pluralNoun: "birds", actionVerb: "fly in" },
    { emoji: "🐱", noun: "kitten", pluralNoun: "kittens", actionVerb: "run in" },
  ],
  subtract: [
    { emoji: "🐦", noun: "bird", pluralNoun: "birds", actionVerb: "fly away" },
    { emoji: "🐥", noun: "chick", pluralNoun: "chicks", actionVerb: "run away" },
    { emoji: "🦋", noun: "butterfly", pluralNoun: "butterflies", actionVerb: "flutter away" },
    { emoji: "🐿️", noun: "squirrel", pluralNoun: "squirrels", actionVerb: "scurry away" },
    { emoji: "🍪", noun: "cookie", pluralNoun: "cookies", actionVerb: "get eaten by ants" },
    { emoji: "🐟", noun: "fish", pluralNoun: "fish", actionVerb: "swim away" },
    { emoji: "🎈", noun: "balloon", pluralNoun: "balloons", actionVerb: "float away" },
    { emoji: "🐝", noun: "bee", pluralNoun: "bees", actionVerb: "buzz away" },
    { emoji: "🍫", noun: "chocolate", pluralNoun: "chocolates", actionVerb: "get eaten up" },
    { emoji: "🐇", noun: "rabbit", pluralNoun: "rabbits", actionVerb: "hop away" },
  ],
  multiply: [
    { emoji: "🍎", noun: "apple", pluralNoun: "apples", actionVerb: "" },
    { emoji: "🍊", noun: "orange", pluralNoun: "oranges", actionVerb: "" },
    { emoji: "⭐", noun: "star", pluralNoun: "stars", actionVerb: "" },
    { emoji: "🧱", noun: "block", pluralNoun: "blocks", actionVerb: "" },
    { emoji: "🧁", noun: "cupcake", pluralNoun: "cupcakes", actionVerb: "" },
    { emoji: "🎈", noun: "balloon", pluralNoun: "balloons", actionVerb: "" },
    { emoji: "🌸", noun: "flower", pluralNoun: "flowers", actionVerb: "" },
    { emoji: "🍪", noun: "cookie", pluralNoun: "cookies", actionVerb: "" },
    { emoji: "💎", noun: "gem", pluralNoun: "gems", actionVerb: "" },
    { emoji: "🧦", noun: "sock", pluralNoun: "socks", actionVerb: "" },
  ],
  divide: [
    { emoji: "🍎", recipientEmoji: "🧺", noun: "apple", pluralNoun: "apples", recipientNoun: "basket", recipientPluralNoun: "baskets", actionVerb: "" },
    { emoji: "🍫", recipientEmoji: "🧒", noun: "chocolate", pluralNoun: "chocolates", recipientNoun: "kid", recipientPluralNoun: "kids", actionVerb: "" },
    { emoji: "🥕", recipientEmoji: "🐰", noun: "carrot", pluralNoun: "carrots", recipientNoun: "rabbit", recipientPluralNoun: "rabbits", actionVerb: "" },
    { emoji: "⭐", recipientEmoji: "🧺", noun: "star", pluralNoun: "stars", recipientNoun: "basket", recipientPluralNoun: "baskets", actionVerb: "" },
    { emoji: "🍇", recipientEmoji: "🌳", noun: "grape", pluralNoun: "grapes", recipientNoun: "tree", recipientPluralNoun: "trees", actionVerb: "" },
    { emoji: "🧸", recipientEmoji: "🧒", noun: "teddy bear", pluralNoun: "teddy bears", recipientNoun: "kid", recipientPluralNoun: "kids", actionVerb: "" },
    { emoji: "🍓", recipientEmoji: "🥣", noun: "strawberry", pluralNoun: "strawberries", recipientNoun: "bowl", recipientPluralNoun: "bowls", actionVerb: "" },
    { emoji: "🥦", recipientEmoji: "🧺", noun: "broccoli", pluralNoun: "broccolis", recipientNoun: "basket", recipientPluralNoun: "baskets", actionVerb: "" },
    { emoji: "🪙", recipientEmoji: "👛", noun: "coin", pluralNoun: "coins", recipientNoun: "purse", recipientPluralNoun: "purses", actionVerb: "" },
    { emoji: "🍭", recipientEmoji: "🧒", noun: "lollipop", pluralNoun: "lollipops", recipientNoun: "child", recipientPluralNoun: "children", actionVerb: "" },
  ],
}

export function getAnimatedTheme(operation: TableOperation, tableNumber: number | null): AnimatedTheme {
  const themes = ANIMATED_THEMES[operation]
  const index = tableNumber !== null ? (tableNumber - 1) % themes.length : 0
  return themes[index]
}
