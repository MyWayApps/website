"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getApplicationByName } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"
import { gunitaksharaMatraData, gunitaksharaOptionText } from "@/lib/kannada-gunitakshara-data"

export default function KannadaMatchGame() {
  const params = useParams()
  const consonant = decodeURIComponent(params.consonant as string)
  const { user, isConnected } = useCurrentUser()
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "wrong" | "question-complete" | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [matchedPairs, setMatchedPairs] = useState<Record<string, any>>({})
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    getApplicationByName("Kannada Gunitakshara").then((application) => setApplicationId(application?.id ?? null))
  }, [])

  const finishGame = async (finalScore: number) => {
    setGameOver(true)
    if (!user || !applicationId) return
    await saveGameScore({
      userId: user.id,
      applicationId,
      score: finalScore,
      maxScore: 5,
      subject: "Kannada",
      isConnected,
    })
    const tier = await getActivityMasteryTier(
      user.id,
      applicationId,
      `barakhadi:kannada-gunitakshara:match:${consonant}`,
    )
    setMasteryTier(tier)
  }

  // Generate 5 questions with matching pairs
  const generateQuestions = () => {
    const questions = []

    for (let i = 0; i < 5; i++) {
      // Select 3 random matras for questions 1-3, 5 for questions 4-5
      const numPairs = i < 3 ? 3 : 5
      const shuffledMatras = [...gunitaksharaMatraData].sort(() => Math.random() - 0.5).slice(0, numPairs)

      // Create left side options (half-letter consonant + vowel formula)
      const leftOptions = shuffledMatras.map(mat => ({
        id: `left-${mat.matra}`,
        text: gunitaksharaOptionText(consonant, mat.matra, mat.name),
        matra: mat.matra,
        matraName: mat.name,
        result: consonant + mat.matra
      }))

      // Create right side answers (correct + wrong options, jumbled)
      const correctAnswers = shuffledMatras.map(mat => ({
        id: `right-${mat.matra}`,
        text: consonant + mat.matra,
        matra: mat.matra,
        matraName: mat.name,
        result: consonant + mat.matra
      }))

      // Add wrong options (2-3 extra wrong answers)
      const remainingMatras = gunitaksharaMatraData.filter(mat =>
        !shuffledMatras.some(selected => selected.matra === mat.matra)
      )
      const numWrongOptions = numPairs === 3 ? 2 : 3
      const wrongAnswers = remainingMatras
        .sort(() => Math.random() - 0.5)
        .slice(0, numWrongOptions)
        .map(mat => ({
          id: `wrong-${mat.matra}`,
          text: consonant + mat.matra,
          matra: mat.matra,
          matraName: mat.name,
          result: consonant + mat.matra
        }))

      // Combine and shuffle all answers
      const allAnswers = [...correctAnswers, ...wrongAnswers].sort(() => Math.random() - 0.5)
      const rightAnswers = allAnswers

      questions.push({
        leftOptions,
        rightAnswers,
        consonant
      })
    }

    return questions
  }

  // Initialize questions
  useEffect(() => {
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
    setIsLoading(false)
    setMatchedPairs({})
    setShowConfetti(false)
  }, [consonant])

  // Reset state when question changes
  useEffect(() => {
    if (questions[currentQuestion]) {
      setMatchedPairs({})
      setShowResult(null)
      setShowConfetti(false)
      setDraggedItem(null)
    }
  }, [currentQuestion, questions])

  const currentQ = questions[currentQuestion]

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, answer: any) => {
    setDraggedItem(answer)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on left option
  const handleDropOnLeft = (e: React.DragEvent, leftOption: any) => {
    e.preventDefault()

    if (draggedItem && !matchedPairs[leftOption.id]) {
      // Lock this pair immediately, right or wrong — no more deleting a
      // wrong match to let the child retry it.
      const newMatchedPairs: Record<string, any> = { ...matchedPairs, [leftOption.id]: draggedItem }
      setMatchedPairs(newMatchedPairs)

      // Check if all pairs are matched, then validate
      if (Object.keys(newMatchedPairs).length === currentQ.leftOptions.length) {
        // All pairs are matched, now check if all are correct
        const allCorrect = currentQ.leftOptions.every((option: any) => {
          const matchedAnswer = newMatchedPairs[option.id as string]
          return matchedAnswer && option.matra === matchedAnswer.matra
        })

        if (allCorrect) {
          // All matches are correct
          const newScore = score + 1
          setScore(newScore)
          setShowResult("question-complete")
          setShowConfetti(true)
          playCorrectSound()
          setTimeout(() => {
            setShowConfetti(false)
            if (currentQuestion < 4) {
              setCurrentQuestion(currentQuestion + 1)
            } else {
              finishGame(newScore)
            }
          }, 3000)
        } else {
          // Some matches are wrong — show it, lock it, and move on
          // (no retry) since a single-shot answer was already given.
          setShowResult("wrong")
          playWrongSound()
          setTimeout(() => {
            setShowResult(null)
            if (currentQuestion < 4) {
              setCurrentQuestion(currentQuestion + 1)
            } else {
              finishGame(score)
            }
          }, 1500)
        }
      } else {
        // Not all pairs matched yet, don't show any message
        // Just allow the user to continue matching
      }
    }

    setDraggedItem(null)
  }

  // Handle back to match main
  const handleBackToMatch = () => {
    window.location.href = "/kannada-gunitakshara/match"
  }

  // Handle restart
  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setShowResult(null)
    setMatchedPairs({})
    setShowConfetti(false)
    setDraggedItem(null)
    setMasteryTier(null)
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
  }

  if (isLoading || !currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-indigo-800 font-bold">Loading...</div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
        <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-indigo-800 mb-4">Game Over!</h1>
            <p className="text-2xl text-indigo-600 mb-6">Your Score: {score} / 5</p>
            {masteryTier && (
              <div className="flex justify-center mb-4">
                <MasteryBadge tier={masteryTier} showLabel />
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 border-2 border-indigo-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={handleBackToMatch}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToMatch}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Selection
        </Button>
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">
          {consonant} ಗುಣಿತಾಕ್ಷರ
        </h1>
        <p className="text-xl text-indigo-700">
          Question {currentQuestion + 1} of 5 | Score: {score}
        </p>
      </div>

      {/* Game Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Instructions */}
            <p className="text-lg text-indigo-700 mb-6">
              Drag the answers from the right to match with the options on the left
            </p>

            {/* Game Layout */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Side - Options */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-800 text-center mb-4">Options</h3>
                {currentQ.leftOptions.map((option: any, index: number) => (
                  <div
                    key={option.id}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-300 ${
                      matchedPairs[option.id]
                        ? option.matra === matchedPairs[option.id].matra
                          ? 'border-green-500 bg-green-100 text-green-800'
                          : 'border-red-500 bg-red-100 text-red-800'
                        : 'border-dashed border-indigo-300 bg-indigo-50 text-indigo-600'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnLeft(e, option)}
                  >
                    <div className="text-2xl font-bold">
                      {matchedPairs[option.id]
                        ? `${option.text}=${matchedPairs[option.id].text}`
                        : option.text
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side - Answers */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-800 text-center mb-4">Answers</h3>
                {currentQ.rightAnswers.map((answer: any, index: number) => {
                  const isMatched = Object.values(matchedPairs).some(pair => pair.id === answer.id)
                  return (
                    <div
                      key={answer.id}
                      draggable={!isMatched}
                      onDragStart={(e) => handleDragStart(e, answer)}
                      className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                        isMatched
                          ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200 hover:border-green-500'
                      }`}
                    >
                      <div className="text-2xl font-bold">
                        {answer.text}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="mb-6">
                {showResult === "correct" ? (
                  <div className="flex items-center justify-center text-green-600 text-2xl font-bold">
                    <CheckCircle className="mr-2 h-8 w-8" />
                    Correct! Great Job!
                  </div>
                ) : showResult === "question-complete" ? (
                  <div className="flex items-center justify-center text-yellow-600 text-3xl font-bold">
                    <CheckCircle className="mr-2 h-10 w-10" />
                    Excellent! Question Complete! 🎉
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-red-600 text-2xl font-bold">
                    <XCircle className="mr-2 h-8 w-8" />
                    Wrong! Try Again!
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'][Math.floor(Math.random() * 10)]
                }}
              ></div>
            </div>
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-4 h-4 text-pink-400"
                style={{
                  transform: 'rotate(45deg)',
                  backgroundColor: '#ff6b6b',
                  clipPath: 'polygon(50% 0%, 80% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 20% 20%)'
                }}
              ></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
