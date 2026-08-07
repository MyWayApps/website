"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2 } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { speakSpellingWord } from "@/lib/spelling-audio"

interface SearchTheWordGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

// Distractor words pool
const DISTRACTOR_WORDS = [
  "apple", "banana", "cherry", "dragon", "eagle", "flower", "garden", "honey",
  "island", "jungle", "kitten", "lemon", "mango", "nature", "orange", "purple",
  "queen", "rabbit", "sunset", "tiger", "umbrella", "valley", "winter", "yellow",
  "zebra", "butter", "candle", "dolphin", "energy", "forest", "guitar", "heaven",
  "insect", "jacket", "knight", "lizard", "mirror", "needle", "ocean", "pencil"
]

// Card colors
const CARD_COLORS = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-cyan-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-emerald-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-pink-500"
]

export default function SearchTheWordGame({ wordList, onGameComplete, onBackToGames }: SearchTheWordGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const currentWord = wordList[currentWordIndex] || ""

  // Text-to-speech function
  const speakWord = (word: string) => {
    void speakSpellingWord(word)
  }

  // Generate options (correct word + distractors)
  const generateOptions = (correctWord: string) => {
    // Get distractors that aren't in the word list and aren't the current word
    const availableDistractors = DISTRACTOR_WORDS.filter(
      w => !wordList.includes(w) && w !== correctWord
    )
    
    // Pick 3-5 random distractors (depending on screen size, we'll show 4-6 options)
    const numDistractors = Math.min(4, availableDistractors.length)
    const shuffledDistractors = availableDistractors.sort(() => Math.random() - 0.5)
    const selectedDistractors = shuffledDistractors.slice(0, numDistractors)
    
    // Combine with correct word and shuffle
    const allOptions = [correctWord, ...selectedDistractors].sort(() => Math.random() - 0.5)
    
    return allOptions
  }

  // Initialize round
  useEffect(() => {
    if (wordList.length > 0 && currentWord) {
      setOptions(generateOptions(currentWord))
      setSelectedOption(null)
      setTimeout(() => speakWord(currentWord), 500)
    }
  }, [currentWordIndex, wordList])

  // Handle option selection
  const handleOptionClick = (option: string) => {
    if (showFeedback) return

    setSelectedOption(option)
    const correct = option.toLowerCase() === currentWord.toLowerCase()
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore(score + 1)
      setShowConfetti(true)
      playCorrectSound()

      setTimeout(() => {
        setShowFeedback(false)
        setShowConfetti(false)
        setSelectedOption(null)

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
        setSelectedOption(null)
      }, 1500)
    }
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-500 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-orange-600 mb-4">Brilliant!</h2>
            <p className="text-2xl text-gray-700 mb-4">You found all the words!</p>
            <p className="text-xl text-amber-600 mb-6">Final Score: {score}/{wordList.length}</p>
            <div className="text-lg text-gray-500">Returning to games...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-amber-400 to-yellow-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToGames}
            className="bg-white/20 hover:bg-white/30 text-orange-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-lg font-bold text-orange-800 mr-1">
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
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-700 mb-2">
                🔍 Search the Word
              </h2>
              <p className="text-lg text-orange-600">
                Listen and find the correct word!
              </p>
              <div className="text-md text-gray-500 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
            </div>

            {/* Listen Button */}
            <div className="text-center mb-8">
              <Button
                onClick={() => speakWord(currentWord)}
                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Volume2 className="mr-3 h-7 w-7" />
                🔊 Listen to the Word
              </Button>
            </div>

            {/* Word Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={showFeedback}
                  className={`h-20 text-2xl font-bold rounded-2xl transition-all duration-300 ${
                    showFeedback && selectedOption === option
                      ? isCorrect
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-4 border-green-300 scale-105'
                        : 'bg-gradient-to-br from-red-400 to-rose-500 text-white border-4 border-red-300 animate-shake'
                      : showFeedback && option.toLowerCase() === currentWord.toLowerCase()
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-4 border-green-300'
                      : `bg-gradient-to-br ${CARD_COLORS[index % CARD_COLORS.length]} text-white shadow-lg hover:shadow-xl hover:scale-105`
                  }`}
                >
                  {option.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`text-center p-6 rounded-2xl ${
                  isCorrect ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"
                }`}
              >
                <div className={`text-4xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 You Found It!" : "🤔 That's Not It!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `"${currentWord.toUpperCase()}" is correct!`
                    : `Look for "${currentWord.toUpperCase()}". Try again!`}
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
                    <div className={`w-3 h-3 rounded-full ${['bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-pink-400'][i % 4]}`}></div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {wordList.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentWordIndex
                      ? 'bg-green-500'
                      : index === currentWordIndex
                      ? 'bg-orange-500 scale-125'
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

