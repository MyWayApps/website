"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { playTeluguTTS } from "@/lib/telugu-tts"

// Matra sequence for all consonants
const matraSequence = [
  "", "ా", "ి", "ీ", "ు", "ూ", "ృ", "ౄ", "ె", "ే", "ై", "ొ", "ో", "ౌ", "ం", "ః"
]

const matraNames = [
  "అ కారము", "ఆ కారము", "ఇ కారము", "ఈ కారము", "ఉ కారము", "ఊ కారము", 
  "ఋ కారము", "ౠ కారము", "ఎ కారము", "ఏ కారము", "ఐ కారము", "ఒ కారము", 
  "ఓ కారము", "ఔ కారము", "పూర్ణాను స్వారము", "విసర్గం"
]

export default function SequenceGame() {
  const params = useParams()
  const consonant = decodeURIComponent(params.consonant as string)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [slots, setSlots] = useState<(string | null)[]>([])
  const [options, setOptions] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [showBalloons, setShowBalloons] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const goodJobRef = useRef<HTMLAudioElement | null>(null)
  const buzzerRef = useRef<HTMLAudioElement | null>(null)

  // Generate 5 random questions
  const generateQuestions = () => {
    const questions = []
    const totalMatras = matraSequence.length
    
    for (let i = 0; i < 5; i++) {
      const startIndex = Math.floor(Math.random() * (totalMatras - 5))
      const questionSequence = matraSequence.slice(startIndex, startIndex + 6)
      const correctAnswers = questionSequence.map(mat => consonant + mat)
      
      // Create options (correct answers + 2 random wrong ones)
      const wrongOptions: string[] = []
      while (wrongOptions.length < 2) {
        const randomIndex = Math.floor(Math.random() * totalMatras)
        const wrongMat = matraSequence[randomIndex]
        const wrongAnswer = consonant + wrongMat
        if (!correctAnswers.includes(wrongAnswer) && !wrongOptions.includes(wrongAnswer)) {
          wrongOptions.push(wrongAnswer)
        }
      }
      
      const allOptions = [...correctAnswers, ...wrongOptions]
      // Shuffle options
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5)
      
      questions.push({
        sequence: questionSequence,
        correctAnswers,
        options: shuffledOptions,
        firstLetter: consonant + questionSequence[0]
      })
    }
    
    return questions
  }

  const [questions] = useState(() => generateQuestions())
  const currentQ = questions[currentQuestion]

  // Initialize current question
  useEffect(() => {
    if (currentQ) {
      const initialSlots = new Array(6).fill(null)
      initialSlots[0] = currentQ.firstLetter // Place first letter in first position
      setSlots(initialSlots)
      
      // Remove first letter from options
      const remainingOptions = currentQ.options.filter(opt => opt !== currentQ.firstLetter)
      setOptions(remainingOptions)
      
      setIsCompleted(false)
      setShowResult(null)
      
      // Play TTS for the first letter when question loads
      setTimeout(() => {
        playTeluguTTS(currentQ.firstLetter).catch(err => {
          console.error("TTS failed:", err)
        })
      }, 500)
    }
  }, [currentQ])

  // Play audio
  const playAudio = (audioFile: string) => {
    if (audioRef.current) {
      audioRef.current.src = `/audio/${audioFile}`
      audioRef.current.play().catch(e => console.error("Audio play failed:", e))
    }
  }

  const playGoodJob = () => {
    if (goodJobRef.current) {
      goodJobRef.current.play().catch(e => console.error("Good job audio failed:", e))
    }
  }

  const playBuzzer = () => {
    if (buzzerRef.current) {
      buzzerRef.current.play().catch(e => console.error("Buzzer audio failed:", e))
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault()
    
    if (draggedItem && !slots[slotIndex]) {
      const newSlots = [...slots]
      newSlots[slotIndex] = draggedItem
      setSlots(newSlots)
      
      const newOptions = options.filter(opt => opt !== draggedItem)
      setOptions(newOptions)
      
      setDraggedItem(null)
      
      // Check if the placed letter is correct for this position
      const correctLetter = currentQ.correctAnswers[slotIndex]
      if (draggedItem === correctLetter) {
        // Correct placement - continue
        const filledSlots = newSlots.filter(slot => slot !== null).length
        if (filledSlots === 6) {
          // All slots filled - check complete answer
          checkAnswer(newSlots)
        }
      } else {
        // Wrong placement - immediate feedback
        setShowResult("wrong")
        playBuzzer()
        setTimeout(() => {
          setShowResult(null)
          // Reset the question with first letter in place
          const resetSlots = new Array(6).fill(null)
          resetSlots[0] = currentQ.firstLetter
          setSlots(resetSlots)
          setOptions([...currentQ.options].filter(opt => opt !== currentQ.firstLetter))
        }, 1500)
      }
    }
  }

  // Check answer
  const checkAnswer = (filledSlots: (string | null)[]) => {
    const userAnswer = filledSlots.join("")
    const correctAnswer = currentQ.correctAnswers.join("")
    
    if (userAnswer === correctAnswer) {
      setShowResult("correct")
      setScore(score + 1)
      setShowBalloons(true)
      playGoodJob()
      setTimeout(() => {
        setShowBalloons(false)
        if (currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          setGameOver(true)
        }
      }, 2000)
    } else {
      setShowResult("wrong")
      playBuzzer()
      setTimeout(() => {
        setShowResult(null)
        // Reset the question
        setSlots(new Array(6).fill(null))
        setOptions([...currentQ.options])
      }, 2000)
    }
  }

  // Handle back to sequence main
  const handleBackToSequence = () => {
    window.location.href = "/telugu-gunintaalu/sequence"
  }

  // Handle restart
  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setShowResult(null)
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
        <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-indigo-800 mb-4">Game Over!</h1>
            <p className="text-2xl text-indigo-600 mb-6">Your Score: {score} / 5</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 border-2 border-indigo-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={handleBackToSequence}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToSequence}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Selection
        </Button>
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">
          {consonant} గుణింతము
        </h1>
        <p className="text-xl text-indigo-700">
          Question {currentQuestion + 1} of 5 | Score: {score}
        </p>
      </div>

      {/* Game Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Instructions */}
            <p className="text-lg text-indigo-700 mb-6">
              Drag and drop the letters in the correct order
            </p>

            {/* Slots Row */}
            <div className="flex justify-center gap-4 mb-8">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center text-2xl font-bold ${
                    slot ? 'bg-indigo-100 border-indigo-500' : 'bg-white'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {slot}
                </div>
              ))}
            </div>

            {/* Options Row */}
            <div className="flex justify-center gap-4 mb-6">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-yellow-100 border-2 border-yellow-400 rounded-lg flex items-center justify-center text-2xl font-bold cursor-move hover:bg-yellow-200 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, option)}
                >
                  {option}
                </div>
              ))}
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="mb-6">
                {showResult === "correct" ? (
                  <div className="flex items-center justify-center text-green-600 text-2xl font-bold">
                    <CheckCircle className="mr-2 h-8 w-8" />
                    Correct! Good Job!
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-red-600 text-2xl font-bold">
                    <XCircle className="mr-2 h-8 w-8" />
                    Wrong! Try Again!
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Balloon Animation */}
      {showBalloons && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div 
                className="w-8 h-10 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 7)],
                  clipPath: 'polygon(50% 0%, 80% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 20% 20%)'
                }}
              ></div>
            </div>
          ))}
          {[...Array(15)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div 
                className="w-6 h-6 text-pink-400"
                style={{
                  transform: 'rotate(45deg)',
                  backgroundColor: '#ff6b6b',
                  clipPath: 'polygon(50% 0%, 80% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 20% 20%)'
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={audioRef} preload="auto" />
      <audio ref={goodJobRef} src="/audio/happy_tune.mp3" preload="auto" />
      <audio ref={buzzerRef} src="/audio/buzz_audio.mp3" preload="auto" />
    </div>
  )
}
