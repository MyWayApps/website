"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { NumberLineJump } from "@/components/number-line-jump"
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

const HAPPY_TUNE_AUDIO = "/audio/happy_tune.mp3"
const BUZZ_AUDIO = "/audio/buzz_audio.mp3"
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

  const happyTuneRef = useRef<HTMLAudioElement | null>(null)
  const buzzRef = useRef<HTMLAudioElement | null>(null)
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

  const playHappyTune = () => {
    if (happyTuneRef.current) {
      happyTuneRef.current.currentTime = 0
      happyTuneRef.current.play().catch(() => {})
    }
  }
  const playBuzz = () => {
    if (buzzRef.current) {
      buzzRef.current.currentTime = 0
      buzzRef.current.play().catch(() => {})
    }
  }

  const finishRound = (wasCorrect: boolean) => {
    setShowResult(wasCorrect ? "correct" : "wrong")
    if (wasCorrect) {
      playHappyTune()
    } else {
      playBuzz()
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
    }, 1400)
  }

  const submitTyped = () => {
    if (!question || showResult) return
    const expected = question.missingSlot === "b" ? question.b : question.answer
    const parsed = parseInt(typedAnswer, 10)
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
      : `${question.a} ${symbol} ${question.b} = ?`

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-300" />
            <span className="text-xl font-bold text-white">
              Question {roundIndex + 1}/{ROUND_LENGTH} · Score: {score}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {question.text ? (
              <>
                {question.emoji && (
                  <p className="text-5xl text-center mb-4 leading-none" aria-hidden="true">
                    {question.emoji.repeat(Math.min(question.a, 12))}
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-800 text-center mb-8 leading-relaxed">{question.text}</p>
              </>
            ) : mechanic === "column" ? (
              <div className="flex flex-col items-end mx-auto w-fit mb-8 font-mono text-4xl font-bold text-gray-800">
                <div className="pr-2">{question.a}</div>
                <div className="flex items-center gap-3">
                  <span>{symbol}</span>
                  <span>{question.b}</span>
                </div>
                <div className="w-full border-b-4 border-gray-700 mt-1" />
              </div>
            ) : (
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

            {mechanic === "mcq" && question.choices && (
              <div className="grid grid-cols-2 gap-4">
                {question.choices.map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => submitChoice(choice)}
                    disabled={!!showResult}
                    className="h-16 text-2xl font-bold bg-white hover:bg-indigo-50 text-gray-800 border-2 border-indigo-200 hover:border-indigo-500 rounded-2xl shadow-md"
                    variant="outline"
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            )}

            {(mechanic === "typed" ||
              mechanic === "column" ||
              mechanic === "missing-operand" ||
              (mechanic === "number-line" && numberLineDone)) && (
                <div className="flex flex-col items-center gap-4">
                  <Input
                    ref={inputRef}
                    type="number"
                    inputMode="numeric"
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitTyped()
                    }}
                    disabled={!!showResult}
                    placeholder="Type your answer"
                    className="no-spinner text-3xl font-bold text-center h-16 max-w-xs"
                  />
                  <Button
                    onClick={submitTyped}
                    disabled={!!showResult || typedAnswer === ""}
                    className="h-14 px-10 text-xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg"
                  >
                    Check
                  </Button>
                </div>
              )}

            {showResult && (
              <div
                className={`mt-6 text-center p-6 rounded-2xl ${showResult === "correct" ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${showResult === "correct" ? "text-green-600" : "text-red-600"} mb-2`}>
                  {showResult === "correct" ? "🎉 Correct!" : "🤔 Try Again!"}
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
      </div>

      <audio ref={happyTuneRef} src={HAPPY_TUNE_AUDIO} preload="auto" />
      <audio ref={buzzRef} src={BUZZ_AUDIO} preload="auto" />
    </div>
  )
}
