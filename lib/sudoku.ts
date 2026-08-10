// Pure Sudoku generation logic — no React/DOM, reusable across grid sizes
// and both the numbers and pictures variants (a "picture" is just a display
// skin over the same underlying 1..size digit grid).

export type SudokuSize = 4 | 6
export type SudokuDifficulty = "easy" | "medium" | "tough"

export const SUDOKU_PICTURES: Record<SudokuSize, string[]> = {
  4: ["🍎", "🍌", "🍇", "🍊"],
  6: ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍"],
}

// How many cells (out of size*size) start blank at each difficulty.
const BLANK_COUNTS: Record<SudokuSize, Record<SudokuDifficulty, number>> = {
  4: { easy: 4, medium: 6, tough: 9 },
  6: { easy: 8, medium: 14, tough: 20 },
}

export function getSudokuBoxDims(size: SudokuSize): { rows: number; cols: number } {
  return size === 4 ? { rows: 2, cols: 2 } : { rows: 2, cols: 3 }
}
const boxDims = getSudokuBoxDims

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function isValidPlacement(grid: number[][], row: number, col: number, value: number, size: SudokuSize): boolean {
  for (let c = 0; c < size; c++) if (grid[row][c] === value) return false
  for (let r = 0; r < size; r++) if (grid[r][col] === value) return false

  const { rows: boxRows, cols: boxCols } = boxDims(size)
  const boxRowStart = Math.floor(row / boxRows) * boxRows
  const boxColStart = Math.floor(col / boxCols) * boxCols
  for (let r = boxRowStart; r < boxRowStart + boxRows; r++) {
    for (let c = boxColStart; c < boxColStart + boxCols; c++) {
      if (grid[r][c] === value) return false
    }
  }
  return true
}

// Randomized backtracking fill — produces a different valid solved grid each call.
function fillGrid(grid: number[][], size: SudokuSize): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        for (const value of shuffle(Array.from({ length: size }, (_, i) => i + 1))) {
          if (isValidPlacement(grid, row, col, value, size)) {
            grid[row][col] = value
            if (fillGrid(grid, size)) return true
            grid[row][col] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

export function generateSolvedGrid(size: SudokuSize): number[][] {
  const grid: number[][] = Array.from({ length: size }, () => new Array(size).fill(0))
  fillGrid(grid, size)
  return grid
}

export interface SudokuPuzzle {
  size: SudokuSize
  solution: number[][]
  puzzle: (number | null)[][]
  /** true where the cell starts filled in and can't be edited. */
  given: boolean[][]
}

export function generateSudokuPuzzle(size: SudokuSize, difficulty: SudokuDifficulty): SudokuPuzzle {
  const solution = generateSolvedGrid(size)
  const puzzle: (number | null)[][] = solution.map((row) => [...row])
  const given: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(true))

  const cells = shuffle(Array.from({ length: size * size }, (_, i) => ({ row: Math.floor(i / size), col: i % size })))
  const blankCount = BLANK_COUNTS[size][difficulty]
  for (let i = 0; i < blankCount; i++) {
    const { row, col } = cells[i]
    puzzle[row][col] = null
    given[row][col] = false
  }

  return { size, solution, puzzle, given }
}

export function countBlanks(given: boolean[][]): number {
  return given.reduce((sum, row) => sum + row.filter((g) => !g).length, 0)
}
