"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { MEMORY_ITEMS, MemoryItem, pickN, pickOne, buildChoices, shuffle } from "@/lib/memory-game"
import type { User } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type Phase = "ready" | "showing" | "asking" | "feedback"
type QuestionType = "tapOrder" | "first" | "last" | "between"

interface Round {
  sequence: MemoryItem[]
  questionType: QuestionType
  palette: MemoryItem[]
  betweenPair?: [MemoryItem, MemoryItem]
  correctAnswer?: MemoryItem
  choiceItems?: MemoryItem[]
}

function buildRound(level: number): Round {
  const length = Math.min(3 + Math.floor((level - 1) / 2), 6)
  const sequence = pickN(MEMORY_ITEMS, length)

  const pool: QuestionType[] = ["tapOrder", "tapOrder", "tapOrder", "first", "last"]
  if (length >= 4) pool.push("between")
  const questionType = pickOne(pool)

  if (questionType === "between") {
    const i = 1 + Math.floor(Math.random() * (length - 2))
    const correctAnswer = sequence[i]
    const betweenPair: [MemoryItem, MemoryItem] = [sequence[i - 1], sequence[i + 1]]
    const choiceItems = buildChoices(correctAnswer, MEMORY_ITEMS, 3, (item) => item.id)
    return { sequence, questionType, palette: shuffle(sequence), betweenPair, correctAnswer, choiceItems }
  }

  const correctAnswer = questionType === "first" ? sequence[0] : sequence[length - 1]
  const choiceItems = buildChoices(correctAnswer, sequence, 3, (item) => item.id)
  return { sequence, questionType, palette: shuffle(sequence), correctAnswer, choiceItems }
}

export default function RememberTheOrder({
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
  const [answer, setAnswer] = useState<MemoryItem[]>([])
  const [pickedChoice, setPickedChoice] = useState<string | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const startRound = () => {
    setRound(buildRound(level))
    setAnswer([])
    setPickedChoice(null)
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
    const t = setTimeout(() => setPhase("asking"), Math.max(3200 - level * 100, 2000))
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  const isSequenceCorrect = (a: MemoryItem[]) => round && a.length === round.sequence.length && a.every((it, i) => it.id === round.sequence[i].id)

  const recordRoundResult = (isCorrect: boolean, maxScore: number, questionType: QuestionType) => {
    if (!user || !applicationId) return
    saveGameScore({
      userId: user.id,
      applicationId,
      score: isCorrect ? maxScore : 0,
      maxScore,
      gameData: { mode: "remember-the-order", level, roundNum, questionType, sequenceLength: round?.sequence.length },
      isConnected,
    })
      .then(() =>
        getActivityMasteryTier(user.id, applicationId, "memory-game:remember-the-order")
          .then(setMasteryTier)
          .catch((error) => console.error("Error fetching Remember the Order mastery tier:", error)),
      )
      .catch((error) => console.error("Error saving Remember the Order score:", error))
  }

  const tapPaletteItem = (item: MemoryItem) => {
    if (phase !== "asking" || !round || round.questionType !== "tapOrder") return
    if (answer.some((a) => a.id === item.id)) return
    const next = [...answer, item]
    setAnswer(next)
    if (next.length === round.sequence.length) {
      const correct = isSequenceCorrect(next)
      if (correct) setScore((s) => s + 15)
      setPhase("feedback")
      recordRoundResult(!!correct, 15, round.questionType)
    }
  }

  const chooseAnswer = (item: MemoryItem) => {
    if (phase !== "asking" || !round || round.questionType === "tapOrder") return
    setPickedChoice(item.id)
    const isCorrect = item.id === round.correctAnswer!.id
    if (isCorrect) setScore((s) => s + 10)
    setPhase("feedback")
    recordRoundResult(isCorrect, 10, round.questionType)
  }

  const nextRound = () => {
    const n = roundNum + 1
    setRoundNum(n)
    if (n % 3 === 0) setLevel((l) => Math.min(l + 1, 6))
    startRound()
  }

  const correct =
    round?.questionType === "tapOrder" ? !!isSequenceCorrect(answer) : pickedChoice === round?.correctAnswer?.id

  const questionText = () => {
    if (!round) return ""
    if (round.questionType === "tapOrder") return "Tap them in the order you saw them"
    if (round.questionType === "first") return "Which came first?"
    if (round.questionType === "last") return "Which came last?"
    const [a, b] = round.betweenPair!
    return `What came between the ${a.name} and the ${b.name}?`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 to-orange-500 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onExit} className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold px-4 py-2" variant="outline">
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
            <h1 className="text-3xl font-bold text-orange-800 mb-4">🔢 Remember the Order</h1>
            <p className="text-lg text-gray-700 mb-6">Watch the sequence, then repeat it back!</p>
            <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 text-lg">
              Start
            </Button>
          </div>
        )}

        {phase === "showing" && round && (
          <div className="bg-white/90 rounded-lg p-10 text-center shadow-2xl">
            <p className="text-gray-500 mb-6">Remember this order...</p>
            <div className="flex flex-wrap justify-center gap-4 text-5xl">
              {round.sequence.map((item, i) => (
                <span key={i}>{item.emoji}</span>
              ))}
            </div>
          </div>
        )}

        {(phase === "asking" || phase === "feedback") && round && (
          <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-orange-800 mb-6">{questionText()}</h2>

            {round.questionType === "tapOrder" && (
              <>
                <div className="flex justify-center gap-3 mb-6 min-h-[3.5rem]">
                  {round.sequence.map((_, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-lg border-2 border-orange-300 bg-orange-50 flex items-center justify-center text-3xl"
                    >
                      {answer[i]?.emoji ?? ""}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {round.palette.map((item) => {
                    const used = answer.some((a) => a.id === item.id)
                    return (
                      <Button
                        key={item.id}
                        disabled={used || phase !== "asking"}
                        onClick={() => tapPaletteItem(item)}
                        className="bg-orange-100 hover:bg-orange-200 text-3xl py-6 px-6 h-auto disabled:opacity-30"
                        variant="outline"
                      >
                        {item.emoji}
                      </Button>
                    )
                  })}
                </div>
              </>
            )}

            {round.questionType !== "tapOrder" && phase === "asking" && (
              <div className="flex flex-wrap justify-center gap-4">
                {round.choiceItems!.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => chooseAnswer(item)}
                    className="bg-orange-100 hover:bg-orange-200 text-4xl py-6 px-6 h-auto"
                    variant="outline"
                  >
                    {item.emoji}
                  </Button>
                ))}
              </div>
            )}

            {phase === "feedback" && (
              <div className="mt-6">
                <p className={`text-2xl font-bold mb-4 ${correct ? "text-green-600" : "text-red-500"}`}>
                  {correct ? "Correct! 🎉" : "Not quite!"}
                </p>
                <p className="text-gray-700 mb-6 flex items-center justify-center gap-2 flex-wrap">
                  Order was: {round.sequence.map((item, i) => <span key={i}>{item.emoji}</span>)}
                </p>
                <Button onClick={nextRound} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 text-lg">
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
