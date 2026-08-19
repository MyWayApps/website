"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { MEMORY_ITEMS, MemoryItem, pickN, pickOne, buildChoices } from "@/lib/memory-game"
import type { User } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type Phase = "ready" | "showing" | "hidden" | "asking" | "feedback"

interface Placement {
  row: number
  col: number
  item: MemoryItem
}

type QuestionType = "where" | "whichbox" | "middle" | "adjacent" | "aboveBelow" | "leftRight"

interface Round {
  rows: number
  cols: number
  placements: Placement[]
  question: QuestionType
  prompt: string
  // Tap-a-cell questions
  targetCell?: { row: number; col: number }
  // Choice-button questions
  choices?: { label: string; value: string }[]
  correctValue?: string
}

function gridConfig(level: number) {
  if (level <= 1) return { rows: 1, cols: 3, itemCount: 1 }
  if (level === 2) return { rows: 2, cols: 3, itemCount: 2 }
  if (level === 3) return { rows: 3, cols: 3, itemCount: 2 }
  return { rows: 3, cols: 3, itemCount: 3 }
}

function buildRound(level: number): Round {
  const { rows, cols, itemCount } = gridConfig(level)
  const allCells = Array.from({ length: rows * cols }, (_, i) => ({ row: Math.floor(i / cols), col: i % cols }))
  const cells = pickN(allCells, itemCount)
  const items = pickN(MEMORY_ITEMS, itemCount)
  const placements: Placement[] = cells.map((c, i) => ({ row: c.row, col: c.col, item: items[i] }))

  const pool: QuestionType[] = ["where", "whichbox"]
  const hasCenter = rows % 2 === 1 && cols % 2 === 1
  if (hasCenter) pool.push("middle")
  const adjacentPair = findAdjacentPair(placements)
  if (adjacentPair) pool.push("adjacent")
  const diffRowPair = placements.length >= 2 ? findPair(placements, (a, b) => a.row !== b.row) : null
  if (diffRowPair) pool.push("aboveBelow")
  const diffColPair = placements.length >= 2 ? findPair(placements, (a, b) => a.col !== b.col) : null
  if (diffColPair) pool.push("leftRight")

  const question = pickOne(pool)

  if (question === "where" || question === "whichbox") {
    const target = pickOne(placements)
    return {
      rows,
      cols,
      placements,
      question,
      prompt: question === "where" ? `Where was the ${target.item.emoji}?` : `Which box had the ${target.item.emoji}?`,
      targetCell: { row: target.row, col: target.col },
    }
  }

  if (question === "middle") {
    const centerRow = (rows - 1) / 2
    const centerCol = (cols - 1) / 2
    const occupant = placements.find((p) => p.row === centerRow && p.col === centerCol)
    const correct = occupant ? occupant.item.id : "empty"
    const distractors = pickN(
      MEMORY_ITEMS.filter((i) => i.id !== correct),
      2
    )
    const options = [
      { label: occupant ? occupant.item.emoji : "Nothing", value: correct },
      ...distractors.map((d) => ({ label: d.emoji, value: d.id })),
    ]
    return {
      rows,
      cols,
      placements,
      question,
      prompt: "What was in the middle?",
      choices: shuffle(options),
      correctValue: correct,
    }
  }

  if (question === "adjacent" && adjacentPair) {
    const [a, b] = adjacentPair
    const choices = buildChoices(b.item, MEMORY_ITEMS, 3, (i) => i.id)
    return {
      rows,
      cols,
      placements,
      question,
      prompt: `What was next to the ${a.item.emoji}?`,
      choices: choices.map((i) => ({ label: i.emoji, value: i.id })),
      correctValue: b.item.id,
    }
  }

  if (question === "aboveBelow" && diffRowPair) {
    const [a, b] = diffRowPair
    const correct = a.row < b.row ? "above" : "below"
    return {
      rows,
      cols,
      placements,
      question,
      prompt: `Was the ${a.item.emoji} above or below the ${b.item.emoji}?`,
      choices: [
        { label: "Above", value: "above" },
        { label: "Below", value: "below" },
      ],
      correctValue: correct,
    }
  }

  // leftRight
  const [a, b] = diffColPair!
  return {
    rows,
    cols,
    placements,
    question,
    prompt: `Which object was on the left: ${a.item.emoji} or ${b.item.emoji}?`,
    choices: [
      { label: a.item.emoji, value: a.item.id },
      { label: b.item.emoji, value: b.item.id },
    ],
    correctValue: a.col < b.col ? a.item.id : b.item.id,
  }
}

