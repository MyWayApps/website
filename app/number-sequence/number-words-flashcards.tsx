"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { numberToWords, randInt } from "./question-generators"

const CARD_COUNT = 12

function generateDeck(maxNumber: number): number[] {
  const cardCount = Math.min(CARD_COUNT, maxNumber)
  const numbers = new Set<number>()
  while (numbers.size < cardCount) {
    numbers.add(randInt(1, maxNumber))
  }
  return [...numbers]
}

interface NumberWordsFlashcardsProps {
  maxNumber: number
  onBackToModes: () => void
}

export default function NumberWordsFlashcards({ maxNumber, onBackToModes }: NumberWordsFlashcardsProps) {
  const [deck, setDeck] = useState<number[]>([])
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setDeck(generateDeck(maxNumber))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prev()
      else if (event.key === "ArrowRight") next()
      else if (event.key === " ") {
        event.preventDefault()
        setIsFlipped((f) => !f)
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck])

  const prev = () => {
    if (deck.length === 0) return
    setIsFlipped(false)
    setIndex((i) => (i === 0 ? deck.length - 1 : i - 1))
  }

  const next = () => {
    if (deck.length === 0) return
    setIsFlipped(false)
    setIndex((i) => (i === deck.length - 1 ? 0 : i + 1))
  }

  if (deck.length === 0) return null

  const currentNumber = deck[index]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500 p-4 relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-between">
        <Button
          onClick={onBackToModes}
          className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Modes
        </Button>
        <div className="bg-white/30 px-4 py-2 rounded-full">
          <span className="text-green-900 font-bold text-lg">Number ↔ Words</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-900">Tap the card to flip!</h1>
        <p className="text-lg text-green-800 mt-2">{index + 1} / {deck.length}</p>
      </div>

      <div className="flex items-center justify-center gap-4 md:gap-8">
        <Button
          onClick={prev}
          variant="outline"
          className="bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-400 font-bold text-lg px-4 py-3"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="perspective-1000 cursor-pointer" onClick={() => setIsFlipped((f) => !f)}>
          <Card
            className={`w-[300px] md:w-[400px] h-[300px] md:h-[350px] shadow-2xl transition-all duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front - digits */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-100 to-green-300 rounded-xl backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-sm text-green-600 mb-2 font-semibold">NUMBER</div>
              <div className="text-7xl font-black text-green-800 text-center">{currentNumber}</div>
            </CardContent>

            {/* Back - words */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-100 to-emerald-300 rounded-xl"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="text-sm text-emerald-600 mb-2 font-semibold">WORDS</div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-800 text-center capitalize">
                {numberToWords(currentNumber)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={next}
          variant="outline"
          className="bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-400 font-bold text-lg px-4 py-3"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-8 text-center text-green-900">
        <p className="text-sm">Use ← → arrow keys to navigate, Space to flip</p>
      </div>
    </div>
  )
}
