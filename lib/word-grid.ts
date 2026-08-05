// Grid-placement algorithms for Word Search and Crossword.
//
// Word Search places the *native script* directly in the grid — one cell per
// grapheme cluster (via Intl.Segmenter), not per Unicode codepoint, so a
// consonant+vowel-sign combination that renders as one visual unit occupies
// exactly one cell the way a reader actually perceives it.
//
// Crossword still builds from the English spelling: it needs the child to
// *type* into each box, and there's no simple universal keyboard for typing
// Telugu/Kannada/Tamil/Malayalam/Devanagari script, so English stays the
// fill-in target there with the native word as the clue.

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Splits text into user-perceived characters (grapheme clusters) rather than raw codepoints. */
export function segmentGraphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (s) => s.segment)
  }
  return Array.from(text)
}

function defaultLatinTokenize(word: string): string[] {
  return word.toUpperCase().replace(/[^A-Z]/g, "").split("")
}

// ─── Word Search ────────────────────────────────────────────────────────────

export interface WordSearchPlacement {
  /** The original, untokenized word — use this to look back up which vocabulary pair it belongs to. */
  word: string
  tokens: string[]
  row: number
  col: number
  dRow: number
  dCol: number
}

export interface WordSearchResult {
  /** Each cell holds one token — a single Latin letter, or one native-script grapheme cluster. */
  grid: string[][]
  placements: WordSearchPlacement[]
  size: number
}

const DIRECTIONS: [number, number][] = [
  [0, 1], // →
  [1, 0], // ↓
  [1, 1], // ↘
  [-1, 1], // ↗
]

export function buildWordSearch(words: string[], size = 10, tokenize: (word: string) => string[] = defaultLatinTokenize): WordSearchResult {
  const seenSignatures = new Set<string>()
  const candidates = words
    .map((word) => ({ word, tokens: tokenize(word) }))
    .filter((c) => c.tokens.length > 0 && c.tokens.length <= size)
    .filter((c) => {
      const sig = c.tokens.join("|")
      if (seenSignatures.has(sig)) return false
      seenSignatures.add(sig)
      return true
    })
    .sort((a, b) => b.tokens.length - a.tokens.length)

  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const placements: WordSearchPlacement[] = []

  function canPlace(tokens: string[], row: number, col: number, dRow: number, dCol: number): boolean {
    for (let i = 0; i < tokens.length; i++) {
      const r = row + dRow * i
      const c = col + dCol * i
      if (r < 0 || r >= size || c < 0 || c >= size) return false
      const existing = grid[r][c]
      if (existing !== null && existing !== tokens[i]) return false
    }
    return true
  }

  function place(word: string, tokens: string[], row: number, col: number, dRow: number, dCol: number) {
    for (let i = 0; i < tokens.length; i++) {
      grid[row + dRow * i][col + dCol * i] = tokens[i]
    }
    placements.push({ word, tokens, row, col, dRow, dCol })
  }

  for (const { word, tokens } of candidates) {
    let placed = false
    const dirOptions = shuffle(DIRECTIONS)
    for (const [dRow, dCol] of dirOptions) {
      if (placed) break
      const rowRange = Array.from({ length: size }, (_, i) => i)
      const colRange = Array.from({ length: size }, (_, i) => i)
      for (const row of shuffle(rowRange)) {
        if (placed) break
        for (const col of shuffle(colRange)) {
          if (canPlace(tokens, row, col, dRow, dCol)) {
            place(word, tokens, row, col, dRow, dCol)
            placed = true
            break
          }
        }
      }
    }
    // A word that truly can't fit anywhere (very unlikely at this grid size) is just skipped.
  }

  // Filler cells draw from the same token repertoire as the placed words —
  // for native scripts that keeps the noise looking like real script instead
  // of mixing in Latin letters; for the English default it's just A-Z.
  const tokenPool = Array.from(new Set(candidates.flatMap((c) => c.tokens)))
  const fillerPool = tokenPool.length > 0 ? tokenPool : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const filledGrid: string[][] = grid.map((row) => row.map((cell) => cell ?? fillerPool[Math.floor(Math.random() * fillerPool.length)]))

  return { grid: filledGrid, placements, size }
}

// ─── Crossword ──────────────────────────────────────────────────────────────

export interface CrosswordPlacement {
  word: string
  row: number
  col: number
  direction: "across" | "down"
  number: number
}

export interface CrosswordResult {
  grid: (string | null)[][]
  placements: CrosswordPlacement[]
  rows: number
  cols: number
}

