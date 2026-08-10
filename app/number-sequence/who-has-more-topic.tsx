"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { TopicProps } from "./types"
import { generateWhoHasMoreQuestion, type WhoHasMoreQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

export default function WhoHasMoreTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<WhoHasMoreQuestion | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setQuestion(generateWhoHasMoreQuestion(0))
  }, [])

  const submitAnswer = (choice: string) => {
    if (isAnswered || !question) return
    const correct = choice === question.correctName
    setSelected(choice)
    setIsAnswered(true)
    setIsCorrect(correct)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        const nextIndex = questionIndex + 1
        setQuestionIndex(nextIndex)
        setQuestion(generateWhoHasMoreQuestion(nextIndex))
        setSelected(null)
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "who-has-more",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: "up-to-50",
        })
        setPhase("results")
      }
    }, 1500)
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    setSelected(null)
    setIsAnswered(false)
    setRoundStartTime(Date.now())
    setQuestion(generateWhoHasMoreQuestion(0))
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToTopics}
        title="Comparison Champion!"
        gradientClass="from-cyan-300 via-sky-400 to-blue-500"
      />
    )
  }

  if (!question) return null

  const options = [question.name1, question.name2]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToTopics}
            className="bg-white/20 hover:bg-white/30 text-sky-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Topics
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-xl font-bold text-sky-900 mr-1">
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
            <h2 className="text-2xl font-bold text-sky-900 mb-8">
              Who Has {question.comparison === "more" ? "More" : "Fewer"}?
            </h2>

            <div className="text-2xl text-gray-800 leading-relaxed mb-8 space-y-2">
              <p>
                {question.name1} has {question.count1} {question.objectEmoji} {question.objectLabel}.
              </p>
              <p>
                {question.name2} has {question.count2} {question.objectEmoji} {question.objectLabel}.
              </p>
              <p className="font-bold mt-4">
                Who has {question.comparison} {question.objectLabel}?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
              {options.map((name) => {
                let cardClass = "bg-white hover:bg-gray-50"
                if (isAnswered) {
                  if (name === question.correctName) cardClass = "bg-green-100 border-green-500 border-4"
                  else if (name === selected) cardClass = "bg-red-100 border-red-500 border-4"
                }
                return (
                  <Card
                    key={name}
                    onClick={() => submitAnswer(name)}
                    className={`${cardClass} cursor-pointer transition-all shadow-lg ${isAnswered ? "cursor-not-allowed" : "hover:scale-105"}`}
                  >
                    <CardContent className="p-6">
                      <span className="text-2xl font-bold text-gray-800">{name}</span>
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
                  {question.correctName} has {question.comparison} {question.objectLabel} ({question.count1} vs{" "}
                  {question.count2}).
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
