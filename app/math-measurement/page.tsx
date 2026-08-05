"use client"

import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { VisualMCQGame } from "@/components/math-topics/visual-mcq-game"
import {
  generateLengthQuestion,
  generateWeightQuestion,
  generateCapacityQuestion,
  generateMeasureQuestion,
  generateSizeQuestion,
} from "@/lib/math-measurement-data"

const GRADIENT = "from-orange-300 via-amber-400 to-yellow-500"

function ComparisonPrompt({ question, question2 }: { question: string; question2: { pair: { a: { emoji: string; label: string }; b: { emoji: string; label: string } } } }) {
  const { a, b } = question2.pair
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-700 mb-6">{question}</p>
      <div className="flex justify-center gap-12">
        <div>
          <div className="text-7xl mb-2">{a.emoji}</div>
          <div className="text-xl font-bold text-gray-700">{a.label}</div>
        </div>
        <div>
          <div className="text-7xl mb-2">{b.emoji}</div>
          <div className="text-xl font-bold text-gray-700">{b.label}</div>
        </div>
      </div>
    </div>
  )
}

function MeasureItPrompt({ question }: { question: { item: { emoji: string; label: string; units: number } } }) {
  const { item } = question
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-700 mb-6">How many 📎 long is the {item.label.toLowerCase()}?</p>
      <div className="text-7xl mb-4">{item.emoji}</div>
      <div className="flex justify-center gap-1 flex-wrap max-w-md mx-auto">
        {Array.from({ length: item.units }, (_, i) => (
          <span key={i} className="text-3xl">
            📎
          </span>
        ))}
      </div>
    </div>
  )
}

function SizeTrioPrompt({
  question,
  askBiggest,
}: {
  question: { trio: { items: { emoji: string; label: string }[] } }
  askBiggest: boolean
}) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-700 mb-6">Which one is the {askBiggest ? "biggest" : "smallest"}?</p>
      <div className="flex justify-center gap-8 flex-wrap">
        {question.trio.items.map((item) => (
          <div key={item.label}>
            <div className="text-7xl mb-2">{item.emoji}</div>
            <div className="text-xl font-bold text-gray-700">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MODES: TopicMode[] = [
  {
    id: "length",
    label: "Longer or Shorter?",
    emoji: "📏",
    description: "Compare the length of two things",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Which Is Longer?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateLengthQuestion("math-measurement:length")
          return { ...q, prompt: <ComparisonPrompt question="Which one is longer?" question2={q} /> }
        }}
      />
    ),
  },
  {
    id: "weight",
    label: "Heavier or Lighter?",
    emoji: "⚖️",
    description: "Compare the weight of two things",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Which Is Heavier?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateWeightQuestion("math-measurement:weight")
          return { ...q, prompt: <ComparisonPrompt question="Which one is heavier?" question2={q} /> }
        }}
      />
    ),
  },
  {
    id: "capacity",
    label: "More or Less?",
    emoji: "🪣",
    description: "Compare how much two things hold",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Which Holds More?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateCapacityQuestion("math-measurement:capacity")
          return { ...q, prompt: <ComparisonPrompt question="Which one holds more?" question2={q} /> }
        }}
      />
    ),
  },
  {
    id: "measure-it",
    label: "Measure It",
    emoji: "📎",
    description: "Count how many paperclips long",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Measure It"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateMeasureQuestion("math-measurement:measure-it")
          return { ...q, prompt: <MeasureItPrompt question={q} /> }
        }}
      />
    ),
  },
  {
    id: "size",
    label: "Smallest or Biggest?",
    emoji: "📐",
    description: "Pick out the biggest or smallest thing",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Smallest or Biggest?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateSizeQuestion("math-measurement:size")
          return { ...q, prompt: <SizeTrioPrompt question={q} askBiggest={q.askBiggest} /> }
        }}
      />
    ),
  },
]

export default function MathMeasurementPage() {
  return <TopicHub title="Measurement" emoji="📏" gradient={GRADIENT} applicationName="Measurement" modes={MODES} />
}
