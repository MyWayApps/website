"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from 'lucide-react'

type GameMode = "menu" | "count-by-2" | "count-by-3" | "count-by-5" | "count-by-10"
type PlayableGameMode = Exclude<GameMode, "menu">

interface User {
  id: string
  name: string
  email: string
}

interface GameData {
  mode: string
  pictureSet?: string
  completionTime: number
}

interface SkipCountingGameProps {
  user?: User | null
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

const gameData: Record<PlayableGameMode, {
  title: string
  pictures: Array<{ emoji: string; name: string; color: string }>
  sequence: number[]
}> = {
  "count-by-2": {
    title: "Skip Count by 2",
    pictures: [
      { emoji: "🍓", name: "Strawberries", color: "from-red-200 to-pink-200" },
      { emoji: "🐸", name: "Frogs", color: "from-green-200 to-emerald-200" },
      { emoji: "🦋", name: "Butterflies", color: "from-purple-200 to-pink-200" },
      { emoji: "🌸", name: "Flowers", color: "from-pink-200 to-rose-200" },
      { emoji: "🐱", name: "Cats", color: "from-orange-200 to-yellow-200" },
    ],
    sequence: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  },
  "count-by-3": {
    title: "Skip Count by 3",
    pictures: [
      { emoji: "🐰", name: "Bunnies", color: "from-blue-200 to-purple-200" },
      { emoji: "🐻", name: "Bears", color: "from-brown-200 to-amber-200" },
      { emoji: "🐼", name: "Pandas", color: "from-gray-200 to-slate-200" },
      { emoji: "🦊", name: "Foxes", color: "from-orange-200 to-red-200" },
      { emoji: "🐨", name: "Koalas", color: "from-gray-200 to-blue-200" },
    ],
    sequence: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
  },
  "count-by-5": {
    title: "Skip Count by 5",
    pictures: [
      { emoji: "🦋", name: "Butterflies", color: "from-green-200 to-teal-200" },
      { emoji: "🐝", name: "Bees", color: "from-yellow-200 to-amber-200" },
      { emoji: "🐞", name: "Ladybugs", color: "from-red-200 to-pink-200" },
      { emoji: "🦗", name: "Crickets", color: "from-green-200 to-lime-200" },
      { emoji: "🕷️", name: "Spiders", color: "from-purple-200 to-indigo-200" },
    ],
    sequence: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  },
  "count-by-10": {
    title: "Skip Count by 10",
    pictures: [
      { emoji: "⭐", name: "Stars", color: "from-yellow-200 to-orange-200" },
      { emoji: "🌟", name: "Sparkles", color: "from-blue-200 to-purple-200" },
      { emoji: "💎", name: "Diamonds", color: "from-cyan-200 to-blue-200" },
      { emoji: "🎈", name: "Balloons", color: "from-pink-200 to-red-200" },
      { emoji: "🎁", name: "Gifts", color: "from-green-200 to-teal-200" },
    ],
    sequence: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
}

// Sound effect frequencies for correct answers
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3

export default function SkipCountingGame({ onGameComplete, onBackToHome }: SkipCountingGameProps = {}) {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [pictureIndex, setPictureIndex] = useState<Record<PlayableGameMode, number>>({
    "count-by-2": 0,
    "count-by-3": 0,
    "count-by-5": 0,
    "count-by-10": 0,
  })

  // Audio context for sound effects
  const playSound = (frequencies: number[], isCorrect: boolean) => {
    try {
      const audioContext = new (
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()

      if (isCorrect) {
        // Play a pleasant ascending melody for correct answers
        const randomFreqs = frequencies.sort(() => Math.random() - 0.5).slice(0, 3)
        randomFreqs.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15)
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.15 + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3)

          oscillator.start(audioContext.currentTime + index * 0.15)
          oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3)
        })
      } else {
        // Play a descending tone for wrong answers
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.2)
          oscillator.type = "sawtooth"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.2)
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + index * 0.2 + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.2 + 0.4)

          oscillator.start(audioContext.currentTime + index * 0.2)
          oscillator.stop(audioContext.currentTime + index * 0.2 + 0.4)
        })
      }
    } catch {
      console.log("Audio not supported")
    }
  }

  const handleModeSelect = (mode: GameMode) => {
    setCurrentMode(mode)
    setCurrentIndex(0)
    setUserInput("")
    setShowFeedback(false)
    setScore(0)

    // Only update picture index for playable modes (not menu)
    if (mode !== "menu") {
      setPictureIndex((prev) => ({
        ...prev,
        [mode]: (prev[mode] + 1) % gameData[mode].pictures.length,
      }))
    }
  }

  const handleSubmit = () => {
    if (currentMode === "menu") return

    const currentGame = gameData[currentMode as PlayableGameMode]
    const correctAnswer = currentGame.sequence[currentIndex]
    const userAnswer = Number.parseInt(userInput)

    if (userAnswer === correctAnswer) {
      setIsCorrect(true)
      setScore(score + 1)
      setShowFeedback(true)

      // Play correct answer sound
      playSound(correctSoundFreqs, true)

      setTimeout(() => {
        if (currentIndex < currentGame.sequence.length - 1) {
          setCurrentIndex(currentIndex + 1)
          setUserInput("")
          setShowFeedback(false)
        } else {
          // Game completed - play victory sound
          setTimeout(() => {
            playSound([523.25, 659.25, 783.99, 1046.5], true)
          }, 500)

          // Save score to database
          if (onGameComplete) {
            const currentPicture = getCurrentPicture(currentMode)
            onGameComplete(score + 1, currentGame.sequence.length, {
              mode: currentMode,
              pictureSet: currentPicture?.name,
              completionTime: Date.now(), // You can track actual time
            })
          }

          setTimeout(() => {
            if (onBackToHome) {
              onBackToHome()
            } else {
              setCurrentMode("menu")
              setCurrentIndex(0)
              setUserInput("")
              setShowFeedback(false)
              setScore(0)
            }
          }, 2000)
        }
      }, 1500)
    } else {
      setIsCorrect(false)
      setShowFeedback(true)

      // Play wrong answer sound
      playSound(wrongSoundFreqs, false)

      setTimeout(() => {
        setShowFeedback(false)
        setUserInput("")
      }, 1500)
    }
  }

  const getCurrentPicture = (mode: GameMode) => {
    if (mode === "menu") return null
    const game = gameData[mode as PlayableGameMode]
    const currentPictureIndex = pictureIndex[mode as PlayableGameMode]
    return game.pictures[currentPictureIndex]
  }

  const renderVisualCount = (mode: GameMode, index: number) => {
    if (mode === "menu") return null

    const currentPicture = getCurrentPicture(mode)
    if (!currentPicture) return null

    const game = gameData[mode as PlayableGameMode]
    const count = game.sequence[index]
    const items = []

    for (let i = 0; i < count && i < 20; i++) {
      items.push(
        <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
          {currentPicture.emoji}
        </span>,
      )
    }

    return (
      <div
        className={`flex flex-wrap gap-2 justify-center mb-6 p-4 bg-gradient-to-r ${currentPicture.color} rounded-2xl backdrop-blur-sm border-2 border-white/50`}
      >
        <div className="w-full text-center mb-2">
          <span className="text-lg font-bold text-gray-700">{currentPicture.name}</span>
        </div>
        {items}
        {count > 20 && <span className="text-2xl">... and more!</span>}
      </div>
    )
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-amber-800 mb-4 font-sans tracking-tight">
                🎯 Skip Counting Adventure
              </h1>
              <p className="text-xl text-amber-700 font-medium">Choose your counting challenge!</p>
              <p className="text-sm text-amber-600 mt-2">Each time you play, you&apos;ll see different pictures!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(gameData).map(([key, data]) => {
                const gameMode = key as PlayableGameMode
                const nextPictureIndex = (pictureIndex[gameMode] + 1) % data.pictures.length
                const nextPicture = data.pictures[nextPictureIndex]

                return (
                  <Button
                    key={key}
                    onClick={() => handleModeSelect(gameMode)}
                    className={`h-32 text-2xl font-bold bg-gradient-to-r ${nextPicture.color} hover:scale-105 transform transition-all duration-300 text-gray-800 border-4 border-white shadow-lg hover:shadow-xl`}
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">{nextPicture.emoji}</span>
                      <span className="font-sans">{data.title}</span>
                      <span className="text-sm font-normal">{nextPicture.name}</span>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentGame = gameData[currentMode as PlayableGameMode]
  const currentPicture = getCurrentPicture(currentMode)
  const isGameComplete = currentIndex >= currentGame.sequence.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => (onBackToHome ? onBackToHome() : setCurrentMode("menu"))}
            className="bg-white/20 hover:bg-white/30 text-amber-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {onBackToHome ? "Back to Home" : "Back to Menu"}
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-amber-800">Score: {score}</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-amber-800 mb-2 font-sans">{currentGame.title}</h2>
              {currentPicture && (
                <p className="text-lg text-amber-700 font-medium mb-2">
                  Counting with {currentPicture.name} {currentPicture.emoji}
                </p>
              )}
              <div className="text-lg text-amber-700 font-medium">
                Question {currentIndex + 1} of {currentGame.sequence.length}
              </div>
            </div>

            {!isGameComplete && (
              <>
                {/* Visual Count Display */}
                {renderVisualCount(currentMode, currentIndex)}

                {/* Question */}
                <div className="text-center mb-8">
                  <div className="text-2xl font-bold text-gray-700 mb-4">
                    {currentIndex === 0 ? (
                      `What comes first when counting by ${currentGame.sequence[1] - currentGame.sequence[0]}?`
                    ) : (
                      <>
                        {currentGame.sequence.slice(0, currentIndex).join(", ")},
                        <span className="text-3xl text-amber-600 mx-2">?</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Input
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter the next number"
                    className="text-3xl text-center w-48 h-16 border-4 border-amber-300 focus:border-amber-500 rounded-2xl font-bold"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && userInput.trim() !== "") {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                    className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Check Answer! ✨
                  </Button>
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div
                    className={`text-center p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
                  >
                    <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                      {isCorrect ? "🎉 Excellent!" : "🤔 Try Again!"}
                    </div>
                    <div className="text-xl font-medium text-gray-700">
                      {isCorrect
                        ? `Yes! The answer is ${currentGame.sequence[currentIndex]}`
                        : `The correct answer is ${currentGame.sequence[currentIndex]}`}
                    </div>
                  </div>
                )}
              </>
            )}

            {isGameComplete && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Congratulations!</div>
                <div className="text-2xl text-gray-700 mb-4">
                  You completed all {currentGame.sequence.length} questions!
                </div>
                <div className="text-xl text-gray-600 mb-2">
                  Final Score: {score}/{currentGame.sequence.length}
                </div>
                <div className="text-lg text-amber-600 mb-2">You counted with {currentPicture?.name}! 🎊</div>
                <div className="mt-4 text-lg text-gray-500">Returning to menu...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
