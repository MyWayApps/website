"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle, Volume2 } from "lucide-react"
import { teluguRiddles, TeluguRiddle } from "@/lib/telugu-riddles-data"
import { playTeluguTTS } from "@/lib/telugu-tts"

const GOOD_JOB_AUDIO = "/audio/happy_tune.mp3"

export default function FlipCardGame() {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [riddlesList, setRiddlesList] = useState<TeluguRiddle[]>([])
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Shuffle riddles at the start
    const shuffled = [...teluguRiddles].sort(() => Math.random() - 0.5)
    setRiddlesList(shuffled)
  }, [])

  const currentRiddle = riddlesList[currentRiddleIndex]

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const handleBackToMenu = () => {
    window.location.href = "/telugu-riddles"
  }

  const handleCardClick = () => {
    if (!isFlipped) {
      // First click - show answer
      setIsFlipped(true)
      setScore(score + 1)
      playGoodJobSound()
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    } else {
      // Second click - move to next riddle
      handleNext()
    }
  }

  const handleNext = () => {
    if (currentRiddleIndex < riddlesList.length - 1) {
      setCurrentRiddleIndex(currentRiddleIndex + 1)
      setIsFlipped(false)
    } else {
      // Game complete
      alert(`🎉 Game Complete! You solved all ${riddlesList.length} riddles!`)
      handleRestart()
    }
  }

  const handleRestart = () => {
    const shuffled = [...teluguRiddles].sort(() => Math.random() - 0.5)
    setRiddlesList(shuffled)
    setCurrentRiddleIndex(0)
    setIsFlipped(false)
    setScore(0)
  }

  const playGoodJobSound = () => {
    try {
      const audio = new Audio(GOOD_JOB_AUDIO)
      audio.play().catch(err => console.log("Audio play failed:", err))
    } catch (error) {
      console.log("Audio error:", error)
    }
  }

  const handlePlayAudio = async (text: string) => {
    try {
      await playTeluguTTS(text)
    } catch (error) {
      console.log("TTS error:", error)
    }
  }

  if (!currentRiddle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 to-red-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading riddles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-red-400 p-4 relative overflow-hidden">
      {/* Animated Character */}
      <img 
        src="/characters/monkey-2.png" 
        alt="Monkey" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackToMenu}
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
          
          <Button
            onClick={handleRestart}
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-orange-900 mb-2">
          Flip Card Game
        </h1>
        <p className="text-2xl text-orange-800 font-semibold">
          Click to reveal answer!
        </p>
      </div>

      {/* Score and Progress */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/80 rounded-lg p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-900">
            Riddle {currentRiddleIndex + 1} / {riddlesList.length}
          </div>
          <div className="text-2xl font-bold text-orange-900">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto">
        <div 
          className={`perspective-1000 cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleCardClick}
        >
          <Card className="min-h-[400px] bg-gradient-to-br from-yellow-100 to-orange-200 border-4 border-white shadow-2xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              {!isFlipped ? (
                // Question Side
                <div className="text-center space-y-6">
                  <Lightbulb className="h-24 w-24 text-orange-600 mx-auto animate-pulse" />
                  <h2 className="text-3xl font-bold text-orange-900 mb-4">
                    పొడుపు (Riddle):
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-3xl text-orange-800 leading-relaxed">
                      {currentRiddle.podupu}
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayAudio(currentRiddle.podupu)
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3"
                      size="sm"
                    >
                      <Volume2 className="h-6 w-6" />
                    </Button>
                  </div>
                  <p className="text-xl text-orange-700 mt-8 animate-bounce">
                    👆 Click to see the answer!
                  </p>
                </div>
              ) : (
                // Answer Side
                <div className="text-center space-y-6">
                  <CheckCircle className="h-24 w-24 text-green-600 mx-auto" />
                  <h2 className="text-3xl font-bold text-green-900 mb-4">
                    విడుపు (Answer):
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-4xl font-bold text-green-800">
                      {currentRiddle.vidupu}
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayAudio(currentRiddle.vidupu)
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3"
                      size="sm"
                    >
                      <Volume2 className="h-6 w-6" />
                    </Button>
                  </div>
                  <p className="text-xl text-green-700">
                    ({currentRiddle.englishAnswer})
                  </p>
                  <div className="bg-green-100 rounded-lg p-4 mt-4">
                    <p className="text-lg text-green-800">
                      💡 {currentRiddle.reason}
                    </p>
                  </div>
                  <p className="text-xl text-orange-700 mt-8 animate-bounce">
                    👆 Click for next riddle!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

