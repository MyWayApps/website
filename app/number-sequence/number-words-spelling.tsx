"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { RoundResult } from "./types"
import { numberToWords, randInt } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

interface NumberWordsSpellingProps {
  maxNumber: number
  onRoundComplete: (result: RoundResult) => void
  onBackToModes: () => void
}

// Word-names contain spaces and hyphens ("one hundred and five") — those render
// as fixed separators rather than tappable tiles; only letters need spelling.
type CharSlot = { type: "letter"; letterIndex: number } | { type: "separator"; char: string }

function buildSlots(word: string): CharSlot[] {
  let letterIndex = 0
  return word.split("").map((char) => {
    if (char === " " || char === "-") return { type: "separator", char }
    const slot: CharSlot = { type: "letter", letterIndex }
    letterIndex++
    return slot
  })
}

const LETTER_COLORS = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-cyan-500",
  "from-yellow-400 to-orange-500",
  "from-green-400 to-emerald-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-pink-500",
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-blue-500",
]

function generateLetters(letters: string[]) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  const distractors = alphabet
    .filter((l) => !letters.includes(l))
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(4, 12 - letters.length))
  return [...letters, ...distractors]
    .sort(() => Math.random() - 0.5)
    .map((letter, idx) => ({ letter, used: false, id: idx }))
}

export default function NumberWordsSpelling({ maxNumber, onRoundComplete, onBackToModes }: NumberWordsSpellingProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [number, setNumber] = useState(0)
  const [slots, setSlots] = useState<CharSlot[]>([])
  const [letters, setLetters] = useState<string[]>([]) // uppercase letters that must be spelled, in order
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; used: boolean; id: number }[]>([])
  const [showFeedback, setShowFeedback] = useState<null | "correct" | "wrong">(null)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)

  const setupRound = () => {
    const n = randInt(1, maxNumber)
    const word = numberToWords(n)
    const wordSlots = buildSlots(word)
    const wordLetters = word.toUpperCase().split("").filter((c) => c !== " " && c !== "-")
    setNumber(n)
    setSlots(wordSlots)
    setLetters(wordLetters)
    setSelectedLetters([])
    setAvailableLetters(generateLetters(wordLetters))
    setShowFeedback(null)
  }

  useEffect(() => {
    setRoundStartTime(Date.now())
    setupRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLetterClick = (letterId: number) => {
    if (showFeedback) return
    const letterObj = availableLetters.find((l) => l.id === letterId)
    if (!letterObj || letterObj.used) return

    const nextSelected = [...selectedLetters, letterObj.letter]
    setSelectedLetters(nextSelected)
    setAvailableLetters((prev) => prev.map((l) => (l.id === letterId ? { ...l, used: true } : l)))

    if (nextSelected.length === letters.length) {
      const isCorrect = nextSelected.join("") === letters.join("")
      setShowFeedback(isCorrect ? "correct" : "wrong")

      if (isCorrect) {
        playCorrectSound()
        const newScore = score + 1
        setTimeout(() => {
          setScore(newScore)
          if (questionIndex < 4) {
            setQuestionIndex(questionIndex + 1)
            setupRound()
          } else {
            onRoundComplete({
              topicId: "number-words",
              score: newScore,
              maxScore: 5,
              completionTimeMs: Date.now() - roundStartTime,
              difficultyLabel: `up-to-${maxNumber}-spelling`,
            })
            setPhase("results")
          }
        }, 1500)
      } else {
        playWrongSound()
        setTimeout(() => {
          setSelectedLetters([])
          setAvailableLetters(generateLetters(letters))
          setShowFeedback(null)
        }, 1200)
      }
    }
  }

  const handleRemoveLetter = (letterIndex: number) => {
    if (showFeedback) return
    const letterToRemove = selectedLetters[letterIndex]
    if (letterToRemove === undefined) return
    setSelectedLetters((prev) => prev.filter((_, i) => i !== letterIndex))
    setAvailableLetters((prev) => {
      const idx = prev.findIndex((l) => l.letter === letterToRemove && l.used)
      if (idx === -1) return prev
      const copy = [...prev]
      copy[idx] = { ...copy[idx], used: false }
      return copy
    })
  }

  const handleRestart = () => {
    setQuestionIndex(0)
    setScore(0)
    setRoundStartTime(Date.now())
    setupRound()
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={5}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToModes}
        title="Number Words Wizard!"
        gradientClass="from-lime-300 via-green-400 to-emerald-500"
      />
    )
  }

  if (slots.length === 0) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500 p-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Modes
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-xl font-bold text-green-900 mr-1">
              Question {questionIndex + 1}/5
            </span>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-green-900 mb-2">Spell the Number</h2>
              <div className="text-7xl font-black text-gray-800 my-4">{number}</div>
              <p className="text-lg text-green-700">Tap the letters to spell this number in words</p>
            </div>

            {/* Blanks display */}
            <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
              {slots.map((slot, i) =>
                slot.type === "separator" ? (
                  <div key={i} className="w-4 flex items-center justify-center text-2xl text-green-800 font-bold">
                    {slot.char === "-" ? "-" : ""}
                  </div>
                ) : (
                  <div
                    key={i}
                    onClick={() => handleRemoveLetter(slot.letterIndex)}
                    className={`w-10 h-12 md:w-12 md:h-14 rounded-xl border-4 flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 cursor-pointer ${
                      selectedLetters[slot.letterIndex]
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300 shadow-lg hover:scale-105"
                        : "bg-gray-100 border-gray-300 border-dashed"
                    }`}
                  >
                    {selectedLetters[slot.letterIndex] || ""}
                  </div>
                )
              )}
            </div>

            {/* Available letters */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {availableLetters.map((letterObj, idx) => (
                <Button
                  key={letterObj.id}
                  onClick={() => handleLetterClick(letterObj.id)}
                  disabled={letterObj.used || !!showFeedback}
                  className={`w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl font-bold rounded-xl transition-all duration-300 ${
                    letterObj.used
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      : `bg-gradient-to-br ${LETTER_COLORS[idx % LETTER_COLORS.length]} text-white shadow-lg hover:shadow-xl hover:scale-110`
                  }`}
                >
                  {letterObj.letter}
                </Button>
              ))}
            </div>

            {showFeedback && (
              <div
                className={`p-6 rounded-2xl ${showFeedback === "correct" ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"} border-4`}
              >
                <div
                  className={`text-3xl font-bold mb-2 ${showFeedback === "correct" ? "text-green-600" : "text-red-600"}`}
                >
                  {showFeedback === "correct" ? "🎉 Correct!" : "🤔 Not quite — try again!"}
                </div>
                <div className="text-xl font-medium text-gray-700 capitalize">
                  {number} = {numberToWords(number)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
