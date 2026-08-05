"use client"

import { useEffect, useRef, useState } from "react"

interface ColumnAnswerGridProps {
  a: number
  b: number
  symbol: string
  /** Carry/borrow annotations only make sense for add/subtract — multiply and divide get none. */
  operation: "add" | "subtract" | "multiply" | "divide"
  answerLength: number
  value: string
  onChange: (value: string) => void
  disabled: boolean
  onEnterComplete?: (value: string) => void
}

type Cell = { kind: "blank" } | { kind: "digit"; char: string } | { kind: "symbol"; char: string } | { kind: "box"; index: number }

type ColumnAnnotation =
  | { kind: "carry" } // addition: a "1" carried into this column from the one before it
  | { kind: "borrow-in" } // subtraction: this column borrowed a ten from the column to its left
  | { kind: "borrow-out"; reduced: number } // subtraction: this column lent 1 away — show its reduced value, strike the original

function buildRow(totalCols: number, rightAlignedCells: Cell[], symbol?: string): Cell[] {
  const contentLen = rightAlignedCells.length + (symbol ? 1 : 0)
  const row: Cell[] = Array.from({ length: totalCols - contentLen }, () => ({ kind: "blank" }))
  if (symbol) row.push({ kind: "symbol", char: symbol })
  return [...row, ...rightAlignedCells]
}

/** Digit of `nums` (most-significant-first) at `place` places from the right (0 = units), 0 if beyond its length. */
function digitAt(nums: number[], place: number): number {
  return place < nums.length ? nums[nums.length - 1 - place] : 0
}

/** Column index (annotations are indexed left-to-right like the rendered row) for a given place. */
function columnOfPlace(place: number, totalCols: number): number {
  return totalCols - 1 - place
}

function computeAddAnnotations(aNums: number[], bNums: number[], totalCols: number): (ColumnAnnotation | null)[] {
  const result: (ColumnAnnotation | null)[] = Array(totalCols).fill(null)
  let carry = 0
  for (let place = 0; place < totalCols; place++) {
    const sum = digitAt(aNums, place) + digitAt(bNums, place) + carry
    carry = sum >= 10 ? 1 : 0
    if (carry && place + 1 < totalCols) {
      result[columnOfPlace(place + 1, totalCols)] = { kind: "carry" }
    }
  }
  return result
}

function computeSubtractAnnotations(aNums: number[], bNums: number[], totalCols: number): (ColumnAnnotation | null)[] {
  // Simulate the borrow chain (this can cascade through zeros, e.g. 500-258) to find
  // which places actually need to borrow — `effective` only exists to detect that
  // correctly; the displayed "reduced" value for a lending column is always the
  // simple original-digit-minus-one, since a column that itself also needed to
  // borrow is shown with the borrow-in marker instead (see the priority below).
  const effective = Array.from({ length: totalCols }, (_, place) => digitAt(aNums, place))
  const isBorrower: boolean[] = Array(totalCols).fill(false)
  for (let place = 0; place < totalCols; place++) {
    if (effective[place] < digitAt(bNums, place)) {
      isBorrower[place] = true
      effective[place] += 10
      if (place + 1 < totalCols) effective[place + 1] -= 1
    }
  }

  const result: (ColumnAnnotation | null)[] = Array(totalCols).fill(null)
  for (let place = 0; place < totalCols; place++) {
    if (!isBorrower[place]) continue
    result[columnOfPlace(place, totalCols)] = { kind: "borrow-in" }
    const lenderPlace = place + 1
    // A column that both lends and itself borrows keeps the borrow-in marker
    // (the more actionable fact for solving that column) rather than also
    // showing a reduced value that would itself need a second correction.
    if (lenderPlace < totalCols && !isBorrower[lenderPlace]) {
      result[columnOfPlace(lenderPlace, totalCols)] = { kind: "borrow-out", reduced: digitAt(aNums, lenderPlace) - 1 }
    }
  }
  return result
}

/**
 * Traditional column-arithmetic layout: operands stacked and right-aligned
 * digit-by-digit, a horizontal rule, then one single-digit input box per
 * answer digit — aligned under its own place-value column. Cursor starts in
 * the units box (rightmost) and auto-advances right to left (units → tens →
 * hundreds), matching how column arithmetic is actually solved by hand.
 *
 * Box values are tracked as their own array (`digits`), not derived from the
 * joined `value` string — joining a sparse array loses which position an
 * empty box was at (e.g. ["", "5", ""].join("") === "5", indistinguishable
 * from box 0 holding "5"), which breaks if a box other than the leftmost
 * empty one is filled first (arrow-key navigation makes this reachable).
 *
 * Addition also shows a small carried "1" above a column once the column to
 * its right (the one that generated the carry) has been filled — matching
 * how it's taught: work out units, *then* see the carry for tens. Subtraction
 * shows its borrow markers (a small "1" for the column borrowing, a struck-
 * through reduced digit for the column lending) right away instead, since
 * knowing a column needs to borrow is something you need *before* solving it,
 * not a consequence revealed after.
 */
