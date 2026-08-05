"use client"

import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { VisualMCQGame } from "@/components/math-topics/visual-mcq-game"
import { ShadeFractionGame } from "@/components/math-topics/shade-fraction-game"
import { FractionCircle } from "@/components/math-topics/fraction-circle"
import {
  generateIdentifyFractionQuestion,
  generateCompareFractionsQuestion,
  generateShadeFractionTarget,
} from "@/lib/math-fractions-data"

const GRADIENT = "from-violet-300 via-purple-400 to-fuchsia-500"

const MODES: TopicMode[] = [
  {
    id: "identify-simple",
    label: "Identify Simple Fractions",
    emoji: "🥧",
    description: "What fraction is shaded?",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="What Fraction Is Shaded?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateIdentifyFractionQuestion("simple", "math-fractions:identify-simple")
          return {
            ...q,
            prompt: (
              <div className="flex justify-center gap-4 flex-wrap">
                {q.circles.map((c, i) => (
                  <FractionCircle key={i} numerator={c.numerator} denominator={c.denominator} />
                ))}
              </div>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "identify-mixed",
    label: "Identify Mixed Fractions",
    emoji: "🍕",
    description: "Whole numbers plus a fraction",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="What Number Is Shown?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateIdentifyFractionQuestion("mixed", "math-fractions:identify-mixed")
          return {
            ...q,
            prompt: (
              <div className="flex justify-center gap-4 flex-wrap">
                {q.circles.map((c, i) => (
                  <FractionCircle key={i} numerator={c.numerator} denominator={c.denominator} size={100} />
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
    label: "Compare Fractions",
    emoji: "⚖️",
    description: "Which fraction is bigger?",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Which Is Bigger?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateCompareFractionsQuestion("math-fractions:compare")
          return {
            ...q,
            prompt: (
              <div className="flex justify-center gap-10">
                <div className="text-center">
                  <FractionCircle numerator={q.a.numerator} denominator={q.a.denominator} size={110} />
                  <div className="mt-2 text-xl font-bold text-gray-700">A: {q.a.numerator}/{q.a.denominator}</div>
                </div>
                <div className="text-center">
                  <FractionCircle numerator={q.b.numerator} denominator={q.b.denominator} size={110} />
                  <div className="mt-2 text-xl font-bold text-gray-700">B: {q.b.numerator}/{q.b.denominator}</div>
                </div>
              </div>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "shade",
    label: "Shade the Fraction",
    emoji: "🎨",
    description: "Tap to shade the right amount",
    render: ({ onBackToModes, onComplete }) => (
      <ShadeFractionGame
        gradientClass={GRADIENT}
        generateFraction={() => generateShadeFractionTarget("math-fractions:shade")}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
      />
    ),
  },
]

export default function MathFractionsPage() {
  return <TopicHub title="Fractions" emoji="🥧" gradient={GRADIENT} applicationName="Fractions" modes={MODES} />
}
