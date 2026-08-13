"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import type { RoundResult } from "./types"
import { numberToWords, randInt, shuffle } from "./question-generators"
import { playCorrectSound, playWrongSound } from "./audio"

const PAIR_COUNT = 5

interface MatchCard {
  id: number
  number: number
  display: string
  type: "digit" | "word"
}

function generateCards(maxNumber: number): MatchCard[] {
  const pairCount = Math.min(PAIR_COUNT, maxNumber)
  const numbers = new Set<number>()
  while (numbers.size < pairCount) {
    numbers.add(randInt(1, maxNumber))
  }
  const cards: MatchCard[] = []
  let id = 0
  for (const n of numbers) {
    cards.push({ id: id++, number: n, display: String(n), type: "digit" })
    cards.push({ id: id++, number: n, display: numberToWords(n), type: "word" })
  }
  return shuffle(cards)
}

interface NumberWordsMatchingProps {
  maxNumber: number
  onRoundComplete: (result: RoundResult) => void
  onBackToModes: () => void
}

export default function NumberWordsMatching({ maxNumber, onRoundComplete, onBackToModes }: NumberWordsMatchingProps) {
  const [cards, setCards] = useState<MatchCard[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set())
  const [touchedIds, setTouchedIds] = useState<Set<number>>(new Set())
  const [firstTryScore, setFirstTryScore] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundStartTime, setRoundStartTime] = useState(0)

  useEffect(() => {
    setRoundStartTime(Date.now())
    setCards(generateCards(maxNumber))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCardClick = (card: MatchCard) => {
    if (isChecking || matchedIds.has(card.id) || flipped.includes(card.id) || flipped.length === 2) return

    const nextFlipped = [...flipped, card.id]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      setIsChecking(true)
      const [firstId, secondId] = nextFlipped
      const first = cards.find((c) => c.id === firstId)!
      const second = cards.find((c) => c.id === secondId)!
      const isMatch = first.number === second.number

      setTimeout(() => {
        if (isMatch) {
          playCorrectSound()
          const wasFirstTry = !touchedIds.has(firstId) && !touchedIds.has(secondId)
          const newMatchedIds = new Set(matchedIds)
          newMatchedIds.add(firstId)
          newMatchedIds.add(secondId)
          setMatchedIds(newMatchedIds)
          const newFirstTryScore = wasFirstTry ? firstTryScore + 1 : firstTryScore
          if (wasFirstTry) setFirstTryScore(newFirstTryScore)
          setFlipped([])
          setIsChecking(false)

          if (newMatchedIds.size === cards.length) {
            onRoundComplete({
              topicId: "number-words",
              score: newFirstTryScore,
              maxScore: PAIR_COUNT,
              completionTimeMs: Date.now() - roundStartTime,
              difficultyLabel: `up-to-${maxNumber}-matching`,
            })
            setPhase("results")
          }
        } else {
          playWrongSound()
          setTouchedIds((prev) => new Set(prev).add(firstId).add(secondId))
          setFlipped([])
          setIsChecking(false)
        }
      }, 900)
    }
  }

  const handleRestart = () => {
    setCards(generateCards(maxNumber))
    setFlipped([])
    setMatchedIds(new Set())
    setTouchedIds(new Set())
    setFirstTryScore(0)
    setIsChecking(false)
    setRoundStartTime(Date.now())
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={firstTryScore}
        maxScore={PAIR_COUNT}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToModes}
        title="Number Words Wizard!"
        gradientClass="from-lime-300 via-green-400 to-emerald-500"
      />
    )
  }

  if (cards.length === 0) return null

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

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-green-900">
              Pairs found: {matchedIds.size / 2}/{PAIR_COUNT}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-900 mb-2">Number ↔ Words Matching</h2>
              <p className="text-lg text-green-700">Tap two cards to match a number with its words</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-3xl mx-auto">
              {cards.map((card) => {
                const isFaceUp = flipped.includes(card.id) || matchedIds.has(card.id)
                const isMatched = matchedIds.has(card.id)
                return (
                  <Card
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg ${
                      isMatched
                        ? "bg-green-100 border-green-500 border-4 opacity-70"
                        : isFaceUp
                          ? "bg-white border-green-400 border-4 scale-105"
                          : "bg-gradient-to-br from-emerald-400 to-green-600 hover:scale-105"
                    }`}
                  >
                    <CardContent className="p-2 text-center flex items-center justify-center h-full">
                      {isFaceUp ? (
                        <span
                          className={`font-bold text-gray-800 capitalize ${card.type === "digit" ? "text-2xl md:text-3xl" : "text-sm md:text-base"}`}
                        >
                          {card.display}
                        </span>
                      ) : (
                        <span className="text-3xl">🔢</span>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
