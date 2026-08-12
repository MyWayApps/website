// Board + movement logic for the simplified Chowka Bara game. Board is a
// square-ring race track (verified closed loop, no gaps) with each player
// peeling off into a short private diagonal "home stretch" toward a shared
// center Home cell — same race-to-home idea as the traditional cross-shaped
// board, simplified for a reliable, easy-to-verify board shape.

export type PlayerId = "child" | "computer"

export interface BoardCell {
  row: number
  col: number
}

export const GRID_SIZE = 7
export const RING_LENGTH = 24 // 4 * (GRID_SIZE - 1)
export const HOME_STRETCH_LENGTH = 2
export const FINISH_POSITION = RING_LENGTH + HOME_STRETCH_LENGTH // 26 = token is Home
export const TOKENS_PER_PLAYER = 4

// The shared outer-ring track, walked clockwise starting at the top-left corner.
export const RING: BoardCell[] = (() => {
  const ring: BoardCell[] = []
  const N = GRID_SIZE
  for (let c = 0; c < N; c++) ring.push({ row: 0, col: c }) // top row, L->R
  for (let r = 1; r < N; r++) ring.push({ row: r, col: N - 1 }) // right col, T->B
  for (let c = N - 2; c >= 0; c--) ring.push({ row: N - 1, col: c }) // bottom row, R->L
  for (let r = N - 2; r >= 1; r--) ring.push({ row: r, col: 0 }) // left col, B->T
  return ring
})()

export const HOME_CELL: BoardCell = { row: 3, col: 3 }

// Each player starts on an opposite ring corner and cuts diagonally inward to Home.
export const START_OFFSET: Record<PlayerId, number> = { child: 0, computer: 12 }
export const HOME_STRETCH: Record<PlayerId, BoardCell[]> = {
  child: [
    { row: 1, col: 1 },
    { row: 2, col: 2 },
  ],
  computer: [
    { row: 5, col: 5 },
    { row: 4, col: 4 },
  ],
}

export interface ChowkaBaraToken {
  id: number
  position: number // 0..RING_LENGTH-1 = on ring; RING_LENGTH.. = home stretch; FINISH_POSITION = home
}

export function createInitialTokens(): ChowkaBaraToken[] {
  return Array.from({ length: TOKENS_PER_PLAYER }, (_, id) => ({ id, position: 0 }))
}

/** The board cell a token currently occupies (its own start on turn 0, since position 0 = the player's own ring offset). */
export function cellForToken(player: PlayerId, position: number): BoardCell {
  if (position < RING_LENGTH) {
    const ringIndex = (START_OFFSET[player] + position) % RING_LENGTH
    return RING[ringIndex]
  }
  if (position < FINISH_POSITION) {
    return HOME_STRETCH[player][position - RING_LENGTH]
  }
  return HOME_CELL
}

export function rollDice(): number {
  return 1 + Math.floor(Math.random() * 6)
}

export function isTokenFinished(token: ChowkaBaraToken): boolean {
  return token.position >= FINISH_POSITION
}

export function moveToken(token: ChowkaBaraToken, diceValue: number): ChowkaBaraToken {
  return { ...token, position: Math.min(token.position + diceValue, FINISH_POSITION) }
}

/** Simple computer heuristic: finish a token if the roll lands it exactly on/past Home, otherwise push the most-advanced token forward. */
export function pickComputerToken(tokens: ChowkaBaraToken[], diceValue: number): ChowkaBaraToken | null {
  const eligible = tokens.filter((t) => !isTokenFinished(t))
  if (eligible.length === 0) return null
  const finishers = eligible.filter((t) => t.position + diceValue >= FINISH_POSITION)
  if (finishers.length > 0) return finishers[0]
  return eligible.reduce((best, t) => (t.position > best.position ? t : best))
}

export function hasPlayerWon(tokens: ChowkaBaraToken[]): boolean {
  return tokens.every(isTokenFinished)
}

/** All path cells to render on the board (deduplicated), each tagged with what kind of cell it is. */
export interface PathCell extends BoardCell {
  key: string
  kind: "ring" | "stretch-child" | "stretch-computer" | "home"
}

export const PATH_CELLS: PathCell[] = (() => {
  const cells: PathCell[] = []
  const seen = new Set<string>()
  const add = (cell: BoardCell, kind: PathCell["kind"]) => {
    const key = `${cell.row},${cell.col}`
    if (seen.has(key)) return
    seen.add(key)
    cells.push({ ...cell, key, kind })
  }
  RING.forEach((cell) => add(cell, "ring"))
  HOME_STRETCH.child.forEach((cell) => add(cell, "stretch-child"))
  HOME_STRETCH.computer.forEach((cell) => add(cell, "stretch-computer"))
  add(HOME_CELL, "home")
  return cells
})()
