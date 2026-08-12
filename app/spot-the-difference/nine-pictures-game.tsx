"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Timer } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { EMOJI_POOL } from "@/lib/spot-the-difference-data"

interface NinePicturesGameProps {
  onBackToModes: () => void
}

interface NineRound {
  gridA: string[]
  gridB: string[]
  gridASizes: string[]
  gridBSizes: string[]
  diffIndex: number
}

const ROUND_COUNT = 3
const ROUND_TIME_SECONDS = 10

// Purely decorative — the same picture can render at any of these sizes on
// either board, so size alone is never a reliable signal for which one differs.
const SIZE_CLASSES = ["text-4xl", "text-5xl", "text-6xl", "text-7xl"]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomSizes(): string[] {
  return Array.from({ length: 9 }, () => SIZE_CLASSES[Math.floor(Math.random() * SIZE_CLASSES.length)])
}

function generateRound(): NineRound {
  const shuffled = shuffle(EMOJI_POOL)
  const gridA = shuffled.slice(0, 9)
  const unused = shuffled.slice(9)
  const diffIndex = Math.floor(Math.random() * 9)
  const replacement = unused[Math.floor(Math.random() * unused.length)]
  const gridB = [...gridA]
  gridB[diffIndex] = replacement
  return { gridA, gridB, diffIndex, gridASizes: randomSizes(), gridBSizes: randomSizes() }
}

function generateRounds(): NineRound[] {
  return Array.from({ length: ROUND_COUNT }, () => generateRound())
}

export default function NinePicturesGame({ onBackToModes }: NinePicturesGameProps) {
  const [rounds, setRounds] = useState<NineRound[]>(() => generateRounds())
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [found, setFound] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [wrongCell, setWrongCell] = useState<{ grid: "A" | "B"; index: number } | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS)

  const round = rounds[roundIndex]

  // Reset the clock at the start of every round.
  useEffect(() => {
    setTimeLeft(ROUND_TIME_SECONDS)
  }, [roundIndex])

  // Tick the clock while the round is still live.
  useEffect(() => {
    if (found || timedOut || sessionComplete) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      playWrongSound()
      setTimeout(() => {
        setTimedOut(false)
        if (roundIndex < ROUND_COUNT - 1) {
          setRoundIndex((i) => i + 1)
        } else {
          setSessionComplete(true)
        }
      }, 1800)
      return
    }
    const tick = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(tick)
  }, [timeLeft, found, timedOut, sessionComplete, roundIndex])

  const handlePlayAgain = () => {
    setRounds(generateRounds())
    setRoundIndex(0)
    setScore(0)
    setFound(false)
    setTimedOut(false)
    setWrongCell(null)
    setShowConfetti(false)
    setSessionComplete(false)
    setTimeLeft(ROUND_TIME_SECONDS)
  }

  const handleClick = (grid: "A" | "B", index: number) => {
    if (found || timedOut) return

    if (index === round.diffIndex) {
      setFound(true)
      setScore((s) => s + 1)
      setShowConfetti(true)
      playCorrectSound()

      setTimeout(() => {
        setShowConfetti(false)
        setFound(false)
        if (roundIndex < ROUND_COUNT - 1) {
          setRoundIndex((i) => i + 1)
        } else {
          setSessionComplete(true)
        }
      }, 1200)
    } else {
      playWrongSound()
      setWrongCell({ grid, index })
      setTimeout(() => setWrongCell(null), 400)
    }
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-400 to-pink-500 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-orange-600 mb-4">Great Job!</h2>
            <p className="text-2xl text-gray-700 mb-6">You found {score}/{ROUND_COUNT}!</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-2xl px-8 py-4"
              >
                Play Again
              </Button>
              <Button
                onClick={onBackToModes}
                className="bg-white/50 hover:bg-white/70 text-gray-800 border-2 border-gray-200 font-bold rounded-2xl px-8 py-4"
                variant="outline"
              >
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderGrid = (grid: "A" | "B", items: string[], sizes: string[]) => (
    <div className="p-4 rounded-3xl border-4 border-orange-300 bg-white/60 shadow-lg">
      <div className="grid grid-cols-3 gap-3">
        {items.map((emoji, index) => {
          const isFoundCell = found && index === round.diffIndex
          const isTimeoutReveal = timedOut && index === round.diffIndex
          const isWrongCell = wrongCell?.grid === grid && wrongCell?.index === index
          return (
            <button
              key={index}
              onClick={() => handleClick(grid, index)}
              disabled={found || timedOut}
              className={`aspect-square w-20 sm:w-24 rounded-2xl border-4 shadow-lg flex items-center justify-center leading-none transition-all duration-200 ${
                isFoundCell
                  ? "border-green-400 bg-green-50 scale-110 ring-4 ring-green-300"
                  : isTimeoutReveal
                  ? "border-blue-400 bg-blue-50 ring-4 ring-blue-300"
                  : isWrongCell
                  ? "border-red-400 bg-red-50 animate-pulse"
                  : "border-white bg-white hover:scale-105"
              }`}
            >
              <span className={sizes[index]}>{emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            {Array.from({ length: ROUND_COUNT }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-orange-700 mb-2">🔍 Nine Pictures</h2>
              <p className="text-lg text-orange-600 mb-4">
                One picture is different between the two boards — tap it!
              </p>
              <div
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xl border-2 ${
                  timeLeft <= 3
                    ? "bg-red-100 text-red-600 border-red-300 animate-pulse"
                    : "bg-orange-100 text-orange-700 border-orange-300"
                }`}
              >
                <Timer className="h-5 w-5" />
                {timedOut ? "Time's up!" : `${timeLeft}s`}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
              {renderGrid("A", round.gridA, round.gridASizes)}
              {renderGrid("B", round.gridB, round.gridBSizes)}
            </div>

            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full ${["bg-yellow-400", "bg-pink-400", "bg-blue-400", "bg-green-400"][i % 4]}`}></div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-2 mt-8">
              {rounds.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < roundIndex ? "bg-green-500" : index === roundIndex ? "bg-orange-500 scale-125" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
