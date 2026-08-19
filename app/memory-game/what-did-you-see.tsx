"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import {
  MEMORY_ITEMS,
  MEMORY_COLORS,
  MEMORY_SHAPES,
  MemoryItem,
  ColorSwatch,
  ShapeKind,
  pickN,
  pickOne,
  buildChoices,
} from "@/lib/memory-game"
import type { User } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type Phase = "ready" | "showing" | "asking" | "feedback"

type ShapeRound = {
  kind: "shape"
  shape: ShapeKind
  color: ColorSwatch
  size: "big" | "small"
  question: "color" | "shape" | "size"
}

type ObjectRound = {
  kind: "object"
  items: MemoryItem[]
  question: "object" | "count" | "animal" | "picture"
  countTarget?: MemoryItem
}

type Round = ShapeRound | ObjectRound

const QUESTION_TEXT: Record<string, string> = {
  color: "What color was it?",
  shape: "What shape was it?",
  size: "Was it big or small?",
  object: "What did you see?",
  picture: "Which picture did you see?",
  animal: "Which animal did you see?",
  count: "",
}

function buildShapeRound(): ShapeRound {
  const questions: ShapeRound["question"][] = ["color", "shape", "size"]
  return {
    kind: "shape",
    shape: pickOne(MEMORY_SHAPES),
    color: pickOne(MEMORY_COLORS),
    size: Math.random() < 0.5 ? "big" : "small",
    question: pickOne(questions),
  }
}

function buildObjectRound(itemCount: number): ObjectRound {
  const items = pickN(MEMORY_ITEMS, itemCount)
  const animals = items.filter((i) => i.category === "animal")
  const questions: ObjectRound["question"][] = ["object", "picture"]
  if (itemCount > 1) questions.push("count")
  if (animals.length > 0) questions.push("animal")
  const question = pickOne(questions)
  const countTarget = question === "count" ? pickOne(items) : undefined
  return { kind: "object", items, question, countTarget }
}

