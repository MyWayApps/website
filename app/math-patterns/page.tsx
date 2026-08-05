"use client"

import { Fragment } from "react"
import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { VisualMCQGame } from "@/components/math-topics/visual-mcq-game"
import {
  generateNextInPatternQuestion,
  generateMissingPieceQuestion,
  generateNumberPatternQuestion,
} from "@/lib/math-patterns-data"

const GRADIENT = "from-pink-300 via-rose-400 to-red-500"

function ShapeSequenceRow({ sequence }: { sequence: (string | null)[] }) {
  return (
    <div className="flex justify-center gap-3 flex-wrap mb-2">
      {sequence.map((s, i) => (
        <div
          key={i}
          className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl border-4 text-4xl md:text-5xl ${
            s === null ? "border-dashed border-rose-400 bg-rose-50 text-rose-400" : "border-rose-200 bg-white"
          }`}
        >
          {s === null ? "?" : s}
        </div>
      ))}
    </div>
  )
}

function NumberSequenceRow({ sequence }: { sequence: (number | null)[] }) {
  return (
    <div className="flex justify-center items-center gap-2 flex-wrap mb-2">
      {sequence.map((n, i) => (
        <Fragment key={i}>
          <div
            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl border-4 text-3xl md:text-4xl font-bold ${
              n === null ? "border-dashed border-rose-400 bg-rose-50 text-rose-400" : "border-rose-200 bg-white text-gray-800"
            }`}
          >
            {n === null ? "?" : n}
          </div>
          {i < sequence.length - 1 && <span className="text-2xl text-gray-400 font-bold">→</span>}
        </Fragment>
      ))}
    </div>
  )
}

const MODES: TopicMode[] = [
  {
    id: "next",
    label: "What Comes Next?",
    emoji: "➡️",
    description: "Spot the pattern and finish it",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="What Comes Next?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateNextInPatternQuestion("math-patterns:next")
          return {
            ...q,
            prompt: (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700 mb-6">What comes next?</p>
                <ShapeSequenceRow sequence={q.sequence} />
              </div>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "missing",
    label: "Find the Missing One",
    emoji: "🧩",
    description: "Fill the gap in the pattern",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Find the Missing One"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateMissingPieceQuestion("math-patterns:missing")
          return {
            ...q,
            prompt: (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700 mb-6">What belongs in the gap?</p>
                <ShapeSequenceRow sequence={q.sequence} />
              </div>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "numbers",
    label: "Number Patterns",
    emoji: "🔢",
    description: "Count on and find the next number",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Number Patterns"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateNumberPatternQuestion("math-patterns:numbers")
          return {
            ...q,
            prompt: (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700 mb-6">What number comes next?</p>
                <NumberSequenceRow sequence={q.sequence} />
              </div>
            ),
          }
        }}
      />
    ),
  },
]

export default function MathPatternsPage() {
  return <TopicHub title="Patterns" emoji="🧩" gradient={GRADIENT} applicationName="Patterns" modes={MODES} />
}
