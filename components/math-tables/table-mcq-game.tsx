"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { MathScratchpad } from "@/components/math-operations/math-scratchpad"
import { TablePicker } from "./table-picker"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { generateTableFact, generateFactChoices, TABLE_OPERATION_SYMBOLS, type Fact } from "@/lib/math-tables-data"

const TABLE_LENGTH = 10
const ADVANCE_DELAY_MS = 5000

interface TableMcqGameProps {
  operation: "add" | "subtract" | "multiply"
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

const TABLE_LABEL: Record<TableMcqGameProps["operation"], (n: number) => string> = {
  add: (n) => `Add ${n}`,
  subtract: (n) => `Subtract ${n}`,
  multiply: (n) => `${n} Table`,
}

/** Alternates question format position by position, so the "final test" mixes tap-a-choice and type-the-answer questions rather than being all one format. */
function questionTypeFor(position: number): "mcq" | "typed" {
  return position % 2 === 1 ? "mcq" : "typed"
}

export function TableMcqGame({ operation, gradientClass, onBackToModes, onComplete }: TableMcqGameProps) {
  const symbol = TABLE_OPERATION_SYMBOLS[operation]
  const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [position, setPosition] = useState(1)
  const [score, setScore] = useState(0)
  const [fact, setFact] = useState<Fact | null>(null)
  const [choices, setChoices] = useState<number[]>([])
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const [typedAnswer, setTypedAnswer] = useState("")
  const [masteredPositions, setMasteredPositions] = useState<Set<number>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const questionType = questionTypeFor(position)

  useEffect(() => {
    if (tableNumber === null) return
    const f = generateTableFact(operation, tableNumber, position)
    setFact(f)
    const spread = operation === "multiply" ? tableNumber * 2 : 4
    setChoices(generateFactChoices(f.answer, Math.max(spread, 3)))
    setShowResult(null)
    setTypedAnswer("")
    if (questionTypeFor(position) === "typed") {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableNumber, position])

  const advance = (correct: boolean) => {
    if (correct) setMasteredPositions((prev) => new Set(prev).add(position))
    setTimeout(() => {
      const nextScore = correct ? score + 1 : score
      if (correct) setScore(nextScore)
      if (position < TABLE_LENGTH) {
        setPosition((p) => p + 1)
      } else {
        onComplete(nextScore, TABLE_LENGTH)
        setPhase("results")
      }
    }, ADVANCE_DELAY_MS)
  }

  const handleChoice = (choice: number) => {
    if (!fact || showResult) return
    const correct = choice === fact.answer
    setShowResult(correct ? "correct" : "wrong")
    if (correct) playCorrectSound()
    else playWrongSound()
    advance(correct)
  }

  const handleTypedSubmit = () => {
    if (!fact || showResult) return
    const parsed = parseInt(typedAnswer, 10)
    const correct = !Number.isNaN(parsed) && parsed === fact.answer
    setShowResult(correct ? "correct" : "wrong")
    if (correct) playCorrectSound()
    else playWrongSound()
    advance(correct)
  }

  const handleRestart = () => {
    setScore(0)
    setPosition(1)
    setMasteredPositions(new Set())
    setPhase("playing")
  }

  const handlePickAnotherTable = () => {
    setTableNumber(null)
    setPosition(1)
    setScore(0)
    setMasteredPositions(new Set())
    setPhase("playing")
  }

  if (tableNumber === null) {
    return (
      <TablePicker
        operation={operation}
        gradientClass={gradientClass}
        onBack={onBackToModes}
        onPick={setTableNumber}
        title="Choose a Table to Master"
        subtitle="Pick a number, then take the final test"
      />
    )
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={TABLE_LENGTH}
        onPlayAgain={handleRestart}
        onBackToTopics={handlePickAnotherTable}
        title="Table Master!"
        gradientClass={gradientClass}
      />
    )
  }

  if (!fact) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={handlePickAnotherTable}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {TABLE_LABEL[operation](tableNumber)}
          </Button>
          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-lg font-bold text-white mr-1">
              Question {position}/{TABLE_LENGTH}
            </span>
            {Array.from({ length: TABLE_LENGTH }, (_, i) => (
              <Star key={i} className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6 items-start">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-10 md:p-12">
              <p className="text-5xl font-bold text-gray-800 text-center mb-10">
                {fact.a} {symbol} {fact.b} = {questionType === "typed" && showResult ? fact.answer : "?"}
              </p>

              {questionType === "mcq" ? (
                <div className="grid grid-cols-2 gap-5">
                  {choices.map((choice) => {
                    const isCorrectChoice = choice === fact.answer
                    let cardClass = "bg-white hover:bg-indigo-50 text-gray-800 border-indigo-200 hover:border-indigo-500"
                    if (showResult && isCorrectChoice) cardClass = "bg-green-200 border-green-500 text-green-900"
                    else if (showResult && !isCorrectChoice) cardClass = "bg-white text-gray-400 border-gray-200"

                    return (
                      <Button
                        key={choice}
                        onClick={() => handleChoice(choice)}
                        disabled={!!showResult}
                        className={`h-20 md:h-24 text-3xl md:text-4xl font-bold border-2 rounded-2xl shadow-md ${cardClass}`}
                        variant="outline"
                      >
                        {choice}
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Input
                    ref={inputRef}
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTypedSubmit()
                    }}
                    disabled={!!showResult}
                    placeholder="Type your answer"
                    className="no-spinner text-4xl md:text-5xl font-bold text-center h-20 max-w-sm placeholder:text-base md:placeholder:text-lg placeholder:font-medium"
                  />
                  {!showResult && (
                    <Button
                      onClick={handleTypedSubmit}
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

          {/* Live progress table — fills in with a checkmark as each fact is mastered, keeping answers hidden until then so it doesn't spoil the test. */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-5">
              <h3 className="text-lg font-bold text-gray-800 text-center mb-3">{TABLE_LABEL[operation](tableNumber)}</h3>
              <div className="space-y-1">
                {Array.from({ length: TABLE_LENGTH }, (_, i) => i + 1).map((pos) => {
                  const f = generateTableFact(operation, tableNumber, pos)
                  const mastered = masteredPositions.has(pos)
                  const isCurrent = pos === position
                  return (
                    <div
                      key={pos}
                      className={`flex items-center justify-between rounded-lg px-3 py-1.5 font-mono text-sm font-semibold ${
                        mastered ? "bg-green-100 text-green-800" : isCurrent ? "bg-indigo-50 text-indigo-900" : "text-gray-400"
                      }`}
                    >
                      <span>
                        {f.a} {symbol} {f.b}
                        {mastered ? ` = ${f.answer}` : ""}
                      </span>
                      {mastered && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 ml-2" />}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <MathScratchpad />
      </div>
    </div>
  )
}