export function buildCrossword(words: string[], maxSize = 16): CrosswordResult | null {
  const upperWords = Array.from(new Set(words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))))
    .filter((w) => w.length > 0 && w.length <= maxSize)
    .sort((a, b) => b.length - a.length)

  if (upperWords.length === 0) return null

  const size = maxSize
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const placements: { word: string; row: number; col: number; direction: "across" | "down" }[] = []

  function canPlace(word: string, row: number, col: number, dir: "across" | "down"): boolean {
    const dRow = dir === "down" ? 1 : 0
    const dCol = dir === "across" ? 1 : 0
    for (let i = 0; i < word.length; i++) {
      const r = row + dRow * i
      const c = col + dCol * i
      if (r < 0 || r >= size || c < 0 || c >= size) return false
      const existing = grid[r][c]
      if (existing !== null && existing !== word[i]) return false
    }
    const beforeR = row - dRow
    const beforeC = col - dCol
    const afterR = row + dRow * word.length
    const afterC = col + dCol * word.length
    if (beforeR >= 0 && beforeR < size && beforeC >= 0 && beforeC < size && grid[beforeR][beforeC] !== null) return false
    if (afterR >= 0 && afterR < size && afterC >= 0 && afterC < size && grid[afterR][afterC] !== null) return false
    return true
  }

  function place(word: string, row: number, col: number, dir: "across" | "down") {
    const dRow = dir === "down" ? 1 : 0
    const dCol = dir === "across" ? 1 : 0
    for (let i = 0; i < word.length; i++) {
      grid[row + dRow * i][col + dCol * i] = word[i]
    }
    placements.push({ word, row, col, direction: dir })
  }

  const first = upperWords[0]
  const startRow = Math.floor(size / 2)
  const startCol = Math.max(0, Math.floor((size - first.length) / 2))
  place(first, startRow, startCol, "across")

  for (let idx = 1; idx < upperWords.length; idx++) {
    const word = upperWords[idx]
    let placed = false

    for (const existing of placements) {
      if (placed) break
      const existingDRow = existing.direction === "down" ? 1 : 0
      const existingDCol = existing.direction === "across" ? 1 : 0
      for (let i = 0; i < existing.word.length && !placed; i++) {
        for (let j = 0; j < word.length && !placed; j++) {
          if (existing.word[i] !== word[j]) continue
          const newDir: "across" | "down" = existing.direction === "across" ? "down" : "across"
          const intersectRow = existing.row + existingDRow * i
          const intersectCol = existing.col + existingDCol * i
          const newDRow = newDir === "down" ? 1 : 0
          const newDCol = newDir === "across" ? 1 : 0
          const wordStartRow = intersectRow - newDRow * j
          const wordStartCol = intersectCol - newDCol * j
          if (canPlace(word, wordStartRow, wordStartCol, newDir)) {
            place(word, wordStartRow, wordStartCol, newDir)
            placed = true
          }
        }
      }
    }

    if (!placed) {
      // No shared-letter intersection found — fall back to a disconnected slot so the word still appears.
      outer: for (let r = 0; r < size && !placed; r++) {
        for (let c = 0; c <= size - word.length && !placed; c++) {
          if (canPlace(word, r, c, "across")) {
            place(word, r, c, "across")
            placed = true
            break outer
          }
        }
      }
    }
  }

  // Trim to the bounding box of placed letters.
  let minRow = size,
    maxRow = -1,
    minCol = size,
    maxCol = -1
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== null) {
        minRow = Math.min(minRow, r)
        maxRow = Math.max(maxRow, r)
        minCol = Math.min(minCol, c)
        maxCol = Math.max(maxCol, c)
      }
    }
  }
  const rows = maxRow - minRow + 1
  const cols = maxCol - minCol + 1
  const trimmedGrid: (string | null)[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => grid[r + minRow][c + minCol]),
  )
  const adjusted = placements.map((p) => ({ ...p, row: p.row - minRow, col: p.col - minCol }))

  // Number every cell that starts an across or down word, reading order.
  const startNumbers = new Map<string, number>()
  const sorted = [...adjusted].sort((a, b) => a.row - b.row || a.col - b.col)
  let n = 1
  for (const p of sorted) {
    const key = `${p.row},${p.col}`
    if (!startNumbers.has(key)) {
      startNumbers.set(key, n)
      n++
    }
  }
  const numberedPlacements: CrosswordPlacement[] = adjusted.map((p) => ({
    ...p,
    number: startNumbers.get(`${p.row},${p.col}`)!,
  }))

  return { grid: trimmedGrid, placements: numberedPlacements, rows, cols }
}
