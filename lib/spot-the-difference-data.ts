// Data for the "Spot the Difference" game. Pictures are plain emoji —
// matches the app's existing convention for "a picture representing thing
// X" (Sudoku's picture-tile mode in lib/sudoku.ts, Picture Vocabulary Game),
// no illustrated art assets involved.

// ─── Mode A: Nine Pictures (3x3 grid) ──────────────────────────────────────

export const EMOJI_POOL = [
  // animals
  "🐶", "🐱", "🐰", "🐻", "🦁", "🐯", "🐸", "🐵", "🐮", "🐷", "🐨", "🦒", "🐘", "🦊",
  // fruits
  "🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍍", "🥝", "🍑", "🍒",
  // vehicles
  "🚗", "🚕", "🚌", "🚓", "🚑", "🚒", "🚲", "🚂", "✈️", "🚀",
  // objects / nature
  "⚽", "🏀", "🎈", "🎁", "🌞", "🌙", "⭐", "☂️", "🌈", "🌸", "🌵", "🍄", "🎂", "🧸", "🎨", "📚",
]

// ─── Mode B: Big Picture (positioned-emoji scene) ──────────────────────────

export interface SceneElement {
  id: string
  emoji: string
  xPct: number // 0-100, left %
  yPct: number // 0-100, top %
  sizeRem?: number // optional override, default ~3rem (text-5xl)
}

export type DifferenceSpec =
  | { type: "remove"; elementId: string }
  | { type: "swap"; elementId: string; swapEmoji: string }

export interface Scene {
  id: string
  name: string
  backgroundClass: string
  elements: SceneElement[]
  difference: DifferenceSpec
}

/** The element(s) as shown in the second panel, with the scene's difference applied. */
export function applyDifference(scene: Scene): SceneElement[] {
  if (scene.difference.type === "remove") {
    return scene.elements.filter((el) => el.id !== scene.difference.elementId)
  }
  return scene.elements.map((el) =>
    el.id === scene.difference.elementId && scene.difference.type === "swap"
      ? { ...el, emoji: scene.difference.swapEmoji }
      : el
  )
}

/** The target position players need to click (same in both panels). */
export function differenceTarget(scene: Scene): { xPct: number; yPct: number } {
  const el = scene.elements.find((e) => e.id === scene.difference.elementId)!
  return { xPct: el.xPct, yPct: el.yPct }
}

