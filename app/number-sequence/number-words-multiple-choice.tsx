"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { RoundResult } from "./types"
import { generateNumberWordsChoices, numberToWords, randInt, type NumberWordsDirection } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

interface NumberWordsMultipleChoiceProps {
  onRoundComplete: (result: RoundResult) => void
  onBackToModes: () => void
}

interface McqRound {
  direction: NumberWordsDirection
  correctNumber: number
  choices: number[]
}

function generateRound(index: number): McqRound {
  const direction: NumberWordsDirection = index % 2 === 0 ? "numberToWord" : "wordToNumber"
  const correctNumber = randInt(1, 1000)
  return { direction, correctNumber, choices: generateNumberWordsChoices(correctNumber) }
}

export default function NumberWordsMultipleChoice({ onRoundComplete, onBackToModes }: NumberWordsMultipleChoiceProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState<McqRound | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setRound(generateRound(0))
  }, [])

  const submitAnswer = (choice: number) => {
    if (isAnswered || !round) return
    const correct = choice === round.correctNumber
    setSelected(choice)
    setIsAnswered(true)
    setIsCorrect(correct)
    correct ? playCorrectSound() : playWrongSound()
    const newScore = correct ? score + 1 : score

    setTimeout(() => {
      if (correct) setScore(newScore)

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1)
        setRound(generateRound(questionIndex + 1))
        setSelected(null)
        setIsAnswered(false)
      } else {
        onRoundComplete({
          topicId: "number-words",
          score: newScore,
          maxScore: 5,
          completionTimeMs: Date.now() - roundStartTime,
          difficultyLabel: "up-to-1000-mcq",
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
    setRound(generateRound(0))
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

  if (!round) return null

  const isNumberToWord = round.direction === "numberToWord"

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
              {isNumberToWord ? "Which word matches this number?" : "Which number matches these words?"}
            </p>

            {isNumberToWord ? (
              <div className="text-7xl font-black text-gray-800 mb-8">{round.correctNumber}</div>
            ) : (
              <div className="text-3xl md:text-4xl font-black text-gray-800 mb-8 capitalize">
                {numberToWords(round.correctNumber)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
              {round.choices.map((choice) => {
                const isThisSelected = selected === choice
                let cardClass = "bg-white hover:bg-gray-50"
                if (isAnswered && isThisSelected) {
                  cardClass = isCorrect ? "bg-green-100 border-green-500 border-4" : "bg-red-100 border-red-500 border-4"
                } else if (isAnswered && choice === round.correctNumber) {
                  cardClass = "bg-green-100 border-green-500 border-4"
                }
                return (
                  <Card
                    key={choice}
                    className={`${cardClass} cursor-pointer transition-all shadow-lg ${isAnswered ? "cursor-not-allowed" : "hover:scale-105"}`}
                    onClick={() => {
                      if (isAnswered) return
                      submitAnswer(choice)
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      {isNumberToWord ? (
                        <span className="text-2xl font-bold text-gray-800 capitalize">{numberToWords(choice)}</span>
                      ) : (
                        <span className="text-3xl font-bold text-gray-800">{choice}</span>
                      )}
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
                <div className="text-xl font-medium text-gray-700 capitalize">
                  {round.correctNumber} = {numberToWords(round.correctNumber)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
