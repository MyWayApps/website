"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2, MapPin, Key, Eye, EyeOff } from "lucide-react"

interface TreasureHuntGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

interface TreasureChest {
  id: number
  word: string
  x: number
  y: number
  opened: boolean
  locked: boolean
  hintShown: boolean
}

// Sound effect frequencies
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3
const treasureSoundFreqs = [440, 554.37, 659.25, 783.99, 1046.5] // A4, C#5, E5, G5, C6
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function TreasureHuntGame({ wordList, onGameComplete, onBackToGames }: TreasureHuntGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [treasureChests, setTreasureChests] = useState<TreasureChest[]>([])
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [wrongAttempts, setWrongAttempts] = useState(0)

  // Audio context for sound effects
  const playSound = (frequencies: number[], isCorrect: boolean) => {
    try {
      const audioContext = new (
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()

      if (isCorrect) {
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

  // Text-to-speech function
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // Initialize game
  useEffect(() => {
    if (wordList.length > 0) {
      setCurrentWord(wordList[0])
      setGameStartTime(Date.now())
      createTreasureChests()
    }
  }, [wordList])

  // Create treasure chests for current word
  const createTreasureChests = () => {
    const word = wordList[currentWordIndex]
    const chests: TreasureChest[] = []
    
    // Create 3-5 chests with the word
    const chestCount = Math.min(5, Math.max(3, word.length))
    
    for (let i = 0; i < chestCount; i++) {
      chests.push({
        id: i,
        word: word,
        x: Math.random() * 500 + 100,
        y: Math.random() * 200 + 150,
        opened: false,
        locked: true,
        hintShown: false
      })
    }
    
    setTreasureChests(chests)
    setUserInput("")
    setWrongAttempts(0)
    setShowHint(false)
  }

  // Handle word submission
  const handleSubmit = () => {
    const correct = userInput.toLowerCase().trim() === currentWord.toLowerCase()
    
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      playSound(correctSoundFreqs, true)
      
      // Open all chests
      setTreasureChests(prevChests => 
        prevChests.map(chest => ({ ...chest, opened: true, locked: false }))
      )
      
      // Play treasure sound
      setTimeout(() => playSound(treasureSoundFreqs, true), 500)
      
      setTimeout(() => {
        setShowFeedback(false)
        setUserInput("")
        setWrongAttempts(0)
        setShowHint(false)
        
        if (currentWordIndex < wordList.length - 1) {
          // Move to next word
          setCurrentWordIndex(currentWordIndex + 1)
          setCurrentWord(wordList[currentWordIndex + 1])
          createTreasureChests()
        } else {
          // Game completed
          handleGameComplete()
        }
      }, 3000)
    } else {
      playSound(wrongSoundFreqs, false)
      setWrongAttempts(wrongAttempts + 1)
      
      // Show hint after 2 wrong attempts
      if (wrongAttempts >= 1) {
        setShowHint(true)
      }
      
      setTimeout(() => {
        setShowFeedback(false)
        setUserInput("")
      }, 1500)
    }
  }

  const handleGameComplete = () => {
    playSound(successSoundFreqs, true)
    
    setTimeout(() => {
      onGameComplete(score + 1)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const getHint = () => {
    const word = currentWord
    if (word.length <= 2) return `The word has ${word.length} letters`
    if (word.length <= 4) return `Starts with "${word[0].toUpperCase()}" and ends with "${word[word.length - 1].toUpperCase()}"`
    return `Starts with "${word[0].toUpperCase()}", has ${word.length} letters, and ends with "${word[word.length - 1].toUpperCase()}"`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 p-4">
      <div className="max-w-6xl mx-auto">
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

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-orange-800">Score: {score}/5</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-800 mb-4 font-sans">
                🏴‍☠️ Treasure Hunt Game
              </h2>
              <p className="text-lg text-orange-700 font-medium">
                Find the treasure by spelling words correctly!
              </p>
              <div className="text-lg text-orange-600 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
            </div>

            {/* Game Area */}
            <div className="relative mb-8">
              {/* Pirate Map Background */}
              <div className="relative h-96 bg-gradient-to-b from-amber-100 to-yellow-200 rounded-2xl border-4 border-amber-600 shadow-lg overflow-hidden">
                {/* Map decorations */}
                <div className="absolute top-4 left-4 text-2xl">🗺️</div>
                <div className="absolute top-4 right-4 text-2xl">⚓</div>
                <div className="absolute bottom-4 left-4 text-2xl">🏝️</div>
                <div className="absolute bottom-4 right-4 text-2xl">🌊</div>
                
                {/* Compass */}
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-3xl">🧭</div>
                
                {/* Treasure Chests */}
                {treasureChests.map((chest) => (
                  <div
                    key={chest.id}
                    className="absolute transition-all duration-500"
                    style={{
                      left: chest.x,
                      top: chest.y,
                    }}
                  >
                    <div className={`text-4xl transition-all duration-500 ${
                      chest.opened 
                        ? 'animate-bounce' 
                        : chest.locked 
                        ? 'grayscale' 
                        : ''
                    }`}>
                      {chest.opened ? '💰' : '🔒'}
                    </div>
                    {chest.locked && (
                      <div className="absolute -top-2 -right-2 text-lg">🔐</div>
                    )}
                  </div>
                ))}
                
                {/* X marks the spot */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-3xl">❌</div>
              </div>
            </div>

            {/* Word Display and Input */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <Button
                  onClick={() => speakWord(currentWord)}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Volume2 className="mr-2 h-6 w-6" />
                  Listen to Word
                </Button>
              </div>
              
              <div className="text-2xl font-bold text-gray-700 mb-4">
                Spell the word to unlock the treasure chests:
              </div>
              
              <div className="flex justify-center gap-4">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the word here..."
                  className="text-xl text-center border-4 border-orange-300 focus:border-orange-500 rounded-xl font-bold w-64"
                  disabled={showFeedback}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || showFeedback}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold text-xl px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Unlock! 🔓
                </Button>
              </div>
            </div>

            {/* Hint Section */}
            {showHint && (
              <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-300">
                <div className="text-lg font-bold text-blue-800 mb-2">
                  <Key className="inline-block mr-2 h-5 w-5" />
                  Hint:
                </div>
                <div className="text-lg text-blue-700">{getHint()}</div>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`text-center p-6 rounded-2xl ${
                  isCorrect ? "bg-green-100" : "bg-red-100"
                } border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Excellent!" : "🤔 Try Again!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `Correct! The word is "${currentWord}"`
                    : `The correct word is "${currentWord}"`}
                </div>
                {isCorrect && (
                  <div className="text-lg text-orange-600 mt-2">
                    💰 Treasure unlocked! Great job!
                  </div>
                )}
              </div>
            )}

            {/* Game Complete */}
            {currentWordIndex >= wordList.length && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Congratulations!</div>
                <div className="text-2xl text-gray-700 mb-4">You found all the treasure!</div>
                <div className="text-xl text-gray-600 mb-2">Final Score: {score}/5</div>
                <div className="text-lg text-orange-600 mb-2">
                  🏴‍☠️ Treasure Hunter Master!
                </div>
                <div className="mt-4 text-lg text-gray-500">Returning to games...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

