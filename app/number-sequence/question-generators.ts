// Pure question-generation functions — no React/DOM, easy to reason about and
// tweak independently of the topic components that render them.

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── Forward / Backward counting ───────────────────────────────────────────

export type Order = "ascending" | "descending"

export interface SequenceQuestion {
  sequence: number[]
  availableNumbers: number[]
}

export function generateSequenceQuestion(order: Order, maxNumber: number): SequenceQuestion {
  const maxStart = order === "ascending" ? maxNumber - 4 : Math.max(5, maxNumber - 5)
  const minStart = order === "ascending" ? 1 : 5
  const startNumber = randInt(minStart, maxStart)

  const sequence: number[] = []
  for (let i = 0; i < 5; i++) {
    sequence.push(order === "ascending" ? startNumber + i : startNumber - i)
  }

  const usedNumbers = new Set(sequence)
  const distractors: number[] = []
  while (distractors.length < 4) {
    const distractor = randInt(1, maxNumber)
    if (!usedNumbers.has(distractor)) {
      distractors.push(distractor)
      usedNumbers.add(distractor)
    }
  }

  return { sequence, availableNumbers: shuffle([...sequence, ...distractors]) }
}

// ─── Counting shapes/objects ────────────────────────────────────────────────

export type ShapeType = "circle" | "square" | "triangle"

export interface ShapeQuestion {
  shapes: { type: ShapeType }[]
  /** The one shape type the student must count — everything else is a distractor. */
  targetShape: ShapeType
  answerFormat: "typed" | "mcq"
  correctCount: number
  mcqOptions?: number[]
}

export function difficultyForIndex(i: number): "easy" | "medium" | "hard" {
  if (i < 2) return "easy"
  if (i < 4) return "medium"
  return "hard"
}

const SHAPE_TYPES: ShapeType[] = ["circle", "square", "triangle"]

export function generateShapeQuestion(index: number): ShapeQuestion {
  const level = difficultyForIndex(index)
  const answerFormat: "typed" | "mcq" = index % 2 === 0 ? "typed" : "mcq"

  // distractorTypes = how many OTHER shape types get scattered in as noise —
  // the question always asks to count just one specific (target) shape type,
  // so mixing in other types never makes the question ambiguous.
  const config = {
    easy: { min: 1, max: 5, distractorTypes: 0 },
    medium: { min: 5, max: 10, distractorTypes: 1 },
    hard: { min: 8, max: 15, distractorTypes: 2 },
  }[level]

  const shuffledTypes = shuffle(SHAPE_TYPES)
  const targetShape = shuffledTypes[0]
  const distractorTypes = shuffledTypes.slice(1, 1 + config.distractorTypes)

  const correctCount = randInt(config.min, config.max)
  const shapes: ShapeQuestion["shapes"] = Array.from({ length: correctCount }, () => ({ type: targetShape }))

  distractorTypes.forEach((distractorType) => {
    const distractorCount = randInt(2, 6)
    for (let i = 0; i < distractorCount; i++) shapes.push({ type: distractorType })
  })

  const shuffledShapes = shuffle(shapes)

  const mcqOptions =
    answerFormat === "mcq"
      ? shuffle(
          Array.from(new Set([correctCount, correctCount + 1, Math.max(0, correctCount - 1), correctCount + 2])),
        ).slice(0, 4)
      : undefined

  return { shapes: shuffledShapes, targetShape, answerFormat, correctCount, mcqOptions }
}

// ─── Numbers before/after ───────────────────────────────────────────────────

export type BeforeAfterDirection = "before" | "after" | "both"

export interface BeforeAfterQuestion {
  prompt: string
  base: number
  direction: BeforeAfterDirection
  /** Set for "before"/"after" — the single blank to fill. */
  answer?: number
  /** Set for "both" — the two blanks on either side of the base number. */
  beforeAnswer?: number
  afterAnswer?: number
}

const BEFORE_AFTER_RANGES = [20, 20, 50, 50, 100]

