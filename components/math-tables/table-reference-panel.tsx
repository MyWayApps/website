"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { generateTableFact, TABLE_OPERATION_SYMBOLS } from "@/lib/math-tables-data"

interface TableReferencePanelProps {
  operation: "add" | "subtract" | "multiply"
  gradientClass: string
  onBackToModes: () => void
}

const TABLE_LABEL: Record<TableReferencePanelProps["operation"], (n: number) => string> = {
  add: (n) => `Add ${n}`,
  subtract: (n) => `Subtract ${n}`,
  multiply: (n) => `${n} Table`,
}

/** Read-only reference — every fact for every table (1-10), all on one page. */
export function TableReferencePanel({ operation, gradientClass, onBackToModes }: TableReferencePanelProps) {
  const symbol = TABLE_OPERATION_SYMBOLS[operation]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">All the Tables</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <Card key={n} className="bg-white/95 shadow-xl border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-4">{TABLE_LABEL[operation](n)}</h2>
                <div className="space-y-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((pos) => {
                    const f = generateTableFact(operation, n, pos)
                    return (
                      <div key={pos} className="flex justify-between font-mono text-base font-semibold text-gray-700">
                        <span>
                          {f.a} {symbol} {f.b}
                        </span>
                        <span className="text-indigo-600">= {f.answer}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