export default function WhatDidYouSee({
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
  const [selected, setSelected] = useState<string | null>(null)
  const [correctKey, setCorrectKey] = useState<string | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const startRound = () => {
    const itemCount = Math.min(2 + Math.floor(level / 2), 4)
    const next: Round = Math.random() < 0.5 ? buildShapeRound() : buildObjectRound(itemCount)
    setRound(next)
    setSelected(null)
    setCorrectKey(null)
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
    const viewTime = Math.max(2600 - level * 150, 1200)
    const t = setTimeout(() => setPhase("asking"), viewTime)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  const choices = useMemo(() => {
    if (!round || phase !== "asking") return []
    if (round.kind === "shape") {
      if (round.question === "color") return buildChoices(round.color, MEMORY_COLORS, 3, (c) => c.name)
      if (round.question === "shape") return buildChoices(round.shape, MEMORY_SHAPES, 3, (s) => s.name)
      return ["big", "small"]
    }
    if (round.question === "count") {
      const correctCount = round.items.filter((i) => i.id === round.countTarget!.id).length
      const pool = [correctCount, correctCount + 1, Math.max(1, correctCount - 1), correctCount + 2]
      return Array.from(new Set(pool)).slice(0, 3).sort(() => Math.random() - 0.5)
    }
    const shown = round.question === "animal" ? round.items.filter((i) => i.category === "animal") : round.items
    const correct = pickOne(shown)
    const pool = round.question === "animal" ? MEMORY_ITEMS.filter((i) => i.category === "animal") : MEMORY_ITEMS
    return buildChoices(correct, pool, 3, (i) => i.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  const answer = (choice: unknown) => {
    if (!round || phase !== "asking") return
    let isCorrect = false
    let key = ""
    if (round.kind === "shape") {
      if (round.question === "color") {
        key = (choice as ColorSwatch).name
        isCorrect = key === round.color.name
        setCorrectKey(round.color.name)
      } else if (round.question === "shape") {
        key = (choice as ShapeKind).name
        isCorrect = key === round.shape.name
        setCorrectKey(round.shape.name)
      } else {
        key = choice as string
        isCorrect = key === round.size
        setCorrectKey(round.size)
      }
    } else if (round.question === "count") {
      key = String(choice)
      const correctCount = round.items.filter((i) => i.id === round.countTarget!.id).length
      isCorrect = Number(choice) === correctCount
      setCorrectKey(String(correctCount))
    } else {
      key = (choice as MemoryItem).id
      const shown = round.question === "animal" ? round.items.filter((i) => i.category === "animal") : round.items
      isCorrect = shown.some((i) => i.id === key)
      setCorrectKey(shown[0]?.id ?? "")
    }
    setSelected(key)
    if (isCorrect) setScore((s) => s + 10)
    setPhase("feedback")

    if (user && applicationId) {
      saveGameScore({
        userId: user.id,
        applicationId,
        score: isCorrect ? 10 : 0,
        maxScore: 10,
        gameData: { mode: "what-did-you-see", level, roundNum, kind: round.kind, question: round.question },
        isConnected,
      })
        .then(() =>
          getActivityMasteryTier(user.id, applicationId, "memory-game:what-did-you-see")
            .then(setMasteryTier)
            .catch((error) => console.error("Error fetching What Did You See mastery tier:", error)),
        )
        .catch((error) => console.error("Error saving What Did You See score:", error))
    }
  }

  const nextRound = () => {
    const newRoundNum = roundNum + 1
    setRoundNum(newRoundNum)
    if (newRoundNum % 3 === 0) setLevel((l) => Math.min(l + 1, 8))
    startRound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onExit}
            className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold px-4 py-2"
            variant="outline"
          >
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
            <h1 className="text-3xl font-bold text-blue-800 mb-4">👀 What Did You See?</h1>
            <p className="text-lg text-gray-700 mb-6">
              Look closely at what's shown, then answer a question about it!
            </p>
            <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 text-lg">
              Start
            </Button>
          </div>
        )}

        {phase === "showing" && round && (
          <div className="bg-white/90 rounded-lg p-10 text-center shadow-2xl min-h-[280px] flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-6">Remember this...</p>
            {round.kind === "shape" ? (
              <div
                className={`${round.shape.className} ${round.size === "big" ? "w-32 h-32" : "w-14 h-14"}`}
                style={{ backgroundColor: round.color.hex }}
              />
            ) : (
              <div className="flex flex-wrap justify-center gap-6 text-6xl">
                {round.items.map((item, i) => (
                  <span key={i}>{item.emoji}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === "asking" && round && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              {round.kind === "object" && round.question === "count"
                ? `How many ${round.countTarget!.name}s did you see?`
                : QUESTION_TEXT[round.question]}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {choices.map((choice, i) => (
                <Button
                  key={i}
                  onClick={() => answer(choice)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-900 text-2xl py-6 px-6 h-auto"
                  variant="outline"
                >
                  {renderChoice(round, choice)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {phase === "feedback" && round && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            <h2 className={`text-3xl font-bold mb-4 ${isRoundCorrect(round, selected, correctKey) ? "text-green-600" : "text-red-500"}`}>
              {isRoundCorrect(round, selected, correctKey) ? "Correct! 🎉" : "Not quite!"}
            </h2>
            <p className="text-gray-700 mb-6">The answer was: {describeCorrect(round, correctKey)}</p>
            <Button onClick={nextRound} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 text-lg">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function renderChoice(round: Round, choice: unknown) {
  if (round.kind === "shape") {
    if (round.question === "color") {
      const c = choice as ColorSwatch
      return <span className="inline-block w-8 h-8 rounded-full align-middle" style={{ backgroundColor: c.hex }} />
    }
    if (round.question === "shape") return (choice as ShapeKind).symbol
    return choice === "big" ? "Big" : "Small"
  }
  if (round.question === "count") return String(choice)
  return (choice as MemoryItem).emoji
}

function isRoundCorrect(round: Round, selected: string | null, correctKey: string | null) {
  return selected !== null && selected === correctKey
}

function describeCorrect(round: Round, correctKey: string | null) {
  if (!correctKey) return ""
  if (round.kind === "shape") {
    if (round.question === "color") return correctKey
    if (round.question === "shape") return correctKey
    return correctKey === "big" ? "Big" : "Small"
  }
  if (round.question === "count") return correctKey
  const item = MEMORY_ITEMS.find((i) => i.id === correctKey)
  return item ? `${item.emoji} ${item.name}` : ""
}
