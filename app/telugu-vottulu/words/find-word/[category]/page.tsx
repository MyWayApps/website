"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Volume2, CheckCircle, XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { getWordsByCategory, getWordCategoryLabel, WordCategory } from "@/lib/telugu-vottulu-data"
import { playTeluguTTS } from "@/lib/telugu-tts"

export default function FindWordGame() {
  const params = useParams()
  const category = params.category as WordCategory
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  
  const goodJobRef = useRef<HTMLAudioElement | null>(null)
  const buzzerRef = useRef<HTMLAudioElement | null>(null)

  const categoryLabel = getWordCategoryLabel(category)

  // Generate 5 questions with random words
  const generateQuestions = () => {
    const questions = []
    const allWords = getWordsByCategory(category)
    
    for (let i = 0; i < 5; i++) {
      // Select a random correct word
      const correctWord = allWords[Math.floor(Math.random() * allWords.length)]
      
      // Select 2 random wrong words (excluding the correct word)
      const remainingWords = allWords.filter(word => word !== correctWord)
      const wrongWords = remainingWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
      
      // Combine and shuffle options
      const allOptions = [correctWord, ...wrongWords].sort(() => Math.random() - 0.5)
      
      questions.push({
        correctWord,
        options: allOptions
      })
    }
    
    return questions
  }

  // Initialize questions
  useEffect(() => {
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
    setIsLoading(false)
  }, [category])

  // Reset state when question changes and auto-play audio
  useEffect(() => {
    if (questions[currentQuestion]) {
      setShowResult(null)
      setShowConfetti(false)
      // Auto-play audio when question loads
      setTimeout(() => {
        playWordAudio(questions[currentQuestion].correctWord)
      }, 500)
    }
  }, [currentQuestion, questions])

  const currentQ = questions[currentQuestion]

  // Play word audio using TTS
  const playWordAudio = async (word: string) => {
    if (isPlayingTTS) return
    
    try {
      setIsPlayingTTS(true)
      await playTeluguTTS(word, false)
    } catch (error) {
      console.error("TTS play failed:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  const playGoodJob = () => {
    if (goodJobRef.current) {
      goodJobRef.current.play().catch(e => console.error("Good job audio failed:", e))
    }
  }

  const playBuzzer = () => {
    if (buzzerRef.current) {
      buzzerRef.current.play().catch(e => console.error("Buzzer audio failed:", e))
    }
  }

  // Handle word selection
  const handleWordClick = (selectedWord: string) => {
    if (showResult) return
    
    if (selectedWord === currentQ.correctWord) {
      setShowResult("correct")
      setScore(score + 1)
      setShowConfetti(true)
      playGoodJob()
      
      setTimeout(() => {
        setShowConfetti(false)
        if (currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          setGameOver(true)
        }
      }, 3000)
    } else {
      setShowResult("wrong")
      playBuzzer()
      setTimeout(() => {
        setShowResult(null)
      }, 1500)
    }
  }

  const handleBackToCategories = () => {
    window.location.href = "/telugu-vottulu/words/find-word"
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setShowResult(null)
    setShowConfetti(false)
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
  }

  if (isLoading || !currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-pink-800 font-bold">Loading...</div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center">
        <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-pink-800 mb-4">Game Over!</h1>
            <p className="text-2xl text-pink-600 mb-6">Your Score: {score} / 5</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-2 border-pink-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={handleBackToCategories}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Categories
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToCategories}
          className="bg-white/20 hover:bg-white/30 text-pink-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Categories
        </Button>
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-900 mb-2">
          {categoryLabel.telugu}
        </h1>
        <p className="text-xl text-pink-700">
          Question {currentQuestion + 1} of 5 | Score: {score}
        </p>
      </div>

      {/* Game Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Instructions */}
            <p className="text-lg text-pink-700 mb-6">
              Listen to the audio and click on the correct word
            </p>

            {/* Play Audio Button */}
            <div className="mb-8">
              <Button
                onClick={() => playWordAudio(currentQ.correctWord)}
                disabled={isPlayingTTS}
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-2 border-pink-400 font-bold text-xl px-8 py-4 disabled:opacity-50"
                variant="outline"
              >
                <Volume2 className="mr-2 h-6 w-6" />
                {isPlayingTTS ? "Playing..." : "Play Audio"}
              </Button>
            </div>

            {/* Word Options */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentQ.options.map((word: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word)}
                  disabled={showResult !== null}
                  className={`p-6 border-2 rounded-lg text-2xl font-bold transition-all duration-200 ${
                    showResult === "correct" && word === currentQ.correctWord
                      ? 'bg-green-200 border-green-500 text-green-800'
                      : showResult === "wrong" && word === currentQ.correctWord
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800'
                      : showResult === "wrong" && word !== currentQ.correctWord
                      ? 'bg-red-200 border-red-500 text-red-800'
                      : showResult
                      ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                      : 'bg-pink-100 border-pink-400 text-pink-800 hover:bg-pink-200 hover:border-pink-500 cursor-pointer'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="mb-6">
                {showResult === "correct" ? (
                  <div className="flex items-center justify-center text-green-600 text-3xl font-bold">
                    <CheckCircle className="mr-2 h-10 w-10" />
                    Excellent! Great Job! 🎉
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
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={goodJobRef} src="/audio/happy_tune.mp3" preload="auto" />
      <audio ref={buzzerRef} src="/audio/buzz_audio.mp3" preload="auto" />
    </div>
  )
}

