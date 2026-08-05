"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { NumberLineJump } from "@/components/number-line-jump"
import { MathScratchpad } from "@/components/math-operations/math-scratchpad"
import { TablePicker } from "./table-picker"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { generateRandomFactInTable, TABLE_OPERATION_SYMBOLS, type Fact } from "@/lib/math-tables-data"

const ROUND_LENGTH = 5

interface NumberLineTableGameProps {
  operation: "add" | "subtract"
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

export function NumberLineTableGame({ operation, gradientClass, onBackToModes, onComplete }: NumberLineTableGameProps) {
  const symbol = TABLE_OPERATION_SYMBOLS[operation]

  const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [fact, setFact] = useState<Fact | null>(null)
  const [hopDone, setHopDone] = useState(false)
  const [typedAnswer, setTypedAnswer] = useState("")
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (tableNumber === null) return
    setFact(generateRandomFactInTable(operation, tableNumber, `math-tables:${operation}:number-line`))
    setHopDone(false)
    setTypedAnswer("")
    setShowResult(null)
    const timer = setTimeout(() => {
      setHopDone(true)
      inputRef.current?.focus()
    }, 1300)
    return () => clearTimeout(timer)
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

  if (tableNumber === null) {
    return <TablePicker operation={operation} gradientClass={gradientClass} onBack={onBackToModes} onPick={setTableNumber} />
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={ROUND_LENGTH}
        onPlayAgain={handleRestart}
        onBackToTopics={handlePickAnotherTable}
        title="Great Job!"
        gradientClass={gradientClass}
      />
    )
  }

  if (!fact) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={handlePickAnotherTable}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Table {tableNumber}
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
          <CardContent className="p-10 md:p-12">
            <p className="text-5xl font-bold text-gray-800 text-center mb-8">
              {fact.a} {symbol} {fact.b} = {showResult ? fact.answer : "?"}
            </p>

            <div className="bg-indigo-50 rounded-2xl p-4 mb-8">
              <NumberLineJump
                start={fact.a}
                end={fact.answer}
                max={Math.max(fact.a, fact.answer, 20)}
                character={operation === "add" ? "kangaroo" : "rabbit"}
              />
            </div>

            {hopDone && (
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
                <div className={`text-3xl font-bold ${showResult === "correct" ? "text-green-600" : "text-red-600"}`}>
                  {showResult === "correct" ? "🎉 Correct!" : `🤔 The answer is ${fact.answer}`}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <MathScratchpad />
      </div>
    </div>
  )
}
