"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2, Rocket, CheckCircle, XCircle } from "lucide-react"

interface WordRocketGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

interface Letter {
  id: number
  letter: string
  x: number
  y: number
  used: boolean
  correct: boolean
}

// Sound effect frequencies
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3
const rocketSoundFreqs = [440, 554.37, 659.25, 783.99, 1046.5] // A4, C#5, E5, G5, C6
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function WordRocketGame({ wordList, onGameComplete, onBackToGames }: WordRocketGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [scrambledLetters, setScrambledLetters] = useState<Letter[]>([])
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([])
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [rocketPosition, setRocketPosition] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)
  const [showStars, setShowStars] = useState(false)
  const animationRef = useRef<number>()

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
      createScrambledLetters()
      // Auto-play audio when game starts
      setTimeout(() => {
        speakWord(wordList[0])
      }, 500)
    }
  }, [wordList])

  // Create scrambled letters for current word
  const createScrambledLetters = (wordToUse?: string) => {
    const word = wordToUse || wordList[currentWordIndex]
    const letters = word.split('')
    
    // Add some extra letters to make it more challenging, but avoid duplicates
    const extraLetters = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'l', 'd', 'h', 'c', 'f', 'g', 'j', 'k', 'm', 'p', 'q', 'v', 'w', 'x', 'y', 'z']
    const wordLetters = letters.map(l => l.toLowerCase())
    const availableExtras = extraLetters.filter(letter => !wordLetters.includes(letter))
    
    // Add 2-3 extra letters (no duplicates)
    const numExtras = Math.min(3, availableExtras.length)
    const selectedExtras = availableExtras.slice(0, numExtras)
    
    const allLetters = [...letters, ...selectedExtras]
    
    console.log('Creating letters for word:', word, 'Letters:', letters, 'All letters:', allLetters)
    
    const scrambled = allLetters
      .map((letter, index) => ({
        id: index,
        letter: letter.toUpperCase(),
        x: Math.random() * 600 + 100,
        y: Math.random() * 200 + 200,
        used: false,
        correct: letters.includes(letter.toLowerCase())
      }))
      .sort(() => Math.random() - 0.5)
    
    setScrambledLetters(scrambled)
    setSelectedLetters([])
    setRocketPosition(0)
  }

  // Animate rocket movement
  useEffect(() => {
    if (isLaunching) {
      const animate = () => {
        setRocketPosition(prev => {
          if (prev >= 100) {
            setIsLaunching(false)
            setShowStars(true)
            return 100
          }
          return prev + 2
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isLaunching])

  // Handle letter selection
  const handleLetterClick = (letter: Letter) => {
    if (letter.used || selectedLetters.length >= currentWord.length) return

    const newSelectedLetters = [...selectedLetters, letter]
    setSelectedLetters(newSelectedLetters)
    
    // Update letter as used
    setScrambledLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, used: true } : l)
    )

    // Check if word is complete
    if (newSelectedLetters.length === currentWord.length) {
      checkWord(newSelectedLetters)
    }
  }

  // Check if the selected letters form the correct word
  const checkWord = (lettersToCheck: Letter[] = selectedLetters) => {
    const selectedWord = lettersToCheck.map(l => l.letter.toLowerCase()).join('')
    const correct = selectedWord === currentWord.toLowerCase()
    
    console.log('Word check:', { selectedWord, currentWord: currentWord.toLowerCase(), correct })
    
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      playSound(correctSoundFreqs, true)
      
      // Launch rocket
      setTimeout(() => {
        setIsLaunching(true)
        playSound(rocketSoundFreqs, true)
      }, 1000)
      
      setTimeout(() => {
        setShowFeedback(false)
        setShowStars(false)
        
        if (currentWordIndex < wordList.length - 1) {
          // Move to next word
          const nextWordIndex = currentWordIndex + 1
          const nextWord = wordList[nextWordIndex]
          setCurrentWordIndex(nextWordIndex)
          setCurrentWord(nextWord)
          createScrambledLetters(nextWord)
          // Auto-play audio for next word
          setTimeout(() => {
            speakWord(nextWord)
          }, 1000)
        } else {
          // Game completed
          handleGameComplete()
        }
      }, 3000)
    } else {
      playSound(wrongSoundFreqs, false)
      
      setTimeout(() => {
        setShowFeedback(false)
        // Reset selection
        setSelectedLetters([])
        setScrambledLetters(prev => 
          prev.map(l => ({ ...l, used: false }))
        )
      }, 1500)
    }
  }

  const handleGameComplete = () => {
    playSound(successSoundFreqs, true)
    
    setTimeout(() => {
      onGameComplete(score + 1)
    }, 2000)
  }

  const removeLastLetter = () => {
    if (selectedLetters.length > 0) {
      const lastLetter = selectedLetters[selectedLetters.length - 1]
      setSelectedLetters(prev => prev.slice(0, -1))
      
      // Mark letter as unused
      setScrambledLetters(prev => 
        prev.map(l => l.id === lastLetter.id ? { ...l, used: false } : l)
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToGames}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-indigo-800">Score: {score}/5</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-indigo-800 mb-4 font-sans">
                🚀 Word Rocket Game
              </h2>
              <p className="text-lg text-indigo-700 font-medium">
                Listen to the word and drag letters to spell it correctly!
              </p>
              <div className="text-lg text-indigo-600 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
            </div>

            {/* Game Area */}
            <div className="relative mb-8">
              {/* Space Background */}
              <div className="relative h-80 bg-gradient-to-b from-indigo-800 via-purple-800 to-indigo-900 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                {/* Stars */}
                <div className="absolute inset-0">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: Math.random() * 3 + 's'
                      }}
                    />
                  ))}
                </div>

                {/* Rocket */}
                <div 
                  className="absolute transition-all duration-1000 ease-out"
                  style={{
                    left: '50%',
                    bottom: `${10 + rocketPosition * 0.6}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="text-6xl">🚀</div>
                  {isLaunching && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-12 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Launch Pad */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-600 rounded-t-full">
                  {selectedLetters.length === currentWord.length && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-yellow-300 font-bold animate-pulse">
                      Ready to Launch!
                    </div>
                  )}
                </div>

                {/* Selected Letters Display */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-white/90 rounded-xl p-4 border-2 border-indigo-300">
                    <div className="text-lg font-bold text-gray-700 mb-2">Your Word:</div>
                    <div className="flex gap-2 justify-center">
                      {selectedLetters.map((letter, index) => (
                        <div
                          key={index}
                          className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold border-2 border-white shadow-lg"
                        >
                          {letter.letter}
                        </div>
                      ))}
                      {[...Array(currentWord.length - selectedLetters.length)].map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="w-16 h-16 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center"
                        >
                          ?
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Success Stars */}
                {showStars && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute text-2xl animate-bounce"
                        style={{
                          left: Math.random() * 100 + '%',
                          top: Math.random() * 100 + '%',
                          animationDelay: Math.random() * 2 + 's'
                        }}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Word Display and Controls */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-6 mb-4">
                <Button
                  onClick={() => speakWord(currentWord)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Volume2 className="mr-2 h-6 w-6" />
                  Listen to Word
                </Button>
                <Button
                  onClick={removeLastLetter}
                  disabled={selectedLetters.length === 0}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove Last Letter
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-2xl font-bold text-gray-700">
                  Spell: <span className="text-indigo-600">{currentWord.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Scrambled Letters */}
            <div className="text-center mb-6">
              <div className="text-lg font-bold text-gray-700 mb-4">Click the letters in order:</div>
              <div className="flex flex-wrap justify-center gap-3">
                {scrambledLetters.map((letter) => (
                  <Button
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    disabled={letter.used}
                    className={`w-16 h-16 text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                      letter.used
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : letter.correct
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600'
                    }`}
                  >
                    {letter.letter}
                  </Button>
                ))}
              </div>
            </div>

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
                  <div className="text-lg text-indigo-600 mt-2">
                    🚀 Rocket launched! Great job!
                  </div>
                )}
              </div>
            )}

            {/* Game Complete */}
            {currentWordIndex >= wordList.length && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Congratulations!</div>
                <div className="text-2xl text-gray-700 mb-4">You launched all the rockets!</div>
                <div className="text-xl text-gray-600 mb-2">Final Score: {score}/5</div>
                <div className="text-lg text-indigo-600 mb-2">
                  🚀 Rocket Master!
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

