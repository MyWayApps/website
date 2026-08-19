"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateCompareQuestion, type CompareQuestion, type CompareSymbol } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

const OPTIONS: CompareSymbol[] = [">", "<", "="]

// The value pair a question must include (and answer correctly) to count as
// breadth evidence for that range tier — crossing these trips kids up more
// than mid-range values. "Up to 10" has none: the range is small enough that
// 2 clean qualifying sessions already implies broad exposure.
const BOUNDARY_VALUES: Record<number, number[]> = {
  50: [49, 50],
  100: [99, 100],
  1000: [999, 1000],
}

function isBoundaryQuestion(question: CompareQuestion, maxNumber: number): boolean {
  const boundaries = BOUNDARY_VALUES[maxNumber]
  if (!boundaries) return false
  return boundaries.includes(question.a) || boundaries.includes(question.b)
}

export default function NumberCompareTopic({ onRoundComplete, onBackToTopics, userId, applicationId }: TopicProps) {
  const [phase, setPhase] = useState<"setup" | "playing" | "results">("setup")
  const [maxNumber, setMaxNumber] = useState(10)
  const [rangeTiers, setRangeTiers] = useState<Partial<Record<number, MasteryTier>>>({})

  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<CompareQuestion | null>(null)
  const [selected, setSelected] = useState<CompareSymbol | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [boundaryHit, setBoundaryHit] = useState(false)

  useEffect(() => {
    if (phase !== "setup" || !userId || !applicationId) return
    let cancelled = false

    const loadTiers = async () => {
      const ranges = [10, 50, 100, 1000]
      const entries = await Promise.all(
        ranges.map(async (range) => {
          const tier = await getActivityMasteryTier(userId, applicationId, `number-sequence:number-compare:${range}`, {
            modeFilter: (gameData) => gameData?.topicId === "number-compare" && gameData?.difficultyLabel === `up-to-${range}`,
            breadthCheck: (gameData) => gameData?.boundaryHit === true,
          })
          return [range, tier] as const
        }),
      )
      if (!cancelled) setRangeTiers(Object.fromEntries(entries))
    }

    loadTiers()
    return () => {
      cancelled = true
    }
  }, [phase, userId, applicationId])

  const handleStartRound = () => {
    setQuestionIndex(0)
    setScore(0)
    setSelected(null)
    setIsAnswered(false)
    setBoundaryHit(false)
    setRoundStartTime(Date.now())
    setQuestion(generateCompareQuestion(maxNumber))
    setPhase("playing")
  }

  const submitAnswer = (choice: CompareSymbol) => {
    if (isAnswered || !question) return
    const correct = choice === question.correct
    const newBoundaryHit = boundaryHit || (correct && isBoundaryQuestion(question, maxNumber))
    setSelected(choice)
    setIsAnswered(true)
    setIsCorrect(correct)
    setBoundaryHit(newBoundaryHit)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setQuestion(generateCompareQuestion(maxNumber))
        setSelected(null)
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "number-compare",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: `up-to-${maxNumber}`,
          meta: { boundaryHit: newBoundaryHit },
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
        title="Comparison Master!"
        gradientClass="from-violet-300 via-purple-400 to-fuchsia-500"
      />
    )
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500 p-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToTopics}
              className="bg-white/20 hover:bg-white/30 text-purple-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Topics
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-purple-900 mb-4 font-sans">Greater, Less or Equal</h2>
                <p className="text-lg text-purple-700 font-medium">Choose your challenge settings</p>
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
                          {rangeTiers[maxNum] && <MasteryBadge tier={rangeTiers[maxNum]!} size="sm" />}
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
    <div className="min-h-screen bg-gradient-to-br from-violet-300 via-purple-400 to-fuchsia-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setPhase("setup")}
            className="bg-white/20 hover:bg-white/30 text-purple-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-xl font-bold text-purple-900 mr-1">
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
            <h2 className="text-2xl font-bold text-purple-900 mb-8">Greater, Less, or Equal?</h2>

            <div className="flex items-center justify-center gap-8 mb-10">
              <span className="text-6xl font-black text-gray-800">{question.a}</span>
              <span className="text-4xl font-bold text-gray-400">?</span>
              <span className="text-6xl font-black text-gray-800">{question.b}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
              {OPTIONS.map((option) => {
                let cardClass = "bg-white hover:bg-gray-50"
                if (isAnswered) {
                  if (option === question.correct) cardClass = "bg-green-100 border-green-500 border-4"
                  else if (option === selected) cardClass = "bg-red-100 border-red-500 border-4"
                }
                return (
                  <Card
                    key={option}
                    onClick={() => submitAnswer(option)}
                    className={`${cardClass} cursor-pointer transition-all shadow-lg ${isAnswered ? "cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    <CardContent className="p-6">
                      <span className="text-5xl font-black text-gray-800">{option}</span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {isAnswered && (
              <div
                className={`p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Not quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {question.a} {question.correct} {question.b}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
