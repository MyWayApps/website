import { pickUnseen } from "@/lib/question-history"
import type { MCQQuestion } from "@/components/math-topics/visual-mcq-game"
import type { MatchPair } from "@/components/math-topics/generic-matching-mode"

export interface ShapeInfo {
  id: string
  name: string
  kind: "2d" | "3d"
  /** 3D solids render as a plain emoji (renders reliably everywhere); 2D shapes are drawn with CSS. */
  emoji?: string
}

export const SHAPES: ShapeInfo[] = [
  { id: "circle", name: "Circle", kind: "2d" },
  { id: "square", name: "Square", kind: "2d" },
  { id: "triangle", name: "Triangle", kind: "2d" },
  { id: "rectangle", name: "Rectangle", kind: "2d" },
  { id: "star", name: "Star", kind: "2d" },
  { id: "diamond", name: "Diamond", kind: "2d" },
  { id: "cube", name: "Cube", kind: "3d", emoji: "🎲" },
  { id: "sphere", name: "Sphere", kind: "3d", emoji: "⚽" },
  { id: "cone", name: "Cone", kind: "3d", emoji: "🍦" },
  { id: "cylinder", name: "Cylinder", kind: "3d", emoji: "🥫" },
]

function randomChoices(correct: string, pool: string[], count = 4): string[] {
  const choices = new Set([correct])
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  for (const c of shuffled) {
    if (choices.size >= count) break
    choices.add(c)
  }
  return [...choices].sort(() => Math.random() - 0.5)
}

export function generateIdentifyShapeQuestion(gameKey: string): MCQQuestion & { shape: ShapeInfo } {
  const shape = pickUnseen(gameKey, SHAPES, (s) => s.id)
  const allNames = SHAPES.map((s) => s.name)
  return {
    shape,
    prompt: null, // filled in by the caller (needs JSX, kept out of this data module)
    choices: randomChoices(shape.name, allNames),
    correctChoice: shape.name,
  }
}

export function generate2DOr3DQuestion(gameKey: string): MCQQuestion & { shape: ShapeInfo } {
  const shape = pickUnseen(gameKey, SHAPES, (s) => s.id)
  const correctChoice = shape.kind === "2d" ? "Flat Shape (2D)" : "Solid Shape (3D)"
  return {
    shape,
    prompt: null,
    choices: ["Flat Shape (2D)", "Solid Shape (3D)"],
    correctChoice,
  }
}

const REAL_LIFE_PAIRS: { shapeId: string; shapeLabel: string; objectLabel: string }[] = [
  { shapeId: "circle", shapeLabel: "Circle", objectLabel: "🌕 Full Moon" },
  { shapeId: "square", shapeLabel: "Square", objectLabel: "🪟 Window" },
  { shapeId: "triangle", shapeLabel: "Triangle", objectLabel: "🍕 Pizza Slice" },
  { shapeId: "rectangle", shapeLabel: "Rectangle", objectLabel: "📖 Book" },
  { shapeId: "cube", shapeLabel: "Cube", objectLabel: "🎲 Dice" },
  { shapeId: "sphere", shapeLabel: "Sphere", objectLabel: "⚽ Ball" },
]

export function generateRealLifeMatchPairs(): MatchPair[] {
  return [...REAL_LIFE_PAIRS]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map((p) => ({ left: p.shapeLabel, right: p.objectLabel }))
}
