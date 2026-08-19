"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, ArrowRight } from "lucide-react"
import { MEMORY_ITEMS, MEMORY_COLORS, MEMORY_SHAPES, MemoryItem, ColorSwatch, ShapeKind, pickN, pickOne } from "@/lib/memory-game"
import type { User } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type Phase = "ready" | "showing" | "hidden" | "asking" | "feedback"

type SlotContent = { type: "object"; item: MemoryItem } | { type: "shape"; shape: ShapeKind; color: ColorSwatch } | null

type ChangeType = "swap" | "appear" | "disappear" | "move" | "color"

interface Descriptor {
  type: ChangeType
  before: SlotContent
  after: SlotContent
}

function contentKey(c: SlotContent): string {
  if (!c) return "empty"
  return c.type === "object" ? `o:${c.item.id}` : `s:${c.shape.name}:${c.color.name}`
}

function descKey(d: Descriptor): string {
  return `${d.type}:${contentKey(d.before)}:${contentKey(d.after)}`
}

function randomContent(theme: "object" | "shape", excludeKeys: string[] = []): SlotContent {
  if (theme === "object") {
    const pool = MEMORY_ITEMS.filter((i) => !excludeKeys.includes(`o:${i.id}`))
    return { type: "object", item: pickOne(pool.length ? pool : MEMORY_ITEMS) }
  }
  const shape = pickOne(MEMORY_SHAPES)
  const color = pickOne(MEMORY_COLORS)
  return { type: "shape", shape, color }
}

function buildBoard(size: number, theme: "object" | "shape", emptyCount: number): SlotContent[] {
  const board: SlotContent[] = []
  const used: string[] = []
  for (let i = 0; i < size; i++) {
    if (i < emptyCount) {
      board.push(null)
    } else {
      const c = randomContent(theme, used)
      used.push(contentKey(c))
      board.push(c)
    }
  }
  return shuffleArr(board)
}

function shuffleArr<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function applyChange(board: SlotContent[], theme: "object" | "shape"): { board: SlotContent[]; descriptor: Descriptor } {
  const filledIdx = board.map((c, i) => (c ? i : -1)).filter((i) => i >= 0)
  const emptyIdx = board.map((c, i) => (!c ? i : -1)).filter((i) => i >= 0)

  const eligible: ChangeType[] = ["swap"]
  if (emptyIdx.length > 0) eligible.push("appear")
  if (filledIdx.length >= 2) eligible.push("disappear", "move")
  if (theme === "shape" && filledIdx.length >= 1) eligible.push("color")

  const type = pickOne(eligible)
  const next = [...board]
  const used = board.filter((c): c is Exclude<SlotContent, null> => !!c).map(contentKey)

  if (type === "swap") {
    const idx = pickOne(filledIdx)
    const before = board[idx]
    const after = randomContent(theme, [...used, contentKey(before)])
    next[idx] = after
    return { board: next, descriptor: { type, before, after } }
  }
  if (type === "appear") {
    const idx = pickOne(emptyIdx)
    const after = randomContent(theme, used)
    next[idx] = after
    return { board: next, descriptor: { type, before: null, after } }
  }
  if (type === "disappear") {
    const idx = pickOne(filledIdx)
    const before = board[idx]
    next[idx] = null
    return { board: next, descriptor: { type, before, after: null } }
  }
  if (type === "move") {
    const [a, b] = pickN(filledIdx, 2)
    const before = board[a]
    next[a] = board[b]
    next[b] = board[a]
    return { board: next, descriptor: { type, before, after: board[b] } }
  }
  // color
  const idx = pickOne(filledIdx.filter((i) => board[i]?.type === "shape"))
  const before = board[idx] as { type: "shape"; shape: ShapeKind; color: ColorSwatch }
  const newColor = pickOne(MEMORY_COLORS.filter((c) => c.name !== before.color.name))
  const after: SlotContent = { type: "shape", shape: before.shape, color: newColor }
  next[idx] = after
  return { board: next, descriptor: { type: "color", before, after } }
}

function buildFakeDescriptor(correct: Descriptor, board: SlotContent[], theme: "object" | "shape"): Descriptor {
  const filled = board.filter((c): c is Exclude<SlotContent, null> => !!c)
  const used = filled.map(contentKey)
  if (correct.type === "swap") {
    const before = randomContent(theme, used)
    const after = randomContent(theme, [...used, contentKey(before)])
    return { type: "swap", before, after }
  }
  if (correct.type === "appear") {
    const after = randomContent(theme, used)
    return { type: "appear", before: null, after }
  }
  if (correct.type === "disappear") {
    const candidate = filled.length ? pickOne(filled) : randomContent(theme, used)
    return { type: "disappear", before: candidate, after: null }
  }
  if (correct.type === "move") {
    const candidate = filled.length ? pickOne(filled) : randomContent(theme, used)
    return { type: "move", before: candidate, after: candidate }
  }
  const before = randomContent("shape", used) as { type: "shape"; shape: ShapeKind; color: ColorSwatch }
  const newColor = pickOne(MEMORY_COLORS.filter((c) => c.name !== before.color.name))
  return { type: "color", before, after: { type: "shape", shape: before.shape, color: newColor } }
}

function buildChoiceSet(correct: Descriptor, board: SlotContent[], theme: "object" | "shape"): Descriptor[] {
  const options: Descriptor[] = [correct]
  const keys = new Set([descKey(correct)])
  let guard = 0
  while (options.length < 3 && guard < 40) {
    guard++
    const fake = buildFakeDescriptor(correct, board, theme)
    const k = descKey(fake)
    if (!keys.has(k)) {
      keys.add(k)
      options.push(fake)
    }
  }
  return shuffleArr(options)
}

