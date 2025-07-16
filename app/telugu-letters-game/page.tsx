"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"

// Telugu letters and their audio file names
const teluguLetters = [
  { letter: "అ", audio: "telugu-a.mp3" },
  { letter: "ఆ", audio: "telugu-aa.mp3" },
  { letter: "ఇ", audio: "telugu-i.mp3" },
  { letter: "ఈ", audio: "telugu-ii.mp3" },
  { letter: "ఉ", audio: "telugu-u.mp3" },
  { letter: "ఊ", audio: "telugu-uu.mp3" },
  { letter: "ఋ", audio: "telugu-ru.mp3" },
  { letter: "ఎ", audio: "telugu-e.mp3" },
  { letter: "ఏ", audio: "telugu-ee.mp3" },
  { letter: "ఐ", audio: "telugu-ai.mp3" },
  { letter: "ఒ", audio: "telugu-o.mp3" },
  { letter: "ఓ", audio: "telugu-oo.mp3" },
  { letter: "ఔ", audio: "telugu-au.mp3" },
  // ...add more as needed
]

const GOOD_JOB_AUDIO = "/audio/good-job.mp3" // Place a "good job" mp3 in public/audio/

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
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const goodJobRef = useRef<HTMLAudioElement | null>(null)

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
      audioRef.current?.play()
    }, 400)
  }, [round])

  const handleCardClick = (idx: number) => {
    if (showResult || gameOver) return
    if (choices[idx] === correctIdx) {
      setShowResult("correct")
      setScore((s) => s + 1)
      goodJobRef.current?.play()
      setTimeout(() => setRound((r) => r + 1), 1200)
    } else {
      setShowResult("wrong")
      setTimeout(() => setShowResult(null), 900)
    }
  }

  const handleReplayAudio = () => {
    audioRef.current?.play()
  }

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const handleRestart = () => {
    setScore(0)
    setRound(1)
    setGameOver(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-300 to-green-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full max-w-lg">
        <div />
        <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
          <Star className="h-6 w-6 text-yellow-600" />
          <span className="text-xl font-bold text-indigo-800">Score: {score}</span>
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={`/audio/${teluguLetters[correctIdx].audio}`}
        preload="auto"
      />
      <audio ref={goodJobRef} src={GOOD_JOB_AUDIO} preload="auto" />

      <Card className="w-full max-w-lg min-h-[320px] flex flex-col items-center justify-center shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center h-full w-full">
          {gameOver ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-3xl font-bold text-green-800 mb-4">Game Over!</div>
              <div className="text-2xl text-indigo-900 mb-2">Your Score: {score} / 10</div>
              <Button onClick={handleRestart} className="mt-4" variant="outline">
                Play Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col items-center">
                <div className="text-lg text-indigo-900 font-semibold mb-2">
                  Round {round} of 10
                </div>
                <Button
                  onClick={handleReplayAudio}
                  className="bg-white/30 hover:bg-white/40 text-indigo-800 border-white font-bold text-lg px-4 py-2"
                  variant="outline"
                >
                  🔊 Hear the Letter
                </Button>
              </div>
              <div className="flex flex-row gap-8 mt-2">
                {choices.map((letterIdx, idx) => (
                  <Card
                    key={idx}
                    className={`w-28 h-36 flex items-center justify-center text-6xl font-bold cursor-pointer transition-all duration-200 ${
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
                <div className="mt-4 text-green-700 font-bold text-xl">Good job!</div>
              )}
              {showResult === "wrong" && (
                <div className="mt-4 text-red-700 font-bold text-xl">Try again!</div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}