export const SCENES: Scene[] = [
  {
    id: "garden",
    name: "Mango Garden",
    backgroundClass: "bg-gradient-to-b from-sky-200 to-green-200",
    elements: [
      { id: "sun", emoji: "☀️", xPct: 10, yPct: 8 },
      { id: "cloud1", emoji: "☁️", xPct: 35, yPct: 10 },
      { id: "cloud2", emoji: "☁️", xPct: 70, yPct: 12 },
      { id: "tree", emoji: "🌳", xPct: 50, yPct: 38, sizeRem: 5 },
      { id: "sunflower1", emoji: "🌻", xPct: 15, yPct: 70 },
      { id: "sunflower2", emoji: "🌻", xPct: 30, yPct: 80 },
      { id: "sunflower3", emoji: "🌻", xPct: 50, yPct: 85 },
      { id: "sunflower4", emoji: "🌻", xPct: 70, yPct: 78 },
      { id: "sunflower5", emoji: "🌻", xPct: 88, yPct: 68 },
      { id: "butterfly", emoji: "🦋", xPct: 62, yPct: 30 },
      { id: "bee", emoji: "🐝", xPct: 40, yPct: 25 },
      { id: "grass", emoji: "🌿", xPct: 20, yPct: 92 },
    ],
    difference: { type: "remove", elementId: "sunflower3" },
  },
  {
    id: "farm",
    name: "Sunny Farm",
    backgroundClass: "bg-gradient-to-b from-blue-200 to-lime-200",
    elements: [
      { id: "sun", emoji: "☀️", xPct: 85, yPct: 8 },
      { id: "barn", emoji: "🏡", xPct: 50, yPct: 32, sizeRem: 5 },
      { id: "cow1", emoji: "🐄", xPct: 18, yPct: 72 },
      { id: "cow2", emoji: "🐄", xPct: 36, yPct: 80 },
      { id: "sheep", emoji: "🐑", xPct: 55, yPct: 75 },
      { id: "chicken", emoji: "🐔", xPct: 70, yPct: 82 },
      { id: "horse", emoji: "🐴", xPct: 86, yPct: 70 },
      { id: "haystack", emoji: "🌾", xPct: 8, yPct: 88 },
      { id: "tree1", emoji: "🌳", xPct: 4, yPct: 48 },
      { id: "tree2", emoji: "🌳", xPct: 96, yPct: 48 },
      { id: "cloud", emoji: "☁️", xPct: 28, yPct: 14 },
      { id: "duck", emoji: "🦆", xPct: 62, yPct: 90 },
    ],
    difference: { type: "swap", elementId: "cow2", swapEmoji: "🐖" },
  },
  {
    id: "zoo",
    name: "Fun Zoo",
    backgroundClass: "bg-gradient-to-b from-yellow-100 to-amber-200",
    elements: [
      { id: "sun", emoji: "☀️", xPct: 90, yPct: 8 },
      { id: "elephant", emoji: "🐘", xPct: 18, yPct: 65 },
      { id: "lion", emoji: "🦁", xPct: 40, yPct: 70 },
      { id: "giraffe", emoji: "🦒", xPct: 62, yPct: 52, sizeRem: 5 },
      { id: "monkey", emoji: "🐵", xPct: 78, yPct: 72 },
      { id: "zebra", emoji: "🦓", xPct: 14, yPct: 85 },
      { id: "balloon1", emoji: "🎈", xPct: 30, yPct: 18 },
      { id: "balloon2", emoji: "🎈", xPct: 52, yPct: 14 },
      { id: "popcorn", emoji: "🍿", xPct: 86, yPct: 88 },
      { id: "bench", emoji: "🪑", xPct: 8, yPct: 92 },
      { id: "tree", emoji: "🌳", xPct: 96, yPct: 55 },
      { id: "flag", emoji: "🚩", xPct: 66, yPct: 8 },
    ],
    difference: { type: "remove", elementId: "balloon2" },
  },
  {
    id: "beach",
    name: "Sandy Beach",
    backgroundClass: "bg-gradient-to-b from-cyan-200 to-yellow-100",
    elements: [
      { id: "sun", emoji: "☀️", xPct: 85, yPct: 8 },
      { id: "cloud", emoji: "☁️", xPct: 18, yPct: 10 },
      { id: "umbrella", emoji: "⛱️", xPct: 50, yPct: 38, sizeRem: 5 },
      { id: "ball", emoji: "🏐", xPct: 28, yPct: 58 },
      { id: "shell1", emoji: "🐚", xPct: 14, yPct: 82 },
      { id: "shell2", emoji: "🐚", xPct: 72, yPct: 84 },
      { id: "crab", emoji: "🦀", xPct: 60, yPct: 75 },
      { id: "boat", emoji: "⛵", xPct: 82, yPct: 30 },
      { id: "bucket", emoji: "🪣", xPct: 40, yPct: 88 },
      { id: "bird", emoji: "🐦", xPct: 65, yPct: 15 },
    ],
    difference: { type: "swap", elementId: "shell2", swapEmoji: "⭐" },
  },
  {
    id: "park",
    name: "City Park",
    backgroundClass: "bg-gradient-to-b from-sky-200 to-emerald-100",
    elements: [
      { id: "sun", emoji: "☀️", xPct: 90, yPct: 8 },
      { id: "tree1", emoji: "🌳", xPct: 14, yPct: 38, sizeRem: 5 },
      { id: "tree2", emoji: "🌳", xPct: 86, yPct: 38, sizeRem: 5 },
      { id: "bench", emoji: "🪑", xPct: 50, yPct: 75 },
      { id: "dog", emoji: "🐕", xPct: 30, yPct: 82 },
      { id: "ball", emoji: "⚽", xPct: 65, yPct: 85 },
      { id: "bird1", emoji: "🐦", xPct: 20, yPct: 18 },
      { id: "bird2", emoji: "🐦", xPct: 42, yPct: 14 },
      { id: "kite", emoji: "🪁", xPct: 70, yPct: 18 },
      { id: "flower1", emoji: "🌷", xPct: 8, yPct: 92 },
      { id: "flower2", emoji: "🌷", xPct: 60, yPct: 92 },
      { id: "cloud", emoji: "☁️", xPct: 52, yPct: 8 },
    ],
    difference: { type: "remove", elementId: "bird1" },
  },
  {
    id: "bedroom",
    name: "Cozy Bedroom",
    backgroundClass: "bg-gradient-to-b from-indigo-100 to-purple-100",
    elements: [
      { id: "window", emoji: "🪟", xPct: 82, yPct: 15, sizeRem: 4 },
      { id: "moon", emoji: "🌙", xPct: 90, yPct: 8 },
      { id: "bed", emoji: "🛏️", xPct: 30, yPct: 60, sizeRem: 6 },
      { id: "teddy", emoji: "🧸", xPct: 50, yPct: 52 },
      { id: "lamp", emoji: "💡", xPct: 10, yPct: 32 },
      { id: "bookshelf", emoji: "📚", xPct: 75, yPct: 55 },
      { id: "toycar", emoji: "🚗", xPct: 20, yPct: 88 },
      { id: "star1", emoji: "⭐", xPct: 60, yPct: 16 },
      { id: "star2", emoji: "⭐", xPct: 72, yPct: 22 },
      { id: "clock", emoji: "🕰️", xPct: 40, yPct: 20 },
      { id: "plant", emoji: "🪴", xPct: 92, yPct: 72 },
    ],
    difference: { type: "swap", elementId: "teddy", swapEmoji: "🐰" },
  },
]
