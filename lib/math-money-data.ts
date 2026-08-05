import { pickUnseen, pickUnseenRandom } from "@/lib/question-history"
import type { MCQQuestion } from "@/components/math-topics/visual-mcq-game"
import type { MoneyPiece } from "@/components/math-topics/money-visual"

export const COINS = [1, 2, 5, 10]
export const NOTES = [10, 20, 50, 100, 200, 500]

const ALL_DENOMINATIONS: MoneyPiece[] = [
  ...COINS.map((value) => ({ value, kind: "coin" as const })),
  ...NOTES.map((value) => ({ value, kind: "note" as const })),
]

function randomChoiceValues(correct: number, spread: number, count = 4): number[] {
  const choices = new Set([correct])
  let attempts = 0
  while (choices.size < count && attempts < 50) {
    attempts++
    const delta = Math.floor(Math.random() * spread * 2) - spread
    const candidate = correct + delta
    if (candidate > 0 && candidate !== correct) choices.add(candidate)
  }
  while (choices.size < count) choices.add(choices.size * 5 + correct)
  return [...choices].sort(() => Math.random() - 0.5)
}

export function generateIdentifyMoneyQuestion(gameKey: string): MCQQuestion & { piece: MoneyPiece } {
  const piece = pickUnseen(gameKey, ALL_DENOMINATIONS, (p) => `${p.kind}-${p.value}`)
  const choices = randomChoiceValues(piece.value, piece.kind === "coin" ? 4 : 50).map((v) => `₹${v}`)
  return { piece, prompt: null, choices, correctChoice: `₹${piece.value}` }
}

export function generateCountMoneyQuestion(gameKey: string): MCQQuestion & { pieces: MoneyPiece[] } {
  const pieceCount = pickUnseenRandom(`${gameKey}:count`, 2, 3)
  const pool = COINS.slice(0, 3) // keep totals small and countable for this age group
  const pieces: MoneyPiece[] = Array.from({ length: pieceCount }, () => ({
    value: pool[Math.floor(Math.random() * pool.length)],
    kind: "coin" as const,
  }))
  const total = pieces.reduce((sum, p) => sum + p.value, 0)
  const choices = randomChoiceValues(total, 4).map((v) => `₹${v}`)
  return { pieces, prompt: null, choices, correctChoice: `₹${total}` }
}

export function generateCompareMoneyQuestion(gameKey: string): MCQQuestion & { priceA: number; priceB: number } {
  const priceA = pickUnseenRandom(`${gameKey}:a`, 1, 50)
  let priceB = pickUnseenRandom(`${gameKey}:b`, 1, 50)
  if (priceB === priceA) priceB = priceA + 1
  const correctChoice = priceA > priceB ? "The first toy" : priceA < priceB ? "The second toy" : "They cost the same"
  return { priceA, priceB, prompt: null, choices: ["The first toy", "The second toy", "They cost the same"], correctChoice }
}
