export interface MoneyPiece {
  value: number
  kind: "coin" | "note"
}

const NOTE_COLORS: Record<number, string> = {
  10: "#a855f7",
  20: "#f59e0b",
  50: "#22c55e",
  100: "#a3a3a3",
  200: "#eab308",
  500: "#6b7280",
}

/** CSS-styled (not photographic) Indian Rupee coin/note representation. */
export function MoneyVisual({ value, kind, size = 100 }: MoneyPiece & { size?: number }) {
  if (kind === "coin") {
    return (
      <div
        className="mx-auto rounded-full border-4 border-yellow-700 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md"
        style={{ width: size * 0.7, height: size * 0.7 }}
      >
        <span className="font-black text-yellow-900" style={{ fontSize: size * 0.22 }}>
          ₹{value}
        </span>
      </div>
    )
  }
  const color = NOTE_COLORS[value] ?? "#6366f1"
  return (
    <div
      className="mx-auto rounded-lg border-2 border-white/70 flex items-center justify-center shadow-md"
      style={{ width: size * 1.7, height: size * 0.85, backgroundColor: color }}
    >
      <span className="font-black text-white drop-shadow" style={{ fontSize: size * 0.26 }}>
        ₹{value}
      </span>
    </div>
  )
}
