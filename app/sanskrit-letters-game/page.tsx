"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import { transliterateToKannada } from "@/lib/sanskrit-tts"
import { getLettersByType, getLetterTypeLabel, LetterType, SanskritLetter } from "@/lib/sanskrit-letters-data"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { pickUnseenRandom } from "@/lib/question-history"

const ROUND_LENGTH = 10

const successMessages = [
  "Good job!", "Excellent!", "Amazing work!", "Fantastic!", "Outstanding!",
  "Brilliant!", "Perfect!", "Wonderful!", "Great job!", "Superb!",
]

function randomChoiceIndices(correctIndex: number, total: number): number[] {
  const indices = [correctIndex]
  while (indices.length < Math.min(3, total)) {
    const idx = Math.floor(Math.random() * total)
    if (!indices.includes(idx)) indices.push(idx)
  }
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

export default function SanskritLettersGame() {
  const searchParams = useSearchParams()
  const letterType = (searchParams.get("type") as LetterType) || "vowels"
  const { speak, isSpeaking } = useTTS()

  const [letters, setLetters] = useState<SanskritLetter[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("Good job!")
  const [isReady, setIsReady] = useState(false)

  const typeLabel = getLetterTypeLabel(letterType)

  useEffect(() => {
    setLetters(getLettersByType(letterType))
    setIsReady(true)
  }, [letterType])

  const playLetterAudio = (letterIdx: number) => {
    if (letters.length === 0) return
    speak(transliterateToKannada(letters[letterIdx].letter), "kn")
  }

  useEffect(() => {
    if (!isReady || letters.length === 0) return
    if (round > ROUND_LENGTH) {
      setGameOver(true)
      return
    }
    const correct = pickUnseenRandom(`sanskrit-letters-game:${letterType}`, 0, letters.length - 1)
    setCorrectIdx(correct)
    setChoices(randomChoiceIndices(correct, letters.length))
    setShowResult(null)
    const timer = setTimeout(() => playLetterAudio(correct), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, isReady, letters])

  const handleCardClick = (idx: number) => {
    if (showResult || gameOver || letters.length === 0) return
    if (choices[idx] === correctIdx) {
      setShowResult("correct")
      setScore((s) => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      playCorrectSound()
      setCurrentMessage(successMessages[Math.floor(Math.random() * successMessages.length)])
      setTimeout(() => setRound((r) => r + 1), 1800)
    } else {
      setShowResult("wrong")
      playWrongSound()
      setTimeout(() => setShowResult(null), 1400)
    }
  }

  const handleReplayAudio = () => playLetterAudio(correctIdx)
  const handleBackToHome = () => {
    window.location.href = "/sanskrit-letters"
  }
  const handleRestart = () => {
    setScore(0)
    setRound(1)
    setGameOver(false)
  }

  if (!isReady || letters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute bottom-0 right-0 text-[16rem] leading-none opacity-10 pointer-events-none select-none z-0">
        ॐ
      </div>

      <div className="w-full max-w-[800px] flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Sanskrit Letters
        </Button>
        <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
          <span className="text-white font-bold">{typeLabel.native}</span>
          {Array.from({ length: ROUND_LENGTH }, (_, i) => (
            <Star key={i} className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
          ))}
        </div>
      </div>

      <div className="text-center mb-6 relative z-10">
        <h1 className="text-4xl font-bold text-white drop-shadow">Tap the letter</h1>
      </div>

      <Card className="w-full max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 relative z-10">
        <CardContent className="p-8">
          {gameOver ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-3xl font-bold text-green-800 mb-4">Game Over!</div>
              <div className="text-2xl text-amber-900 mb-2">Your Score: {score} / {ROUND_LENGTH}</div>
              <Button onClick={handleRestart} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3" variant="outline">
                Play Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center">
                <div className="text-xl text-amber-900 font-semibold mb-3">
                  Question {round} of {ROUND_LENGTH}
                </div>
                <Button
                  onClick={handleReplayAudio}
                  disabled={isSpeaking}
                  className="bg-white/30 hover:bg-white/40 text-amber-800 border-white font-bold text-lg px-6 py-3"
                  variant="outline"
                >
                  🔊 Hear the Letter
                </Button>
              </div>
              <div className="flex flex-row gap-6 mt-4 justify-center flex-wrap">
                {choices.map((letterIdx, idx) => (
                  <Card
                    key={idx}
                    className={`w-36 h-44 flex items-center justify-center text-7xl font-bold cursor-pointer transition-all duration-200 ${
                      showResult && choices[idx] === correctIdx && showResult === "correct"
                        ? "bg-green-200 border-green-500 scale-110"
                        : showResult && idx === choices.findIndex((i) => i === correctIdx) && showResult === "wrong"
                          ? "bg-red-200 border-red-500"
                          : "bg-white/80 hover:bg-amber-100"
                    }`}
                    onClick={() => handleCardClick(idx)}
                  >
                    {letters[letterIdx].letter}
                  </Card>
                ))}
              </div>
              {showResult === "correct" && (
                <div className="mt-4 text-green-700 font-bold text-xl animate-bounce text-center">{currentMessage}</div>
              )}
              {showResult === "wrong" && <div className="mt-4 text-red-700 font-bold text-xl text-center">Try again!</div>}
            </>
          )}
        </CardContent>
      </Card>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <div className="w-3 h-3 bg-orange-400 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