export function ColumnAnswerGrid({ a, b, symbol, operation, answerLength, onChange, disabled, onEnterComplete }: ColumnAnswerGridProps) {
  const aDigits = String(a).split("")
  const bDigits = String(b).split("")
  const totalCols = Math.max(aDigits.length, bDigits.length + 1, answerLength)

  const aRow = buildRow(totalCols, aDigits.map((char) => ({ kind: "digit", char })))
  const bRow = buildRow(
    totalCols,
    bDigits.map((char) => ({ kind: "digit", char })),
    symbol,
  )
  const answerRow = buildRow(
    totalCols,
    Array.from({ length: answerLength }, (_, i) => ({ kind: "box", index: i })),
  )

  const [digits, setDigits] = useState<string[]>(() => Array(answerLength).fill(""))
  const boxRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setDigits(Array(answerLength).fill(""))
    boxRefs.current[answerLength - 1]?.focus()
  }, [a, b, answerLength])

  const annotations =
    operation === "add"
      ? computeAddAnnotations(aDigits.map(Number), bDigits.map(Number), totalCols)
      : operation === "subtract"
        ? computeSubtractAnnotations(aDigits.map(Number), bDigits.map(Number), totalCols)
        : Array(totalCols).fill(null)

  const isRevealed = (place: number, kind: ColumnAnnotation["kind"]): boolean => {
    if (kind !== "carry") return true
    const priorIndex = answerLength - 1 - (place - 1)
    if (priorIndex < 0 || priorIndex >= answerLength) return true
    return digits[priorIndex] !== ""
  }

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/[^0-9]/g, "").slice(-1)
    const next = digits.slice()
    next[index] = char
    setDigits(next)
    const joined = next.join("")
    onChange(joined)

    if (char && index > 0) {
      boxRefs.current[index - 1]?.focus()
    }
    // Pass the freshly-computed value straight through rather than letting the
    // parent read its own `typedAnswer` state here — setState from onChange()
    // above hasn't re-rendered the parent yet, so its closure would still see
    // the value from before this last digit (one keystroke stale), wrongly
    // marking a correct answer as wrong.
    if (char && next.every((d) => d !== "")) {
      onEnterComplete?.(joined)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && digits[index] === "" && index < answerLength - 1) {
      boxRefs.current[index + 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      boxRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < answerLength - 1) {
      boxRefs.current[index + 1]?.focus()
    } else if (e.key === "Enter") {
      onEnterComplete?.(digits.join(""))
    }
  }

  const cellClass = "w-14 h-16 md:w-16 md:h-20 flex items-center justify-center text-4xl md:text-5xl font-bold font-mono"

  const renderCell = (cell: Cell, key: string) => {
    if (cell.kind === "blank") return <div key={key} className={cellClass} />
    if (cell.kind === "digit") return (
      <div key={key} className={`${cellClass} text-gray-800`}>
        {cell.char}
      </div>
    )
    if (cell.kind === "symbol") return (
      <div key={key} className={`${cellClass} text-gray-600`}>
        {cell.char}
      </div>
    )
    return (
      <input
        key={key}
        ref={(el) => {
          boxRefs.current[cell.index] = el
        }}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={digits[cell.index]}
        onChange={(e) => handleChange(cell.index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(cell.index, e)}
        disabled={disabled}
        className="no-spinner w-14 h-16 md:w-16 md:h-20 text-4xl md:text-5xl font-bold font-mono text-center rounded-xl border-4 border-indigo-300 focus:border-indigo-600 focus:outline-none bg-white"
      />
    )
  }

  /** Same as renderCell for a "digit" cell, but strikes it through when this column lent a ten away. */
  const renderADigit = (cell: Cell, key: string, col: number) => {
    if (cell.kind !== "digit") return renderCell(cell, key)
    const annotation = annotations[col]
    if (annotation?.kind === "borrow-out") {
      return (
        <div key={key} className={`${cellClass} text-red-500 line-through decoration-2`}>
          {cell.char}
        </div>
      )
    }
    return (
      <div key={key} className={`${cellClass} text-gray-800`}>
        {cell.char}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-fit">
        <div className="flex">
          {Array.from({ length: totalCols }, (_, col) => {
            const annotation = annotations[col]
            const place = totalCols - 1 - col
            const show = annotation && isRevealed(place, annotation.kind)
            return (
              <div key={`carry-${col}`} className="w-14 md:w-16 h-6 md:h-7 flex items-end justify-center">
                {show && annotation.kind !== "borrow-out" && (
                  <span className="text-lg md:text-xl font-bold text-indigo-500 leading-none">1</span>
                )}
                {show && annotation.kind === "borrow-out" && (
                  <span className="text-lg md:text-xl font-bold text-red-500 leading-none">{annotation.reduced}</span>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex">{aRow.map((cell, i) => renderADigit(cell, `a-${i}`, i))}</div>
        <div className="flex">{bRow.map((cell, i) => renderCell(cell, `b-${i}`))}</div>
        <div className="border-b-4 border-gray-700 mt-1" />
      </div>
      <div className="flex mt-2">{answerRow.map((cell, i) => renderCell(cell, `ans-${i}`))}</div>
    </div>
  )
}
