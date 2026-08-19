"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateArrangeOrderQuestion, type ArrangeOrderQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

export default function ArrangeOrderTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [phase, setPhase] = useState<"setup" | "playing" | "results">("setup")
  const [maxNumber, setMaxNumber] = useState(100)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<ArrangeOrderQuestion | null>(null)
  const [placed, setPlaced] = useState<(number | null)[]>([null, null, null, null])
  const [available, setAvailable] = useState<number[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)

  const loadQuestion = () => {
    const q = generateArrangeOrderQuestion(maxNumber)
    setQuestion(q)
    setPlaced([null, null, null, null])
    setAvailable(q.numbers)
    setIsAnswered(false)
  }

  const handleStartRound = () => {
    setQuestionIndex(0)
    setScore(0)
    setRoundStartTime(Date.now())
    loadQuestion()
    setPhase("playing")
  }

  const advance = (newScore: number) => {
    if (questionIndex < 4) {
      setQuestionIndex(questionIndex + 1)
      loadQuestion()
    } else {
      onRoundComplete({
        topicId: "arrange-order",
        score: newScore,
        maxScore: 5,
        completionTimeMs: Date.now() - roundStartTime,
        difficultyLabel: `up-to-${maxNumber}`,
      })
      setPhase("results")
    }
  }

  const handlePick = (n: number) => {
    if (isAnswered || !question) return
    const idx = placed.findIndex((p) => p === null)
    if (idx === -1) return
    const nextPlaced = [...placed]
    nextPlaced[idx] = n
    setPlaced(nextPlaced)
    setAvailable((prev) => prev.filter((x) => x !== n))

    if (nextPlaced.every((p) => p !== null)) {
      const correct = nextPlaced.every((p, i) => p === question.sorted[i])
      setIsAnswered(true)
      setIsCorrect(correct)
      correct ? playCorrectSound() : playWrongSound()
      const newScore = correct ? score + 1 : score
      setTimeout(() => {
        if (correct) setScore(newScore)
        advance(newScore)
      }, 1800)
    }
  }

  const handleUndo = (idx: number) => {
    if (isAnswered) return
    const n = placed[idx]
    if (n === null) return
    const nextPlaced = [...placed]
    nextPlaced[idx] = null
    setPlaced(nextPlaced)
    setAvailable((prev) => [...prev, n])
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleStartRound}
        onBackToTopics={onBackToTopics}
        title="Ordering Star!"
        gradientClass="from-orange-300 via-amber-400 to-yellow-500"
      />
    )
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-500 p-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToTopics}
              className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Topics
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-orange-900 mb-4 font-sans">🔀 Arrange in Order</h2>
                <p className="text-lg text-orange-700 font-medium">Choose your challenge settings</p>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Number Range</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[10, 50, 100, 1000].map((maxNum) => (
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setPhase("setup")}
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-xl font-bold text-orange-900 mr-1">Question {questionIndex + 1}/5</span>
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
            <h2 className="text-2xl font-bold text-orange-900 mb-2">
              Arrange in {question.direction === "ascending" ? "Increasing" : "Decreasing"} Order
            </h2>
            <p className="text-gray-600 mb-6">Tap the numbers below in the right order</p>

            {/* Answer slots */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {placed.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    onClick={() => handleUndo(i)}
                    disabled={p === null || isAnswered}
                    className={`w-20 h-20 rounded-2xl border-4 flex items-center justify-center text-2xl font-black transition-all ${
                      isAnswered
                        ? p === question.sorted[i]
                          ? "bg-green-100 border-green-500 text-green-800"
                          : "bg-red-100 border-red-500 text-red-800"
                        : p !== null
                          ? "bg-amber-100 border-amber-400 text-amber-900 cursor-pointer hover:bg-amber-200"
                          : "bg-white border-dashed border-gray-300 text-gray-300"
                    }`}
                  >
                    {p ?? "?"}
                  </button>
                  {i < placed.length - 1 && (
                    <span className="text-3xl font-black text-gray-400">
                      {question.direction === "ascending" ? "<" : ">"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Number bank */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {available.map((n) => (
                <button
                  key={n}
                  onClick={() => handlePick(n)}
                  disabled={isAnswered}
                  className="w-20 h-20 rounded-2xl border-4 border-sky-300 bg-sky-50 hover:bg-sky-100 hover:scale-105 text-2xl font-black text-sky-900 shadow transition-all"
                >
                  {n}
                </button>
              ))}
            </div>

            {isAnswered && (
              <div
                className={`p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Not quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {question.sorted.join(question.direction === "ascending" ? " < " : " > ")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
