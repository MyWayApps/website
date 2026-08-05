"use client"

import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { VisualMCQGame } from "@/components/math-topics/visual-mcq-game"
import { MoneyVisual } from "@/components/math-topics/money-visual"
import {
  generateIdentifyMoneyQuestion,
  generateCountMoneyQuestion,
  generateCompareMoneyQuestion,
} from "@/lib/math-money-data"

const GRADIENT = "from-sky-300 via-blue-400 to-cyan-500"

const MODES: TopicMode[] = [
  {
    id: "identify",
    label: "Identify the Note/Coin",
    emoji: "🪙",
    description: "How much is this worth?",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="How Much Is This?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateIdentifyMoneyQuestion("math-money:identify")
          return { ...q, prompt: <MoneyVisual value={q.piece.value} kind={q.piece.kind} /> }
        }}
      />
    ),
  },
  {
    id: "count",
    label: "Count the Money",
    emoji: "💰",
    description: "Add up the coins",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="How Much Money Is There?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateCountMoneyQuestion("math-money:count")
          return {
            ...q,
            prompt: (
              <div className="flex justify-center gap-4 flex-wrap">
                {q.pieces.map((p, i) => (
                  <MoneyVisual key={i} value={p.value} kind={p.kind} />
                ))}
              </div>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "compare",
    label: "Which Costs More?",
    emoji: "🛒",
    description: "Compare two prices",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Which Toy Costs More?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateCompareMoneyQuestion("math-money:compare")
          return {
            ...q,
            prompt: (
              <div className="flex justify-center gap-10 text-center">
                <div>
                  <div className="text-6xl mb-2">🧸</div>
                  <div className="text-2xl font-bold text-gray-700">₹{q.priceA}</div>
                </div>
                <div>
                  <div className="text-6xl mb-2">🚗</div>
                  <div className="text-2xl font-bold text-gray-700">₹{q.priceB}</div>
                </div>
              </div>
            ),
          }
        }}
      />
    ),
  },
]

export default function MathMoneyPage() {
  return <TopicHub title="Money" emoji="💰" gradient={GRADIENT} applicationName="Money" modes={MODES} />
}
