// Board graph + movement/capture logic for the simplified Puli Meka (Aadu
// Puli Aattam) game. Board matches the traditional triangular board (apex +
// 3 rows of 6 points, connected by 3 horizontal rows and 6 "fan" rays
// radiating from the apex through all 3 rows down to the base) rather than
// the square Bagh Chal lattice — verified point count/degree distribution
// before use. Capture jumps are listed explicitly as (from, over, to)
// triples rather than derived via coordinate arithmetic, since the board
// isn't a uniform Cartesian grid (the apex is a single convergence point).

export interface Point {
  row: number // 0 = apex, 1-3 = the three rows below it
  col: number // 0 for the apex, 1-6 within a row
}

export const ROWS = 3
export const COLS = 6
export const APEX: Point = { row: 0, col: 0 }

export function pointKey(p: Point): string {
  return `${p.row},${p.col}`
}

function samePoint(a: Point, b: Point): boolean {
  return a.row === b.row && a.col === b.col
}

export const ALL_POINTS: Point[] = (() => {
  const points: Point[] = [APEX]
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) points.push({ row: r, col: c })
  }
  return points
})()

const NEIGHBORS: Map<string, Point[]> = (() => {
  const map = new Map<string, Point[]>()
  ALL_POINTS.forEach((p) => map.set(pointKey(p), []))
  const link = (a: Point, b: Point) => {
    map.get(pointKey(a))!.push(b)
    map.get(pointKey(b))!.push(a)
  }
  // horizontal within each row
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c < COLS; c++) link({ row: r, col: c }, { row: r, col: c + 1 })
  }
  // fan rays: apex -> row1 -> row2 -> row3, one ray per column
  for (let c = 1; c <= COLS; c++) {
    link(APEX, { row: 1, col: c })
    link({ row: 1, col: c }, { row: 2, col: c })
    link({ row: 2, col: c }, { row: 3, col: c })
  }
  return map
})()

export function getNeighbors(p: Point): Point[] {
  return NEIGHBORS.get(pointKey(p)) ?? []
}

/** Every unique undirected edge, for drawing the board's connecting lines. */
export const EDGES: [Point, Point][] = (() => {
  const edges: [Point, Point][] = []
  const seen = new Set<string>()
  NEIGHBORS.forEach((neighbors, fromKey) => {
    const [row, col] = fromKey.split(",").map(Number)
    const from: Point = { row, col }
    for (const to of neighbors) {
      const a = pointKey(from)
      const b = pointKey(to)
      const edgeKey = a < b ? `${a}|${b}` : `${b}|${a}`
      if (seen.has(edgeKey)) continue
      seen.add(edgeKey)
      edges.push([from, to])
    }
  })
  return edges
})()

export interface JumpTriple {
  from: Point
  over: Point
  to: Point
}

/** Every valid capture jump (colinear from/over/to along a row or a fan ray), in both directions. */
export const JUMPS: JumpTriple[] = (() => {
  const jumps: JumpTriple[] = []
  const addBothWays = (a: Point, b: Point, c: Point) => {
    jumps.push({ from: a, over: b, to: c })
    jumps.push({ from: c, over: b, to: a })
  }
  // horizontal triples within each row
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS - 2; c++) {
      addBothWays({ row: r, col: c }, { row: r, col: c + 1 }, { row: r, col: c + 2 })
    }
  }
  // fan-ray triples: apex/row1/row2, and row1/row2/row3
  for (let c = 1; c <= COLS; c++) {
    addBothWays(APEX, { row: 1, col: c }, { row: 2, col: c })
    addBothWays({ row: 1, col: c }, { row: 2, col: c }, { row: 3, col: c })
  }
  return jumps
})()

export const INITIAL_TIGER: Point = APEX
export const INITIAL_GOATS: Point[] = [
  { row: 3, col: 1 },
  { row: 3, col: 2 },
  { row: 3, col: 3 },
  { row: 3, col: 4 },
  { row: 3, col: 5 },
]

export const TOTAL_GOATS = INITIAL_GOATS.length
export const GOATS_CAPTURED_FOR_TIGER_WIN = 3

export interface Capture {
  over: Point
  to: Point
}

export function getTigerMoves(tigerPos: Point, goatPositions: Point[]): { simpleMoves: Point[]; captures: Capture[] } {
  const goatSet = new Set(goatPositions.map(pointKey))
  const simpleMoves: Point[] = []
  const captures: Capture[] = []

  for (const n of getNeighbors(tigerPos)) {
    if (!goatSet.has(pointKey(n))) simpleMoves.push(n)
  }

  for (const jump of JUMPS) {
    if (!samePoint(jump.from, tigerPos)) continue
    if (goatSet.has(pointKey(jump.over)) && !goatSet.has(pointKey(jump.to)) && !samePoint(jump.to, tigerPos)) {
      captures.push({ over: jump.over, to: jump.to })
    }
  }

  return { simpleMoves, captures }
}

export function getGoatMoves(goatPos: Point, tigerPos: Point, goatPositions: Point[]): Point[] {
  const occupied = new Set([pointKey(tigerPos), ...goatPositions.map(pointKey)])
  return getNeighbors(goatPos).filter((n) => !occupied.has(pointKey(n)))
}

export function tigerHasNoMoves(tigerPos: Point, goatPositions: Point[]): boolean {
  const { simpleMoves, captures } = getTigerMoves(tigerPos, goatPositions)
  return simpleMoves.length === 0 && captures.length === 0
}

export type TigerDecision = { type: "capture"; over: Point; to: Point } | { type: "move"; to: Point } | null

/** Simple heuristic: always take a capture if one's available, otherwise step toward the nearest goat. Not unbeatable — no lookahead. */
export function pickTigerMove(tigerPos: Point, goatPositions: Point[]): TigerDecision {
  const { simpleMoves, captures } = getTigerMoves(tigerPos, goatPositions)
  if (captures.length > 0) {
    const pick = captures[Math.floor(Math.random() * captures.length)]
    return { type: "capture", over: pick.over, to: pick.to }
  }
  if (simpleMoves.length === 0 || goatPositions.length === 0) return null

  let best = simpleMoves[0]
  let bestDist = Infinity
  for (const move of simpleMoves) {
    for (const goat of goatPositions) {
      const dist = Math.abs(move.row - goat.row) + Math.abs(move.col - goat.col)
      if (dist < bestDist) {
        bestDist = dist
        best = move
      }
    }
  }
  return { type: "move", to: best }
}

/** Percentage position for rendering — points fan outward from the apex, matching the traditional triangular board. */
export function pointPct(p: Point): { x: number; y: number } {
  if (p.row === 0) return { x: 50, y: 8 }
  const baseX = 10 + (p.col - 1) * 16 // row 3's x positions: 10,26,42,58,74,90
  const factor = p.row / ROWS
  return {
    x: 50 + (baseX - 50) * factor,
    y: 8 + p.row * 28,
  }
}
