"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react"

export interface LessonFlashcard {
  front: string
  back: string
}

interface LessonFlashcardDeckProps {
  title: string
  gradientClass: string
  cards: LessonFlashcard[]
  onBackToModes: () => void
}

/**
 * Generic flip-card deck — tap the card to flip it, arrows to move through
 * the deck. Reusable by any future lesson that wants flashcards.
 */
export function LessonFlashcardDeck({ title, gradientClass, cards, onBackToModes }: LessonFlashcardDeckProps) {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const card = cards[index]

  const goTo = (next: number) => {
    setIndex((next + cards.length) % cards.length)
    setIsFlipped(false)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 flex flex-col items-center relative overflow-hidden`}>
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm text-white font-bold">
            {index + 1} / {cards.length}
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow">{title}</h1>
          <p className="text-white/90 mt-1">Tap the card to flip it</p>
        </div>

        <Card
          onClick={() => setIsFlipped((f) => !f)}
          className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 cursor-pointer"
        >
          <CardContent className="p-8 md:p-12 min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center text-center gap-4">
            {!isFlipped ? (
              <p className="text-3xl md:text-4xl font-bold text-gray-800">{card.front}</p>
            ) : (
              <p className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed">{card.back}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
              <RotateCw className="h-4 w-4" />
              {isFlipped ? "Tap to see the front" : "Tap to see the answer"}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={() => goTo(index - 1)}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Prev
          </Button>
          <Button
            onClick={() => goTo(index + 1)}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold px-6 py-3"
            variant="outline"
          >
            Next
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
