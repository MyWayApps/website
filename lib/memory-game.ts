// Shared data pools + small helpers for the four Memory Game modes
// (what-did-you-see, what-changed, where-was-it, remember-the-order).
// Kept independent of any one game's UI so pools stay consistent across modes.

export interface MemoryItem {
  id: string
  emoji: string
  name: string
  category: "animal" | "food" | "vehicle" | "object"
}

export const MEMORY_ITEMS: MemoryItem[] = [
  { id: "dog", emoji: "🐶", name: "dog", category: "animal" },
  { id: "cat", emoji: "🐱", name: "cat", category: "animal" },
  { id: "rabbit", emoji: "🐰", name: "rabbit", category: "animal" },
  { id: "lion", emoji: "🦁", name: "lion", category: "animal" },
  { id: "bear", emoji: "🐻", name: "bear", category: "animal" },
  { id: "elephant", emoji: "🐘", name: "elephant", category: "animal" },
  { id: "apple", emoji: "🍎", name: "apple", category: "food" },
  { id: "banana", emoji: "🍌", name: "banana", category: "food" },
  { id: "grapes", emoji: "🍇", name: "grapes", category: "food" },
  { id: "icecream", emoji: "🍦", name: "ice cream", category: "food" },
  { id: "cake", emoji: "🍰", name: "cake", category: "food" },
  { id: "car", emoji: "🚗", name: "car", category: "vehicle" },
  { id: "bus", emoji: "🚌", name: "bus", category: "vehicle" },
  { id: "bike", emoji: "🚲", name: "bike", category: "vehicle" },
  { id: "plane", emoji: "✈️", name: "plane", category: "vehicle" },
  { id: "boat", emoji: "⛵", name: "boat", category: "vehicle" },
  { id: "ball", emoji: "⚽", name: "ball", category: "object" },
  { id: "star", emoji: "⭐", name: "star", category: "object" },
  { id: "book", emoji: "📚", name: "book", category: "object" },
  { id: "kite", emoji: "🪁", name: "kite", category: "object" },
]

export interface ColorSwatch {
  name: string
  hex: string
}

export const MEMORY_COLORS: ColorSwatch[] = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
]

export interface ShapeKind {
  name: string
  symbol: string
  className: string
}

export const MEMORY_SHAPES: ShapeKind[] = [
  { name: "Circle", symbol: "●", className: "rounded-full" },
  { name: "Square", symbol: "■", className: "rounded-none" },
  { name: "Triangle", symbol: "▲", className: "" },
  { name: "Diamond", symbol: "◆", className: "rotate-45 rounded-sm" },
]

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length))
}

export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Build `count` multiple-choice options that always include `correct`, deduped by key. */
export function buildChoices<T>(correct: T, pool: T[], count: number, key: (t: T) => string): T[] {
  const distractors = pool.filter((item) => key(item) !== key(correct))
  const options = [correct, ...pickN(distractors, count - 1)]
  return shuffle(options)
}
