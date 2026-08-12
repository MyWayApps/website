"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, RotateCcw } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import {
  ALL_POINTS,
  EDGES,
  INITIAL_TIGER,
  INITIAL_GOATS,
  TOTAL_GOATS,
  GOATS_CAPTURED_FOR_TIGER_WIN,
  getGoatMoves,
  tigerHasNoMoves,
  pickTigerMove,
  pointPct,
  type Point,
} from "@/lib/puli-meka-data"

interface PuliMekaGameProps {
  onBackToModes: () => void
}

interface GameState {
  tigerPos: Point
  goatPositions: Point[]
  capturedCount: number
}

function samePoint(a: Point, b: Point): boolean {
  return a.row === b.row && a.col === b.col
}

const HOW_TO_PLAY_STEPS = [
  "Tap a goat 🐐 to select it.",
  "Tap a glowing green dot to move it there.",
  "Watch out — the tiger can jump over a goat to catch it!",
  "Trap the tiger so it can't move — you win!",
]

const INITIAL_GAME: GameState = { tigerPos: INITIAL_TIGER, goatPositions: INITIAL_GOATS, capturedCount: 0 }

export default function PuliMekaGame({ onBackToModes }: PuliMekaGameProps) {
  const [game, setGame] = useState<GameState>(INITIAL_GAME)
  const [selectedGoat, setSelectedGoat] = useState<Point | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"child" | "computer">("child")
  const [winner, setWinner] = useState<"child" | "computer" | null>(null)
  const [message, setMessage] = useState("🐐 Help the goats escape the tiger!")
  const [showHowTo, setShowHowTo] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [captureEffect, setCaptureEffect] = useState<Point | null>(null)

  const legalMoves = selectedGoat ? getGoatMoves(selectedGoat, game.tigerPos, game.goatPositions) : []

  // Computer's automated turn.
  useEffect(() => {
    if (currentPlayer !== "computer" || winner) return
    setMessage("Tiger is thinking...")

    const timeout = setTimeout(() => {
      setGame((prev) => {
        if (tigerHasNoMoves(prev.tigerPos, prev.goatPositions)) {
          setWinner("child")
          setMessage("The tiger is trapped! You win! 🎉")
          playCorrectSound()
          return prev
        }

        const decision = pickTigerMove(prev.tigerPos, prev.goatPositions)
        if (!decision) {
          setWinner("child")
          setMessage("The tiger is trapped! You win! 🎉")
          playCorrectSound()
          return prev
        }

        if (decision.type === "capture") {
          setCaptureEffect(decision.over)
          setTimeout(() => setCaptureEffect(null), 700)
          const newCaptured = prev.capturedCount + 1
          if (newCaptured >= GOATS_CAPTURED_FOR_TIGER_WIN) {
            setWinner("computer")
            setMessage("The tiger caught too many goats!")
            playWrongSound()
          } else {
            setMessage("The tiger caught a goat! Watch out!")
          }
          return {
            tigerPos: decision.to,
            goatPositions: prev.goatPositions.filter((g) => !samePoint(g, decision.over)),
            capturedCount: newCaptured,
          }
        }

        setMessage("Your turn — move a goat!")
        return { ...prev, tigerPos: decision.to }
      })
      setCurrentPlayer("child")
    }, 900)

    return () => clearTimeout(timeout)
  }, [currentPlayer, winner])

  const handlePointClick = (point: Point) => {
    if (currentPlayer !== "child" || winner) return

    const goatHere = game.goatPositions.some((g) => samePoint(g, point))
    if (goatHere) {
      setSelectedGoat((prev) => (prev && samePoint(prev, point) ? null : point))
      return
    }

    if (selectedGoat && legalMoves.some((m) => samePoint(m, point))) {
      setGame((prev) => ({
        ...prev,
        goatPositions: prev.goatPositions.map((g) => (samePoint(g, selectedGoat) ? point : g)),
      }))
      setSelectedGoat(null)
      setMessage("Good move!")
      setCurrentPlayer("computer")
    }
  }

  const handleRestart = () => {
    setGame(INITIAL_GAME)
    setSelectedGoat(null)
    setCurrentPlayer("child")
    setWinner(null)
    setMessage("🐐 Help the goats escape the tiger!")
    setCaptureEffect(null)
  }

  if (!hasSeenIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-lime-300 to-green-400 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl mb-2">🐯</div>
            <h2 className="text-3xl font-bold text-green-700 mb-2">How to Play</h2>
            <p className="text-lg font-medium text-green-800 mb-2">🐐 Help the goats escape the tiger!</p>
            {HOW_TO_PLAY_STEPS.map((step, i) => (
              <p key={i} className="text-lg text-gray-700">
                {i + 1}️⃣ {step}
              </p>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={() => setHasSeenIntro(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl px-10 py-4 text-xl"
              >
                Got it!
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

  if (winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-lime-300 to-green-400 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{winner === "child" ? "🐐🏆" : "🐯"}</div>
            <h2 className="text-4xl font-bold text-green-700 mb-4">{winner === "child" ? "You Won!" : "Tiger Won!"}</h2>
            <p className="text-xl text-gray-700 mb-6">
              {winner === "child" ? "You trapped the tiger — the goats are safe!" : "The tiger caught too many goats. Try again!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRestart} className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-2xl px-8 py-4">
                <RotateCcw className="mr-2 h-5 w-5" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-200 via-lime-300 to-green-400 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>
          <Button
            onClick={() => setShowHowTo(true)}
            className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold px-4 py-3"
            variant="outline"
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            How to Play
          </Button>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-6 text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-2">🐯 Puli Meka</h1>
            <p className={`text-xl font-bold mb-3 ${currentPlayer === "child" ? "text-blue-600" : "text-orange-600"}`}>{message}</p>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: TOTAL_GOATS }, (_, i) => (
                <span key={i} className={`text-2xl ${i < game.capturedCount ? "opacity-25 grayscale" : ""}`}>
                  🐐
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="relative aspect-square w-full max-w-md mx-auto bg-amber-50 rounded-2xl border-4 border-amber-800/30 p-6">
              <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                {EDGES.map(([a, b], i) => {
                  const pa = pointPct(a)
                  const pb = pointPct(b)
                  return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#b45309" strokeWidth="1.5" />
                })}
              </svg>

              {ALL_POINTS.map((p) => {
                const pos = pointPct(p)
                const isTiger = samePoint(p, game.tigerPos)
                const isGoat = game.goatPositions.some((g) => samePoint(g, p))
                const isSelected = selectedGoat !== null && samePoint(selectedGoat, p)
                const isLegalMove = legalMoves.some((m) => samePoint(m, p))
                return (
                  <button
                    key={`${p.row}-${p.col}`}
                    onClick={() => handlePointClick(p)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: "18%", height: "18%" }}
                  >
                    {isTiger && <span className="text-4xl drop-shadow">🐯</span>}
                    {isGoat && (
                      <span className={`text-3xl transition-transform duration-200 ${isSelected ? "scale-125 drop-shadow-lg" : ""}`}>
                        🐐
                      </span>
                    )}
                    {!isTiger && !isGoat && (
                      <span
                        className={`block w-3 h-3 rounded-full ${
                          isLegalMove ? "bg-green-400 animate-pulse ring-4 ring-green-300" : "bg-amber-700/40"
                        }`}
                      />
                    )}
                  </button>
                )
              })}

              {captureEffect && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping pointer-events-none"
                  style={{ left: `${pointPct(captureEffect).x}%`, top: `${pointPct(captureEffect).y}%` }}
                >
                  💨
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showHowTo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHowTo(false)}>
          <Card className="bg-white max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-700 mb-4">How to Play 🐯</h3>
              {HOW_TO_PLAY_STEPS.map((step, i) => (
                <p key={i} className="text-lg">
                  {i + 1}️⃣ {step}
                </p>
              ))}
              <Button onClick={() => setShowHowTo(false)} className="bg-green-600 text-white font-bold rounded-2xl px-8 py-3 mt-2">
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
