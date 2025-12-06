"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2 } from "lucide-react"

interface SpellTheWordGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

// Letter button colors
const LETTER_COLORS = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-cyan-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-emerald-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-pink-500",
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-blue-500"
]

export default function SpellTheWordGame({ wordList, onGameComplete, onBackToGames }: SpellTheWordGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<{letter: string, used: boolean, id: number}[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const currentWord = wordList[currentWordIndex] || ""

  // Text-to-speech function
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.7
      utterance.pitch = 1.1
      utterance.volume = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  // Generate available letters (word letters + distractors)
  const generateLetters = (word: string) => {
    const wordLetters = word.toUpperCase().split('')
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    
    // Get distractor letters (not in word)
    const distractors = allLetters
      .filter(l => !wordLetters.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4, 10 - wordLetters.length))
    
    // Combine and shuffle
    const combined = [...wordLetters, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((letter, idx) => ({ letter, used: false, id: idx }))
    
    return combined
  }

  // Initialize game
  useEffect(() => {
    if (wordList.length > 0 && currentWord) {
      setAvailableLetters(generateLetters(currentWord))
      setSelectedLetters([])
      setTimeout(() => speakWord(currentWord), 500)
    }
  }, [currentWordIndex, wordList])

  // Handle letter selection
  const handleLetterClick = (letterId: number) => {
    const letter = availableLetters.find(l => l.id === letterId)
    if (!letter || letter.used) return

    const newSelectedLetters = [...selectedLetters, letter.letter]
    setSelectedLetters(newSelectedLetters)
    
    // Mark letter as used
    setAvailableLetters(prev => 
      prev.map(l => l.id === letterId ? { ...l, used: true } : l)
    )

    // Check if word is complete
    if (newSelectedLetters.length === currentWord.length) {
      const isWordCorrect = newSelectedLetters.join('').toLowerCase() === currentWord.toLowerCase()
      setIsCorrect(isWordCorrect)
      setShowFeedback(true)

      if (isWordCorrect) {
        setScore(score + 1)
        setShowConfetti(true)
        
        setTimeout(() => {
          setShowFeedback(false)
          setShowConfetti(false)
          
          if (currentWordIndex < wordList.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1)
          } else {
            setGameComplete(true)
            onGameComplete(score + 1)
          }
        }, 2000)
      } else {
        setTimeout(() => {
          setShowFeedback(false)
          // Reset for retry
          setSelectedLetters([])
          setAvailableLetters(generateLetters(currentWord))
        }, 1500)
      }
    }
  }

  // Handle removing a selected letter
  const handleRemoveLetter = (index: number) => {
    if (showFeedback) return
    
    const letterToRemove = selectedLetters[index]
    const newSelectedLetters = selectedLetters.filter((_, i) => i !== index)
    setSelectedLetters(newSelectedLetters)
    
    // Find and unmark the letter
    const letterObj = availableLetters.find(l => l.letter === letterToRemove && l.used)
    if (letterObj) {
      setAvailableLetters(prev =>
        prev.map(l => l.id === letterObj.id ? { ...l, used: false } : l)
      )
    }
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-green-600 mb-4">Amazing!</h2>
            <p className="text-2xl text-gray-700 mb-4">You spelled all the words!</p>
            <p className="text-xl text-teal-600 mb-6">Final Score: {score}/{wordList.length}</p>
            <div className="text-lg text-gray-500">Returning to games...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-teal-400 to-cyan-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToGames}
            className="bg-white/20 hover:bg-white/30 text-teal-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold text-teal-800">Score: {score}/{wordList.length}</span>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-teal-700 mb-2">
                ✨ Spell the Word
              </h2>
              <p className="text-lg text-teal-600">
                Listen and tap the letters to spell the word!
              </p>
              <div className="text-md text-gray-500 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
            </div>

            {/* Listen Button */}
            <div className="text-center mb-8">
              <Button
                onClick={() => speakWord(currentWord)}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Volume2 className="mr-3 h-7 w-7" />
                🔊 Listen to the Word
              </Button>
            </div>

            {/* Blanks Display */}
            <div className="flex justify-center gap-3 mb-8">
              {currentWord.split('').map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleRemoveLetter(index)}
                  className={`w-14 h-16 rounded-xl border-4 flex items-center justify-center text-3xl font-bold transition-all duration-300 cursor-pointer ${
                    selectedLetters[index]
                      ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white border-teal-300 shadow-lg hover:scale-105'
                      : 'bg-gray-100 border-gray-300 border-dashed'
                  }`}
                >
                  {selectedLetters[index] || ''}
                </div>
              ))}
            </div>

            {/* Available Letters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {availableLetters.map((letterObj, index) => (
                <Button
                  key={letterObj.id}
                  onClick={() => handleLetterClick(letterObj.id)}
                  disabled={letterObj.used || showFeedback}
                  className={`w-14 h-14 text-2xl font-bold rounded-xl transition-all duration-300 ${
                    letterObj.used
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : `bg-gradient-to-br ${LETTER_COLORS[index % LETTER_COLORS.length]} text-white shadow-lg hover:shadow-xl hover:scale-110`
                  }`}
                >
                  {letterObj.letter}
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
                  {isCorrect ? "🎉 Perfect!" : "🤔 Try Again!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `You spelled "${currentWord.toUpperCase()}" correctly!`
                    : `That's not right. Listen again and try!`}
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
                    <div className={`w-3 h-3 rounded-full ${['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400'][i % 4]}`}></div>
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
                      ? 'bg-teal-500 scale-125'
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

