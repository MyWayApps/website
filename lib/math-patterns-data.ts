import { pickUnseenRandom } from "@/lib/question-history"
import type { MCQQuestion } from "@/components/math-topics/visual-mcq-game"

const SHAPE_SYMBOLS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"]
const STEPS = [1, 2, 3, 5, 10]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface ShapePatternQuestion extends MCQQuestion {
  sequence: (string | null)[]
}

export interface NumberPatternQuestion extends MCQQuestion {
  sequence: (number | null)[]
}

/** A repeating pattern (AB or ABC) — ask what comes next after the shown run. */
export function generateNextInPatternQuestion(gameKey: string): ShapePatternQuestion {
  const unitLength = pickUnseenRandom(`${gameKey}:unit`, 2, 3)
  const symbols = shuffle(SHAPE_SYMBOLS).slice(0, unitLength)
  const totalLength = 5
  const shown = Array.from({ length: totalLength }, (_, i) => symbols[i % unitLength])
  const next = symbols[totalLength % unitLength]
  const wrongPool = SHAPE_SYMBOLS.filter((s) => s !== next)
  const choices = shuffle([next, ...shuffle(wrongPool).slice(0, 3)])
  return { sequence: [...shown, null], prompt: null, choices, correctChoice: next }
}

/** A repeating pattern with one gap in the middle — ask what belongs there. */
export function generateMissingPieceQuestion(gameKey: string): ShapePatternQuestion {
  const unitLength = pickUnseenRandom(`${gameKey}:unit`, 2, 3)
  const symbols = shuffle(SHAPE_SYMBOLS).slice(0, unitLength)
  const totalLength = 5
  const full = Array.from({ length: totalLength }, (_, i) => symbols[i % unitLength])
  const blankIndex = pickUnseenRandom(`${gameKey}:blank`, 1, totalLength - 2)
  const correct = full[blankIndex]
  const sequence = full.map((s, i) => (i === blankIndex ? null : s))
  const wrongPool = SHAPE_SYMBOLS.filter((s) => s !== correct)
  const choices = shuffle([correct, ...shuffle(wrongPool).slice(0, 3)])
  return { sequence, prompt: null, choices, correctChoice: correct }
}

/** A growing number pattern (skip counting by 1/2/3/5/10) — ask for the next number. */
export function generateNumberPatternQuestion(gameKey: string): NumberPatternQuestion {
  const step = STEPS[pickUnseenRandom(`${gameKey}:step`, 0, STEPS.length - 1)]
  const start = pickUnseenRandom(`${gameKey}:start`, 1, 10)
  const shown = Array.from({ length: 4 }, (_, i) => start + i * step)
  const next = start + 4 * step
  const wrongChoices = new Set<number>()
  const candidateDeltas = [-2, -1, 1, 2, step, -step].filter((d) => d !== 0)
  let attempt = 0
  while (wrongChoices.size < 3 && attempt < 20) {
    const delta = candidateDeltas[Math.floor(Math.random() * candidateDeltas.length)]
    const candidate = next + delta
    if (candidate > 0 && candidate !== next) wrongChoices.add(candidate)
    attempt++
  }
  while (wrongChoices.size < 3) wrongChoices.add(next + wrongChoices.size + 1)
  const choices = shuffle([next, ...wrongChoices]).map(String)
  return { sequence: [...shown, null], prompt: null, choices, correctChoice: String(next) }
}
