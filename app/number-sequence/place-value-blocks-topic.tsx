"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { RoundResult } from "./types"
import { generateBlockPlaceValueQuestion, type BlockPlaceValueQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

const UNIT = 12 // px — base grid cell size all the blocks derive from

function gridLines(cellPx: number) {
  return {
    backgroundImage:
      `repeating-linear-gradient(to right, rgba(0,0,0,0.3) 0 1px, transparent 1px ${cellPx}px), ` +
      `repeating-linear-gradient(to bottom, rgba(0,0,0,0.3) 0 1px, transparent 1px ${cellPx}px)`,
  }
}

function OnesBlock() {
  return (
    <div
      className="rounded-sm border-2"
      style={{ width: UNIT * 2, height: UNIT * 2, background: "#c4a3f0", borderColor: "#5b2c8f" }}
    />
  )
}

function TensBlock() {
  return (
    <div
      className="rounded-sm border-2"
      style={{
        width: UNIT * 2,
        height: UNIT * 2 * 10,
        backgroundColor: "#fbbf24",
        borderColor: "#b45309",
        backgroundImage: `repeating-linear-gradient(to bottom, rgba(0,0,0,0.3) 0 1px, transparent 1px ${UNIT * 2}px)`,
      }}
    />
  )
}

function HundredsBlock() {
  const size = UNIT * 2 * 10
  return (
    <div
      className="rounded-sm border-2"
      style={{ width: size, height: size, backgroundColor: "#86efac", borderColor: "#166534", ...gridLines(UNIT * 2) }}
    />
  )
}

function ThousandsBlock() {
  const size = UNIT * 2 * 10
  const offset = UNIT
  return (
    <div className="relative" style={{ width: size + offset, height: size + offset }}>
      <div className="absolute rounded-sm" style={{ width: size, height: size, top: offset, left: offset, backgroundColor: "#1e3a8a" }} />
      <div
        className="absolute rounded-sm border-2"
        style={{ width: size, height: size, backgroundColor: "#60a5fa", borderColor: "#1e3a8a", ...gridLines(UNIT * 2) }}
      />
    </div>
  )
}

interface PlaceValueBlocksTopicProps {
  onRoundComplete: (result: RoundResult) => void
  onBackToModes: () => void
}

export default function PlaceValueBlocksTopic({ onRoundComplete, onBackToModes }: PlaceValueBlocksTopicProps) {
  const [phase, setPhase] = useState<"setup" | "playing" | "results">("setup")
  const [maxNumber, setMaxNumber] = useState(50)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<BlockPlaceValueQuestion | null>(null)
  const [typedValue, setTypedValue] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus()
  }, [question, phase])

  const handleStartRound = () => {
    setQuestionIndex(0)
    setScore(0)
    setTypedValue("")
    setIsAnswered(false)
    setRoundStartTime(Date.now())
    setQuestion(generateBlockPlaceValueQuestion(maxNumber))
    setPhase("playing")
  }

  const submitAnswer = () => {
    if (isAnswered || !question || typedValue === "") return
    const correct = Number(typedValue) === question.number
    setIsAnswered(true)
    setIsCorrect(correct)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setQuestion(generateBlockPlaceValueQuestion(maxNumber))
        setTypedValue("")
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "place-value",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: `blocks-up-to-${maxNumber}`,
        })
        setPhase("results")
      }
    }, 1500)
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleStartRound}
        onBackToTopics={onBackToModes}
        title="Block Builder!"
        gradientClass="from-violet-300 via-indigo-400 to-blue-500"
      />
    )
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-300 via-indigo-400 to-blue-500 p-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToModes}
              className="bg-white/20 hover:bg-white/30 text-indigo-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Modes
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-indigo-900 mb-4 font-sans">Base-Ten Blocks</h2>
                <p className="text-lg text-indigo-700 font-medium">Choose your challenge settings</p>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Number Range</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                    {[50, 100, 1000].map((maxNum) => (
                      <Button
                        key={maxNum}
                        onClick={() => setMaxNumber(maxNum)}
                        className={`h-20 text-xl font-bold border-4 transition-all duration-300 ${
                          maxNumber === maxNum
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-white shadow-lg scale-105"
                            : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                        }`}
                        variant="outline"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl">🔢</span>
                          <span>Up to {maxNum}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleStartRound}
                    className="h-16 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚀</span>
                      <span>Start Game!</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!question) return null

  const breakdown = [
    question.thousands > 0 ? `${question.thousands} thousand${question.thousands === 1 ? "" : "s"}` : null,
    question.hundreds > 0 ? `${question.hundreds} hundred${question.hundreds === 1 ? "" : "s"}` : null,
    question.tens > 0 ? `${question.tens} ten${question.tens === 1 ? "" : "s"}` : null,
    question.ones > 0 ? `${question.ones} one${question.ones === 1 ? "" : "s"}` : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-indigo-400 to-blue-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setPhase("setup")}
            className="bg-white/20 hover:bg-white/30 text-indigo-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-xl font-bold text-indigo-900 mr-1">
              Question {questionIndex + 1}/5
            </span>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6">What number do these blocks show?</h2>

            <div className="flex flex-wrap items-end justify-center gap-4 mb-8 min-h-[140px]">
              {Array.from({ length: question.thousands }, (_, i) => (
                <ThousandsBlock key={`th-${i}`} />
              ))}
              {Array.from({ length: question.hundreds }, (_, i) => (
                <HundredsBlock key={`h-${i}`} />
              ))}
              {Array.from({ length: question.tens }, (_, i) => (
                <TensBlock key={`t-${i}`} />
              ))}
              {Array.from({ length: question.ones }, (_, i) => (
                <OnesBlock key={`o-${i}`} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <input
                ref={inputRef}
                type="number"
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                disabled={isAnswered}
                autoFocus
                className="no-spinner w-40 h-20 rounded-2xl border-4 border-indigo-300 text-4xl text-center font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
              />
              <Button
                onClick={submitAnswer}
                disabled={typedValue === "" || isAnswered}
                className="h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 rounded-2xl shadow-lg disabled:opacity-50"
              >
                Check My Answer
              </Button>
            </div>

            {isAnswered && (
              <div
                className={`p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Not quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {question.number} = {breakdown.join(", ")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