function findAdjacentPair(placements: Placement[]): [Placement, Placement] | null {
  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      const a = placements[i]
      const b = placements[j]
      if (Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1) return Math.random() < 0.5 ? [a, b] : [b, a]
    }
  }
  return null
}

function findPair(placements: Placement[], pred: (a: Placement, b: Placement) => boolean): [Placement, Placement] | null {
  const pairs: [Placement, Placement][] = []
  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      if (pred(placements[i], placements[j])) pairs.push([placements[i], placements[j]])
    }
  }
  return pairs.length ? pickOne(pairs) : null
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function WhereWasIt({
  onExit,
  user,
  applicationId,
  isConnected = false,
}: {
  onExit: () => void
  user?: User | null
  applicationId?: string
  isConnected?: boolean
}) {
  const [phase, setPhase] = useState<Phase>("ready")
  const [round, setRound] = useState<Round | null>(null)
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [roundNum, setRoundNum] = useState(0)
  const [pickedCell, setPickedCell] = useState<{ row: number; col: number } | null>(null)
  const [pickedValue, setPickedValue] = useState<string | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const startRound = () => {
    setRound(buildRound(level))
    setPickedCell(null)
    setPickedValue(null)
    setPhase("showing")
  }

  const startGame = () => {
    setScore(0)
    setLevel(1)
    setRoundNum(0)
    startRound()
  }

  useEffect(() => {
    if (phase !== "showing" || !round) return
    const t = setTimeout(() => setPhase("hidden"), Math.max(3000 - level * 150, 1600))
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  useEffect(() => {
    if (phase !== "hidden") return
    const t = setTimeout(() => setPhase("asking"), 600)
    return () => clearTimeout(t)
  }, [phase])

  const isCorrect = round?.targetCell
    ? !!pickedCell && pickedCell.row === round.targetCell.row && pickedCell.col === round.targetCell.col
    : pickedValue === round?.correctValue

  const recordRoundResult = (isCorrect: boolean, question: QuestionType | undefined) => {
    if (!user || !applicationId) return
    saveGameScore({
      userId: user.id,
      applicationId,
      score: isCorrect ? 10 : 0,
      maxScore: 10,
      gameData: { mode: "where-was-it", level, roundNum, question },
      isConnected,
    })
      .then(() =>
        getActivityMasteryTier(user.id, applicationId, "memory-game:where-was-it")
          .then(setMasteryTier)
          .catch((error) => console.error("Error fetching Where Was It mastery tier:", error)),
      )
      .catch((error) => console.error("Error saving Where Was It score:", error))
  }

  const tapCell = (row: number, col: number) => {
    if (phase !== "asking" || !round?.targetCell) return
    setPickedCell({ row, col })
    const isCorrect = row === round.targetCell.row && col === round.targetCell.col
    if (isCorrect) setScore((s) => s + 10)
    setPhase("feedback")
    recordRoundResult(isCorrect, round.question)
  }

  const chooseValue = (value: string) => {
    if (phase !== "asking" || !round?.choices) return
    setPickedValue(value)
    const isCorrect = value === round.correctValue
    if (isCorrect) setScore((s) => s + 10)
    setPhase("feedback")
    recordRoundResult(isCorrect, round.question)
  }

  const nextRound = () => {
    const n = roundNum + 1
    setRoundNum(n)
    if (n % 3 === 0) setLevel((l) => Math.min(l + 1, 4))
    startRound()
  }

  const placementAt = (row: number, col: number) => round?.placements.find((p) => p.row === row && p.col === col)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 to-purple-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-purple-900 border-2 border-white font-bold px-4 py-2" variant="outline">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          {phase !== "ready" && (
            <div className="flex items-center gap-2 text-white font-bold drop-shadow">
              <Star className="h-5 w-5" />
              <span>Score: {score}</span>
              <span className="ml-3">Level: {level}</span>
              {masteryTier && (
                <span className="ml-3 bg-white/20 rounded-full px-2 py-1">
                  <MasteryBadge tier={masteryTier} showLabel />
                </span>
              )}
            </div>
          )}
        </div>

        {phase === "ready" && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            <h1 className="text-3xl font-bold text-purple-800 mb-4">📍 Where Was It?</h1>
            <p className="text-lg text-gray-700 mb-6">Watch where objects are placed, then remember their spot!</p>
            <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 text-lg">
              Start
            </Button>
          </div>
        )}

        {round && phase !== "ready" && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            {phase === "showing" && <p className="text-gray-500 mb-4">Remember the positions...</p>}
            {phase === "hidden" && <p className="text-gray-500 mb-4">🙈</p>}
            {(phase === "asking" || phase === "feedback") && (
              <p className="text-2xl font-bold text-purple-800 mb-4">{round.prompt}</p>
            )}

            {(phase === "showing" || (phase === "asking" && round.targetCell) || (phase === "feedback" && round.targetCell)) && (
              <div
                className="grid gap-2 justify-center mx-auto mb-4"
                style={{ gridTemplateColumns: `repeat(${round.cols}, minmax(0, 6.5rem))` }}
              >
                {Array.from({ length: round.rows * round.cols }, (_, i) => {
                  const row = Math.floor(i / round.cols)
                  const col = i % round.cols
                  const p = placementAt(row, col)
                  const isTarget = round.targetCell && round.targetCell.row === row && round.targetCell.col === col
                  const isPicked = pickedCell && pickedCell.row === row && pickedCell.col === col
                  const showContent = phase === "showing" || phase === "feedback"
                  return (
                    <button
                      key={i}
                      disabled={phase !== "asking"}
                      onClick={() => tapCell(row, col)}
                      className={`h-24 w-24 rounded-lg border-2 flex items-center justify-center text-5xl transition-colors
                        ${phase === "asking" ? "bg-purple-50 border-purple-300 hover:bg-purple-100 cursor-pointer" : "bg-purple-50 border-purple-200"}
                        ${phase === "feedback" && isTarget ? "border-green-500 bg-green-50" : ""}
                        ${phase === "feedback" && isPicked && !isTarget ? "border-red-500 bg-red-50" : ""}`}
                    >
                      {showContent ? p?.item.emoji ?? "" : phase === "asking" ? "?" : ""}
                    </button>
                  )
                })}
              </div>
            )}

            {phase === "asking" && round.choices && (
              <div className="flex flex-wrap justify-center gap-3">
                {round.choices.map((c, i) => (
                  <Button
                    key={i}
                    onClick={() => chooseValue(c.value)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-900 text-2xl py-5 px-6 h-auto"
                    variant="outline"
                  >
                    {c.label}
                  </Button>
                ))}
              </div>
            )}

            {phase === "feedback" && (
              <>
                <p className={`text-2xl font-bold my-4 ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                  {isCorrect ? "Correct! 🎉" : "Not quite!"}
                </p>
                {round.choices && (
                  <p className="text-gray-700 mb-4">
                    Answer: {round.choices.find((c) => c.value === round.correctValue)?.label}
                  </p>
                )}
                <Button onClick={nextRound} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 text-lg">
                  Next
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
