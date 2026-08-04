"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, ArrowUp, ArrowDown } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { NumberLineJump } from "@/components/number-line-jump"
import type { TopicProps } from "./types"
import { type Order, generateSequenceQuestion } from "./question-generators"
import { playCorrectSound, playWrongSound, playSuccessMelody } from "./audio"

type Phase = "setup" | "playing" | "results"

export default function ForwardBackwardTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [phase, setPhase] = useState<Phase>("setup")
  const [order, setOrder] = useState<Order>("ascending")
  const [maxNumber, setMaxNumber] = useState(10)

  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([])
  const [filledPositions, setFilledPositions] = useState<boolean[]>([true, false, false, false, false])
  const [currentPosition, setCurrentPosition] = useState(1)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)

  const startNewQuestion = () => {
    const q = generateSequenceQuestion(order, maxNumber)
    setSequence(q.sequence)
    setAvailableNumbers(q.availableNumbers)
    setFilledPositions([true, false, false, false, false])
    setCurrentPosition(1)
  }

  const handleStartRound = () => {
    setQuestionIndex(0)
    setScore(0)
    setRoundStartTime(Date.now())
    startNewQuestion()
    setPhase("playing")
  }

  const handleNumberClick = (number: number) => {
    const expectedNumber = sequence[currentPosition]

    if (number === expectedNumber) {
      setIsCorrect(true)
      setShowFeedback(true)
      playCorrectSound()

      const newFilledPositions = [...filledPositions]
      newFilledPositions[currentPosition] = true
      setFilledPositions(newFilledPositions)

      setTimeout(() => {
        setShowFeedback(false)

        if (currentPosition < 4) {
          setCurrentPosition(currentPosition + 1)
        } else {
          setTimeout(() => playSuccessMelody(), 300)
          const newScore = score + 1
          setScore(newScore)

          setTimeout(() => {
            if (questionIndex < 4) {
              setQuestionIndex(questionIndex + 1)
              startNewQuestion()
            } else {
              onRoundComplete({
                topicId: "forward-backward",
                score: newScore,
                maxScore: 5,
                completionTimeMs: Date.now() - roundStartTime,
                difficultyLabel: `${order}-${maxNumber}`,
              })
              setPhase("results")
            }
          }, 1200)
        }
      }, 1000)
    } else {
      setIsCorrect(false)
      setShowFeedback(true)
      playWrongSound()
      setTimeout(() => setShowFeedback(false), 1200)
    }
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleStartRound}
        onBackToTopics={onBackToTopics}
        title="Sequence Champion!"
      />
    )
  }

  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4 relative overflow-hidden">
        <img
          src="/characters/giraffe.png"
          alt="Giraffe"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToTopics}
              className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Topics
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-indigo-800 mb-4 font-sans">Forward / Backward Counting</h2>
                <p className="text-lg text-indigo-700 font-medium">Choose your challenge settings</p>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Order Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button
                      onClick={() => setOrder("ascending")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        order === "ascending"
                          ? "bg-gradient-to-r from-green-400 to-blue-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ArrowUp className="h-8 w-8" />
                        <span>Forward Counting (1, 2, 3...)</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setOrder("descending")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        order === "descending"
                          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ArrowDown className="h-8 w-8" />
                        <span>Backward Counting (10, 9, 8...)</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Number Range</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[10, 20, 50, 100].map((maxNum) => (
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

  // Playing
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4 relative overflow-hidden">
      <img
        src="/characters/giraffe.png"
        alt="Giraffe"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setPhase("setup")}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-indigo-800">
              Question {questionIndex + 1}/5 · Score: {score}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-indigo-800 mb-2 font-sans">Number Sequence</h2>
              <p className="text-lg text-indigo-700 font-medium">
                {order === "ascending" ? "Ascending" : "Descending"} order (1 to {maxNumber})
              </p>
              <div className="text-lg text-indigo-700 font-medium mt-2">
                Click the correct number to fill the sequence!
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {sequence.map((number, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 rounded-2xl border-4 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                    filledPositions[index]
                      ? "bg-gradient-to-r from-green-400 to-blue-500 text-white border-white shadow-lg"
                      : index === currentPosition
                        ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-800 border-yellow-500 shadow-lg animate-pulse"
                        : "bg-white/20 text-gray-400 border-gray-300"
                  }`}
                >
                  {filledPositions[index] ? number : "?"}
                </div>
              ))}
            </div>

            {(() => {
              const filledIndices = filledPositions
                .map((filled, i) => (filled ? i : -1))
                .filter((i) => i >= 0)
              const lastFilledIdx = filledIndices[filledIndices.length - 1] ?? 0
              const prevFilledIdx = filledIndices.length > 1 ? filledIndices[filledIndices.length - 2] : lastFilledIdx
              return (
                <div className="bg-indigo-50 rounded-2xl p-4 mb-8">
                  <NumberLineJump
                    start={sequence[prevFilledIdx] ?? 0}
                    end={sequence[lastFilledIdx] ?? 0}
                    max={maxNumber}
                    character={order === "ascending" ? "kangaroo" : "rabbit"}
                  />
                </div>
              )
            })()}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Choose the correct number:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {availableNumbers.map((number, index) => (
                  <Button
                    key={index}
                    onClick={() => handleNumberClick(number)}
                    className="w-16 h-16 text-xl font-bold bg-white/20 hover:bg-white/30 text-gray-800 border-2 border-gray-300 hover:border-indigo-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    variant="outline"
                  >
                    {number}
                  </Button>
                ))}
              </div>
            </div>

            {showFeedback && (
              <div
                className={`text-center p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Try Again!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `Great job! The number ${sequence[currentPosition]} is correct!`
                    : `The correct number is ${sequence[currentPosition]}`}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
