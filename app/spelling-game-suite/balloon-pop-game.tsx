"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2, CheckCircle, XCircle } from "lucide-react"
import { speakSpellingWord } from "@/lib/spelling-audio"

interface BalloonPopGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
  onWordComplete?: (word: string) => void
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
const popSoundFreqs = [440, 554.37, 659.25, 783.99] // A4, C#5, E5, G5
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function BalloonPopGame({ wordList, onGameComplete, onBackToGames, onWordComplete }: BalloonPopGameProps) {
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
    void speakSpellingWord(word)
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
    
    // Scatter balloons across a grid of zones (as % of the container, so it
    // stays correct at any container width) with jitter inside each zone —
    // real 2D spread instead of a single row, and no two balloons claim the
    // same zone so they don't stack on top of each other.
    const GRID_COLS = 4
    const GRID_ROWS = 2
    const zones: { xPct: number; yPct: number }[] = []
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        zones.push({
          xPct: ((c + 0.5) / GRID_COLS) * 100,
          yPct: ((r + 0.5) / GRID_ROWS) * 100,
        })
      }
    }
    const shuffledZones = zones.sort(() => Math.random() - 0.5)

    // Create balloons for all letters (word letters + 2 distractors)
    for (let i = 0; i < balloonLetters.length; i++) {
      const letter = shuffledBalloonLetters[i] || ''
      const zone = shuffledZones[i % shuffledZones.length]
      const jitterX = (Math.random() - 0.5) * (100 / GRID_COLS) * 0.5
      const jitterY = (Math.random() - 0.5) * (100 / GRID_ROWS) * 0.5
      newBalloons.push({
        id: i,
        letter: letter,
        x: Math.min(92, Math.max(8, zone.xPct + jitterX)),
        y: Math.min(80, Math.max(10, zone.yPct + jitterY)),
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
      // x/y are % of the container now, so nudge in much smaller steps than
      // the old pixel-based version to keep the bob subtle.
      setBalloons(prevBalloons =>
        prevBalloons.map(balloon => ({
          ...balloon,
          y: balloon.floating ? balloon.y + Math.sin(Date.now() * 0.001 + balloon.id) * 0.08 : balloon.y,
          x: balloon.floating ? balloon.x + Math.cos(Date.now() * 0.0008 + balloon.id) * 0.05 : balloon.x
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

      // Check if word is complete
      if (currentLetterIndex + 1 >= currentWord.length) {
        setScore(score + 1)
        setShowConfetti(true)
        playSound(popSoundFreqs, true)
        onWordComplete?.(currentWord)
        
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
        }, 5000)
      } else {
        setTimeout(() => {
          setShowFeedback(false)
        }, 1000)
      }
    } else {
      // No failure tone here — just show the wrong-letter feedback below.

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

          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            {Array.from({ length: wordList.length }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-purple-800 mb-4 font-sans">
                🎈 Balloon Pop Game
              </h2>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg text-purple-700 font-medium">
                  Listen to the word and click balloons in the correct order to spell it!
                </p>
                <button
                  onClick={() => speakWord(currentWord)}
                  aria-label="Listen to the word"
                  className="text-purple-700 hover:text-purple-900 hover:scale-110 transition-transform"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
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
                    className={`absolute transition-all duration-500 cursor-pointer -translate-x-1/2 ${
                      balloon.popped
                        ? 'opacity-0 scale-0 transform rotate-180'
                        : 'opacity-100 scale-100 hover:scale-110'
                    } ${balloon.floating ? 'animate-bounce' : ''}`}
                    style={{
                      left: `${balloon.x}%`,
                      top: `${balloon.y}%`,
                    }}
                    onClick={() => handleBalloonClick(balloon.id)}
                  >
                    {/* Balloon body — asymmetric radius (fuller top, tapered
                        bottom) reads more like a real balloon than a plain circle */}
                    <div
                      className={`relative w-20 h-24 bg-gradient-to-b ${balloon.color} border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl text-center`}
                      style={{ borderRadius: '50% 50% 50% 50% / 58% 58% 42% 42%' }}
                    >
                      {balloon.letter.toUpperCase()}
                      {/* Sheen highlight */}
                      <div className="absolute top-3 left-4 w-3 h-5 bg-white/40 rounded-full blur-[1px]" />
                    </div>
                    {/* Knot */}
                    <div
                      className="w-2.5 h-2 mx-auto bg-white/90"
                      style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                    />
                    {/* Balloon string */}
                    <div className="w-0.5 h-14 bg-gray-400 mx-auto"></div>
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

