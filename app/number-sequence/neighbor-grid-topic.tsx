"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateNeighborGridQuestion, type NeighborGridQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

type CellKey = "above" | "below" | "left" | "right"
const CELL_KEYS: CellKey[] = ["above", "below", "left", "right"]

function cellClasses(isAnswered: boolean, isCorrect: boolean | undefined, hasValue: boolean) {
  if (isAnswered) {
    return isCorrect
      ? "border-green-500 bg-green-100 text-green-800"
      : "border-red-500 bg-red-100 text-red-800"
  }
  return hasValue
    ? "border-indigo-400 bg-indigo-50 text-indigo-900"
    : "border-dashed border-yellow-500 bg-yellow-100 text-yellow-700 animate-pulse"
}

export default function NeighborGridTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<NeighborGridQuestion | null>(null)
  const [values, setValues] = useState<Record<CellKey, string>>({ above: "", below: "", left: "", right: "" })
  const [isAnswered, setIsAnswered] = useState(false)
  const [cellCorrect, setCellCorrect] = useState<Record<CellKey, boolean>>({
    above: false,
    below: false,
    left: false,
    right: false,
  })
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setQuestion(generateNeighborGridQuestion(0))
  }, [])

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [question])

  const allFilled = CELL_KEYS.every((key) => values[key] !== "")

  const submitAnswer = () => {
    if (isAnswered || !question || !allFilled) return

    const results: Record<CellKey, boolean> = {
      above: Number(values.above) === question.neighbors.above,
      below: Number(values.below) === question.neighbors.below,
      left: Number(values.left) === question.neighbors.left,
      right: Number(values.right) === question.neighbors.right,
    }
    const allCorrect = CELL_KEYS.every((key) => results[key])

    setCellCorrect(results)
    setIsAnswered(true)
    allCorrect ? playCorrectSound() : playWrongSound()
    const newScore = allCorrect ? score + 1 : score

    setTimeout(() => {
      if (allCorrect) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setQuestion(generateNeighborGridQuestion(questionIndex + 1))
        setValues({ above: "", below: "", left: "", right: "" })
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "neighbor-grid",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: "two-digit",
        })
        setPhase("results")
      }
    }, 2000)
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    setValues({ above: "", below: "", left: "", right: "" })
    setIsAnswered(false)
    setRoundStartTime(Date.now())
    setQuestion(generateNeighborGridQuestion(0))
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToTopics}
        title="Neighbor Grid Genius!"
        gradientClass="from-pink-300 via-rose-400 to-red-400"
      />
    )
  }

  if (!question) return null

  const inputClass = (key: CellKey) =>
    `no-spinner w-16 h-16 rounded-xl border-4 text-2xl text-center font-bold focus:outline-none ${cellClasses(isAnswered, cellCorrect[key], values[key] !== "")}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-rose-400 to-red-400 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToTopics}
            className="bg-white/20 hover:bg-white/30 text-rose-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Topics
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-rose-900">
              Question {questionIndex + 1}/5 · Score: {score}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-rose-900 mb-2">Fill in the Neighbor Numbers</h2>
            <p className="text-lg text-rose-700 mb-8">
              Above/below = 10 less/more · Left/right = 1 less/more
            </p>

            <div className="grid grid-cols-3 grid-rows-3 gap-3 w-fit mx-auto mb-8">
              <div />
              <input
                ref={firstInputRef}
                type="number"
                value={values.above}
                onChange={(e) => setValues({ ...values, above: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && allFilled && submitAnswer()}
                disabled={isAnswered}
                className={`col-start-2 row-start-1 ${inputClass("above")}`}
              />
              <div />

              <input
                type="number"
                value={values.left}
                onChange={(e) => setValues({ ...values, left: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && allFilled && submitAnswer()}
                disabled={isAnswered}
                className={`col-start-1 row-start-2 ${inputClass("left")}`}
              />
              <div className="col-start-2 row-start-2 w-16 h-16 rounded-xl border-4 border-rose-500 bg-rose-100 flex items-center justify-center text-2xl font-black text-rose-900">
                {question.center}
              </div>
              <input
                type="number"
                value={values.right}
                onChange={(e) => setValues({ ...values, right: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && allFilled && submitAnswer()}
                disabled={isAnswered}
                className={`col-start-3 row-start-2 ${inputClass("right")}`}
              />

              <div />
              <input
                type="number"
                value={values.below}
                onChange={(e) => setValues({ ...values, below: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && allFilled && submitAnswer()}
                disabled={isAnswered}
                className={`col-start-2 row-start-3 ${inputClass("below")}`}
              />
              <div />
            </div>

            <Button
              onClick={submitAnswer}
              disabled={!allFilled || isAnswered}
              className="h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 rounded-2xl shadow-lg disabled:opacity-50 mb-6"
            >
              Check My Answers
            </Button>

            {isAnswered && (
              <div
                className={`p-6 rounded-2xl ${CELL_KEYS.every((k) => cellCorrect[k]) ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"} border-4`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${CELL_KEYS.every((k) => cellCorrect[k]) ? "text-green-600" : "text-red-600"}`}
                >
                  {CELL_KEYS.every((k) => cellCorrect[k]) ? "🎉 All Correct!" : "🤔 Some were off"}
                </div>
                <div className="text-lg font-medium text-gray-700">
                  Above {question.neighbors.above} · Below {question.neighbors.below} · Left {question.neighbors.left}{" "}
                  · Right {question.neighbors.right}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
