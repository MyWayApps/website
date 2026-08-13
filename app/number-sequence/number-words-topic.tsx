"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { TopicProps } from "./types"
import NumberWordsQuiz from "./number-words-quiz"
import NumberWordsMultipleChoice from "./number-words-multiple-choice"
import NumberWordsFlashcards from "./number-words-flashcards"
import NumberWordsMatching from "./number-words-matching"
import NumberWordsSpelling from "./number-words-spelling"

type Mode = "quiz" | "mcq" | "flashcards" | "matching" | "spelling"

interface ModeMeta {
  id: Mode
  label: string
  emoji: string
  description: string
  gradient: string
}

const MODES: ModeMeta[] = [
  {
    id: "quiz",
    label: "Quiz",
    emoji: "⌨️",
    description: "Type the number, or type its words",
    gradient: "from-blue-400 to-indigo-600",
  },
  {
    id: "mcq",
    label: "Multiple Choice",
    emoji: "✅",
    description: "Pick the matching number or words",
    gradient: "from-teal-400 to-emerald-600",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    emoji: "🔄",
    description: "Flip cards to learn number names",
    gradient: "from-amber-400 to-orange-600",
  },
  {
    id: "matching",
    label: "Matching Game",
    emoji: "🧩",
    description: "Pair each number with its words",
    gradient: "from-pink-400 to-rose-600",
  },
  {
    id: "spelling",
    label: "Spell It Out",
    emoji: "🔤",
    description: "Tap letters to spell the number in words",
    gradient: "from-violet-400 to-fuchsia-600",
  },
]

export default function NumberWordsTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [maxNumber, setMaxNumber] = useState<number | null>(null)
  const [activeMode, setActiveMode] = useState<Mode | null>(null)

  const handleBackToModes = () => setActiveMode(null)

  if (maxNumber !== null) {
    if (activeMode === "quiz") {
      return <NumberWordsQuiz maxNumber={maxNumber} onRoundComplete={onRoundComplete} onBackToModes={handleBackToModes} />
    }
    if (activeMode === "mcq") {
      return (
        <NumberWordsMultipleChoice maxNumber={maxNumber} onRoundComplete={onRoundComplete} onBackToModes={handleBackToModes} />
      )
    }
    if (activeMode === "flashcards") {
      return <NumberWordsFlashcards maxNumber={maxNumber} onBackToModes={handleBackToModes} />
    }
    if (activeMode === "matching") {
      return <NumberWordsMatching maxNumber={maxNumber} onRoundComplete={onRoundComplete} onBackToModes={handleBackToModes} />
    }
    if (activeMode === "spelling") {
      return <NumberWordsSpelling maxNumber={maxNumber} onRoundComplete={onRoundComplete} onBackToModes={handleBackToModes} />
    }
  }

  if (maxNumber === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500 p-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToTopics}
              className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Topics
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-green-900 mb-4 font-sans">🔤 Number ↔ Words</h2>
                <p className="text-lg text-green-700 font-medium">Choose your challenge settings</p>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Number Range</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[10, 50, 100, 1000].map((maxNum) => (
                      <Button
                        key={maxNum}
                        onClick={() => setMaxNumber(maxNum)}
                        className="h-20 text-xl font-bold border-4 transition-all duration-300 bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                        variant="outline"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl">🔢</span>
                          <span>Up to {maxNum}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-300 via-green-400 to-emerald-500 p-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setMaxNumber(null)}
            className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Setup
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 font-sans tracking-tight">
            🔤 Number ↔ Words
          </h1>
          <p className="text-xl text-white/90 font-medium">Choose how you'd like to practice number names!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODES.map((mode) => (
            <Card
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`bg-gradient-to-br ${mode.gradient} border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <CardContent className="p-6 text-center text-white">
                <div className="text-5xl mb-3">{mode.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{mode.label}</h3>
                <p className="text-sm text-white/90">{mode.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
