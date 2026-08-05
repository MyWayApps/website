"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Star, Volume2 } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { CategoryPicker } from "@/components/language-games/category-picker"
import { getGridFriendlyCategories, getGridFriendlyWordPairs, type LanguageCode } from "@/lib/language-games-data"
import { buildCrossword } from "@/lib/word-grid"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"

interface CrosswordGameProps {
  lang: LanguageCode
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

export function CrosswordGame({ lang, gradientClass, onBackToModes, onComplete }: CrosswordGameProps) {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [puzzleSeed, setPuzzleSeed] = useState(0)
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [checkedWords, setCheckedWords] = useState<Record<string, boolean>>({})
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const { speakNative } = useLanguageSpeak(lang)

  const wordPairs = categoryId ? getGridFriendlyWordPairs(lang, categoryId) : []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const words = useMemo(() => wordPairs.slice(0, 7).map((w) => w.english), [categoryId, puzzleSeed])
  const puzzle = useMemo(() => (words.length > 0 ? buildCrossword(words, 16) : null), [words])

  if (categoryId === null) {
    return (
      <CategoryPicker
        title="Crossword Puzzle"
        subtitle="Pick a category to solve"
        categories={getGridFriendlyCategories(lang)}
        gradientClass={gradientClass}
        onBack={onBackToModes}
        onPick={(id) => {
          setCategoryId(id)
          setEntries({})
          setCheckedWords({})
          setPhase("playing")
        }}
      />
    )
  }

  if (!puzzle) return null

  const totalWords = puzzle.placements.length
  const cellKey = (r: number, c: number) => `${r},${c}`

  const cellInputId = (r: number, c: number) => `cw-${lang}-${categoryId}-cell-${r}-${c}`

  // Next filled cell to the right (for auto-advance), falling back to the row below.
  const nextCellId = (r: number, c: number): { r: number; c: number } | null => {
    if (c + 1 < puzzle.cols && puzzle.grid[r][c + 1] !== null) return { r, c: c + 1 }
    if (r + 1 < puzzle.rows && puzzle.grid[r + 1][c] !== null) return { r: r + 1, c }
    return null
  }

  const handleInput = (r: number, c: number, value: string) => {
    const char = value.slice(-1).toUpperCase().replace(/[^A-Z]/, "")
    setEntries((prev) => ({ ...prev, [cellKey(r, c)]: char }))
    if (char) {
      const next = nextCellId(r, c)
      const nextInput = next ? document.getElementById(cellInputId(next.r, next.c)) : null
      if (nextInput) (nextInput as HTMLInputElement).focus()
    }
  }

  const handleCheck = () => {
    const nextChecked: Record<string, boolean> = {}
    let allCorrect = true
    for (const p of puzzle.placements) {
      const dRow = p.direction === "down" ? 1 : 0
      const dCol = p.direction === "across" ? 1 : 0
      let correct = true
      for (let i = 0; i < p.word.length; i++) {
        const r = p.row + dRow * i
        const c = p.col + dCol * i
        if ((entries[cellKey(r, c)] ?? "") !== p.word[i]) correct = false
      }
      nextChecked[p.word] = correct
      if (!correct) allCorrect = false
    }
    setCheckedWords(nextChecked)
    if (allCorrect) {
      playCorrectSound()
      onComplete(totalWords, totalWords)
      setTimeout(() => setPhase("results"), 1200)
    } else {
      playWrongSound()
    }
  }

  const solvedCount = Object.values(checkedWords).filter(Boolean).length

  const handleRestart = () => {
    setEntries({})
    setCheckedWords({})
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
        title="Crossword Complete!"
        gradientClass={gradientClass}
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-5xl mx-auto">
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
              Solved {solvedCount}/{totalWords}
            </span>
            {Array.from({ length: totalWords }, (_, i) => (
              <Star key={i} className={`h-6 w-6 transition-all ${i < solvedCount ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
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
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 overflow-auto">
            <CardContent className="p-6">
              <div
                className="grid gap-0.5 w-fit mx-auto"
                style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
              >
                {puzzle.grid.map((row, r) =>
                  row.map((letter, c) => {
                    if (letter === null) return <div key={cellKey(r, c)} className="w-9 h-9 md:w-10 md:h-10" />
                    const placement = puzzle.placements.find((p) => p.row === r && p.col === c)
                    const value = entries[cellKey(r, c)] ?? ""
                    const isRight = value !== "" && value === letter
                    return (
                      <div key={cellKey(r, c)} className="relative w-9 h-9 md:w-10 md:h-10">
                        {placement && (
                          <span className="absolute top-0 left-0.5 text-[9px] font-bold text-gray-400 z-10">{placement.number}</span>
                        )}
                        <input
                          id={cellInputId(r, c)}
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleInput(r, c, e.target.value)}
                          className={`w-9 h-9 md:w-10 md:h-10 border-2 rounded-md text-center font-bold text-base md:text-lg uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                            isRight ? "bg-green-100 border-green-400 text-green-800" : "bg-white border-indigo-200 text-gray-800"
                          }`}
                        />
                      </div>
                    )
                  }),
                )}
              </div>
              <Button
                onClick={handleCheck}
                className="mt-6 w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg"
              >
                Check Puzzle
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Clues</h3>
              <ul className="space-y-3">
                {puzzle.placements.map((p) => {
                  const pair = wordPairs.find((w) => w.english.toUpperCase() === p.word)
                  const solved = checkedWords[p.word]
                  return (
                    <li
                      key={`${p.word}-${p.direction}`}
                      className={`flex items-center justify-between gap-2 p-2 rounded-xl ${solved ? "bg-green-100" : "bg-gray-50"}`}
                    >
                      <span className={`font-semibold ${solved ? "text-green-700" : "text-gray-700"}`}>
                        {p.number}. {pair?.native ?? p.word}{" "}
                        <span className="text-xs text-gray-400 font-normal">({p.direction})</span>
                      </span>
                      <button onClick={() => speakNative(pair?.native ?? "")} className="text-indigo-500 hover:text-indigo-700 shrink-0">
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
