"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Circle, Square, Triangle } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateShapeQuestion, type ShapeQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

const SHAPE_STYLES: Record<ShapeQuestion["shapes"][number]["type"], { icon: typeof Circle; color: string }> = {
  circle: { icon: Circle, color: "text-blue-500" },
  square: { icon: Square, color: "text-emerald-500" },
  triangle: { icon: Triangle, color: "text-orange-500" },
}

export default function CountingShapesTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<ShapeQuestion | null>(null)
  const [typedValue, setTypedValue] = useState("")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setQuestion(generateShapeQuestion(0))
  }, [])

  useEffect(() => {
    if (question?.answerFormat === "typed") inputRef.current?.focus()
  }, [question])

  const submitAnswer = (givenCount: number) => {
    if (isAnswered || !question) return
    const correct = givenCount === question.correctCount
    setIsAnswered(true)
    setIsCorrect(correct)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setQuestion(generateShapeQuestion(questionIndex + 1))
        setTypedValue("")
        setSelectedOption(null)
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "counting-shapes",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: "auto-ramp",
        })
        setPhase("results")
      }
    }, 1500)
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    setTypedValue("")
    setSelectedOption(null)
    setIsAnswered(false)
    setRoundStartTime(Date.now())
    setQuestion(generateShapeQuestion(0))
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToTopics}
        title="Shape Spotter!"
        gradientClass="from-teal-300 via-emerald-400 to-cyan-500"
      />
    )
  }

  if (!question) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-emerald-400 to-cyan-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToTopics}
            className="bg-white/20 hover:bg-white/30 text-emerald-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Topics
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-emerald-900">
              Question {questionIndex + 1}/5 · Score: {score}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-emerald-900 mb-2 flex items-center justify-center gap-2">
                How many
                {(() => {
                  const { icon: Icon, color } = SHAPE_STYLES[question.targetShape]
                  return <Icon className={`h-8 w-8 ${color}`} fill="currentColor" />
                })()}
                {question.targetShape}s do you see?
              </h2>
              <p className="text-lg text-emerald-700">Ignore any other shapes mixed in!</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center max-w-md mx-auto mb-8 min-h-[120px] items-center">
              {question.shapes.map((shape, i) => {
                const { icon: Icon, color } = SHAPE_STYLES[shape.type]
                return <Icon key={i} className={`h-9 w-9 ${color}`} fill="currentColor" />
              })}
            </div>

            {question.answerFormat === "typed" ? (
              <div className="flex flex-col items-center gap-4 mb-6">
                <input
                  ref={inputRef}
                  type="number"
                  value={typedValue}
                  onChange={(e) => setTypedValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && typedValue !== "" && submitAnswer(Number(typedValue))}
                  disabled={isAnswered}
                  className="no-spinner w-24 h-16 rounded-xl border-4 border-emerald-300 text-3xl text-center font-bold text-emerald-900 focus:outline-none focus:border-emerald-500"
                />
                <Button
                  onClick={() => submitAnswer(Number(typedValue))}
                  disabled={typedValue === "" || isAnswered}
                  className="h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 rounded-2xl shadow-lg disabled:opacity-50"
                >
                  Check My Answer
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto mb-6">
                {question.mcqOptions?.map((option) => {
                  const isThisSelected = selectedOption === option
                  let cardClass = "bg-white hover:bg-gray-50"
                  if (isAnswered && isThisSelected) {
                    cardClass = isCorrect ? "bg-green-100 border-green-500 border-4" : "bg-red-100 border-red-500 border-4"
                  } else if (isAnswered && option === question.correctCount) {
                    cardClass = "bg-green-100 border-green-500 border-4"
                  }
                  return (
                    <Card
                      key={option}
                      className={`${cardClass} cursor-pointer transition-all shadow-lg ${isAnswered ? "cursor-not-allowed" : "hover:scale-105"}`}
                      onClick={() => {
                        if (isAnswered) return
                        setSelectedOption(option)
                        submitAnswer(option)
                      }}
                    >
                      <CardContent className="p-6 text-center">
                        <span className="text-3xl font-bold text-gray-800">{option}</span>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {isAnswered && (
              <div
                className={`text-center p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Not quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  There {question.correctCount === 1 ? "is" : "are"} {question.correctCount} shape
                  {question.correctCount === 1 ? "" : "s"} to count.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
