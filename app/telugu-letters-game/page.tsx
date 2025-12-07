"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { getLettersByType, getLetterTypeLabel, LetterType, TeluguLetterWithWord } from "@/lib/telugu-letters-data"

const GOOD_JOB_AUDIO = "/audio/happy_tune.mp3"
const BUZZ_AUDIO = "/audio/buzz_audio.mp3"
const HAPPY_TUNE_AUDIO = "/audio/happy_tune.mp3" 

// Success messages array
const successMessages = [
  "Good job!",
  "Excellent!",
  "Amazing work!",
  "Fantastic!",
  "Outstanding!",
  "Brilliant!",
  "Perfect!",
  "Wonderful!",
  "Great job!",
  "Superb!",
  "Terrific!",
  "Awesome!",
  "Incredible!",
  "Magnificent!",
  "Splendid!"
]

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

function getRandomChoices(correctIndex: number, totalLetters: number) {
  const indices = [correctIndex]
  while (indices.length < 3) {
    const idx = getRandomInt(totalLetters)
    if (!indices.includes(idx)) indices.push(idx)
  }
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

export default function TeluguLettersGame() {
  const searchParams = useSearchParams()
  const letterType = (searchParams.get("type") as LetterType) || "vowels"
  
  const [letters, setLetters] = useState<TeluguLetterWithWord[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("Good job!")
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const goodJobRef = useRef<HTMLAudioElement | null>(null)
  const buzzRef = useRef<HTMLAudioElement | null>(null)
  const happyTuneRef = useRef<HTMLAudioElement | null>(null)

  const typeLabel = getLetterTypeLabel(letterType)

  // Initialize letters based on type
  useEffect(() => {
    const letterData = getLettersByType(letterType)
    setLetters(letterData)
    setIsReady(true)
  }, [letterType])

  // Play letter audio using TTS
  const playLetterAudio = async (letterIdx: number) => {
    if (isPlayingTTS || letters.length === 0) return
    
    try {
      setIsPlayingTTS(true)
      const textToSpeak = letters[letterIdx].letter
      await playTeluguTTS(textToSpeak)
    } catch (error) {
      console.error("TTS play failed:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  // Setup new round
  useEffect(() => {
    if (!isReady || letters.length === 0) return
    
    if (round > 10) {
      setGameOver(true)
      return
    }
    const correct = getRandomInt(letters.length)
    setCorrectIdx(correct)
    setChoices(getRandomChoices(correct, letters.length))
    setShowResult(null)
    // Play the audio after a short delay
    setTimeout(() => {
      playLetterAudio(correct)
    }, 400)
  }, [round, isReady, letters])

  const handleCardClick = (idx: number) => {
    if (showResult || gameOver || letters.length === 0) return
    if (choices[idx] === correctIdx) {
      setShowResult("correct")
      setScore((s) => s + 1)
      
      // Show confetti
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      
      // Play happy tune and good job audio
      console.log("Playing success audio...")
      if (happyTuneRef.current) {
        happyTuneRef.current.currentTime = 0
        happyTuneRef.current.play().catch(e => console.error("Happy tune play failed:", e))
      }
      if (goodJobRef.current) {
        goodJobRef.current.currentTime = 0
        goodJobRef.current.play().catch(e => console.error("Good job audio play failed:", e))
      }
      
      // Set random success message
      setCurrentMessage(successMessages[Math.floor(Math.random() * successMessages.length)])
      
      setTimeout(() => setRound((r) => r + 1), 2500)
    } else {
      setShowResult("wrong")
      console.log("Playing wrong answer audio...")
      if (buzzRef.current) {
        buzzRef.current.currentTime = 0
        buzzRef.current.play().catch(e => console.error("Buzz audio play failed:", e))
      }
      setTimeout(() => setShowResult(null), 1500)
    }
  }

  const handleReplayAudio = () => {
    playLetterAudio(correctIdx)
  }


  const handleBackToHome = () => {
    window.location.href = "/telugu-letters"
  }

  const handleRestart = () => {
    setScore(0)
    setRound(1)
    setGameOver(false)
  }

  if (!isReady || letters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-amber-400 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-amber-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-amber-400 p-4 flex flex-col items-center justify-center">
      {/* Header with Back to Home Button and Score - Aligned with card */}
      <div className="w-1/2 min-w-[500px] max-w-[800px] flex items-center justify-between mb-6">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-amber-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Telugu Letters
        </Button>
        <div className="flex items-center gap-4">
          <div className="bg-white/30 px-4 py-2 rounded-full">
            <span className="text-amber-800 font-bold">{typeLabel.telugu}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-amber-800">Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-amber-900">
          Tap the letter
        </h1>
      </div>
      
      <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
          {gameOver ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-3xl font-bold text-green-800 mb-4">Game Over!</div>
              <div className="text-2xl text-amber-900 mb-2">Your Score: {score} / 10</div>
              <Button onClick={handleRestart} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3" variant="outline">
                Play Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center">
                <div className="text-xl text-amber-900 font-semibold mb-3">
                  Question {round} of 10
                </div>
                <Button
                  onClick={handleReplayAudio}
                  className="bg-white/30 hover:bg-white/40 text-amber-800 border-white font-bold text-lg px-6 py-3"
                  variant="outline"
                >
                  🔊 Hear the Letter
                </Button>
              </div>
              <div className="flex flex-row gap-6 mt-4 justify-center">
                {choices.map((letterIdx, idx) => (
                  <Card
                    key={idx}
                    className={`w-36 h-44 flex items-center justify-center text-7xl font-bold cursor-pointer transition-all duration-200 ${
                      showResult && choices[idx] === correctIdx && showResult === "correct"
                        ? "bg-green-200 border-green-500 scale-110"
                        : showResult && idx === choices.findIndex(i => i === correctIdx) && showResult === "wrong"
                        ? "bg-red-200 border-red-500"
                        : "bg-white/80 hover:bg-yellow-100"
                    }`}
                    onClick={() => handleCardClick(idx)}
                  >
                    {letters[letterIdx].letter}
                  </Card>
                ))}
              </div>
              {showResult === "correct" && (
                <div className="mt-4 text-green-700 font-bold text-xl animate-bounce">
                  {currentMessage}
                </div>
              )}
              {showResult === "wrong" && (
                <div className="mt-4 text-red-700 font-bold text-xl">Try again!</div>
              )}
            </>
          )}
          </CardContent>
        </Card>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="w-2 h-2 bg-red-400 transform rotate-45"></div>
            </div>
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="w-4 h-4 bg-pink-400 transform rotate-45"></div>
            </div>
          ))}
        </div>
      )}

      <audio 
        ref={goodJobRef} 
        src={GOOD_JOB_AUDIO} 
        preload="auto"
        onError={(e) => console.error("Good job audio error:", e)}
        onLoadStart={() => console.log("Good job audio loading...")}
        onCanPlay={() => console.log("Good job audio can play")}
      />
      <audio 
        ref={buzzRef} 
        src={BUZZ_AUDIO} 
        preload="auto"
        onError={(e) => console.error("Buzz audio error:", e)}
        onLoadStart={() => console.log("Buzz audio loading...")}
        onCanPlay={() => console.log("Buzz audio can play")}
      />
      <audio 
        ref={happyTuneRef} 
        src={HAPPY_TUNE_AUDIO} 
        preload="auto"
        onError={(e) => console.error("Happy tune audio error:", e)}
        onLoadStart={() => console.log("Happy tune audio loading...")}
        onCanPlay={() => console.log("Happy tune audio can play")}
      />
    </div>
  )
}
