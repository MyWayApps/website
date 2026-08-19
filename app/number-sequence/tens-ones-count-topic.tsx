"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateTensOnesCountQuestion, type TensOnesCountQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

export default function TensOnesCountTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [phase, setPhase] = useState<"setup" | "playing" | "results">("setup")
  const [maxGroups, setMaxGroups] = useState(5)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<TensOnesCountQuestion | null>(null)
  const [typedValue, setTypedValue] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus()
  }, [question, phase])

  const loadQuestion = () => {
    setQuestion(generateTensOnesCountQuestion(maxGroups))
    setTypedValue("")
    setIsAnswered(false)
  }

  const handleStartRound = () => {
    setQuestionIndex(0)
    setScore(0)
    setRoundStartTime(Date.now())
    loadQuestion()
    setPhase("playing")
  }

  const submitAnswer = () => {
    if (isAnswered || !question || typedValue === "") return
    const correct = Number(typedValue) === question.total
    setIsAnswered(true)
    setIsCorrect(correct)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        loadQuestion()
      } else {
        onRoundComplete({
          topicId: "tens-ones-count",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: `groups-up-to-${maxGroups}`,
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
        onBackToTopics={onBackToTopics}
        title="Counting Champion!"
        gradientClass="from-cyan-300 via-teal-400 to-emerald-500"
      />
    )
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-teal-400 to-emerald-500 p-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToTopics}
              className="bg-white/20 hover:bg-white/30 text-teal-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Topics
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-teal-900 mb-4 font-sans">📦 Tens & Ones Counting</h2>
                <p className="text-lg text-teal-700 font-medium">Choose your challenge settings</p>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">How many groups of ten?</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                    {[
                      { label: "Up to 5", value: 5 },
                      { label: "Up to 7", value: 7 },
                      { label: "Up to 9", value: 9 },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        onClick={() => setMaxGroups(opt.value)}
                        className={`h-20 text-xl font-bold border-4 transition-all duration-300 ${
                          maxGroups === opt.value
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-white shadow-lg scale-105"
                            : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                        }`}
                        variant="outline"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl">📦</span>
                          <span>{opt.label}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-teal-400 to-emerald-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setPhase("setup")}
            className="bg-white/20 hover:bg-white/30 text-teal-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-xl font-bold text-teal-900 mr-1">Question {questionIndex + 1}/5</span>
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
            <h2 className="text-2xl font-bold text-teal-900 mb-6">
              Each box has 10 cookies. Count how many cookies there are in all.
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex flex-wrap justify-center gap-3 max-w-md">
                {Array.from({ length: question.groups }, (_, i) => (
                  <div
                    key={`box-${i}`}
                    className="w-16 h-16 rounded-xl border-4 border-teal-500 bg-teal-100 flex flex-col items-center justify-center shadow"
                  >
                    <span className="text-2xl">📦</span>
                    <span className="text-xs font-bold text-teal-800">10</span>
                  </div>
                ))}
              </div>
              <span className="text-3xl font-bold text-gray-500">and</span>
              <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                {Array.from({ length: question.ones }, (_, i) => (
                  <span key={`cookie-${i}`} className="text-4xl">
                    🍪
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="flex items-center gap-3 text-3xl font-black text-teal-900">
                <span>{question.groups}0</span>
                <span>+</span>
                <span>{question.ones}</span>
                <span>=</span>
                <input
                  ref={inputRef}
                  type="number"
                  value={typedValue}
                  onChange={(e) => setTypedValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                  disabled={isAnswered}
                  autoFocus
                  className="no-spinner w-32 h-16 rounded-2xl border-4 border-teal-300 text-3xl text-center font-bold text-teal-900 focus:outline-none focus:border-teal-500"
                />
                <span className="text-lg font-semibold text-gray-500">cookies</span>
              </div>
              <Button
                onClick={submitAnswer}
                disabled={typedValue === "" || isAnswered}
                className="h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 rounded-2xl shadow-lg disabled:opacity-50 mt-2"
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
                  {question.groups}0 + {question.ones} = {question.total}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