export function generateBeforeAfterQuestion(index: number): BeforeAfterQuestion {
  const maxNumber = BEFORE_AFTER_RANGES[index] ?? 100
  const roll = Math.random()
  // Mostly single before/after questions, with some "both blanks" ones mixed in.
  const direction: BeforeAfterDirection = roll < 0.25 ? "both" : roll < 0.625 ? "before" : "after"

  if (direction === "both") {
    const base = randInt(2, maxNumber - 1)
    return {
      prompt: `Fill in the numbers on both sides of ${base}`,
      base,
      direction,
      beforeAnswer: base - 1,
      afterAnswer: base + 1,
    }
  }

  const base = direction === "before" ? randInt(2, maxNumber) : randInt(1, maxNumber - 1)
  const answer = direction === "before" ? base - 1 : base + 1
  return { prompt: `What number comes right ${direction} ${base}?`, base, direction, answer }
}

// ─── Greater / Less / Equal ─────────────────────────────────────────────────

export type CompareSymbol = ">" | "<" | "="

export interface CompareQuestion {
  a: number
  b: number
  correct: CompareSymbol
}

export function generateCompareQuestion(maxNumber = 100): CompareQuestion {
  const equalChance = Math.random() < 0.2
  const a = randInt(1, maxNumber)
  const b = equalChance ? a : randInt(1, maxNumber)
  const correct: CompareSymbol = a > b ? ">" : a < b ? "<" : "="
  return { a, b, correct }
}

// ─── Place value ─────────────────────────────────────────────────────────────

export type Place = "hundreds" | "tens" | "ones"

export interface PlaceValueQuestion {
  number: number
  place: Place
  answer: number
  prompt: string
}

export function generatePlaceValueQuestion(index: number): PlaceValueQuestion {
  const useThreeDigit = index >= 2
  const number = useThreeDigit ? randInt(100, 999) : randInt(10, 99)

  const digits: Record<Place, number> = {
    hundreds: Math.floor(number / 100),
    tens: Math.floor((number % 100) / 10),
    ones: number % 10,
  }

  const availablePlaces: Place[] = number >= 100 ? ["hundreds", "tens", "ones"] : ["tens", "ones"]
  const place = availablePlaces[randInt(0, availablePlaces.length - 1)]

  return { number, place, answer: digits[place], prompt: `In the number ${number}, how many ${place}?` }
}

// ─── Neighbor-number grid puzzle ────────────────────────────────────────────

export interface NeighborGridQuestion {
  center: number
  neighbors: { above: number; below: number; left: number; right: number }
}

export function generateNeighborGridQuestion(index: number): NeighborGridQuestion {
  // Early questions use smaller centers, later ones use larger 2-digit centers.
  const center = index < 2 ? randInt(11, 49) : randInt(11, 89)
  return {
    center,
    neighbors: {
      above: center - 10,
      below: center + 10,
      left: center - 1,
      right: center + 1,
    },
  }
}

// ─── Number ↔ Words ─────────────────────────────────────────────────────────

const NUMBER_WORDS_ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
]
const NUMBER_WORDS_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

export function numberToWords(n: number): string {
  if (n === 100) return "one hundred"
  if (n < 20) return NUMBER_WORDS_ONES[n]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return ones === 0 ? NUMBER_WORDS_TENS[tens] : `${NUMBER_WORDS_TENS[tens]}-${NUMBER_WORDS_ONES[ones]}`
}

/** Normalizes hyphens/spacing/case so "twenty-one", "twenty one" and "Twenty One" all match. */
export function normalizeNumberWords(s: string): string {
  return s.trim().toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ")
}

export type NumberWordsDirection = "numberToWord" | "wordToNumber"

export interface NumberWordsQuestion {
  direction: NumberWordsDirection
  number: number
  word: string
}

export function generateNumberWordsQuestion(index: number): NumberWordsQuestion {
  const direction: NumberWordsDirection = index % 2 === 0 ? "numberToWord" : "wordToNumber"
  const number = randInt(1, 100)
  return { direction, number, word: numberToWords(number) }
}
