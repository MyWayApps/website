"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"

type GameMode = "menu" | "setup" | "playing"
type GameType = "drag-baskets" | "select-even" | "select-odd"

interface User {
  id: string
  name: string
  email: string
}

interface GameData {
  mode: string
  gameType: GameType
  rangeMax: number
  completionTime: number
  [key: string]: unknown
}

interface EvenOddGameProps {
  user?: User | null
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // pleasant
const wrongSoundFreqs = [220, 196, 174.61] // error
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // victory

export default function EvenOddGame({ onGameComplete, onBackToHome }: EvenOddGameProps = {}) {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [gameType, setGameType] = useState<GameType>("drag-baskets")
  const [rangeMax, setRangeMax] = useState<number>(10)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [score, setScore] = useState(0)

  // Shared numbers pool for the round
  const numbers = useMemo(() => {
    const arr = Array.from({ length: rangeMax }, (_, i) => i + 1)
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [rangeMax])

  // drag-baskets state
  const [placed, setPlaced] = useState<{ even: number[]; odd: number[] }>({ even: [], odd: [] })

  // select modes state
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // Audio
  const playSound = (frequencies: number[], isCorrect: boolean) => {
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext
      const audioContext = new AC()
      if (isCorrect) {
        const randomFreqs = frequencies
          .slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
        randomFreqs.forEach((freq: number, index: number) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          osc.connect(gain)
          gain.connect(audioContext.destination)
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15)
          osc.type = "sine"
          gain.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15)
          gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.15 + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3)
          osc.start(audioContext.currentTime + index * 0.15)
          osc.stop(audioContext.currentTime + index * 0.15 + 0.3)
        })
      } else {
        frequencies.forEach((freq: number, index: number) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          osc.connect(gain)
          gain.connect(audioContext.destination)
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
          osc.type = "square"
          gain.gain.setValueAtTime(0, audioContext.currentTime + index * 0.1)
          gain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + index * 0.1 + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3)
          osc.start(audioContext.currentTime + index * 0.1)
          osc.stop(audioContext.currentTime + index * 0.1 + 0.3)
        })
      }
    } catch {
      // no audio
    }
  }

  const startGame = () => {
    setScore(0)
    setSelected(new Set())
    setPlaced({ even: [], odd: [] })
    setGameStartTime(Date.now())
    setCurrentMode("playing")
  }

  const isEven = (n: number) => n % 2 === 0

  // Completion checks
  const totalEvens = useMemo(() => numbers.filter((n) => isEven(n)).length, [numbers])
  const totalOdds = numbers.length - totalEvens

  const handleSelectClick = (n: number) => {
    // selecting with pictures: balls/flowers theme
    if (gameType === "select-even") {
      if (isEven(n)) {
        if (!selected.has(n)) {
          const ns = new Set(selected)
          ns.add(n)
          setSelected(ns)
          playSound(correctSoundFreqs, true)
        }
      } else {
        // wrong: do not add, just sound and temporary shake
        playSound(wrongSoundFreqs, false)
      }
    } else if (gameType === "select-odd") {
      if (!isEven(n)) {
        if (!selected.has(n)) {
          const ns = new Set(selected)
          ns.add(n)
          setSelected(ns)
          playSound(correctSoundFreqs, true)
        }
      } else {
        playSound(wrongSoundFreqs, false)
      }
    }
  }

  // Drag and drop
  const dragNumberRef = useRef<number | null>(null)
  const onDragStart = (n: number) => {
    dragNumberRef.current = n
  }
  const onDragEnd = () => {
    dragNumberRef.current = null
  }
  const onDropTo = (bucket: "even" | "odd") => {
    const n = dragNumberRef.current
    if (n == null) return
    const shouldBeEven = isEven(n)
    const correct = (bucket === "even" && shouldBeEven) || (bucket === "odd" && !shouldBeEven)
    if (correct) {
      playSound(correctSoundFreqs, true)
      setPlaced((prev) => {
        const next = { even: [...prev.even], odd: [...prev.odd] }
        // Avoid duplicates
        if (!next.even.includes(n) && !next.odd.includes(n)) {
          next[bucket] = [...next[bucket], n]
        }
        return next
      })
    } else {
      // wrong: bounce back (do nothing state-wise)
      playSound(wrongSoundFreqs, false)
    }
    dragNumberRef.current = null
  }

  // derived gameplay state
  const remainingForDrag = useMemo(() => {
    const used = new Set([...placed.even, ...placed.odd])
    return numbers.filter((n) => !used.has(n))
  }, [numbers, placed])

  const isRoundComplete =
    (gameType === "drag-baskets" && placed.even.length + placed.odd.length === numbers.length) ||
    (gameType === "select-even" && selected.size === totalEvens) ||
    (gameType === "select-odd" && selected.size === totalOdds)

  useEffect(() => {
    if (currentMode === "playing" && isRoundComplete) {
      // Victory audio
      playSound(successSoundFreqs, true)
      setScore(1)
      if (onGameComplete) {
        onGameComplete(1, 1, {
          mode: "even-odd",
          gameType,
          rangeMax,
          completionTime: gameStartTime,
        })
      }
      // Return to setup after a short celebration
      const t = setTimeout(() => {
        setCurrentMode("setup")
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [isRoundComplete, currentMode, onGameComplete, gameType, rangeMax, gameStartTime])

  const resetToMenu = () => {
    setCurrentMode("menu")
    setScore(0)
    setSelected(new Set())
    setPlaced({ even: [], odd: [] })
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-purple-800 mb-4 font-sans tracking-tight">🔢 Even & Odd</h1>
              <p className="text-xl text-purple-700 font-medium">Learn even and odd numbers through play!</p>
              <p className="text-sm text-purple-600 mt-2">Pick a range and a game, then start!</p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => setCurrentMode("setup")}
                className="h-32 text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl px-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">🚀</span>
                  <span className="font-sans">Start</span>
                  <span className="text-sm font-normal">Choose your options</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentMode === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => (onBackToHome ? onBackToHome() : resetToMenu())}
              className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {onBackToHome ? "Back to Home" : "Back to Menu"}
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-purple-800">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-purple-800 mb-4 font-sans">Game Setup</h2>
                <p className="text-lg text-purple-700 font-medium">Choose number range and game type</p>
              </div>

              <div className="space-y-10">
                {/* Range selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Number Range</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[10, 20, 50, 100].map((max) => (
                      <Button
                        key={max}
                        onClick={() => setRangeMax(max)}
                        className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                          rangeMax === max
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-white shadow-lg scale-105"
                            : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                        }`}
                        variant="outline"
                      >
                        1 to {max}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Game type selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Select Game</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setGameType("drag-baskets")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        gameType === "drag-baskets"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">🧺</span>
                        <span>Drag to Baskets</span>
                        <span className="text-xs">(Even vs Odd)</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setGameType("select-even")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        gameType === "select-even"
                          ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">⚽️</span>
                        <span>Select All Even</span>
                        <span className="text-xs">Balls theme</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setGameType("select-odd")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        gameType === "select-odd"
                          ? "bg-gradient-to-r from-pink-400 to-rose-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">🌸</span>
                        <span>Select All Odd</span>
                        <span className="text-xs">Flowers theme</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={startGame}
                    className="h-16 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Start Game!
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // PLAYING
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentMode("setup")}
            className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-purple-800">Score: {score}/1</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-purple-800 mb-2">
                {gameType === "drag-baskets" && "Drag the numbers to the correct baskets"}
                {gameType === "select-even" && "Tap all the EVEN numbers (⚽️ balls)"}
                {gameType === "select-odd" && "Tap all the ODD numbers (🌸 flowers)"}
              </h2>
              <div className="text-purple-700">
                Range: 1 to {rangeMax} • {gameType.replace("-", " ")}
              </div>
            </div>

            {gameType === "drag-baskets" ? (
              <div className="space-y-6">
                {/* Numbers pool */}
                <div>
                  <h3 className="text-center text-lg font-semibold text-gray-700 mb-3">Drag these numbers</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {remainingForDrag.map((n) => (
                      <div
                        key={n}
                        draggable
                        onDragStart={() => onDragStart(n)}
                        onDragEnd={onDragEnd}
                        className="w-14 h-14 rounded-2xl border-4 border-gray-300 bg-white/70 hover:bg-white text-xl font-bold flex items-center justify-center cursor-grab active:cursor-grabbing shadow"
                        aria-grabbed="true"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Baskets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropTo("even")}
                    className="min-h-[160px] rounded-2xl border-4 border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 p-4"
                    aria-label="Even basket dropzone"
                    role="region"
                  >
                    <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
                      <span className="text-2xl">🧺</span> Even Basket
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {placed.even
                        .slice()
                        .sort((a, b) => a - b)
                        .map((n) => (
                          <div
                            key={n}
                            className="w-12 h-12 rounded-xl bg-green-500 text-white border-2 border-white flex items-center justify-center font-bold"
                          >
                            {n}
                          </div>
                        ))}
                    </div>
                  </div>

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropTo("odd")}
                    className="min-h-[160px] rounded-2xl border-4 border-pink-300 bg-gradient-to-r from-pink-100 to-rose-100 p-4"
                    aria-label="Odd basket dropzone"
                    role="region"
                  >
                    <div className="flex items-center gap-2 text-pink-800 font-bold mb-2">
                      <span className="text-2xl">🧺</span> Odd Basket
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {placed.odd
                        .slice()
                        .sort((a, b) => a - b)
                        .map((n) => (
                          <div
                            key={n}
                            className="w-12 h-12 rounded-xl bg-pink-500 text-white border-2 border-white flex items-center justify-center font-bold"
                          >
                            {n}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Celebration */}
                {isRoundComplete && (
                  <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-300 rounded-2xl">
                    <div className="text-4xl mb-2">🎉🎉🎉</div>
                    <div className="text-2xl font-bold text-green-700">You won! Great sorting!</div>
                    <div className="text-sm text-gray-600 mt-1">Returning to setup…</div>
                  </div>
                )}
              </div>
            ) : (
              // SELECT MODES
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-3">
                  {numbers.map((n) => {
                    const isPicked = selected.has(n)
                    const correctForMode =
                      (gameType === "select-even" && isEven(n)) || (gameType === "select-odd" && !isEven(n))
                    const visual = gameType === "select-even" ? "⚽️" : "🌸"
                    return (
                      <button
                        key={n}
                        onClick={() => handleSelectClick(n)}
                        className={`w-20 h-24 rounded-2xl border-4 flex flex-col items-center justify-center text-xl font-bold transition-all ${
                          isPicked
                            ? correctForMode
                              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white shadow-lg scale-105"
                              : "bg-red-200 border-red-300"
                            : "bg-white/70 hover:bg-white border-gray-300"
                        }`}
                        aria-pressed={isPicked}
                      >
                        <span className="text-2xl">{visual}</span>
                        <span>{n}</span>
                      </button>
                    )
                  })}
                </div>

                {isRoundComplete && (
                  <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-300 rounded-2xl">
                    <div className="text-5xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-green-700">You won! All correct numbers selected!</div>
                    <div className="text-sm text-gray-600 mt-1">Returning to setup…</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
