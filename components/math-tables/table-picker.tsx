"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { generateTableFact, TABLE_OPERATION_SYMBOLS, type TableOperation } from "@/lib/math-tables-data"

interface TablePickerProps {
  operation: "add" | "subtract" | "multiply"
  gradientClass: string
  onBack: () => void
  onPick: (tableNumber: number) => void
}

const TABLE_LABEL: Record<TablePickerProps["operation"], (n: number) => string> = {
  add: (n) => `Add ${n}`,
  subtract: (n) => `Subtract ${n}`,
  multiply: (n) => `${n} Table`,
}

const BADGE_COLORS = [
  "from-rose-400 to-pink-500",
  "from-orange-400 to-amber-500",
  "from-yellow-400 to-lime-500",
  "from-green-400 to-emerald-500",
  "from-teal-400 to-cyan-500",
  "from-sky-400 to-blue-500",
  "from-indigo-400 to-violet-500",
  "from-purple-400 to-fuchsia-500",
  "from-pink-400 to-rose-500",
  "from-red-400 to-orange-500",
]

export function TablePicker({ operation, gradientClass, onBack, onPick }: TablePickerProps) {
  const symbol = TABLE_OPERATION_SYMBOLS[operation as TableOperation]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight">Choose a Table to Practice</h1>
          <p className="text-xl text-white/90 font-medium mt-2">Pick a number, then practice its facts</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const previewFacts = [1, 2, 3].map((pos) => generateTableFact(operation, n, pos))
            return (
              <Card
                key={n}
                onClick={() => onPick(n)}
                className="bg-white/95 border-0 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${BADGE_COLORS[(n - 1) % BADGE_COLORS.length]} py-6 flex items-center justify-center`}>
                    <span className="text-5xl font-black text-white drop-shadow">{n}</span>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-xl font-bold text-gray-800 mb-3">{TABLE_LABEL[operation](n)}</div>
                    <div className="space-y-1">
                      {previewFacts.map((f, i) => (
                        <div key={i} className="text-sm font-semibold text-gray-500 font-mono">
                          {f.a} {symbol} {f.b} = {f.answer}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
