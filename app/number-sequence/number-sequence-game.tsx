"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, ArrowUp, ArrowDown } from "lucide-react"

type GameMode = "menu" | "setup" | "playing"
type Order = "ascending" | "descending"

interface User {
  id: string
  name: string
  email?: string
}

interface GameData {
  mode: string
  order: string
  maxNumber: number
  completionTime: number
}

interface NumberSequenceGameProps {
  user?: User | null
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

// Sound effect frequencies
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function NumberSequenceGame({ onGameComplete, onBackToHome }: NumberSequenceGameProps = {}) {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [selectedOrder, setSelectedOrder] = useState<Order>("ascending")
  const [selectedMaxNumber, setSelectedMaxNumber] = useState<number>(10)
  const [currentSequence, setCurrentSequence] = useState<number[]>([])
  const [filledPositions, setFilledPositions] = useState<boolean[]>([false, false, false, false, false])
  const [currentPosition, setCurrentPosition] = useState(0)
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)

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

  const generateSequence = () => {
    // Generate a random starting number within range
    const maxStart = selectedOrder === "ascending" ? selectedMaxNumber - 4 : Math.max(5, selectedMaxNumber - 5)

    const minStart = selectedOrder === "ascending" ? 1 : 5

    const startNumber = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart

    // Create sequence of 5 consecutive numbers
    const sequence = []
    for (let i = 0; i < 5; i++) {
      if (selectedOrder === "ascending") {
        sequence.push(startNumber + i)
      } else {
        sequence.push(startNumber - i)
      }
    }

    // Create available numbers (sequence + some random distractors)
    const distractors = []
    const usedNumbers = new Set(sequence)

    // Add 3-5 distractor numbers
    while (distractors.length < 4) {
      const distractor = Math.floor(Math.random() * selectedMaxNumber) + 1
      if (!usedNumbers.has(distractor)) {
        distractors.push(distractor)
        usedNumbers.add(distractor)
      }
    }

    // Shuffle available numbers
    const available = [...sequence, ...distractors].sort(() => Math.random() - 0.5)

    setCurrentSequence(sequence)
    setAvailableNumbers(available)
    setFilledPositions([true, false, false, false, false])
    setCurrentPosition(1)
    setGameStartTime(Date.now())
  }

  const handleStartGame = () => {
    generateSequence()
    setCurrentMode("playing")
  }

  const handleNumberClick = (number: number) => {
    const expectedNumber = currentSequence[currentPosition]

    if (number === expectedNumber) {
      setIsCorrect(true)
      setShowFeedback(true)

      // Play correct sound
      playSound(correctSoundFreqs, true)

      // Update filled positions
      const newFilledPositions = [...filledPositions]
      newFilledPositions[currentPosition] = true
      setFilledPositions(newFilledPositions)

      setTimeout(() => {
        setShowFeedback(false)

        if (currentPosition < 4) {
          // Move to next position
          setCurrentPosition(currentPosition + 1)
        } else {
          // Sequence completed!
          setScore(score + 1)

          // Play success melody
          setTimeout(() => {
            playSound(successSoundFreqs, true)
          }, 500)

          // Save score and return to setup
          if (onGameComplete) {
            onGameComplete(score + 1, score + 1, {
              mode: "number-sequence",
              order: selectedOrder,
              maxNumber: selectedMaxNumber,
              completionTime: gameStartTime,
            })
          }

          setTimeout(() => {
            setCurrentMode("setup")
            setCurrentPosition(0)
            setFilledPositions([false, false, false, false, false])
          }, 2000)
        }
      }, 1500)
    } else {
      setIsCorrect(false)
      setShowFeedback(true)

      // Play wrong sound
      playSound(wrongSoundFreqs, false)

      setTimeout(() => {
        setShowFeedback(false)
      }, 1500)
    }
  }

  const resetGame = () => {
    setCurrentMode("menu")
    setScore(0)
    setCurrentPosition(0)
    setFilledPositions([false, false, false, false, false])
    setCurrentSequence([])
    setAvailableNumbers([])
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4 flex items-center justify-center relative overflow-hidden">
        {/* Decorative Character */}
        <img 
          src="/characters/giraffe.png" 
          alt="Giraffe" 
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-indigo-800 mb-4 font-sans tracking-tight">
                📈 Number Sequence Challenge
              </h1>
              <p className="text-xl text-indigo-700 font-medium">Complete the number patterns!</p>
              <p className="text-sm text-indigo-600 mt-2">Fill in the missing numbers in the correct order</p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setCurrentMode("setup")}
                className="h-32 text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl px-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">🎯</span>
                  <span className="font-sans">Start Playing</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentMode === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4 relative overflow-hidden">
        {/* Decorative Character */}
        <img 
          src="/characters/giraffe.png" 
          alt="Giraffe" 
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => (onBackToHome ? onBackToHome() : resetGame())}
              className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {onBackToHome ? "Back to Home" : "Back to Menu"}
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-indigo-800">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-indigo-800 mb-4 font-sans">Game Setup</h2>
                <p className="text-lg text-indigo-700 font-medium">Choose your challenge settings</p>
              </div>

              <div className="space-y-8">
                {/* Order Selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Order Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button
                      onClick={() => setSelectedOrder("ascending")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        selectedOrder === "ascending"
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
                      onClick={() => setSelectedOrder("descending")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        selectedOrder === "descending"
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

                {/* Number Range Selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Number Range</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[10, 20, 50, 100].map((maxNum) => (
                      <Button
                        key={maxNum}
                        onClick={() => setSelectedMaxNumber(maxNum)}
                        className={`h-20 text-xl font-bold border-4 transition-all duration-300 ${
                          selectedMaxNumber === maxNum
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

                {/* Start Button */}
                <div className="text-center">
                  <Button
                    onClick={handleStartGame}
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

  // Playing mode
  const isSequenceComplete = filledPositions.every((pos) => pos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/giraffe.png" 
        alt="Giraffe" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentMode("setup")}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-indigo-800">Score: {score}</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-indigo-800 mb-2 font-sans">Number Sequence</h2>
              <p className="text-lg text-indigo-700 font-medium">
                {selectedOrder === "ascending" ? "Ascending" : "Descending"} order (1 to {selectedMaxNumber})
              </p>
              <div className="text-lg text-indigo-700 font-medium mt-2">
                Click the correct number to fill the sequence!
              </div>
            </div>

            {!isSequenceComplete && (
              <>
                {/* Sequence Display */}
                <div className="flex justify-center gap-4 mb-8">
                  {currentSequence.map((number, index) => (
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

                {/* Available Numbers */}
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

                {/* Feedback */}
                {showFeedback && (
                  <div
                    className={`text-center p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
                  >
                    <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                      {isCorrect ? "🎉 Correct!" : "🤔 Try Again!"}
                    </div>
                    <div className="text-xl font-medium text-gray-700">
                      {isCorrect
                        ? `Great job! The number ${currentSequence[currentPosition]} is correct!`
                        : `The correct number is ${currentSequence[currentPosition]}`}
                    </div>
                  </div>
                )}
              </>
            )}

            {isSequenceComplete && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Good Job!</div>
                <div className="text-2xl text-gray-700 mb-4">You completed the sequence perfectly!</div>
                <div className="text-xl text-gray-600 mb-2">
                  Score: {score} point{score !== 1 ? "s" : ""}
                </div>
                <div className="text-lg text-indigo-600 mb-2">
                  Sequence: {currentSequence.join(", ")} ({selectedOrder})
                </div>
                <div className="mt-4 text-lg text-gray-500">Returning to setup...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
