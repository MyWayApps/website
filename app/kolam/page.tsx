"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, RotateCcw, Undo2, Sparkles } from "lucide-react"
import { KolamCanvas } from "@/components/kolam/kolam-canvas"
import { KOLAM_LEVELS, getKolamLevel, getDotPositions, getGhostLoops, evaluateKolam, type Stroke, type KolamEvalResult } from "@/lib/kolam"

type Mode = "levels" | "playing" | "freedraw"

const UNLOCK_KEY = "kolam-unlocked-level"

function loadUnlockedLevel(): number {
  if (typeof window === "undefined") return 1
  const saved = window.localStorage.getItem(UNLOCK_KEY)
  const parsed = saved ? parseInt(saved, 10) : 1
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function saveUnlockedLevel(level: number) {
  if (typeof window !== "undefined") window.localStorage.setItem(UNLOCK_KEY, String(level))
}

export default function KolamPage() {
  const [mode, setMode] = useState<Mode>("levels")
  const [unlockedLevel, setUnlockedLevel] = useState(1)
  const [levelId, setLevelId] = useState(1)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [result, setResult] = useState<KolamEvalResult | null>(null)
  const [freeDrawGridSize, setFreeDrawGridSize] = useState(5)

  useEffect(() => {
    setUnlockedLevel(loadUnlockedLevel())
  }, [])

  const level = getKolamLevel(levelId)
  const allLevelsDone = unlockedLevel > KOLAM_LEVELS.length

  const startLevel = (id: number) => {
    setLevelId(id)
    setStrokes([])
    setResult(null)
    setMode("playing")
  }

  const handleCheck = () => {
    if (!level) return
    const evalResult = evaluateKolam(strokes, level)
    setResult(evalResult)
    if (evalResult.passed && levelId >= unlockedLevel) {
      const next = levelId + 1
      setUnlockedLevel(next)
      saveUnlockedLevel(next)
    }
  }

  const handleTryAgain = () => {
    setStrokes([])
    setResult(null)
  }

  const handleNextLevel = () => {
    if (levelId < KOLAM_LEVELS.length) startLevel(levelId + 1)
    else setMode("levels")
  }

  const GRADIENT = "from-amber-100 via-orange-100 to-rose-100"

  // ── Level select ───────────────────────────────────────────────────────
  if (mode === "levels") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/#games-section">
              <Button className="bg-white/60 hover:bg-white text-rose-900 border-2 border-white font-bold" variant="outline">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-rose-900 mb-3 tracking-tight">🌸 Kolam</h1>
            <p className="text-lg text-rose-800/80">Draw a loop around the dots to make your own kolam!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-2xl mx-auto mb-8">
            {KOLAM_LEVELS.map((l) => {
              const locked = l.id > unlockedLevel
              return (
                <Card
                  key={l.id}
                  onClick={() => !locked && startLevel(l.id)}
                  className={`border-4 rounded-2xl shadow-lg transition-all duration-300 ${
                    locked
                      ? "bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed"
                      : "bg-white/90 border-white cursor-pointer hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  <CardContent className="p-5 flex flex-col items-center gap-2">
                    {locked ? (
                      <Lock className="h-8 w-8 text-gray-400" />
                    ) : (
                      <span className="text-3xl">{["🌀", "🌊", "🌼", "✨", "🪷"][l.id - 1]}</span>
                    )}
                    <span className="font-bold text-rose-900 text-center">{l.title}</span>
                    <span className="text-xs text-rose-700/70">{getDotPositions(l.gridSize, l.dotPattern).length} dots</span>
                  </CardContent>
                </Card>
              )
            })}

            <Card
              onClick={() => allLevelsDone && setMode("freedraw")}
              className={`border-4 rounded-2xl shadow-lg transition-all duration-300 ${
                allLevelsDone
                  ? "bg-gradient-to-br from-fuchsia-200 to-rose-300 border-white cursor-pointer hover:scale-105 hover:shadow-xl"
                  : "bg-gray-100 border-gray-200 opacity-70 cursor-not-allowed"
              }`}
            >
              <CardContent className="p-5 flex flex-col items-center gap-2">
                {allLevelsDone ? <Sparkles className="h-8 w-8 text-fuchsia-700" /> : <Lock className="h-8 w-8 text-gray-400" />}
                <span className="font-bold text-rose-900 text-center">Free Draw</span>
                <span className="text-xs text-rose-700/70">{allLevelsDone ? "Make your own!" : "Finish all levels first"}</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ── Free draw ──────────────────────────────────────────────────────────
  if (mode === "freedraw") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4`}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setMode("levels")}
              className="bg-white/60 hover:bg-white text-rose-900 border-2 border-white font-bold"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>
            <div className="flex gap-2">
              {[3, 4, 5].map((g) => (
                <Button
                  key={g}
                  onClick={() => setFreeDrawGridSize(g)}
                  className={`px-3 py-2 font-bold rounded-xl border-2 ${
                    freeDrawGridSize === g
                      ? "bg-fuchsia-500 text-white border-white"
                      : "bg-white/70 text-rose-900 border-white/60"
                  }`}
                  variant="outline"
                >
                  {g}x{g}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-rose-900">🪷 Free Draw</h1>
            <p className="text-rose-800/80">Make your own kolam design!</p>
          </div>

          <KolamCanvas gridSize={freeDrawGridSize} strokes={strokes} onStrokesChange={setStrokes} />

          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={() => setStrokes((s) => s.slice(0, -1))}
              disabled={strokes.length === 0}
              className="bg-white/80 hover:bg-white text-rose-900 border-2 border-rose-200 font-bold disabled:opacity-40"
              variant="outline"
            >
              <Undo2 className="mr-2 h-5 w-5" />
              Undo
            </Button>
            <Button
              onClick={() => setStrokes([])}
              disabled={strokes.length === 0}
              className="bg-white/80 hover:bg-white text-rose-900 border-2 border-rose-200 font-bold disabled:opacity-40"
              variant="outline"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Playing a level ────────────────────────────────────────────────────
  if (!level) return null
  const ghostLoops = getGhostLoops(level.gridSize, level.style, level.dotPattern)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4`}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => setMode("levels")}
            className="bg-white/60 hover:bg-white text-rose-900 border-2 border-white font-bold"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Levels
          </Button>
          <span className="text-sm font-bold text-rose-900 bg-white/70 px-4 py-2 rounded-full">
            Level {level.id} · {level.title}
          </span>
        </div>

        <div className="text-center mb-3">
          <p className="text-rose-800/80 font-medium">See the target, then draw your loop around the dots below!</p>
        </div>

        <div className="mb-4">
          <p className="text-center text-sm font-bold text-rose-700 mb-1">Target</p>
          <div className="max-w-[160px] mx-auto">
            <KolamCanvas
              gridSize={level.gridSize}
              dotPattern={level.dotPattern}
              ghostLoops={ghostLoops}
              strokes={[]}
              onStrokesChange={() => {}}
              interactive={false}
            />
          </div>
        </div>

        <p className="text-center text-sm font-bold text-rose-700 mb-1">Your Kolam</p>
        <KolamCanvas
          gridSize={level.gridSize}
          dotPattern={level.dotPattern}
          ghostLoops={ghostLoops}
          strokes={strokes}
          onStrokesChange={setStrokes}
        />

        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={() => setStrokes((s) => s.slice(0, -1))}
            disabled={strokes.length === 0}
            className="bg-white/80 hover:bg-white text-rose-900 border-2 border-rose-200 font-bold disabled:opacity-40"
            variant="outline"
          >
            <Undo2 className="mr-2 h-5 w-5" />
            Undo
          </Button>
          <Button
            onClick={() => setStrokes([])}
            disabled={strokes.length === 0}
            className="bg-white/80 hover:bg-white text-rose-900 border-2 border-rose-200 font-bold disabled:opacity-40"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Clear
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <Button
            onClick={handleCheck}
            className="h-14 px-10 rounded-2xl text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:from-fuchsia-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Check ✨
          </Button>
        </div>

        {result && (
          <Card className="mt-6 bg-white/90 border-4 border-white rounded-2xl shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">{result.emoji}</div>
              <p className="text-xl font-bold text-rose-900 mb-4">{result.message}</p>
              {result.passed ? (
                <Button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl px-8 py-4"
                >
                  {levelId < KOLAM_LEVELS.length ? "Next Level →" : "All Done! 🎉"}
                </Button>
              ) : (
                <Button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-xl px-8 py-4"
                >
                  Try Again
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
