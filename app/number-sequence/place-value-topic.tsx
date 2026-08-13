"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { TopicProps } from "./types"
import PlaceValueBlocksTopic from "./place-value-blocks-topic"
import PlaceValueDigitsTopic from "./place-value-digits-topic"

type Mode = "blocks" | "digits"

interface ModeMeta {
  id: Mode
  label: string
  emoji: string
  description: string
  gradient: string
}

const MODES: ModeMeta[] = [
  {
    id: "blocks",
    label: "Base-Ten Blocks",
    emoji: "🧱",
    description: "See the blocks, then type the number they show",
    gradient: "from-violet-400 to-blue-600",
  },
  {
    id: "digits",
    label: "Place Value Digits",
    emoji: "🔢",
    description: "How many hundreds, tens or ones are in a number?",
    gradient: "from-sky-400 to-blue-600",
  },
]

export default function PlaceValueTopic({ onRoundComplete, onBackToTopics }: TopicProps) {
  const [activeMode, setActiveMode] = useState<Mode | null>(null)

  const handleBackToModes = () => setActiveMode(null)

  if (activeMode === "blocks") {
    return <PlaceValueBlocksTopic onRoundComplete={onRoundComplete} onBackToModes={handleBackToModes} />
  }
  if (activeMode === "digits") {
    return <PlaceValueDigitsTopic onRoundComplete={onRoundComplete} onBackToModes={handleBackToModes} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 p-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToTopics}
            className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Topics
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 font-sans tracking-tight">
            🔢 Place Value
          </h1>
          <p className="text-xl text-white/90 font-medium">Choose how you'd like to practice place value!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
