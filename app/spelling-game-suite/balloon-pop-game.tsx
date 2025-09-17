"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2, CheckCircle, XCircle } from "lucide-react"

interface BalloonPopGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

interface Balloon {
  id: number
  letter: string
  x: number
  y: number
  color: string
  popped: boolean
  floating: boolean
  order: number
}

// Balloon colors
const BALLOON_COLORS = [
  "from-pink-300 to-rose-500",
  "from-blue-300 to-cyan-500", 
  "from-yellow-300 to-orange-500",
  "from-green-300 to-emerald-500",
  "from-purple-300 to-violet-500"
]

// Sound effect frequencies
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3
const popSoundFreqs = [440, 554.37, 659.25, 783.99] // A4, C#5, E5, G5
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function BalloonPopGame({ wordList, onGameComplete, onBackToGames }: BalloonPopGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [poppedLetters, setPoppedLetters] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
      setCurrentLetterIndex(0)
      setPoppedLetters([])
      createBalloons()
      // Auto-play audio when game starts
      setTimeout(() => {
        speakWord(wordList[0])
      }, 500)
    }
  }, [wordList])

  // Recreate balloons when currentWord changes
  useEffect(() => {
    if (currentWord && wordList.length > 0) {
      createBalloons(currentWord)
    }
  }, [currentWord])

  // Create balloons for current word
  const createBalloons = (wordToUse?: string) => {
    const newBalloons: Balloon[] = []
    const word = wordToUse || wordList[currentWordIndex]
    const letters = word.split('').map(l => l.toUpperCase())
    
    // Create distractor letters (letters not in the word)
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const distractorLetters = allLetters.filter(letter => 
      !letters.includes(letter)
    )
    
    // Shuffle distractor letters and pick 2
    const shuffledDistractors = distractorLetters.sort(() => Math.random() - 0.5)
    const selectedDistractors = shuffledDistractors.slice(0, 2)
    
    // Create balloons: ALL word letters + 2 distractor letters
    // For 3-letter words: 3 word letters + 2 distractors = 5 balloons
    // For 4-letter words: 4 word letters + 2 distractors = 6 balloons
    // For 5-letter words: 5 word letters + 2 distractors = 7 balloons
    const balloonLetters = [...letters, ...selectedDistractors]
    
    // Shuffle the balloon letters
    const shuffledBalloonLetters = balloonLetters.sort(() => Math.random() - 0.5)
    
    // Create balloons for all letters (word letters + 2 distractors)
    for (let i = 0; i < balloonLetters.length; i++) {
      const letter = shuffledBalloonLetters[i] || ''
      newBalloons.push({
        id: i,
        letter: letter,
        x: (i * 80) + 200, // Spread balloons with 80px spacing, starting from 200px
        y: 120 + (Math.random() * 60), // Keep in visible middle area (120-180px)
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        popped: false,
        floating: true,
        order: i
      })
    }
    
    setBalloons(newBalloons)
  }

  // Animate balloons floating
  useEffect(() => {
    const animate = () => {
      setBalloons(prevBalloons => 
        prevBalloons.map(balloon => ({
          ...balloon,
          y: balloon.floating ? balloon.y + Math.sin(Date.now() * 0.001 + balloon.id) * 0.5 : balloon.y,
          x: balloon.floating ? balloon.x + Math.cos(Date.now() * 0.0008 + balloon.id) * 0.3 : balloon.x
        }))
      )
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Handle balloon click
  const handleBalloonClick = (balloonId: number) => {
    const balloon = balloons.find(b => b.id === balloonId)
    if (!balloon || balloon.popped) return
    
    const correctLetter = currentWord[currentLetterIndex]
    const isCorrect = balloon.letter.toLowerCase() === correctLetter.toLowerCase()
    
    setIsCorrect(isCorrect)
    setShowFeedback(true)
    
    if (isCorrect) {
      // Pop the correct balloon
      setBalloons(prevBalloons => 
        prevBalloons.map(b => 
          b.id === balloonId ? { ...b, popped: true, floating: false } : b
        )
      )
      
      setPoppedLetters([...poppedLetters, balloon.letter])
      setCurrentLetterIndex(currentLetterIndex + 1)
      playSound(correctSoundFreqs, true)
      
      // Check if word is complete
      if (currentLetterIndex + 1 >= currentWord.length) {
        setScore(score + 1)
        setShowConfetti(true)
        playSound(popSoundFreqs, true)
        
        setTimeout(() => {
          setShowFeedback(false)
          setShowConfetti(false)
          setCurrentLetterIndex(0)
          setPoppedLetters([])
          
          if (currentWordIndex < wordList.length - 1) {
            // Move to next word
            const nextWordIndex = currentWordIndex + 1
            const nextWord = wordList[nextWordIndex]
            setCurrentWordIndex(nextWordIndex)
            setCurrentWord(nextWord)
            // Auto-play audio for next word
            setTimeout(() => {
              speakWord(nextWord)
            }, 1000)
          } else {
            // Game completed
            handleGameComplete()
          }
        }, 2000)
      } else {
        setTimeout(() => {
          setShowFeedback(false)
        }, 1000)
      }
    } else {
      playSound(wrongSoundFreqs, false)
      
      // Make balloons shake
      setBalloons(prevBalloons => 
        prevBalloons.map(b => ({ ...b, floating: false }))
      )
      
      setTimeout(() => {
        setShowFeedback(false)
        // Reset balloons to floating
        setBalloons(prevBalloons => 
          prevBalloons.map(b => ({ ...b, floating: true }))
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-rose-500 p-4">
      <div className="max-w-6xl mx-auto">
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

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-purple-800">Score: {score}/5</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-purple-800 mb-4 font-sans">
                🎈 Balloon Pop Game
              </h2>
              <p className="text-lg text-purple-700 font-medium">
                Listen to the word and click balloons in the correct order to spell it!
              </p>
              <div className="text-lg text-purple-600 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
              
              {/* Word Progress Indicator */}
              <div className="mt-4 flex justify-center gap-2">
                {wordList.map((word, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                      index < currentWordIndex
                        ? 'bg-green-500 text-white border-green-600'
                        : index === currentWordIndex
                        ? 'bg-yellow-400 text-black border-yellow-500'
                        : 'bg-gray-200 text-gray-500 border-gray-300'
                    }`}
                  >
                    {index < currentWordIndex ? '✓' : index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Area */}
            <div className="relative mb-8">
              {/* Balloons Canvas */}
              <div className="relative h-96 bg-gradient-to-b from-sky-200 to-blue-300 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                {balloons.map((balloon) => (
                  <div
                    key={balloon.id}
                    className={`absolute transition-all duration-500 cursor-pointer ${
                      balloon.popped 
                        ? 'opacity-0 scale-0 transform rotate-180' 
                        : 'opacity-100 scale-100 hover:scale-110'
                    } ${balloon.floating ? 'animate-bounce' : ''}`}
                    style={{
                      left: balloon.x,
                      top: balloon.y,
                      transform: balloon.floating ? 'none' : 'translateX(10px) translateY(10px)'
                    }}
                    onClick={() => handleBalloonClick(balloon.id)}
                  >
                    <div className={`w-20 h-24 rounded-full bg-gradient-to-b ${balloon.color} border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl text-center`}>
                      {balloon.letter.toUpperCase()}
                    </div>
                    {/* Balloon string */}
                    <div className="w-0.5 h-16 bg-gray-400 mx-auto"></div>
                  </div>
                ))}
                
                {/* Confetti effect */}
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 animate-ping"
                        style={{
                          left: Math.random() * 100 + '%',
                          top: Math.random() * 100 + '%',
                          animationDelay: Math.random() * 2 + 's'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Word Display */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <Button
                  onClick={() => speakWord(currentWord)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Volume2 className="mr-2 h-6 w-6" />
                  Listen to Word
                </Button>
              </div>
              
              <div className="text-2xl font-bold text-gray-700 mb-4">
                Click balloons in the correct order to spell: <span className="text-purple-600">{currentWord.toUpperCase()}</span>
              </div>
              
              {/* Progress indicator */}
              <div className="flex justify-center gap-2 mb-4">
                {currentWord.split('').map((letter, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                      index < currentLetterIndex
                        ? 'bg-green-500 text-white border-green-600'
                        : index === currentLetterIndex
                        ? 'bg-yellow-400 text-black border-yellow-500'
                        : 'bg-gray-200 text-gray-500 border-gray-300'
                    }`}
                  >
                    {index < currentLetterIndex ? '✓' : letter.toUpperCase()}
                  </div>
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
                  {isCorrect ? "🎉 Great!" : "🤔 Try Again!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `Correct letter! Now find the next one.`
                    : `That's not the right letter. Look for "${currentWord[currentLetterIndex].toUpperCase()}"`}
                </div>
                {isCorrect && (
                  <div className="text-lg text-green-600 mt-2">
                    🎈 Balloon popped! Keep going!
                  </div>
                )}
              </div>
            )}

            {/* Game Complete */}
            {currentWordIndex >= wordList.length && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Congratulations!</div>
                <div className="text-2xl text-gray-700 mb-4">You popped all the balloons!</div>
                <div className="text-xl text-gray-600 mb-2">Final Score: {score}/5</div>
                <div className="text-lg text-purple-600 mb-2">
                  🎈 Balloon Pop Master!
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

