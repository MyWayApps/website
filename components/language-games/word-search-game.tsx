"use client"

import { useMemo, useState, type TouchEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Star, Volume2 } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { CategoryPicker } from "@/components/language-games/category-picker"
import { getNativeSearchCategories, getNativeSearchWordPairs, cleanNativeForGrid, type LanguageCode } from "@/lib/language-games-data"
import { buildWordSearch, segmentGraphemes, type WordSearchPlacement } from "@/lib/word-grid"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"

interface WordSearchGameProps {
  lang: LanguageCode
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

interface CellPos {
  r: number
  c: number
}

function cellsOf(p: WordSearchPlacement): CellPos[] {
  return Array.from({ length: p.tokens.length }, (_, i) => ({ r: p.row + p.dRow * i, c: p.col + p.dCol * i }))
}

export function WordSearchGame({ lang, gradientClass, onBackToModes, onComplete }: WordSearchGameProps) {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [puzzleSeed, setPuzzleSeed] = useState(0)
  const [selecting, setSelecting] = useState<CellPos[] | null>(null)
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const { speakNative } = useLanguageSpeak(lang)

  const wordPairs = categoryId ? getNativeSearchWordPairs(lang, categoryId) : []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const words = useMemo(() => wordPairs.slice(0, 6).map((w) => cleanNativeForGrid(w.native)), [categoryId, puzzleSeed])
  const puzzle = useMemo(() => (words.length > 0 ? buildWordSearch(words, 10, segmentGraphemes) : null), [words])

  if (categoryId === null) {
    return (
      <CategoryPicker
        title="Word Search"
        subtitle="Pick a category to search"
        categories={getNativeSearchCategories(lang)}
        gradientClass={gradientClass}
        onBack={onBackToModes}
        onPick={(id) => {
          setCategoryId(id)
          setFoundWords(new Set())
          setPhase("playing")
        }}
      />
    )
  }

  if (!puzzle) return null

  const totalWords = puzzle.placements.length

  const cellKey = (r: number, c: number) => `${r},${c}`

  const foundCellKeys = new Set<string>()
  for (const p of puzzle.placements) {
    if (foundWords.has(p.word)) {
      for (const { r, c } of cellsOf(p)) foundCellKeys.add(cellKey(r, c))
    }
  }

  const handleCellDown = (r: number, c: number) => setSelecting([{ r, c }])

  const handleCellEnter = (r: number, c: number) => {
    if (!selecting) return
    const start = selecting[0]
    const dRow = Math.sign(r - start.r)
    const dCol = Math.sign(c - start.c)
    if (dRow === 0 && dCol === 0) {
      setSelecting([start])
      return
    }
    const length = Math.max(Math.abs(r - start.r), Math.abs(c - start.c)) + 1
    const path: CellPos[] = Array.from({ length }, (_, i) => ({ r: start.r + dRow * i, c: start.c + dCol * i }))
    setSelecting(path)
  }

  const handleCellUp = () => {
    if (!selecting || selecting.length < 2) {
      setSelecting(null)
      return
    }
    const selectedKeys = new Set(selecting.map((p) => cellKey(p.r, p.c)))
    const match = puzzle.placements.find((p) => {
      if (foundWords.has(p.word)) return false
      const cells = cellsOf(p)
      if (cells.length !== selecting.length) return false
      const forward = cells.every((cell) => selectedKeys.has(cellKey(cell.r, cell.c)))
      return forward
    })
    if (match) {
      const nextFound = new Set(foundWords)
      nextFound.add(match.word)
      setFoundWords(nextFound)
      playCorrectSound()
      speakNative(wordPairs.find((w) => cleanNativeForGrid(w.native) === match.word)?.native ?? "")
      if (nextFound.size === totalWords) {
        onComplete(totalWords, totalWords)
        setTimeout(() => setPhase("results"), 1200)
      }
    } else {
      playWrongSound()
    }
    setSelecting(null)
  }

  const selectingKeys = new Set((selecting ?? []).map((p) => cellKey(p.r, p.c)))

  const handleTouchMove = (e: TouchEvent) => {
    if (!selecting) return
    const touch = e.touches[0]
    const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
    const r = el?.dataset.r
    const c = el?.dataset.c
    if (r !== undefined && c !== undefined) handleCellEnter(Number(r), Number(c))
  }

  const handleRestart = () => {
    setFoundWords(new Set())
    setPhase("playing")
    setPuzzleSeed((s) => s + 1)
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={totalWords}
        maxScore={totalWords}
        onPlayAgain={handleRestart}
        onBackToTopics={() => setCategoryId(null)}
        title="Puzzle Solved!"
        gradientClass={gradientClass}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`} onMouseUp={handleCellUp}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={() => setCategoryId(null)}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-lg font-bold text-white mr-1">
              Found {foundWords.size}/{totalWords}
            </span>
            {Array.from({ length: totalWords }, (_, i) => (
              <Star key={i} className={`h-6 w-6 transition-all ${i < foundWords.size ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
            ))}
          </div>
          <Button
            onClick={handleRestart}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold px-4 py-3"
            variant="outline"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6 select-none">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`, touchAction: "none" }}
                onMouseLeave={() => setSelecting(null)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleCellUp}
              >
                {puzzle.grid.map((row, r) =>
                  row.map((letter, c) => {
                    const key = cellKey(r, c)
                    const isFound = foundCellKeys.has(key)
                    const isSelecting = selectingKeys.has(key)
                    return (
                      <div
                        key={key}
                        data-r={r}
                        data-c={c}
                        onMouseDown={() => handleCellDown(r, c)}
                        onMouseEnter={() => handleCellEnter(r, c)}
                        onTouchStart={() => handleCellDown(r, c)}
                        className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-md font-bold text-sm md:text-base leading-none cursor-pointer select-none overflow-hidden ${
                          isFound
                            ? "bg-green-300 text-green-900"
                            : isSelecting
                              ? "bg-indigo-300 text-indigo-900"
                              : "bg-indigo-50 text-gray-700 hover:bg-indigo-100"
                        }`}
                      >
                        {letter}
                      </div>
                    )
                  }),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Find these words</h3>
              <p className="text-sm text-gray-500 mb-3 -mt-2">Find the native-script spelling for each word below</p>
              <ul className="space-y-3">
                {puzzle.placements.map((p) => {
                  const pair = wordPairs.find((w) => cleanNativeForGrid(w.native) === p.word)
                  const found = foundWords.has(p.word)
                  return (
                    <li
                      key={p.word}
                      className={`flex items-center justify-between gap-2 p-2 rounded-xl ${found ? "bg-green-100" : "bg-gray-50"}`}
                    >
                      <span className={`font-semibold ${found ? "text-green-700 line-through" : "text-gray-700"}`}>
                        {pair?.english ?? p.word}
                      </span>
                      <button onClick={() => speakNative(pair?.native ?? "")} className="text-indigo-500 hover:text-indigo-700">
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
