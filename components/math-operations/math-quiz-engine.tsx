"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { NumberLineJump } from "@/components/number-line-jump"
import { AnimatedFigures } from "./animated-figures"
import { ColumnAnswerGrid } from "./column-answer-grid"
import { MathScratchpad } from "./math-scratchpad"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import {
  OPERATION_SYMBOLS,
  generateNumericalQuestion,
  generateWordProblem,
  generateChoices,
  type DigitLevel,
  type Format,
  type Mechanic,
  type Operation,
} from "@/lib/math-operations-data"

const ROUND_LENGTH = 5

interface RoundQuestion {
  a: number
  b: number
  answer: number
  text?: string
  /** Illustrative emoji for word problems (e.g. 🥭 for "mangoes"). */
  emoji?: string
  choices?: number[]
  /** For "missing-operand": which slot the child must fill in. */
  missingSlot?: "a" | "b"
}

interface MathQuizEngineProps {
  operation: Operation
  digitLevel: DigitLevel
  format: Format
  mechanic: Mechanic
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

function buildQuestion(
  operation: Operation,
  digitLevel: DigitLevel,
  format: Format,
  mechanic: Mechanic,
  gameKey: string,
): RoundQuestion {
  const question: RoundQuestion =
    format === "word-problem"
      ? (() => {
          const wp = generateWordProblem(operation, digitLevel, gameKey)
          return { a: wp.a, b: wp.b, answer: wp.answer, text: wp.text, emoji: wp.emoji }
        })()
      : generateNumericalQuestion(operation, digitLevel, gameKey)

  if (mechanic === "mcq") {
    const spread = digitLevel === "1" ? 5 : digitLevel === "2" ? 10 : 50
    question.choices = generateChoices(question.answer, spread)
  }

  if (mechanic === "missing-operand") {
    // Always solve for the second operand — one consistent input across all four operations.
    question.missingSlot = "b"
  }

  return question
}

export default function MathQuizEngine({
  operation,
  digitLevel,
  format,
  mechanic,
  gradientClass,
  onBackToModes,
  onComplete,
}: MathQuizEngineProps) {
  const gameKey = `math-${operation}:${digitLevel}:${format}`
  const symbol = OPERATION_SYMBOLS[operation]

  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<RoundQuestion | null>(null)
  const [typedAnswer, setTypedAnswer] = useState("")
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
  const [numberLineDone, setNumberLineDone] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // The subtraction mascot turns to face left before actually navigating away,
  // so the "walking back" motion reads clearly instead of an instant cut.
  const handleBack = () => {
    if (operation !== "subtract") {
      onBackToModes()
      return
    }
    setIsLeaving(true)
    setTimeout(onBackToModes, 400)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuestion(buildQuestion(operation, digitLevel, format, mechanic, gameKey))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  useEffect(() => {
    setTypedAnswer("")
    setNumberLineDone(false)
    if (mechanic === "number-line") {
      const timer = setTimeout(() => {
        setNumberLineDone(true)
        inputRef.current?.focus()
      }, 1300)
      return () => clearTimeout(timer)
    }
    if (mechanic !== "mcq") {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [question, mechanic])

  const finishRound = (wasCorrect: boolean) => {
    setShowResult(wasCorrect ? "correct" : "wrong")
    if (wasCorrect) {
      playCorrectSound()
    } else {
      playWrongSound()
    }

    setTimeout(() => {
      setShowResult(null)
      const nextScore = wasCorrect ? score + 1 : score
      if (wasCorrect) setScore(nextScore)

      if (roundIndex < ROUND_LENGTH - 1) {
        setRoundIndex((i) => i + 1)
      } else {
        onComplete(nextScore, ROUND_LENGTH)
        setPhase("results")
      }
    }, 5000)
  }

  // Accepts an optional override so a caller that just computed the answer
  // itself (ColumnAnswerGrid, right after its own setState) can pass it
  // straight through instead of relying on `typedAnswer`, which — since
  // setState isn't synchronous — would still hold the previous render's
  // value if read in the same tick as the state update that produced it.
  const submitTyped = (overrideAnswer?: string) => {
    if (!question || showResult) return
    const expected = question.missingSlot === "b" ? question.b : question.answer
    const parsed = parseInt(overrideAnswer ?? typedAnswer, 10)
    finishRound(!Number.isNaN(parsed) && parsed === expected)
  }

  const submitChoice = (choice: number) => {
    if (!question || showResult) return
    finishRound(choice === question.answer)
  }

  const handleRestart = () => {
    setScore(0)
    setRoundIndex(0)
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={ROUND_LENGTH}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToModes}
        title="Math Champion!"
        gradientClass={gradientClass}
      />
    )
  }

  if (!question) return null

  const equationText =
    mechanic === "missing-operand"
      ? `${question.a} ${symbol} ___ = ${question.answer}`
      : `${question.a} ${symbol} ${question.b} = ${showResult ? question.answer : "?"}`

  // The objects-appearing hint only reads clearly with small counts, so it's
  // limited to 1-digit addition/subtraction (numerical or word problem) —
  // 2/3-digit levels would mean dozens of icons, unusable.
  const canShowFigures = digitLevel === "1" && (operation === "add" || operation === "subtract")

  // Division's quotient digit count doesn't map cleanly onto a's/b's column
  // widths the way add/subtract/multiply do, so it keeps the single-box input.
  const isColumnGrid = mechanic === "column" && operation !== "divide"
  const answerLength = String(question.answer).length

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      {operation === "subtract" && (
        <img
          src="/characters/rabbit.png"
          alt="Rabbit"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10 transition-transform duration-500 ease-in-out"
          style={{ transform: `scaleX(${isLeaving ? -1 : 1})` }}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handleBack}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm">
            <span className="text-lg font-bold text-white mr-1">
              Question {roundIndex + 1}/{ROUND_LENGTH}
            </span>
            {Array.from({ length: ROUND_LENGTH }, (_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-10 md:p-12">
            {question.text ? (
              <>
                <p className="text-2xl font-bold text-gray-800 text-center mb-6 leading-relaxed">{question.text}</p>

                {canShowFigures && (
                  <div className="bg-amber-50 rounded-2xl p-4 mb-6">
                    <AnimatedFigures a={question.a} b={question.b} operation={operation} emoji={question.emoji} />
                  </div>
                )}

                {showResult && (
                  <p className="text-3xl font-bold text-gray-800 text-center mb-8">
                    {question.a} {symbol} {question.b} = {question.answer}
                  </p>
                )}
              </>
            ) : mechanic === "column" && operation === "divide" ? (
              <div className="flex flex-col items-end mx-auto w-fit mb-8 font-mono text-4xl font-bold text-gray-800">
                <div className="pr-2">{question.a}</div>
                <div className="flex items-center gap-3">
                  <span>{symbol}</span>
                  <span>{question.b}</span>
                </div>
                <div className="w-full border-b-4 border-gray-700 mt-1" />
              </div>
            ) : mechanic === "column" ? null : (
              <p className="text-5xl font-bold text-gray-800 text-center mb-8">{equationText}</p>
            )}

            {mechanic === "number-line" && (
              <div className="bg-indigo-50 rounded-2xl p-4 mb-8">
                <NumberLineJump
                  start={question.a}
                  end={question.answer}
                  max={Math.max(question.a, question.answer, 20)}
                  character={operation === "add" ? "kangaroo" : "rabbit"}
                />
              </div>
            )}

            {!question.text && canShowFigures && (
              <div className="bg-amber-50 rounded-2xl p-4 mb-8">
                <AnimatedFigures a={question.a} b={question.b} operation={operation} />
              </div>
            )}

            {mechanic === "mcq" && question.choices && (
              <div className="grid grid-cols-2 gap-5">
                {question.choices.map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => submitChoice(choice)}
                    disabled={!!showResult}
                    className="h-20 md:h-24 text-3xl md:text-4xl font-bold bg-white hover:bg-indigo-50 text-gray-800 border-2 border-indigo-200 hover:border-indigo-500 rounded-2xl shadow-md"
                    variant="outline"
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            )}

            {isColumnGrid && (
              <div className="flex flex-col items-center gap-4">
                <ColumnAnswerGrid
                  a={question.a}
                  b={question.b}
                  symbol={symbol}
                  operation={operation}
                  answerLength={answerLength}
                  value={typedAnswer}
                  onChange={setTypedAnswer}
                  disabled={!!showResult}
                  onEnterComplete={submitTyped}
                />
                {!showResult && (
                  <Button
                    onClick={() => submitTyped()}
                    disabled={typedAnswer.length < answerLength}
                    className="h-16 px-10 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg"
                  >
                    Check
                  </Button>
                )}
              </div>
            )}

            {(mechanic === "typed" ||
              (mechanic === "column" && operation === "divide") ||
              mechanic === "missing-operand" ||
              (mechanic === "number-line" && numberLineDone)) && (
                <div className="flex flex-col items-center gap-4">
                  <Input
                    ref={inputRef}
                    type="number"
                    inputMode="numeric"
                    autoFocus
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitTyped()
                    }}
                    disabled={!!showResult}
                    placeholder="Type your answer"
                    className="no-spinner text-4xl md:text-5xl font-bold text-center h-20 max-w-sm placeholder:text-base md:placeholder:text-lg placeholder:font-medium"
                  />
                  {!showResult && (
                    <Button
                      onClick={() => submitTyped()}
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
                {showResult === "wrong" && (
                  <div className="text-xl font-medium text-gray-700">
                    The correct answer is {mechanic === "missing-operand" ? question.b : question.answer}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <MathScratchpad />
      </div>
    </div>
  )
}
