"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import {
  generateSudokuPuzzle,
  getSudokuBoxDims,
  countBlanks,
  SUDOKU_PICTURES,
  type SudokuSize,
  type SudokuDifficulty,
  type SudokuPuzzle,
} from "@/lib/sudoku"

type Mode = "menu" | "setup" | "playing" | "results"
type Variant = "numbers" | "pictures"

interface User {
  id: string
  name: string
  email?: string
}

interface GameData {
  size: SudokuSize
  variant: Variant
  difficulty: SudokuDifficulty
  mistakes: number
  completionTime: number
  [key: string]: unknown
}

interface SudokuGameProps {
  user?: User | null
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

const GRADIENT = "from-cyan-300 via-sky-400 to-blue-600"

export default function SudokuGame({ onGameComplete, onBackToHome }: SudokuGameProps = {}) {
  const [mode, setMode] = useState<Mode>("menu")
  const [size, setSize] = useState<SudokuSize>(4)
  const [variant, setVariant] = useState<Variant>("numbers")
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("easy")

  const [puzzle, setPuzzle] = useState<SudokuPuzzle | null>(null)
  const [grid, setGrid] = useState<(number | null)[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [wrongCell, setWrongCell] = useState<{ row: number; col: number } | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [gameStartTime, setGameStartTime] = useState(0)

  const startGame = () => {
    const p = generateSudokuPuzzle(size, difficulty)
    setPuzzle(p)
    setGrid(p.puzzle.map((row) => [...row]))
    setSelectedCell(null)
    setWrongCell(null)
    setMistakes(0)
    setGameStartTime(Date.now())
    setMode("playing")
  }

  const isComplete = useMemo(() => grid.length > 0 && grid.every((row) => row.every((cell) => cell !== null)), [grid])

  useEffect(() => {
    if (mode === "playing" && isComplete && puzzle) {
      const maxScore = countBlanks(puzzle.given)
      const score = Math.max(0, maxScore - mistakes)
      onGameComplete?.(score, maxScore, {
        size,
        variant,
        difficulty,
        mistakes,
        completionTime: gameStartTime,
      })
      setMode("results")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete, mode])

  const handleCellSelect = (row: number, col: number) => {
    if (!puzzle || puzzle.given[row][col]) return
    setSelectedCell({ row, col })
  }

  const handlePaletteSelect = (value: number) => {
    if (!selectedCell || !puzzle) return
    const { row, col } = selectedCell

    if (puzzle.solution[row][col] === value) {
      playCorrectSound()
      setGrid((prev) => {
        const next = prev.map((r) => [...r])
        next[row][col] = value
        return next
      })
      setSelectedCell(null)
    } else {
      playWrongSound()
      setMistakes((m) => m + 1)
      setWrongCell({ row, col })
      setTimeout(() => setWrongCell(null), 500)
    }
  }

  const valueUsageCount = (value: number): number => grid.flat().filter((v) => v === value).length

  const backToSetup = () => setMode("setup")

  // ── Menu ──────────────────────────────────────────────────────────────────
  if (mode === "menu") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 relative overflow-hidden`}>
        <img
          src="/characters/giraffe.png"
          alt="Giraffe"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            {onBackToHome && (
              <Button
                onClick={onBackToHome}
                className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            )}
          </div>

          <Card className="w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-blue-900 mb-4 tracking-tight">🧩 Sudoku</h1>
                <p className="text-xl text-blue-800 font-medium">Fill the grid so every row, column & box has one of each!</p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setMode("setup")}
                  className="h-32 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl px-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">🚀</span>
                    <span>Start</span>
                    <span className="text-sm font-normal">Choose your options</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Setup ─────────────────────────────────────────────────────────────────
  if (mode === "setup") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 relative overflow-hidden`}>
        <img
          src="/characters/giraffe.png"
          alt="Giraffe"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => (onBackToHome ? onBackToHome() : setMode("menu"))}
              className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {onBackToHome ? "Back to Home" : "Back to Menu"}
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-900 mb-2">Game Setup</h2>
                <p className="text-lg text-blue-800 font-medium">Choose your grid, style, and level</p>
              </div>

              <div className="space-y-10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Grid Size</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {([4, 6] as SudokuSize[]).map((s) => (
                      <Button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                          size === s
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-white shadow-lg scale-105"
                            : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                        }`}
                        variant="outline"
                      >
                        {s} x {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Style</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button
                      onClick={() => setVariant("numbers")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        variant === "numbers"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">🔢</span>
                        <span>Numbers</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() => setVariant("pictures")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        variant === "pictures"
                          ? "bg-gradient-to-r from-pink-400 to-rose-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">🍎</span>
                        <span>Pictures</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Level</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                    {(["easy", "medium", "tough"] as SudokuDifficulty[]).map((d) => (
                      <Button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`h-20 text-lg font-bold border-4 capitalize transition-all duration-300 ${
                          difficulty === d
                            ? "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white border-white shadow-lg scale-105"
                            : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                        }`}
                        variant="outline"
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={startGame}
                    className="h-16 text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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

  // ── Results ───────────────────────────────────────────────────────────────
  if (mode === "results" && puzzle) {
    const maxScore = countBlanks(puzzle.given)
    const score = Math.max(0, maxScore - mistakes)
    return (
      <QuizResults
        score={score}
        maxScore={maxScore}
        onPlayAgain={startGame}
        onBackToTopics={backToSetup}
        title="Sudoku Solved!"
        gradientClass={GRADIENT}
      />
    )
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  if (!puzzle) return null

  const { rows: boxRows, cols: boxCols } = getSudokuBoxDims(size)
  const values = Array.from({ length: size }, (_, i) => i + 1)
  const pictures = SUDOKU_PICTURES[size]
  const cellPx = size === 4 ? 72 : 56

  return (
    <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={backToSetup}
            className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>
          <span className="text-lg font-bold text-white bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm capitalize">
            {size}x{size} • {variant} • {difficulty}
          </span>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6 md:p-8">
            <div
              className="mx-auto mb-8 grid bg-gray-800 gap-[2px] rounded-xl overflow-hidden shadow-lg"
              style={{
                gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
                width: "fit-content",
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isGiven = puzzle.given[r][c]
                  const isSelected = selectedCell?.row === r && selectedCell?.col === c
                  const isWrong = wrongCell?.row === r && wrongCell?.col === c
                  const borderRight = (c + 1) % boxCols === 0 && c !== size - 1 ? "border-r-4 border-gray-800" : ""
                  const borderBottom = (r + 1) % boxRows === 0 && r !== size - 1 ? "border-b-4 border-gray-800" : ""

                  let bg = "bg-white hover:bg-blue-50"
                  if (isGiven) bg = "bg-gray-100"
                  else if (isWrong) bg = "bg-red-200"
                  else if (isSelected) bg = "bg-blue-200"
                  else if (cell !== null) bg = "bg-green-100"

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellSelect(r, c)}
                      disabled={isGiven}
                      className={`flex items-center justify-center font-bold ${bg} ${borderRight} ${borderBottom} ${
                        isGiven ? "cursor-default" : "cursor-pointer"
                      } transition-colors`}
                      style={{ width: cellPx, height: cellPx, fontSize: variant === "pictures" ? cellPx * 0.5 : cellPx * 0.4 }}
                    >
                      {cell !== null ? (variant === "pictures" ? pictures[cell - 1] : cell) : ""}
                    </button>
                  )
                })
              )}
            </div>

            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-gray-700">
                {selectedCell ? "Pick a value for the selected cell" : "Tap an empty cell first"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {values.map((value) => {
                const usedUp = valueUsageCount(value) >= size
                return (
                  <button
                    key={value}
                    onClick={() => handlePaletteSelect(value)}
                    disabled={!selectedCell || usedUp}
                    className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center font-bold transition-all ${
                      usedUp
                        ? "bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed"
                        : selectedCell
                          ? "bg-white hover:bg-blue-50 border-blue-300 hover:scale-105 cursor-pointer"
                          : "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                    }`}
                    style={{ fontSize: variant === "pictures" ? 28 : 24 }}
                  >
                    {variant === "pictures" ? pictures[value - 1] : value}
                  </button>
                )
              })}
            </div>

            {mistakes > 0 && (
              <p className="text-center text-sm text-gray-500 mt-4">Mistakes so far: {mistakes}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
