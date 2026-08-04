"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { RoundResult } from "./types"
import { generateNumberWordsQuestion, normalizeNumberWords, type NumberWordsQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

interface NumberWordsQuizProps {
  onRoundComplete: (result: RoundResult) => void
  onBackToModes: () => void
}

export default function NumberWordsQuiz({ onRoundComplete, onBackToModes }: NumberWordsQuizProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<NumberWordsQuestion | null>(null)
  const [typedValue, setTypedValue] = useState("")
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setQuestion(generateNumberWordsQuestion(0))
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [question])

  const submitAnswer = () => {
    if (isAnswered || !question || typedValue === "") return

    const correct =
      question.direction === "numberToWord"
        ? normalizeNumberWords(typedValue) === normalizeNumberWords(question.word)
        : Number(typedValue) === question.number

    setIsAnswered(true)
    setIsCorrect(correct)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setQuestion(generateNumberWordsQuestion(questionIndex + 1))
        setTypedValue("")
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "number-words",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: "up-to-1000",
        })
        setPhase("results")
      }
    }, 1500)
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    setTypedValue("")
    setIsAnswered(false)
    setRoundStartTime(Date.now())
    setQuestion(generateNumberWordsQuestion(0))
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToModes}
        title="Number Words Wizard!"
        gradientClass="from-lime-300 via-green-400 to-emerald-500"
      />
    )
  }

  if (!question) return null

  const isNumberToWord = question.direction === "numberToWord"

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Modes
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-green-900">
              Question {questionIndex + 1}/5 · Score: {score}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-green-900 mb-2">Number ↔ Words</h2>
            <p className="text-lg text-green-700 mb-8">
              {isNumberToWord ? "Type the number in words" : "Type the number as digits"}
            </p>

            {isNumberToWord ? (
              <div className="text-7xl font-black text-gray-800 mb-8">{question.number}</div>
            ) : (
              <div className="text-4xl md:text-5xl font-black text-gray-800 mb-8 capitalize">{question.word}</div>
            )}

            <div className="flex flex-col items-center gap-4 mb-6">
              <input
                ref={inputRef}
                type={isNumberToWord ? "text" : "number"}
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                disabled={isAnswered}
                autoFocus
                placeholder={isNumberToWord ? "e.g. one hundred and five" : "e.g. 105"}
                className="w-72 h-16 rounded-2xl border-4 border-green-300 text-2xl text-center font-bold text-green-900 focus:outline-none focus:border-green-500 placeholder:text-green-300 placeholder:font-normal"
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
                <div className="text-xl font-medium text-gray-700 capitalize">
                  {question.number} = {question.word}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
