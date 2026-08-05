"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { MathScratchpad } from "@/components/math-operations/math-scratchpad"
import { TablePicker } from "./table-picker"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { generateRandomFact, generateRandomFactInTable, ANIMATED_THEME, type TableOperation, type Fact } from "@/lib/math-tables-data"

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

function Icon({ emoji, delayMs = 0, fading = false }: { emoji: string; delayMs?: number; fading?: boolean }) {
  return (
    <span
      className={`text-4xl inline-block ${fading ? "table-icon-fade" : "table-icon-pop"}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {emoji}
    </span>
  )
}

const TABLE_SCOPED = new Set<TableOperation>(["add", "subtract", "multiply"])

export function AnimatedOperationGame({ operation, gradientClass, onBackToModes, onComplete }: AnimatedOperationGameProps) {
  const gameKey = `math-tables:${operation}:animated`
  const theme = ANIMATED_THEME[operation]
  const needsTable = TABLE_SCOPED.has(operation)

  const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundIndex, setRoundIndex] = useState(0)
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
        ? generateRandomFactInTable(operation as "add" | "subtract" | "multiply", tableNumber, gameKey)
        : generateRandomFact(operation, gameKey)
    setFact(nextFact)
    setStage("intro")
    setTypedAnswer("")
    setShowResult(null)
    const t1 = setTimeout(() => setStage("action"), INTRO_MS)
    const t2 = setTimeout(() => {
      setStage("ask")
      inputRef.current?.focus()
    }, INTRO_MS + ACTION_MS)
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
      <TablePicker
        operation={operation as "add" | "subtract" | "multiply"}
        gradientClass={gradientClass}
        onBack={onBackToModes}
        onPick={setTableNumber}
      />
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
        return stage === "action" ? `+ ${fact.b} more ${theme.emoji} swim in!` : stage === "ask" ? "How many now?" : `${fact.a} fish`
      case "subtract":
        return stage === "action" ? `${fact.b} fly away!` : stage === "ask" ? "How many are left?" : `${fact.a} chicks`
      case "multiply":
        return stage === "action" ? `${fact.a} groups of ${fact.b}` : stage === "ask" ? "How many apples in total?" : "Watch the groups form"
      case "divide":
        return stage === "action" ? `Share equally among ${fact.b} friends!` : stage === "ask" ? "How many does each friend get?" : `${fact.a} cookies`
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
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {Array.from({ length: fact.a }, (_, i) => (
                    <Icon key={`a-${i}`} emoji={theme.emoji} delayMs={i * 80} />
                  ))}
                  {stage !== "intro" &&
                    Array.from({ length: fact.b }, (_, i) => <Icon key={`b-${i}`} emoji={theme.emoji} delayMs={i * 120} />)}
                </div>
              )}

              {operation === "subtract" && (
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {Array.from({ length: fact.a }, (_, i) => (
                    <Icon key={i} emoji={theme.emoji} delayMs={i * 80} fading={stage !== "intro" && i >= fact.a - fact.b} />
                  ))}
                </div>
              )}

              {operation === "multiply" && (
                <div className="flex flex-col items-center gap-2">
                  {Array.from({ length: fact.a }, (_, row) => (
                    <div key={row} className="flex gap-2">
                      {stage !== "intro" || row === 0
                        ? Array.from({ length: fact.b }, (_, col) => (
                            <Icon key={col} emoji={theme.emoji} delayMs={row * 200 + col * 60} />
                          ))
                        : null}
                    </div>
                  ))}
                </div>
              )}

              {operation === "divide" && (
                <div>
                  {stage === "intro" ? (
                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                      {Array.from({ length: fact.a }, (_, i) => (
                        <Icon key={i} emoji={theme.emoji} delayMs={i * 60} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-6">
                      {Array.from({ length: fact.b }, (_, groupIdx) => (
                        <div key={groupIdx} className="flex flex-col items-center gap-1">
                          <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
                            {Array.from({ length: fact.answer }, (_, i) => (
                              <Icon key={i} emoji={theme.emoji} delayMs={groupIdx * 150 + i * 60} />
                            ))}
                          </div>
                          <span className="text-4xl">{theme.recipientEmoji}</span>
                        </div>
                      ))}
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
        @keyframes table-icon-fade-out {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.4);
            opacity: 0.15;
          }
        }
        .table-icon-fade {
          animation: table-icon-fade-out 0.6s ease-in forwards;
        }
      `}</style>
    </div>
  )
}
