"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { MathScratchpad } from "@/components/math-operations/math-scratchpad"
import { TablePicker } from "./table-picker"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { generateRandomFact, generateRandomFactInTable, getAnimatedTheme, type TableOperation, type Fact } from "@/lib/math-tables-data"

const ROUND_LENGTH = 5
const INTRO_MS = 900
const ACTION_MS = 1900

type Stage = "intro" | "action" | "ask"

interface AnimatedOperationGameProps {
  operation: TableOperation
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

function Icon({
  emoji,
  delayMs = 0,
  leaving = false,
  leaveIndex = 0,
}: {
  emoji: string
  delayMs?: number
  /** True once this icon should visibly leave the scene (fly/run/float off), rather than just fading in place. */
  leaving?: boolean
  /** Alternates the exit direction per icon so a group leaving together scatters instead of all sliding the same way. */
  leaveIndex?: number
}) {
  const driftX = leaveIndex % 2 === 0 ? 34 : -34
  return (
    <span
      className={`text-4xl inline-block ${leaving ? "table-icon-leave" : "table-icon-pop"}`}
      style={{ animationDelay: `${delayMs}ms`, "--drift-x": `${driftX}px` } as CSSProperties}
    >
      {emoji}
    </span>
  )
}

const TABLE_SCOPED = new Set<TableOperation>(["add", "subtract", "multiply", "divide"])

export function AnimatedOperationGame({ operation, gradientClass, onBackToModes, onComplete }: AnimatedOperationGameProps) {
  const gameKey = `math-tables:${operation}:animated`
  const needsTable = TABLE_SCOPED.has(operation)

  const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundIndex, setRoundIndex] = useState(0)
  const theme = getAnimatedTheme(operation, tableNumber)
  const [score, setScore] = useState(0)
  const [fact, setFact] = useState<Fact | null>(null)
  const [stage, setStage] = useState<Stage>("intro")
  const [typedAnswer, setTypedAnswer] = useState("")
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (needsTable && tableNumber === null) return
    const nextFact =
      needsTable && tableNumber !== null
        ? generateRandomFactInTable(operation, tableNumber, gameKey)
        : generateRandomFact(operation, gameKey)
    setFact(nextFact)
    setStage("intro")
    setTypedAnswer("")
    setShowResult(null)
    // Division's one-at-a-time distribution can involve a lot more items
    // than a fixed pace suits (up to 10 groups of 10) — give it more time,
    // capped so a big fact still finishes at a reasonable pace.
    const actionMs = operation === "divide" ? Math.min(1300 + nextFact.a * 45, 4500) : ACTION_MS
    const t1 = setTimeout(() => setStage("action"), INTRO_MS)
    const t2 = setTimeout(() => {
      setStage("ask")
      inputRef.current?.focus()
    }, INTRO_MS + actionMs)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex, tableNumber])

  const handleSubmit = () => {
    if (!fact || showResult) return
    const parsed = parseInt(typedAnswer, 10)
    const correct = !Number.isNaN(parsed) && parsed === fact.answer
    setShowResult(correct ? "correct" : "wrong")
    if (correct) playCorrectSound()
    else playWrongSound()

    setTimeout(() => {
      const nextScore = correct ? score + 1 : score
      if (correct) setScore(nextScore)
      if (roundIndex < ROUND_LENGTH - 1) {
        setRoundIndex((i) => i + 1)
      } else {
        onComplete(nextScore, ROUND_LENGTH)
        setPhase("results")
      }
    }, 5000)
  }

  const handleRestart = () => {
    setScore(0)
    setRoundIndex(0)
    setPhase("playing")
  }

  const handlePickAnotherTable = () => {
    setTableNumber(null)
    setRoundIndex(0)
    setScore(0)
    setPhase("playing")
  }

  if (needsTable && tableNumber === null) {
    return (
      <TablePicker operation={operation} gradientClass={gradientClass} onBack={onBackToModes} onPick={setTableNumber} />
    )
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={ROUND_LENGTH}
        onPlayAgain={handleRestart}
        onBackToTopics={needsTable ? handlePickAnotherTable : onBackToModes}
        title="Great Job!"
        gradientClass={gradientClass}
      />
    )
  }

  if (!fact) return null

  const storyLine = () => {
    switch (operation) {
      case "add":
        return stage === "action"
          ? `+ ${fact.b} more ${fact.b === 1 ? theme.noun : theme.pluralNoun} ${theme.actionVerb}!`
          : stage === "ask"
            ? `How many ${theme.pluralNoun}?`
            : `${fact.a} ${fact.a === 1 ? theme.noun : theme.pluralNoun}`
      case "subtract":
        return stage === "action"
          ? `${fact.b} ${fact.b === 1 ? theme.noun : theme.pluralNoun} ${theme.actionVerb}!`
          : stage === "ask"
            ? `How many ${theme.pluralNoun} are left?`
            : `${fact.a} ${fact.a === 1 ? theme.noun : theme.pluralNoun}`
      case "multiply":
        return stage === "action"
          ? `${fact.a} groups of ${fact.b} ${theme.pluralNoun}`
          : stage === "ask"
            ? `How many ${theme.pluralNoun} in total?`
            : "Watch the groups form"
      case "divide":
        return stage === "action"
          ? `Each ${theme.noun} flies into a ${theme.recipientNoun}!`
          : stage === "ask"
            ? `How many ${theme.pluralNoun} does each ${theme.recipientNoun} get?`
            : `Share ${fact.a} ${theme.pluralNoun} equally between ${fact.b} ${fact.b === 1 ? theme.recipientNoun : theme.recipientPluralNoun}.`
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={needsTable ? handlePickAnotherTable : onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {needsTable ? `Table ${tableNumber}` : "Back"}
          </Button>
          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-lg font-bold text-white mr-1">
              Question {roundIndex + 1}/{ROUND_LENGTH}
            </span>
            {Array.from({ length: ROUND_LENGTH }, (_, i) => (
              <Star key={i} className={`h-7 w-7 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-10 md:p-12 text-center">
            <p className="text-2xl font-bold text-gray-700 mb-8 min-h-[2.5rem]">{storyLine()}</p>

            {/* Visual story */}
            <div className="mb-8 min-h-[100px] flex items-center justify-center">
              {operation === "add" && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
                    {Array.from({ length: fact.a }, (_, i) => (
                      <Icon key={`a-${i}`} emoji={theme.emoji} delayMs={i * 80} />
                    ))}
                    {stage !== "intro" && (
                      <>
                        <span className="text-4xl font-bold text-gray-400 mx-1">+</span>
                        {Array.from({ length: fact.b }, (_, i) => (
                          <Icon key={`b-${i}`} emoji={theme.emoji} delayMs={i * 120} />
                        ))}
                      </>
                    )}
                  </div>
                  {stage === "ask" && (
                    <div className="text-2xl font-bold text-gray-600">
                      {fact.a} + {fact.b}
                    </div>
                  )}
                </div>
              )}

              {operation === "subtract" && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                    {Array.from({ length: fact.a }, (_, i) => (
                      <Icon
                        key={i}
                        emoji={theme.emoji}
                        delayMs={i * 80}
                        leaving={stage !== "intro" && i >= fact.a - fact.b}
                        leaveIndex={i}
                      />
                    ))}
                  </div>
                  {stage === "ask" && (
                    <div className="text-2xl font-bold text-gray-600">
                      {fact.a} {fact.a === 1 ? theme.noun : theme.pluralNoun} − {fact.b} {fact.b === 1 ? theme.noun : theme.pluralNoun}
                    </div>
                  )}
                </div>
              )}

              {operation === "multiply" && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-wrap justify-center gap-3 max-w-xl">
                    {Array.from({ length: fact.a }, (_, row) =>
                      stage !== "intro" || row === 0 ? (
                        <div
                          key={row}
                          className="flex flex-wrap items-center justify-center gap-1.5 p-3 rounded-2xl border-4 border-indigo-200 bg-indigo-50"
                        >
                          {Array.from({ length: fact.b }, (_, col) => (
                            <Icon key={col} emoji={theme.emoji} delayMs={row * 200 + col * 60} />
                          ))}
                        </div>
                      ) : null
                    )}
                  </div>
                  {stage === "ask" && (
                    <div className="flex flex-col items-center gap-1 text-2xl font-bold text-gray-600">
                      <div>
                        {fact.a} {fact.a === 1 ? "group" : "groups"} of {fact.b} {theme.pluralNoun}
                      </div>
                      <div>
                        {fact.a} x {fact.b}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {operation === "divide" && (
                <div className="flex flex-col items-center gap-4">
                  {/* Pool square — items visibly leave one at a time once sharing starts. */}
                  <div className="flex flex-wrap justify-center gap-1.5 p-4 rounded-2xl border-4 border-amber-200 bg-amber-50 max-w-xs min-h-[3.5rem]">
                    {Array.from({ length: fact.a }, (_, i) => (
                      <Icon
                        key={i}
                        emoji={theme.emoji}
                        // Same delay formula as the matching basket arrival below,
                        // so an item "leaving" the pool and its twin "arriving" in
                        // a basket happen at the same moment — the closest a pure
                        // CSS animation gets to a real point-to-point flight.
                        delayMs={i * 45}
                        leaving={stage !== "intro"}
                        leaveIndex={i}
                      />
                    ))}
                  </div>

                  {stage !== "intro" && (
                    <div className="flex flex-wrap justify-center gap-4">
                      {Array.from({ length: fact.b }, (_, groupIdx) => (
                        <div
                          key={groupIdx}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-4 border-emerald-200 bg-emerald-50"
                        >
                          <span className="text-3xl">{theme.recipientEmoji}</span>
                          <div className="flex flex-wrap justify-center gap-1 w-[90px] min-h-[2.5rem]">
                            {Array.from({ length: fact.answer }, (_, i) => (
                              <Icon
                                key={i}
                                emoji={theme.emoji}
                                // Round-robin delay: one item lands per recipient in
                                // turn (basket 1, basket 2, basket 1, ...), so they
                                // visibly fill up one at a time rather than all at once.
                                delayMs={(i * fact.b + groupIdx) * 45}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage === "ask" && (
                    <div className="text-2xl font-bold text-gray-600">
                      {fact.a} ÷ {fact.b}
                    </div>
                  )}
                </div>
              )}
            </div>

            {stage === "ask" && (
              <div className="flex flex-col items-center gap-4">
                <Input
                  ref={inputRef}
                  type="number"
                  inputMode="numeric"
                  autoFocus
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                  }}
                  disabled={!!showResult}
                  placeholder="Type your answer"
                  className="no-spinner text-4xl md:text-5xl font-bold text-center h-20 max-w-sm placeholder:text-base md:placeholder:text-lg placeholder:font-medium"
                />
                {!showResult && (
                  <Button
                    onClick={handleSubmit}
                    disabled={typedAnswer === ""}
                    className="h-16 px-10 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg"
                  >
                    Check
                  </Button>
                )}
              </div>
            )}

            {showResult && (
              <div
                className={`mt-6 text-center p-6 rounded-2xl ${showResult === "correct" ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${showResult === "correct" ? "text-green-600" : "text-red-600"} mb-2`}>
                  {showResult === "correct" ? "🎉 Correct!" : "🤔 Not Quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {fact.a} {operation === "add" ? "+" : operation === "subtract" ? "−" : operation === "multiply" ? "×" : "÷"} {fact.b} = {fact.answer}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <MathScratchpad />
      </div>

      <style jsx>{`
        @keyframes table-icon-pop-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          70% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .table-icon-pop {
          animation: table-icon-pop-in 0.4s ease-out both;
        }
        @keyframes table-icon-leave {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--drift-x, 30px), -55px) scale(0.5);
            opacity: 0;
          }
        }
        .table-icon-leave {
          animation: table-icon-leave 0.8s ease-in forwards;
        }
      `}</style>
    </div>
  )
}
