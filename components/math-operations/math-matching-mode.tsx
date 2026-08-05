"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { OPERATION_SYMBOLS, generateNumericalQuestion, type DigitLevel, type Operation } from "@/lib/math-operations-data"

const PAIR_COUNT = 5

interface MatchCard {
  id: number
  pairId: number
  display: string
  type: "equation" | "answer"
}

function generateCards(operation: Operation, digitLevel: DigitLevel, gameKey: string): MatchCard[] {
  const symbol = OPERATION_SYMBOLS[operation]
  const cards: MatchCard[] = []
  // Every pair's answer must be unique, or two different equations can land on
  // the same displayed number and matching becomes ambiguous/impossible to win.
  const usedAnswers = new Set<number>()
  let id = 0
  for (let pairId = 0; pairId < PAIR_COUNT; pairId++) {
    let q = generateNumericalQuestion(operation, digitLevel, gameKey)
    let attempts = 0
    while (usedAnswers.has(q.answer) && attempts < 30) {
      q = generateNumericalQuestion(operation, digitLevel, gameKey)
      attempts++
    }
    usedAnswers.add(q.answer)
    cards.push({ id: id++, pairId, display: `${q.a} ${symbol} ${q.b}`, type: "equation" })
    cards.push({ id: id++, pairId, display: String(q.answer), type: "answer" })
  }
  return [...cards].sort(() => Math.random() - 0.5)
}

interface MathMatchingModeProps {
  operation: Operation
  digitLevel: DigitLevel
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

export default function MathMatchingMode({ operation, digitLevel, gradientClass, onBackToModes, onComplete }: MathMatchingModeProps) {
  const gameKey = `math-${operation}:${digitLevel}:matching`
  const [cards, setCards] = useState<MatchCard[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set())
  const [touchedIds, setTouchedIds] = useState<Set<number>>(new Set())
  const [firstTryScore, setFirstTryScore] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [phase, setPhase] = useState<"playing" | "results">("playing")

  useEffect(() => {
    setCards(generateCards(operation, digitLevel, gameKey))
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
      const isMatch = first.pairId === second.pairId

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
            onComplete(newFirstTryScore, PAIR_COUNT)
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
    setCards(generateCards(operation, digitLevel, gameKey))
    setFlipped([])
    setMatchedIds(new Set())
    setTouchedIds(new Set())
    setFirstTryScore(0)
    setIsChecking(false)
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={firstTryScore}
        maxScore={PAIR_COUNT}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToModes}
        title="Matching Master!"
        gradientClass={gradientClass}
      />
    )
  }

  if (cards.length === 0) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            {Array.from({ length: PAIR_COUNT }, (_, i) => (
              <Star
                key={i}
                className={`h-8 w-8 transition-all ${
                  i < matchedIds.size / 2 ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-10 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Match the Equation to Its Answer</h2>
              <p className="text-lg text-gray-600">Tap two cards to make a pair</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 max-w-4xl mx-auto">
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
                          ? "bg-white border-indigo-400 border-4 scale-105"
                          : "bg-gradient-to-br from-indigo-400 to-purple-600 hover:scale-105"
                    }`}
                  >
                    <CardContent className="p-2 text-center flex items-center justify-center h-full">
                      {isFaceUp ? (
                        <span className="font-bold text-gray-800 text-2xl md:text-3xl">{card.display}</span>
                      ) : (
                        <span className="text-4xl">❓</span>
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
