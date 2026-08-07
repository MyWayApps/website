"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2 } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { speakSpellingWord } from "@/lib/spelling-audio"

interface TypeTheWordGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

export default function TypeTheWordGame({ wordList, onGameComplete, onBackToGames }: TypeTheWordGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [typedWord, setTypedWord] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const boxRefs = useRef<(HTMLInputElement | null)[]>([])

  const currentWord = wordList[currentWordIndex] || ""

  // Text-to-speech function
  const speakWord = (word: string) => {
    void speakSpellingWord(word)
  }

  // Initialize game and auto-focus the first box
  useEffect(() => {
    if (wordList.length > 0 && currentWord) {
      setTypedWord("")
      boxRefs.current = []
      setTimeout(() => {
        speakWord(currentWord)
        boxRefs.current[0]?.focus()
      }, 500)
    }
  }, [currentWordIndex, wordList])

  // One real <input maxLength={1}> per letter, auto-advancing as each is
  // filled — replaces the on-screen virtual keyboard entirely.
  const handleBoxChange = (index: number, rawValue: string) => {
    if (showFeedback) return
    const char = rawValue.replace(/[^A-Za-z]/g, "").slice(-1).toUpperCase()

    setTypedWord((prev) => {
      const chars = prev.padEnd(currentWord.length, " ").split("")
      chars[index] = char || " "
      return chars.join("").trimEnd()
    })

    if (char && index < currentWord.length - 1) {
      boxRefs.current[index + 1]?.focus()
    }
  }

  const handleBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showFeedback) return

    if (e.key === "Backspace" && !typedWord[index]?.trim() && index > 0) {
      e.preventDefault()
      setTypedWord((prev) => {
        const chars = prev.padEnd(currentWord.length, " ").split("")
        chars[index - 1] = " "
        return chars.join("").trimEnd()
      })
      boxRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      boxRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < currentWord.length - 1) {
      boxRefs.current[index + 1]?.focus()
    } else if (e.key === "Enter") {
      checkAnswer()
    }
  }

  // Check if answer is correct
  const checkAnswer = () => {
    if (typedWord.length !== currentWord.length || typedWord.includes(" ")) return

    const correct = typedWord.toLowerCase() === currentWord.toLowerCase()
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      playCorrectSound()

      setTimeout(() => {
        setShowFeedback(false)
        setShowConfetti(false)
        setTypedWord("")

        if (currentWordIndex < wordList.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1)
        } else {
          setGameComplete(true)
          onGameComplete(score + 1)
        }
      }, 5000)
    } else {
      playWrongSound()

      setTimeout(() => {
        setShowFeedback(false)
        setTypedWord("")
        boxRefs.current[0]?.focus()
      }, 1500)
    }
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-rose-500 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-purple-600 mb-4">Fantastic!</h2>
            <p className="text-2xl text-gray-700 mb-4">You typed all the words!</p>
            <p className="text-xl text-pink-600 mb-6">Final Score: {score}/{wordList.length}</p>
            <div className="text-lg text-gray-500">Returning to games...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-rose-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToGames}
            className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-lg font-bold text-purple-800 mr-1">
              Word {currentWordIndex + 1}/{wordList.length}
            </span>
            {Array.from({ length: wordList.length }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-purple-700 mb-2">
                ⌨️ Type the Word
              </h2>
              <p className="text-lg text-purple-600">
                Listen and type the word you hear!
              </p>
              <div className="text-md text-gray-500 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
            </div>

            {/* Listen Button */}
            <div className="text-center mb-6">
              <Button
                onClick={() => speakWord(currentWord)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Volume2 className="mr-3 h-7 w-7" />
                🔊 Listen to the Word
              </Button>
            </div>

            {/* Word Blanks — each is a real input, auto-focused and
                auto-advancing, no on-screen keyboard needed */}
            <div className="flex justify-center gap-2 mb-8">
              {currentWord.split('').map((letter, index) => {
                const typed = (typedWord[index] || '').trim()
                return (
                  <input
                    key={index}
                    ref={(el) => { boxRefs.current[index] = el }}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    disabled={showFeedback}
                    value={typed}
                    onChange={(e) => handleBoxChange(index, e.target.value)}
                    onKeyDown={(e) => handleBoxKeyDown(index, e)}
                    className={`w-12 h-14 rounded-xl border-4 flex items-center justify-center text-2xl font-bold text-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
                      typed
                        ? typed.toLowerCase() === letter.toLowerCase()
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300'
                          : 'bg-gradient-to-br from-purple-400 to-pink-500 text-white border-purple-300'
                        : 'bg-gray-100 border-gray-300 border-dashed'
                    }`}
                  />
                )
              })}
            </div>

            {/* Submit Button */}
            <div className="text-center mb-6">
              <Button
                onClick={checkAnswer}
                disabled={typedWord.length !== currentWord.length || typedWord.includes(' ') || showFeedback}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Check My Answer
              </Button>
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`text-center p-6 rounded-2xl ${
                  isCorrect ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"
                }`}
              >
                <div className={`text-4xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Correct!" : "🤔 Not Quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `Great job! "${currentWord.toUpperCase()}" is right!`
                    : `The word was "${currentWord.toUpperCase()}". Try again!`}
                </div>
              </div>
            )}

            {/* Confetti */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full ${['bg-yellow-400', 'bg-pink-400', 'bg-purple-400', 'bg-blue-400'][i % 4]}`}></div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {wordList.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentWordIndex
                      ? 'bg-green-500'
                      : index === currentWordIndex
                      ? 'bg-purple-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

