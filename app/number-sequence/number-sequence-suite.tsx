"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { RoundResult, TopicId } from "./types"
import ForwardBackwardTopic from "./forward-backward-topic"
import CountingShapesTopic from "./counting-shapes-topic"
import NumberNeighborsTopic from "./number-neighbors-topic"
import NumberCompareTopic from "./number-compare-topic"
import PlaceValueTopic from "./place-value-topic"
import NeighborGridTopic from "./neighbor-grid-topic"
import NumberWordsTopic from "./number-words-topic"

interface TopicMeta {
  id: TopicId
  label: string
  emoji: string
  description: string
  gradient: string
}

const TOPICS: TopicMeta[] = [
  {
    id: "forward-backward",
    label: "Forward / Backward Counting",
    emoji: "📈",
    description: "Fill in ascending or descending number sequences",
    gradient: "from-blue-400 to-indigo-600",
  },
  {
    id: "counting-shapes",
    label: "Counting Shapes",
    emoji: "🔺",
    description: "Count circles, squares & triangles — easy to hard",
    gradient: "from-teal-400 to-emerald-600",
  },
  {
    id: "number-neighbors",
    label: "Before & After",
    emoji: "↔️",
    description: "What number comes right before or after?",
    gradient: "from-amber-400 to-orange-600",
  },
  {
    id: "number-compare",
    label: "Greater, Less or Equal",
    emoji: "⚖️",
    description: "Compare two numbers with >, < or =",
    gradient: "from-violet-400 to-fuchsia-600",
  },
  {
    id: "place-value",
    label: "Place Value",
    emoji: "🔢",
    description: "Hundreds, tens and ones",
    gradient: "from-sky-400 to-blue-600",
  },
  {
    id: "neighbor-grid",
    label: "Neighbor Number Grid",
    emoji: "➕",
    description: "Fill in the numbers around a given number",
    gradient: "from-pink-400 to-rose-600",
  },
  {
    id: "number-words",
    label: "Number ↔ Words",
    emoji: "🔤",
    description: "Type the number in words — and the other way round!",
    gradient: "from-lime-400 to-emerald-600",
  },
]

interface NumberSequenceSuiteProps {
  onGameComplete: (result: RoundResult) => void
  onBackToHome: () => void
}

export default function NumberSequenceSuite({ onGameComplete, onBackToHome }: NumberSequenceSuiteProps) {
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null)

  const handleRoundComplete = (result: RoundResult) => {
    onGameComplete(result)
  }

  const handleBackToTopics = () => setActiveTopic(null)

  if (activeTopic === "forward-backward") {
    return <ForwardBackwardTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }
  if (activeTopic === "counting-shapes") {
    return <CountingShapesTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }
  if (activeTopic === "number-neighbors") {
    return <NumberNeighborsTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }
  if (activeTopic === "number-compare") {
    return <NumberCompareTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }
  if (activeTopic === "place-value") {
    return <PlaceValueTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }
  if (activeTopic === "neighbor-grid") {
    return <NeighborGridTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }
  if (activeTopic === "number-words") {
    return <NumberWordsTopic onRoundComplete={handleRoundComplete} onBackToTopics={handleBackToTopics} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-400 to-purple-500 p-4 relative overflow-hidden">
      <img
        src="/characters/giraffe.png"
        alt="Giraffe"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToHome}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2 font-sans tracking-tight">
            📈 Number Sequence Challenge
          </h1>
          <p className="text-xl text-white/90 font-medium">Pick a topic — each round has 5 questions!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`bg-gradient-to-br ${topic.gradient} border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <CardContent className="p-6 text-center text-white">
                <div className="text-5xl mb-3">{topic.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{topic.label}</h3>
                <p className="text-sm text-white/90">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
