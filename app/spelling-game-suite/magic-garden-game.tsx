"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2, CheckCircle, XCircle } from "lucide-react"

interface MagicGardenGameProps {
  wordList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

interface Flower {
  id: number
  word: string
  x: number
  y: number
  color: string
  bloomed: boolean
  growing: boolean
}

// Flower colors - 5 unique colors for 5 flowers
const FLOWER_COLORS = [
  "from-pink-300 to-rose-500",
  "from-purple-300 to-violet-500", 
  "from-yellow-300 to-orange-500",
  "from-blue-300 to-cyan-500",
  "from-green-300 to-emerald-500"
]

// Sound effect frequencies
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3
const bloomSoundFreqs = [440, 554.37, 659.25, 783.99] // A4, C#5, E5, G5
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function MagicGardenGame({ wordList, onGameComplete, onBackToGames }: MagicGardenGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [showSparkles, setShowSparkles] = useState(false)
  const [colorOffset, setColorOffset] = useState(0) // For rotating flower colors
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
      createFlowers()
      // Auto-play audio when game starts
      setTimeout(() => {
        speakWord(wordList[0])
      }, 500)
    }
  }, [wordList])

  // Create flowers for current word
  const createFlowers = () => {
    const newFlowers: Flower[] = []
    const correctWord = wordList[currentWordIndex]
    
    console.log('Creating flowers for word:', correctWord, 'at index:', currentWordIndex)
    console.log('Full word list:', wordList)
    console.log('Word length:', correctWord.length)
    
    // Create extra words for distraction - use words from the actual word list
    const allAvailableWords = [
      "cat", "dog", "sun", "hat", "car", "cup", "pen", "box", "key", "toy",
      "run", "fun", "big", "red", "hot", "book", "tree", "bird", "fish", "hand",
      "moon", "star", "blue", "pink", "play", "jump", "walk", "talk", "sing",
      "house", "water", "happy", "green", "black", "white", "small", "large", "light", "heavy"
    ]
    
    // Create a pool of all available words of the same length
    const sameLengthWords = allAvailableWords.filter(word => word.length === correctWord.length)
    
    // Remove the correct word from the pool
    const availableExtras = sameLengthWords.filter(word => word !== correctWord)
    
    console.log('Available extra words:', availableExtras)
    
    // Select 4 random extra words
    const selectedExtras = availableExtras
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
    
    console.log('Selected extras:', selectedExtras)
    
    // Create the final word list: correct word + 4 extras = 5 total
    const allWords = [correctWord, ...selectedExtras]
    
    // Shuffle the words so correct word is not always first
    const shuffledWords = allWords.sort(() => Math.random() - 0.5)
    
    console.log('All words before shuffle:', allWords)
    console.log('Final word selection:', shuffledWords)
    
    // Ensure we have exactly 5 words
    if (shuffledWords.length !== 5) {
      console.error('ERROR: Expected 5 words but got', shuffledWords.length, ':', shuffledWords)
    }
    
    // Verify the correct word is in the final selection
    if (!shuffledWords.includes(correctWord)) {
      console.error('ERROR: Correct word', correctWord, 'not found in final selection:', shuffledWords)
    } else {
      console.log('✓ Correct word', correctWord, 'found in final selection')
    }
    
    for (let i = 0; i < allWords.length; i++) {
      newFlowers.push({
        id: i,
        word: shuffledWords[i],
        x: 100 + (i * 160), // Spread 5 flowers evenly across the full width (100, 260, 420, 580, 740)
        y: 120 + (Math.random() * 60), // Keep flowers in the middle area
        color: FLOWER_COLORS[(i + colorOffset) % FLOWER_COLORS.length], // Rotate colors for each word
        bloomed: false,
        growing: true
      })
    }
    
    setFlowers(newFlowers)
  }

  // Animate flowers growing
  useEffect(() => {
    const animate = () => {
      setFlowers(prevFlowers => 
        prevFlowers.map(flower => ({
          ...flower,
          y: flower.growing ? flower.y + Math.sin(Date.now() * 0.0008 + flower.id) * 0.3 : flower.y,
          x: flower.growing ? flower.x + Math.cos(Date.now() * 0.0006 + flower.id) * 0.2 : flower.x
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

  // Handle word submission
  const handleSubmit = () => {
    const correct = userInput.toLowerCase().trim() === currentWord.toLowerCase()
    
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(score + 1)
      playSound(correctSoundFreqs, true)
      setShowSparkles(true)
      
      // Rotate colors for next word
      setColorOffset(prevOffset => (prevOffset + 1) % FLOWER_COLORS.length)
      
      // Bloom all flowers
      setFlowers(prevFlowers => 
        prevFlowers.map(flower => ({ ...flower, bloomed: true, growing: false }))
      )
      
      // Play bloom sound
      setTimeout(() => playSound(bloomSoundFreqs, true), 500)
      
      setTimeout(() => {
        setShowFeedback(false)
        setShowSparkles(false)
        setUserInput("")
        
        if (currentWordIndex < wordList.length - 1) {
          // Move to next word
          const nextWordIndex = currentWordIndex + 1
          const nextWord = wordList[nextWordIndex]
          setCurrentWordIndex(nextWordIndex)
          setCurrentWord(nextWord)
          createFlowers()
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
      playSound(wrongSoundFreqs, false)
      
      // Make flowers wilt slightly
      setFlowers(prevFlowers => 
        prevFlowers.map(flower => ({ ...flower, growing: false }))
      )
      
      setTimeout(() => {
        setShowFeedback(false)
        setUserInput("")
        // Reset flowers to growing
        setFlowers(prevFlowers => 
          prevFlowers.map(flower => ({ ...flower, growing: true }))
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToGames}
            className="bg-white/20 hover:bg-white/30 text-green-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-green-800">Score: {score}/5</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-green-800 mb-4 font-sans">
                🌸 Magic Garden Game
              </h2>
              <p className="text-lg text-green-700 font-medium">
                Listen to the word and type it correctly to make flowers bloom!
              </p>
              <div className="text-lg text-green-600 mt-2">
                Word {currentWordIndex + 1} of {wordList.length}
              </div>
            </div>

            {/* Game Area */}
            <div className="relative mb-8">
              {/* Garden Canvas */}
              <div className="relative h-96 bg-gradient-to-b from-green-200 to-emerald-300 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                {flowers.map((flower) => (
                  <div
                    key={flower.id}
                    className={`absolute transition-all duration-700 cursor-pointer ${
                      flower.bloomed 
                        ? 'opacity-100 scale-110' 
                        : 'opacity-70 scale-90'
                    } ${flower.growing ? 'animate-pulse' : ''}`}
                    style={{
                      left: flower.x,
                      top: flower.y,
                    }}
                    onClick={() => {
                      if (flower.word === currentWord) {
                        setUserInput(flower.word)
                      }
                    }}
                  >
                    <div className="relative">
                      {/* Flower design with petals */}
                      <div className={`w-20 h-20 relative ${flower.growing ? 'animate-pulse' : ''}`}>
                        {flower.bloomed ? (
                          // Bloomed flower with petals
                          <div className="relative">
                            {/* Flower petals */}
                            <div className="absolute inset-0">
                              {/* Petal 1 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-0 top-1 left-1/2 -translate-x-1/2`}></div>
                              {/* Petal 2 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-45 top-1/2 right-1 -translate-y-1/2`}></div>
                              {/* Petal 3 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-90 bottom-1 left-1/2 -translate-x-1/2`}></div>
                              {/* Petal 4 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-135 top-1/2 left-1 -translate-y-1/2`}></div>
                              {/* Petal 5 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-22.5 top-2 right-2`}></div>
                              {/* Petal 6 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-67.5 top-2 left-2`}></div>
                              {/* Petal 7 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-112.5 bottom-2 right-2`}></div>
                              {/* Petal 8 */}
                              <div className={`absolute w-8 h-6 bg-gradient-to-br ${flower.color} rounded-full transform rotate-157.5 bottom-2 left-2`}></div>
                            </div>
                            {/* Flower center */}
                            <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-2 border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                          </div>
                        ) : (
                          // Bud (unbloomed flower) - circle design
                          <div className="relative">
                            <div className={`w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-green-500 mx-auto shadow-lg flex items-center justify-center`}>
                              <div className="w-6 h-6 bg-gradient-to-br from-green-200 to-green-400 rounded-full border border-green-300"></div>
                            </div>
                          </div>
                        )}
                        {/* Stem */}
                        <div className="absolute w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 transform -translate-x-1/2 top-full left-1/2 rounded-full"></div>
                        {/* Word display */}
                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                          <span className="text-sm font-bold text-white bg-black/50 px-2 py-1 rounded-md shadow-lg">{flower.word}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Sparkles effect */}
                {showSparkles && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-300 animate-ping"
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

            {/* Word Display and Input */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <Button
                  onClick={() => speakWord(currentWord)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Volume2 className="mr-2 h-6 w-6" />
                  Listen to Word
                </Button>
              </div>
              
              <div className="text-2xl font-bold text-gray-700 mb-4">
                Type the word you heard (5 flowers, only one has the correct word):
              </div>
              
              <div className="flex justify-center gap-4">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the word here..."
                  className="text-xl text-center border-4 border-green-300 focus:border-green-500 rounded-xl font-bold w-64"
                  disabled={showFeedback}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || showFeedback}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Bloom! 🌸
                </Button>
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
                  {isCorrect ? "🌸 Beautiful!" : "🌱 Try Again!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect
                    ? `Correct! The word is "${currentWord}"`
                    : `The correct word is "${currentWord}"`}
                </div>
                {isCorrect && (
                  <div className="text-lg text-green-600 mt-2">
                    🌸 Flowers bloomed! Wonderful!
                  </div>
                )}
              </div>
            )}

            {/* Game Complete */}
            {currentWordIndex >= wordList.length && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Congratulations!</div>
                <div className="text-2xl text-gray-700 mb-4">Your garden is in full bloom!</div>
                <div className="text-xl text-gray-600 mb-2">Final Score: {score}/5</div>
                <div className="text-lg text-green-600 mb-2">
                  🌸 Magic Garden Master!
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

