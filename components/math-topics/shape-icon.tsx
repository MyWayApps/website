import type { ShapeInfo } from "@/lib/math-shapes-data"

/**
 * Renders a shape as pure CSS (2D) or a plain emoji (3D solids). CSS avoids
 * the cross-platform rendering gaps some combining emoji sequences have.
 */
export function ShapeIcon({ shape, size = 128 }: { shape: ShapeInfo; size?: number }) {
  if (shape.kind === "3d") {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size, fontSize: size * 0.7 }}>
        {shape.emoji}
      </div>
    )
  }

  const style = { width: size, height: size }
  const color = "#6366f1" // indigo-500

  switch (shape.id) {
    case "circle":
      return <div className="mx-auto rounded-full" style={{ ...style, backgroundColor: color }} />
    case "square":
      return <div className="mx-auto rounded-md" style={{ ...style, backgroundColor: color }} />
    case "rectangle":
      return <div className="mx-auto rounded-md" style={{ width: size * 1.4, height: size * 0.7, backgroundColor: color }} />
    case "triangle":
      return (
        <div
          className="mx-auto"
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
          }}
        />
      )
    case "star":
      return (
        <div
          className="mx-auto"
          style={{
            ...style,
            backgroundColor: color,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      )
    case "diamond":
      return <div className="mx-auto" style={{ ...style, backgroundColor: color, transform: "rotate(45deg)" }} />
    default:
      return null
  }
}
