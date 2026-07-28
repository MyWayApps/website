"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateBeforeAfterQuestion, type BeforeAfterQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

export default function NumberNeighborsTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<BeforeAfterQuestion | null>(null)
  const [typedValue, setTypedValue] = useState("")
  const [beforeValue, setBeforeValue] = useState("")
  const [afterValue, setAfterValue] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [beforeCorrect, setBeforeCorrect] = useState(false)
  const [afterCorrect, setAfterCorrect] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setQuestion(generateBeforeAfterQuestion(0))
  }, [])

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [question])

  const isBoth = question?.direction === "both"
  const canSubmit = isBoth ? beforeValue !== "" && afterValue !== "" : typedValue !== ""

  const advance = (correct: boolean) => {
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setQuestion(generateBeforeAfterQuestion(questionIndex + 1))
        setTypedValue("")
        setBeforeValue("")
        setAfterValue("")
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "number-neighbors",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: "mixed-range",
        })
        setPhase("results")
      }
    }, 1500)
  }

  const submitAnswer = () => {
    if (isAnswered || !question || !canSubmit) return

    if (question.direction === "both") {
      const beforeOk = Number(beforeValue) === question.beforeAnswer
      const afterOk = Number(afterValue) === question.afterAnswer
      setBeforeCorrect(beforeOk)
      setAfterCorrect(afterOk)
      const correct = beforeOk && afterOk
      setIsAnswered(true)
      setIsCorrect(correct)
      correct ? playCorrectSound() : playWrongSound()
      advance(correct)
    } else {
      const correct = Number(typedValue) === question.answer
      setIsAnswered(true)
      setIsCorrect(correct)
      correct ? playCorrectSound() : playWrongSound()
      advance(correct)
    }
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    setTypedValue("")
    setBeforeValue("")
    setAfterValue("")
    setIsAnswered(false)
    setRoundStartTime(Date.now())
    setQuestion(generateBeforeAfterQuestion(0))
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToTopics}
        title="Neighbor Number Whiz!"
        gradientClass="from-amber-300 via-orange-400 to-red-400"
      />
    )
  }

  if (!question) return null

  const blankClass = (correct: boolean) =>
    `w-20 h-20 rounded-2xl border-4 text-3xl text-center font-bold focus:outline-none ${
      isAnswered
        ? correct
          ? "border-green-500 bg-green-100 text-green-800"
          : "border-red-500 bg-red-100 text-red-800"
        : "border-orange-300 text-orange-900 focus:border-orange-500"
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-300 via-orange-400 to-red-400 p-4 relative overflow-hidden">
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

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-orange-900">
              Question {questionIndex + 1}/5 · Score: {score}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-orange-900 mb-8">Numbers Before &amp; After</h2>

            {isBoth ? (
              <>
                <p className="text-xl font-bold text-gray-700 mb-6">Fill in both blanks:</p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <input
                    ref={firstInputRef}
                    type="number"
                    value={beforeValue}
                    onChange={(e) => setBeforeValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && canSubmit && submitAnswer()}
                    disabled={isAnswered}
                    className={blankClass(beforeCorrect)}
                  />
                  <div className="w-20 h-20 rounded-2xl border-4 border-orange-500 bg-orange-100 flex items-center justify-center text-3xl font-black text-orange-900">
                    {question.base}
                  </div>
                  <input
                    type="number"
                    value={afterValue}
                    onChange={(e) => setAfterValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && canSubmit && submitAnswer()}
                    disabled={isAnswered}
                    className={blankClass(afterCorrect)}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-8">{question.prompt}</p>
                <div className="flex flex-col items-center gap-4 mb-6">
                  <input
                    ref={firstInputRef}
                    type="number"
                    value={typedValue}
                    onChange={(e) => setTypedValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                    disabled={isAnswered}
                    className="w-32 h-20 rounded-2xl border-4 border-orange-300 text-4xl text-center font-bold text-orange-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </>
            )}

            <Button
              onClick={submitAnswer}
              disabled={!canSubmit || isAnswered}
              className="h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 rounded-2xl shadow-lg disabled:opacity-50 mb-6"
            >
              Check My Answer
            </Button>

            {isAnswered && (
              <div
                className={`p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Not quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isBoth
                    ? `${question.beforeAnswer}, ${question.base}, ${question.afterAnswer}`
                    : `The answer is ${question.answer}`}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