const QUESTION_BY_TYPE: Record<ChangeType, string> = {
  swap: "Which object changed?",
  appear: "Which object was added?",
  disappear: "Which object disappeared?",
  move: "What moved?",
  color: "Which color changed?",
}

function ContentView({ content, size = "text-5xl" }: { content: SlotContent; size?: string }) {
  if (!content) return <span className={`${size} text-gray-300`}>·</span>
  if (content.type === "object") return <span className={size}>{content.item.emoji}</span>
  return (
    <span
      className={`inline-block ${size === "text-5xl" ? "w-10 h-10" : "w-7 h-7"} ${content.shape.className}`}
      style={{ backgroundColor: content.color.hex }}
    />
  )
}

function DescriptorView({ d }: { d: Descriptor }) {
  if (d.type === "appear")
    return (
      <span className="inline-flex items-center gap-2">
        <ContentView content={d.after} size="text-3xl" /> appeared
      </span>
    )
  if (d.type === "disappear")
    return (
      <span className="inline-flex items-center gap-2">
        <ContentView content={d.before} size="text-3xl" /> disappeared
      </span>
    )
  if (d.type === "move")
    return (
      <span className="inline-flex items-center gap-2">
        <ContentView content={d.before} size="text-3xl" /> moved
      </span>
    )
  return (
    <span className="inline-flex items-center gap-2">
      <ContentView content={d.before} size="text-3xl" />
      <ArrowRight className="h-5 w-5" />
      <ContentView content={d.after} size="text-3xl" />
    </span>
  )
}

interface Round {
  theme: "object" | "shape"
  before: SlotContent[]
  after: SlotContent[]
  correct: Descriptor
  choices: Descriptor[]
}

function buildRound(level: number): Round {
  const size = Math.min(2 + level, 6)
  const theme: "object" | "shape" = Math.random() < 0.5 ? "object" : "shape"
  const emptyCount = size < 6 && Math.random() < 0.4 ? 1 : 0
  const before = buildBoard(size, theme, emptyCount)
  const { board: after, descriptor } = applyChange(before, theme)
  const choices = buildChoiceSet(descriptor, before, theme)
  return { theme, before, after, correct: descriptor, choices }
}

export default function WhatChanged({
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
  const [pickedKey, setPickedKey] = useState<string | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const startRound = () => {
    setRound(buildRound(level))
    setPickedKey(null)
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
    const t = setTimeout(() => setPhase("hidden"), Math.max(2800 - level * 150, 1500))
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  useEffect(() => {
    if (phase !== "hidden") return
    const t = setTimeout(() => setPhase("asking"), 700)
    return () => clearTimeout(t)
  }, [phase])

  const choose = (d: Descriptor) => {
    if (phase !== "asking" || !round) return
    const k = descKey(d)
    const isCorrect = k === descKey(round.correct)
    setPickedKey(k)
    if (isCorrect) setScore((s) => s + 10)
    setPhase("feedback")

    if (user && applicationId) {
      saveGameScore({
        userId: user.id,
        applicationId,
        score: isCorrect ? 10 : 0,
        maxScore: 10,
        gameData: { mode: "what-changed", level, roundNum, changeType: round.correct.type, theme: round.theme },
        isConnected,
      })
        .then(() =>
          getActivityMasteryTier(user.id, applicationId, "memory-game:what-changed")
            .then(setMasteryTier)
            .catch((error) => console.error("Error fetching What Changed mastery tier:", error)),
        )
        .catch((error) => console.error("Error saving What Changed score:", error))
    }
  }

  const nextRound = () => {
    const n = roundNum + 1
    setRoundNum(n)
    if (n % 3 === 0) setLevel((l) => Math.min(l + 1, 4))
    startRound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 to-teal-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-teal-900 border-2 border-white font-bold px-4 py-2" variant="outline">
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
            <h1 className="text-3xl font-bold text-teal-800 mb-4">🔄 What Changed?</h1>
            <p className="text-lg text-gray-700 mb-6">Study the scene, then spot what's different!</p>
            <Button onClick={startGame} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 text-lg">
              Start
            </Button>
          </div>
        )}

        {phase === "showing" && round && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            <p className="text-gray-500 mb-6">Remember this scene...</p>
            <div className="flex flex-wrap justify-center gap-6">
              {round.before.map((c, i) => (
                <ContentView key={i} content={c} />
              ))}
            </div>
          </div>
        )}

        {phase === "hidden" && (
          <div className="bg-white/90 rounded-lg p-10 text-center shadow-2xl min-h-[160px] flex items-center justify-center">
            <p className="text-4xl">🙈</p>
          </div>
        )}

        {(phase === "asking" || phase === "feedback") && round && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {round.after.map((c, i) => (
                <ContentView key={i} content={c} />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-teal-800 mb-6">{QUESTION_BY_TYPE[round.correct.type]}</h2>
            {phase === "asking" && (
              <div className="flex flex-col items-center gap-3">
                {round.choices.map((d, i) => (
                  <Button
                    key={i}
                    onClick={() => choose(d)}
                    className="bg-teal-100 hover:bg-teal-200 text-teal-900 text-xl py-5 px-6 h-auto w-full max-w-sm"
                    variant="outline"
                  >
                    <DescriptorView d={d} />
                  </Button>
                ))}
              </div>
            )}
            {phase === "feedback" && (
              <>
                <p className={`text-2xl font-bold mb-4 ${pickedKey === descKey(round.correct) ? "text-green-600" : "text-red-500"}`}>
                  {pickedKey === descKey(round.correct) ? "Correct! 🎉" : "Not quite!"}
                </p>
                <p className="text-gray-700 mb-6 flex items-center justify-center gap-2">
                  Answer: <DescriptorView d={round.correct} />
                </p>
                <Button onClick={nextRound} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 text-lg">
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
