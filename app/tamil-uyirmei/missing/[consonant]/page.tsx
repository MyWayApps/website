"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { playTamilTTS } from "@/lib/tamil-tts"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getApplicationByName } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"
import { uyirmeiMatraSequence } from "@/lib/tamil-uyirmei-data"

export default function MissingLettersGame() {
  const params = useParams()
  const consonant = decodeURIComponent(params.consonant as string)
  const { user, isConnected } = useCurrentUser()
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMissingIndex, setCurrentMissingIndex] = useState<number>(0)
  const [filledPositions, setFilledPositions] = useState<{[key: number]: { value: string; correct: boolean }}>({})
  const [isWaitingForNext, setIsWaitingForNext] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const [hadMistake, setHadMistake] = useState(false)

  useEffect(() => {
    getApplicationByName("Tamil Uyirmei").then((application) => setApplicationId(application?.id ?? null))
  }, [])

  const finishGame = async (finalScore: number) => {
    setGameOver(true)
    if (!user || !applicationId) return
    await saveGameScore({
      userId: user.id,
      applicationId,
      score: finalScore,
      maxScore: 5,
      subject: "Tamil",
      isConnected,
    })
    const tier = await getActivityMasteryTier(
      user.id,
      applicationId,
      `barakhadi:tamil-uyirmei:missing:${consonant}`,
    )
    setMasteryTier(tier)
  }

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Generate 5 questions with missing letters
  const generateQuestions = () => {
    const questions = []
    const totalMatras = uyirmeiMatraSequence.length

    for (let i = 0; i < 5; i++) {
      const startIndex = Math.floor(Math.random() * (totalMatras - 5))
      const questionSequence = uyirmeiMatraSequence.slice(startIndex, startIndex + 6)
      const correctAnswers = questionSequence.map(mat => consonant + mat)

      let missingIndices: number[]
      let missingLetters: string[]

      if (i < 2) {
        // First 2 questions: 1 missing letter
        const missingIndex = Math.floor(Math.random() * 6)
        missingIndices = [missingIndex]
        missingLetters = [correctAnswers[missingIndex]]
      } else {
        // Next 3 questions: 2 missing letters
        const indices = [0, 1, 2, 3, 4, 5]
        const shuffled = indices.sort(() => Math.random() - 0.5)
        missingIndices = shuffled.slice(0, 2).sort()
        missingLetters = missingIndices.map(idx => correctAnswers[idx])
      }

      // Create sequence with missing letters
      const sequenceWithMissing = correctAnswers.map((letter, index) =>
        missingIndices.includes(index) ? "?" : letter
      )

      // Create options (correct answers + wrong ones)
      const wrongOptions: string[] = []
      const numWrongOptions = i < 2 ? 2 : 3 // 3 options for single missing, 5 options for double missing
      while (wrongOptions.length < numWrongOptions) {
        const randomIndex = Math.floor(Math.random() * totalMatras)
        const wrongMat = uyirmeiMatraSequence[randomIndex]
        const wrongAnswer = consonant + wrongMat
        if (!correctAnswers.includes(wrongAnswer) && !wrongOptions.includes(wrongAnswer)) {
          wrongOptions.push(wrongAnswer)
        }
      }

      const allOptions = [...missingLetters, ...wrongOptions]
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5)

      questions.push({
        sequence: sequenceWithMissing,
        correctAnswers: missingLetters,
        options: shuffledOptions,
        missingIndices,
        fullSequence: correctAnswers
      })
    }

    return questions
  }

  // Initialize questions
  useEffect(() => {
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
    setIsLoading(false)
    setCurrentMissingIndex(0)
    setFilledPositions({})
    setIsWaitingForNext(false)
  }, [consonant])

  const currentQ = questions[currentQuestion]

  // Reset state when question changes
  useEffect(() => {
    if (currentQ) {
      setCurrentMissingIndex(0)
      setFilledPositions({})
      setIsWaitingForNext(false)
      setSelectedAnswer(null)
      setShowResult(null)
      setShowConfetti(false)
      setHadMistake(false)

      // Play TTS for the full sequence when question loads
      setTimeout(() => {
        const fullSequence = currentQ.fullSequence.join("")
        playTamilTTS(fullSequence).catch(err => {
          console.error("TTS failed:", err)
        })
      }, 500)
    }
  }, [currentQ])

  // Play audio
  const playAudio = (audioFile: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/audio/${audioFile}`
      audioRef.current.play().catch(e => console.error("Audio play failed:", e))
    }
  }

  // Handle option selection
  const handleOptionClick = (option: string) => {
    if (isWaitingForNext || !currentQ) return // Waiting for next step or no current question

    const currentMissingPos = currentQ.missingIndices[currentMissingIndex]
    const correctAnswer = currentQ.fullSequence[currentMissingPos]
    const correct = option === correctAnswer
    // Any wrong pick forfeits this question's point, but we still lock the
    // choice in and move on — no more unlimited retries per slot.
    const mistakeSoFar = hadMistake || !correct

    setIsWaitingForNext(true)
    setHadMistake(mistakeSoFar)
    setShowResult(correct ? "correct" : "wrong")
    correct ? playCorrectSound() : playWrongSound()

    // Fill this slot with whatever was picked, right or wrong, styled
    // accordingly — instead of silently substituting the correct answer.
    const newFilledPositions = { ...filledPositions, [currentMissingPos]: { value: option, correct } }
    setFilledPositions(newFilledPositions)

    const isLastPosition =
      currentQ.missingIndices.length === 1 || currentMissingIndex === currentQ.missingIndices.length - 1

    if (isLastPosition) {
      const newScore = mistakeSoFar ? score : score + 1
      if (!mistakeSoFar) setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setScore(newScore)
        if (currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          finishGame(newScore)
        }
      }, 4000)
    } else {
      setTimeout(() => {
        setShowResult(null)
        setIsWaitingForNext(false)
        setCurrentMissingIndex(currentMissingIndex + 1)
      }, 2000)
    }
  }

  // Handle back to missing main
  const handleBackToMissing = () => {
    window.location.href = "/tamil-uyirmei/missing"
  }

  // Handle restart
  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setShowResult(null)
    setSelectedAnswer(null)
    setCurrentMissingIndex(0)
    setFilledPositions({})
    setIsWaitingForNext(false)
    setShowConfetti(false)
    setHadMistake(false)
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
                onClick={handleBackToMissing}
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
          onClick={handleBackToMissing}
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
          {consonant} உயிர்மெய்
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
            <p className="text-lg text-indigo-700 mb-4">
              Find the missing letter(s) in the sequence
            </p>

            {/* Progress for multiple missing letters */}
            {currentQ?.missingIndices.length > 1 && (
              <p className="text-md text-indigo-600 mb-6">
                Fill position {currentMissingIndex + 1} of {currentQ.missingIndices.length} missing letters
              </p>
            )}

            {/* Sequence with Missing Letters */}
            <div className="flex justify-center gap-4 mb-8">
              {currentQ?.sequence.map((letter: string, index: number) => {
                const isMissing = currentQ.missingIndices.includes(index)
                const isFilled = filledPositions[index]
                const isCurrentMissing = isMissing && currentQ.missingIndices[currentMissingIndex] === index

                return (
                  <div
                    key={index}
                    className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                      isFilled
                        ? filledPositions[index].correct
                          ? 'border-green-500 bg-green-100 text-green-800'
                          : 'border-red-500 bg-red-100 text-red-800'
                        : isCurrentMissing
                        ? 'border-dashed border-yellow-500 bg-yellow-100 text-yellow-600 animate-pulse'
                        : isMissing
                        ? 'border-dashed border-indigo-300 bg-indigo-50 text-indigo-400'
                        : 'border-indigo-500 bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {isFilled ? filledPositions[index].value : letter}
                  </div>
                )
              })}
            </div>

            {/* Options */}
            <div className="flex justify-center gap-4 mb-6">
              {currentQ?.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={isWaitingForNext}
                  className={`w-20 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                    isWaitingForNext
                      ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200 hover:border-yellow-500 cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="mb-6">
                {showResult === "correct" ? (
                  <div className="flex items-center justify-center text-green-600 text-2xl font-bold">
                    <CheckCircle className="mr-2 h-8 w-8" />
                    Correct! Great Job!
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

      {/* Audio Elements */}
      <audio ref={audioRef} preload="auto" />
    </div>
  )
}
