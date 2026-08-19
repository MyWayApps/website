// Kolam drawing-game data model + a deliberately forgiving shape evaluator.
// Kept independent of the canvas/drawing engine (components/kolam/kolam-canvas.tsx)
// so new levels or ghost-loop styles can be added here without touching any
// drawing code — level defs are just {gridSize, style} tuples.

export type KolamStyle = "square" | "scalloped" | "flower" | "star" | "lotus"

export interface KolamLevel {
  id: number
  title: string
  gridSize: number
  style: KolamStyle
  /**
   * Sparse dot layout as [col, row] indices into the gridSize x gridSize
   * conceptual grid. Omit to use every cell (a full grid). Lets a level use
   * a shape like a 5-dot plus/diamond instead of a dense NxN grid.
   */
  dotPattern?: [number, number][]
}

// Plus/diamond arrangement (top, left, center, right, bottom) within a 3x3
// grid — the classic 5-dot sikku kolam motif: one interlocking loop through
// the four outer dots and the center.
const PLUS_PATTERN: [number, number][] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [1, 2],
]

export const KOLAM_LEVELS: KolamLevel[] = [
  { id: 1, title: "Simple Loop", gridSize: 3, style: "flower", dotPattern: PLUS_PATTERN },
  { id: 2, title: "Wavy Loop", gridSize: 3, style: "scalloped" },
  { id: 3, title: "Flower Kolam", gridSize: 4, style: "flower" },
  { id: 4, title: "Star Kolam", gridSize: 5, style: "star" },
  { id: 5, title: "Traditional Kolam", gridSize: 5, style: "lotus" },
]

export function getKolamLevel(id: number): KolamLevel | undefined {
  return KOLAM_LEVELS.find((l) => l.id === id)
}

export interface Point {
  x: number
  y: number
}

export type Stroke = Point[]

/**
 * Dot positions in normalized grid space (0..1 across both axes). Pass a
 * `dotPattern` (see KolamLevel) to get a sparse layout instead of every
 * cell in the gridSize x gridSize grid.
 */
export function getDotPositions(gridSize: number, dotPattern?: [number, number][]): Point[] {
  const toPoint = (col: number, row: number): Point => ({
    x: gridSize === 1 ? 0.5 : col / (gridSize - 1),
    y: gridSize === 1 ? 0.5 : row / (gridSize - 1),
  })
  if (dotPattern) return dotPattern.map(([col, row]) => toPoint(col, row))
  const dots: Point[] = []
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      dots.push(toPoint(col, row))
    }
  }
  return dots
}

export interface DotLoop {
  center: Point
  radius: number
}

// How much each dot's loop radius overlaps its neighbor's, as a fraction of
// the spacing between adjacent dots — this is what produces the crossing/
// interlocking look real sikku kolam has, purely from circle overlap with
// no need to compute actual over/under braid geometry.
const OVERLAP_FACTOR: Record<KolamStyle, number> = {
  square: 0.56,
  scalloped: 0.62,
  flower: 0.58,
  star: 0.63,
  lotus: 0.66,
}

/**
 * The authentic sikku-kolam look: one small loop drawn around every dot
 * (not just the boundary), sized so each overlaps its neighbors — exactly
 * how real kolam patterns are threaded, a continuous loop around each dot
 * with natural crossings where adjacent loops meet. Used for both the
 * target preview and the faint guide on the drawing canvas; purely
 * cosmetic, evaluateKolam() never compares against it.
 */
export function getGhostLoops(gridSize: number, style: KolamStyle, dotPattern?: [number, number][]): DotLoop[] {
  const spacing = gridSize > 1 ? 1 / (gridSize - 1) : 0.5
  const radius = spacing * OVERLAP_FACTOR[style]
  return getDotPositions(gridSize, dotPattern).map((center) => ({ center, radius }))
}

// ─── Evaluation ─────────────────────────────────────────────────────────

function pointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x
    const yi = poly[i].y
    const xj = poly[j].x
    const yj = poly[j].y
    const intersects = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function totalPathLength(points: Point[]): number {
  let length = 0
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
  }
  return length
}

export interface KolamEvalResult {
  enclosedCount: number
  totalDots: number
  isClosed: boolean
  passed: boolean
  emoji: string
  message: string
}

/**
 * Deliberately forgiving: never compares the drawn line against the target
 * curve's exact shape. Instead checks whether the child's line loops around
 * enough of the dots and covers enough ground — a wobbly, imprecise loop
 * passes exactly as well as a neat one, and multiple separate strokes are
 * combined (in drawing order) before checking, so lifting the pen mid-loop
 * doesn't penalize the child.
 */
export function evaluateKolam(strokes: Stroke[], level: KolamLevel): KolamEvalResult {
  const points = strokes.flat()
  const dots = getDotPositions(level.gridSize, level.dotPattern)
  const totalDots = dots.length

  if (points.length < 4) {
    return {
      enclosedCount: 0,
      totalDots,
      isClosed: false,
      passed: false,
      emoji: "✏️",
      message: "Draw a loop all the way around the dots!",
    }
  }

  const enclosedCount = dots.filter((d) => pointInPolygon(d, points)).length
  const enclosedRatio = enclosedCount / totalDots

  const first = points[0]
  const last = points[points.length - 1]
  const isClosed = Math.hypot(last.x - first.x, last.y - first.y) < 0.18

  const length = totalPathLength(points)
  const longEnough = length >= 1.4

  const passed = enclosedRatio >= 0.75 && longEnough

  if (passed && isClosed) {
    return { enclosedCount, totalDots, isClosed, passed, emoji: "🌸", message: "Beautiful! Perfect kolam!" }
  }
  if (passed) {
    return { enclosedCount, totalDots, isClosed, passed, emoji: "🎉", message: "Great job! Lovely loop!" }
  }
  if (enclosedRatio >= 0.4) {
    return {
      enclosedCount,
      totalDots,
      isClosed,
      passed,
      emoji: "🌟",
      message: "Almost! Try connecting the loop around a few more dots.",
    }
  }
  return {
    enclosedCount,
    totalDots,
    isClosed,
    passed,
    emoji: "💫",
    message: "Good try! Draw your loop all the way around the dots.",
  }
}
