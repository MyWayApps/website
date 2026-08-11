"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { AnimatedOperationGame } from "@/components/math-tables/animated-operation-game"
import { NumberLineTableGame } from "@/components/math-tables/number-line-table-game"
import { TableMcqGame } from "@/components/math-tables/table-mcq-game"
import { TableReferencePanel } from "@/components/math-tables/table-reference-panel"
import type { TableOperation } from "@/lib/math-tables-data"

const GRADIENT = "from-indigo-300 via-blue-400 to-cyan-500"

const OPERATIONS: { id: TableOperation; label: string; emoji: string }[] = [
  { id: "add", label: "Learn Addition", emoji: "➕" },
  { id: "subtract", label: "Learn Subtraction", emoji: "➖" },
  { id: "multiply", label: "Learn Multiplication", emoji: "✖️" },
  { id: "divide", label: "Learn Division", emoji: "➗" },
]

function modesForOperation(operation: TableOperation): TopicMode[] {
  const animated: TopicMode = {
    id: "animated",
    label: "Animated",
    emoji: "🎬",
    description: "Watch the story, then answer",
    render: ({ onBackToModes, onComplete }) => (
      <AnimatedOperationGame operation={operation} gradientClass={GRADIENT} onBackToModes={onBackToModes} onComplete={onComplete} />
    ),
  }

  if (operation === "divide") {
    return [animated]
  }

  const numberLine: TopicMode = {
    id: "number-line",
    label: "Number Line Hop",
    // Matches the character NumberLineTableGame actually plays with below (kangaroo for add, rabbit for subtract).
    emoji: operation === "subtract" ? "🐇" : "🦘",
    description: "Watch the hop, then type the answer",
    render: ({ onBackToModes, onComplete }) => (
      <NumberLineTableGame
        operation={operation as "add" | "subtract"}
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
      />
    ),
  }

  const mcq: TopicMode = {
    id: "mcq",
    label: "Final Test",
    emoji: "🏆",
    description: "Master a table with a mix of quiz questions",
    render: ({ onBackToModes, onComplete }) => (
      <TableMcqGame
        operation={operation as "add" | "subtract" | "multiply"}
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
      />
    ),
  }

  const allTables: TopicMode = {
    id: "all-tables",
    label: "Table Book",
    emoji: "📖",
    description: "Browse every fact, table by table",
    render: ({ onBackToModes }) => (
      <TableReferencePanel operation={operation as "add" | "subtract" | "multiply"} gradientClass={GRADIENT} onBackToModes={onBackToModes} />
    ),
  }

  if (operation === "multiply") {
    return [animated, mcq, allTables]
  }

  return [numberLine, animated, mcq, allTables]
}

export default function MathTablesPage() {
  const [operation, setOperation] = useState<TableOperation | null>(null)

  if (operation) {
    const meta = OPERATIONS.find((o) => o.id === operation)!
    return (
      <TopicHub
        title={meta.label}
        emoji={meta.emoji}
        gradient={GRADIENT}
        // Each operation keeps its own score bucket rather than pooling into one
        // "Memorize Tables" total — Addition and Multiplication progress shouldn't blend.
        applicationName={`Memorize ${meta.label.replace("Learn ", "")}`}
        modes={modesForOperation(operation)}
        onBack={() => setOperation(null)}
        backLabel="Back"
      />
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 relative overflow-hidden`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => (window.location.href = "/#math")}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 tracking-tight">🔢 Memorize Tables</h1>
          <p className="text-xl text-white/90 font-medium">Choose what you'd like to learn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {OPERATIONS.map((op) => (
            <Card
              key={op.id}
              onClick={() => setOperation(op.id)}
              className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardContent className="p-10 text-center">
                <div className="text-6xl mb-4">{op.emoji}</div>
                <h3 className="text-3xl font-bold text-gray-800">{op.label}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
