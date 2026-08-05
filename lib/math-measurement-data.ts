import { pickUnseen } from "@/lib/question-history"
import type { MCQQuestion } from "@/components/math-topics/visual-mcq-game"

interface ComparisonObject {
  emoji: string
  label: string
}

export interface ComparisonPair {
  id: string
  a: ComparisonObject
  b: ComparisonObject
  /** Which one wins the comparison ("longer", "heavier", "holds more"). */
  winner: "a" | "b"
}

const LENGTH_PAIRS: ComparisonPair[] = [
  { id: "snake-worm", a: { emoji: "🐍", label: "Snake" }, b: { emoji: "🪱", label: "Worm" }, winner: "a" },
  { id: "giraffe-cat", a: { emoji: "🦒", label: "Giraffe" }, b: { emoji: "🐱", label: "Cat" }, winner: "a" },
  { id: "pencil-crayon", a: { emoji: "✏️", label: "Pencil" }, b: { emoji: "🖍️", label: "Crayon" }, winner: "a" },
  { id: "train-bike", a: { emoji: "🚆", label: "Train" }, b: { emoji: "🚲", label: "Bicycle" }, winner: "a" },
  { id: "river-puddle", a: { emoji: "🏞️", label: "River" }, b: { emoji: "💧", label: "Puddle" }, winner: "a" },
]

const WEIGHT_PAIRS: ComparisonPair[] = [
  { id: "elephant-mouse", a: { emoji: "🐘", label: "Elephant" }, b: { emoji: "🐭", label: "Mouse" }, winner: "a" },
  { id: "rock-feather", a: { emoji: "🪨", label: "Rock" }, b: { emoji: "🪶", label: "Feather" }, winner: "a" },
  { id: "watermelon-grape", a: { emoji: "🍉", label: "Watermelon" }, b: { emoji: "🍇", label: "Grapes" }, winner: "a" },
  { id: "car-bicycle", a: { emoji: "🚗", label: "Car" }, b: { emoji: "🚲", label: "Bicycle" }, winner: "a" },
  { id: "whale-fish", a: { emoji: "🐋", label: "Whale" }, b: { emoji: "🐟", label: "Fish" }, winner: "a" },
]

const CAPACITY_PAIRS: ComparisonPair[] = [
  { id: "bucket-cup", a: { emoji: "🪣", label: "Bucket" }, b: { emoji: "🥤", label: "Cup" }, winner: "a" },
  { id: "bathtub-bottle", a: { emoji: "🛁", label: "Bathtub" }, b: { emoji: "🍼", label: "Bottle" }, winner: "a" },
  { id: "pool-glass", a: { emoji: "🏊", label: "Swimming Pool" }, b: { emoji: "🥛", label: "Glass" }, winner: "a" },
  { id: "jug-spoon", a: { emoji: "🫙", label: "Jug" }, b: { emoji: "🥄", label: "Spoon" }, winner: "a" },
  { id: "tank-teacup", a: { emoji: "🛢️", label: "Tank" }, b: { emoji: "🍵", label: "Teacup" }, winner: "a" },
]

function buildQuestion(pool: ComparisonPair[], gameKey: string): MCQQuestion & { pair: ComparisonPair } {
  const pair = pickUnseen(gameKey, pool, (p) => p.id)
  const correctObj = pair.winner === "a" ? pair.a : pair.b
  return {
    pair,
    prompt: null,
    choices: [pair.a.label, pair.b.label],
    correctChoice: correctObj.label,
  }
}

export const generateLengthQuestion = (gameKey: string) => buildQuestion(LENGTH_PAIRS, gameKey)
export const generateWeightQuestion = (gameKey: string) => buildQuestion(WEIGHT_PAIRS, gameKey)
export const generateCapacityQuestion = (gameKey: string) => buildQuestion(CAPACITY_PAIRS, gameKey)

export interface MeasureItem {
  id: string
  label: string
  emoji: string
  units: number
}

const MEASURE_ITEMS: MeasureItem[] = [
  { id: "pencil", label: "Pencil", emoji: "✏️", units: 4 },
  { id: "book", label: "Book", emoji: "📕", units: 6 },
  { id: "shoe", label: "Shoe", emoji: "👟", units: 5 },
  { id: "spoon", label: "Spoon", emoji: "🥄", units: 3 },
  { id: "phone", label: "Phone", emoji: "📱", units: 5 },
  { id: "banana", label: "Banana", emoji: "🍌", units: 4 },
  { id: "toothbrush", label: "Toothbrush", emoji: "🪥", units: 3 },
  { id: "crayon", label: "Crayon", emoji: "🖍️", units: 2 },
]

export function generateMeasureQuestion(gameKey: string): MCQQuestion & { item: MeasureItem } {
  const item = pickUnseen(gameKey, MEASURE_ITEMS, (i) => i.id)
  const wrongChoices = new Set<number>()
  const deltas = [-2, -1, 1, 2]
  let attempt = 0
  while (wrongChoices.size < 3 && attempt < 20) {
    const delta = deltas[Math.floor(Math.random() * deltas.length)]
    const candidate = item.units + delta
    if (candidate > 0 && candidate !== item.units) wrongChoices.add(candidate)
    attempt++
  }
  while (wrongChoices.size < 3) wrongChoices.add(item.units + wrongChoices.size + 1)
  const choices = [item.units, ...wrongChoices].sort(() => Math.random() - 0.5).map(String)
  return { item, prompt: null, choices, correctChoice: String(item.units) }
}

export interface SizeTrio {
  id: string
  /** Ordered smallest to biggest, exactly 3 items. */
  items: { emoji: string; label: string }[]
}

const SIZE_TRIOS: SizeTrio[] = [
  { id: "ant-cat-elephant", items: [{ emoji: "🐜", label: "Ant" }, { emoji: "🐱", label: "Cat" }, { emoji: "🐘", label: "Elephant" }] },
  { id: "pea-apple-watermelon", items: [{ emoji: "🟢", label: "Pea" }, { emoji: "🍎", label: "Apple" }, { emoji: "🍉", label: "Watermelon" }] },
  { id: "mouse-dog-horse", items: [{ emoji: "🐭", label: "Mouse" }, { emoji: "🐶", label: "Dog" }, { emoji: "🐴", label: "Horse" }] },
  { id: "button-plate-sofa", items: [{ emoji: "🔘", label: "Button" }, { emoji: "🍽️", label: "Plate" }, { emoji: "🛋️", label: "Sofa" }] },
  { id: "seed-tree-mountain", items: [{ emoji: "🌱", label: "Seed" }, { emoji: "🌳", label: "Tree" }, { emoji: "⛰️", label: "Mountain" }] },
  { id: "coin-book-car", items: [{ emoji: "🪙", label: "Coin" }, { emoji: "📚", label: "Books" }, { emoji: "🚗", label: "Car" }] },
]

export function generateSizeQuestion(gameKey: string): MCQQuestion & { trio: SizeTrio; askBiggest: boolean } {
  const trio = pickUnseen(gameKey, SIZE_TRIOS, (t) => t.id)
  const askBiggest = Math.random() < 0.5
  const correct = askBiggest ? trio.items[2] : trio.items[0]
  const choices = [...trio.items].sort(() => Math.random() - 0.5).map((i) => i.label)
  return { trio, askBiggest, prompt: null, choices, correctChoice: correct.label }
}
