interface FractionCircleProps {
  numerator: number
  denominator: number
  size?: number
}

/** A pie circle with `numerator/denominator` shaded, drawn with a conic-gradient. */
export function FractionCircle({ numerator, denominator, size = 140 }: FractionCircleProps) {
  const percent = Math.min(100, (numerator / denominator) * 100)
  return (
    <div
      className="mx-auto rounded-full border-4 border-indigo-700"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#6366f1 0% ${percent}%, white ${percent}% 100%)`,
      }}
    />
  )
}
