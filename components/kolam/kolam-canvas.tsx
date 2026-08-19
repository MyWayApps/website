"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getDotPositions, type DotLoop, type Point, type Stroke } from "@/lib/kolam"

interface KolamCanvasProps {
  gridSize: number
  /** Sparse dot layout — see KolamLevel.dotPattern. Omit for a full grid. */
  dotPattern?: [number, number][]
  ghostLoops?: DotLoop[]
  strokes: Stroke[]
  onStrokesChange: (strokes: Stroke[]) => void
  /** Set false for a static, non-interactive preview render. */
  interactive?: boolean
}

// Fraction of the canvas reserved as empty margin around the dot grid, so
// per-dot ghost loops (which overlap outward past the boundary dots) and a
// user's own loop drawn "around" the outermost dots both have somewhere to
// go without hitting the canvas edge.
const PADDING = 0.32

export function KolamCanvas({ gridSize, dotPattern, ghostLoops, strokes, onStrokesChange, interactive = true }: KolamCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef<Stroke | null>(null)
  const [canvasSize, setCanvasSize] = useState(300)
  const [dpr, setDpr] = useState(1)

  useEffect(() => {
    setDpr(window.devicePixelRatio || 1)
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setCanvasSize(Math.round(width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toGridSpace = useCallback((clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const px = (clientX - rect.left) / rect.width
    const py = (clientY - rect.top) / rect.height
    const inner = 1 - 2 * PADDING
    return { x: (px - PADDING) / inner, y: (py - PADDING) / inner }
  }, [])

  const toPixels = useCallback((pt: Point, size: number): Point => {
    const inner = size * (1 - 2 * PADDING)
    const offset = size * PADDING
    return { x: offset + pt.x * inner, y: offset + pt.y * inner }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)

    if (ghostLoops) {
      const inner = canvasSize * (1 - 2 * PADDING)
      ctx.strokeStyle = "rgba(180, 83, 9, 0.35)"
      ctx.lineWidth = Math.max(2, canvasSize * 0.01)
      ctx.setLineDash([canvasSize * 0.025, canvasSize * 0.02])
      for (const loop of ghostLoops) {
        const center = toPixels(loop.center, canvasSize)
        ctx.beginPath()
        ctx.arc(center.x, center.y, loop.radius * inner, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    for (const dot of getDotPositions(gridSize, dotPattern)) {
      const p = toPixels(dot, canvasSize)
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(3, canvasSize * 0.014), 0, Math.PI * 2)
      ctx.fillStyle = "#b5473a"
      ctx.fill()
    }

    const liveStrokes = drawingRef.current ? [...strokes, drawingRef.current] : strokes
    for (const stroke of liveStrokes) {
      if (stroke.length < 2) continue
      ctx.beginPath()
      const p0 = toPixels(stroke[0], canvasSize)
      ctx.moveTo(p0.x, p0.y)
      // Smooth the polyline by curving through the midpoint of each
      // consecutive pair rather than drawing straight jagged segments.
      for (let i = 1; i < stroke.length - 1; i++) {
        const curr = toPixels(stroke[i], canvasSize)
        const next = toPixels(stroke[i + 1], canvasSize)
        ctx.quadraticCurveTo(curr.x, curr.y, (curr.x + next.x) / 2, (curr.y + next.y) / 2)
      }
      const last = toPixels(stroke[stroke.length - 1], canvasSize)
      ctx.lineTo(last.x, last.y)
      ctx.strokeStyle = "#6d28d9"
      ctx.lineWidth = Math.max(3, canvasSize * 0.018)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }

    ctx.restore()
  }, [strokes, ghostLoops, gridSize, dotPattern, canvasSize, dpr, toPixels])

  useEffect(() => {
    draw()
  }, [draw])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = [toGridSpace(e.clientX, e.clientY)]
    draw()
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || !drawingRef.current) return
    e.preventDefault()
    const pt = toGridSpace(e.clientX, e.clientY)
    const last = drawingRef.current[drawingRef.current.length - 1]
    if (Math.hypot(pt.x - last.x, pt.y - last.y) < 0.008) return
    drawingRef.current.push(pt)
    draw()
  }

  const endStroke = () => {
    if (!drawingRef.current) return
    if (drawingRef.current.length > 1) {
      onStrokesChange([...strokes, drawingRef.current])
    }
    drawingRef.current = null
    draw()
  }

  return (
    <div ref={containerRef} className="w-full aspect-square">
      <canvas
        ref={canvasRef}
        width={canvasSize * dpr}
        height={canvasSize * dpr}
        style={{ width: canvasSize, height: canvasSize, touchAction: "none" }}
        className={`bg-white rounded-2xl shadow-inner border-2 border-orange-200 ${interactive ? "cursor-crosshair" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        onPointerLeave={endStroke}
      />
    </div>
  )
}
