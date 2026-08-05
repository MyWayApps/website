"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ShapeIcon } from "@/components/math-topics/shape-icon"
import { SHAPES } from "@/lib/math-shapes-data"

interface ShapeReferencePanelProps {
  gradientClass: string
  onBackToModes: () => void
}

/** Read-only browse view — all shapes at a glance, grouped into a Plane (2D) panel and a Solid (3D) panel. */
export function ShapeReferencePanel({ gradientClass, onBackToModes }: ShapeReferencePanelProps) {
  const planeShapes = SHAPES.filter((s) => s.kind === "2d")
  const solidShapes = SHAPES.filter((s) => s.kind === "3d")

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-5xl mx-auto">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow">All the Shapes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Plane Shapes (2D)</h2>
              <div className="grid grid-cols-2 gap-6">
                {planeShapes.map((shape) => (
                  <div key={shape.id} className="flex flex-col items-center gap-3">
                    <ShapeIcon shape={shape} size={90} />
                    <span className="text-lg font-bold text-gray-700">{shape.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Solid Shapes (3D)</h2>
              <div className="grid grid-cols-2 gap-6">
                {solidShapes.map((shape) => (
                  <div key={shape.id} className="flex flex-col items-center gap-3">
                    <ShapeIcon shape={shape} size={90} />
                    <span className="text-lg font-bold text-gray-700">{shape.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
