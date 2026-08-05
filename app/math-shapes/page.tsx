"use client"

import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { VisualMCQGame } from "@/components/math-topics/visual-mcq-game"
import { GenericMatchingMode } from "@/components/math-topics/generic-matching-mode"
import { ShapeIcon } from "@/components/math-topics/shape-icon"
import { ShapeReferencePanel } from "@/components/math-topics/shape-reference-panel"
import { generateIdentifyShapeQuestion, generate2DOr3DQuestion, generateRealLifeMatchPairs } from "@/lib/math-shapes-data"

const GRADIENT = "from-green-300 via-emerald-400 to-teal-500"

const SHAPE_VIDEOS = [
  {
    id: "plane-shapes",
    title: "Plane Shapes",
    youtubeId: "4PlMoMVIP6M",
    description: "Flat 2D shapes like circles, squares and triangles.",
  },
  {
    id: "solid-shapes",
    title: "Solid Shapes",
    youtubeId: "LHmupcXiWh8",
    description: "3D shapes like cubes, spheres and cones, and where we see them around us.",
  },
]

const MODES: TopicMode[] = [
  {
    id: "all-shapes",
    label: "All Shapes",
    emoji: "📋",
    description: "Browse every plane and solid shape",
    render: ({ onBackToModes }) => <ShapeReferencePanel gradientClass={GRADIENT} onBackToModes={onBackToModes} />,
  },
  {
    id: "identify",
    label: "Identify the Shape",
    emoji: "🔺",
    description: "Name the flat and solid shapes",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Identify the Shape"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateIdentifyShapeQuestion("math-shapes:identify")
          return { ...q, prompt: <ShapeIcon shape={q.shape} /> }
        }}
      />
    ),
  },
  {
    id: "2d-or-3d",
    label: "2D or 3D?",
    emoji: "📐",
    description: "Sort flat shapes from solid shapes",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Flat or Solid?"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generate2DOr3DQuestion("math-shapes:2d-or-3d")
          return { ...q, prompt: <ShapeIcon shape={q.shape} /> }
        }}
      />
    ),
  },
  {
    id: "match",
    label: "Match to Real Life",
    emoji: "🧩",
    description: "Pair each shape with an everyday object",
    render: ({ onBackToModes, onComplete }) => (
      <GenericMatchingMode
        title="Match the Shape to Real Life"
        gradientClass={GRADIENT}
        generatePairs={generateRealLifeMatchPairs}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
      />
    ),
  },
]

export default function MathShapesPage() {
  return <TopicHub title="Shapes" emoji="🔺" gradient={GRADIENT} applicationName="Shapes" modes={MODES} videos={SHAPE_VIDEOS} />
}
