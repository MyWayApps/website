"use client"

import { useEffect, useRef, useState } from "react"
import { Pencil, Eraser, ChevronUp } from "lucide-react"

/**
 * Inline "rough work" notepad — a freehand drawing canvas kids can open right
 * below the question to work out column sums, tally marks, etc. before
 * answering. Shared across every math game (Math Operations, Memorize
 * Tables, Shapes, Fractions, Money, Measurement) rather than rebuilt per
 * game. Rendered as a normal block by the caller (inside its own
 * max-w-* wrapper, right after the question Card) rather than as a floating
 * overlay, so it reads as part of the page instead of popping up over it.
 */
export function MathScratchpad() {
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getRelativePos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true
    lastPos.current = getRelativePos(e)
  }

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const pos = getRelativePos(e)
    ctx.strokeStyle = "#312e81"
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const endDraw = () => {
    isDrawing.current = false
    lastPos.current = null
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Fresh scratchpad each time it's opened, so old work from a previous question doesn't linger.
  useEffect(() => {
    if (isOpen) handleClear()
  }, [isOpen])

  return (
    <div className="mt-6">
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-indigo-700 rounded-full px-6 py-3 shadow-lg border-2 border-indigo-200 font-bold transition-all"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
          {isOpen ? "Hide Rough Work" : "Show Rough Work"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl p-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800">✏️ Rough Work</h3>
            <button onClick={handleClear} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Clear">
              <Eraser className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full aspect-[2/1] border-4 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/40 touch-none cursor-crosshair"
            onPointerDown={startDraw}
            onPointerMove={draw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
          />
        </div>
      )}
    </div>
  )
}
