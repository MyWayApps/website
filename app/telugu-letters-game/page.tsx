"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { playTeluguTTS } from "@/lib/telugu-tts"

// Telugu letters and their audio file names
const teluguLetters = [
  { letter: "అ", audio: "telugu-a.mp3" },
  { letter: "ఆ", audio: "telugu-aa.mp3" },
  { letter: "ఇ", audio: "telugu-e.mp3" },
  { letter: "ఈ", audio: "telugu-ee.mp3" },
  { letter: "ఉ", audio: "telugu-u.mp3" },
  { letter: "ఊ", audio: "telugu-uu.mp3" },
  //{ letter: "ఋ", audio: "telugu-sequence.mp3" },
  //{ letter: "ౠ", audio: "telugu-sequence.mp3" },
  { letter: "ఎ", audio: "telugu-ae.mp3" },
  { letter: "ఏ", audio: "telugu-aee.mp3" },
  { letter: "ఐ", audio: "telugu-aeee.mp3" },
  { letter: "ఒ", audio: "telugu-o.mp3" },
  { letter: "ఓ", audio: "telugu-oo.mp3" },
  //{ letter: "ఔ", audio: "telugu-sequence.mp3" },
  { letter: "అం", audio: "telugu-am.mp3" },
  { letter: "అః", audio: "telugu-aha.mp3" },
  { letter: "క", audio: "telugu-ka.mp3" },
  { letter: "ఖ", audio: "telugu-kha.mp3" },
  { letter: "గ", audio: "telugu-ga.mp3" },
  { letter: "ఘ", audio: "telugu-gha.mp3" },
  //{ letter: "ఙ", audio: "telugu-sequence.mp3" },
  { letter: "చ", audio: "telugu-cha.mp3" },
  { letter: "ఛ", audio: "telugu-chcha.mp3" },
  { letter: "జ", audio: "telugu-ja.mp3" },
  { letter: "ఝ", audio: "telugu-jha.mp3" },
  //{ letter: "ఞ", audio: "telugu-sequence.mp3" },
  { letter: "ట", audio: "telugu-tta.mp3" },
  { letter: "ఠ", audio: "telugu-ttha.mp3" },
  { letter: "డ", audio: "telugu-dda.mp3" },
  { letter: "ఢ", audio: "telugu-ddha.mp3" },
  //{ letter: "ణ", audio: "telugu-sequence.mp3" },
  { letter: "త", audio: "telugu-ta.mp3" },
  { letter: "థ", audio: "telugu-thha.mp3" },
  { letter: "ద", audio: "telugu-da.mp3" },
  { letter: "ధ", audio: "telugu-dhha.mp3" },
  { letter: "న", audio: "telugu-na.mp3" },
  { letter: "ప", audio: "telugu-pa.mp3" },
  { letter: "ఫ", audio: "telugu-pha.mp3" },
  { letter: "బ", audio: "telugu-ba.mp3" },
  { letter: "భ", audio: "telugu-bha.mp3" },
  { letter: "మ", audio: "telugu-ma.mp3" },
  { letter: "య", audio: "telugu-ya.mp3" },
  { letter: "ర", audio: "telugu-ra.mp3" },
  { letter: "ల", audio: "telugu-la.mp3" },
  { letter: "వ", audio: "telugu-va.mp3" },
  { letter: "శ", audio: "telugu-sha.mp3" },
  { letter: "ష", audio: "telugu-sha.mp3" },
  { letter: "స", audio: "telugu-sa.mp3" },
  { letter: "హ", audio: "telugu-ha.mp3" },
  { letter: "ళ", audio: "telugu-llaa.mp3" },
  { letter: "క్ష", audio: "telugu-ksha.mp3" },
  //{ letter: "ఱ", audio: "telugu-sequence.mp3" }
]

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

function getRandomChoices(correctIndex: number) {
  const indices = [correctIndex]
  while (indices.length < 3) {
    const idx = getRandomInt(teluguLetters.length)
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
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("Good job!")
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const goodJobRef = useRef<HTMLAudioElement | null>(null)
  const buzzRef = useRef<HTMLAudioElement | null>(null)
  const happyTuneRef = useRef<HTMLAudioElement | null>(null)

  // Play letter audio using TTS
  const playLetterAudio = async (letterIdx: number) => {
    if (isPlayingTTS) return
    
    try {
      setIsPlayingTTS(true)
      const textToSpeak = teluguLetters[letterIdx].letter
      await playTeluguTTS(textToSpeak)
    } catch (error) {
      console.error("TTS play failed:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  // Setup new round
  useEffect(() => {
    if (round > 10) {
      setGameOver(true)
      return
    }
    const correct = getRandomInt(teluguLetters.length)
    setCorrectIdx(correct)
    setChoices(getRandomChoices(correct))
    setShowResult(null)
    // Play the audio after a short delay
    setTimeout(() => {
      playLetterAudio(correct)
    }, 400)
  }, [round])

  const handleCardClick = (idx: number) => {
    if (showResult || gameOver) return
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
        <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
          <Star className="h-6 w-6 text-yellow-600" />
          <span className="text-xl font-bold text-amber-800">Score: {score}</span>
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
                    {teluguLetters[letterIdx].letter}
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