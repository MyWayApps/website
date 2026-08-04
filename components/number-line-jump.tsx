"use client"

import { useEffect, useState } from "react"

interface NumberLineJumpProps {
  start: number
  end: number
  max: number
  character?: "frog" | "kangaroo"
  className?: string
}

const CHARACTER_EMOJI: Record<"frog" | "kangaroo", string> = {
  frog: "🐸",
  kangaroo: "🦘",
}

/**
 * Animated number line: a character hops from `start` to `end` along a
 * 0..max line. Used to visualize counting sequences and simple addition/
 * subtraction ("start at 3, hop forward 4, land on 7").
 */
export function NumberLineJump({ start, end, max, character = "frog", className = "" }: NumberLineJumpProps) {
  const [position, setPosition] = useState(start)
  const [isHopping, setIsHopping] = useState(false)

  useEffect(() => {
    setPosition(start)
    setIsHopping(false)
    const startTimer = setTimeout(() => {
      setIsHopping(true)
      setPosition(end)
    }, 400)
    const stopTimer = setTimeout(() => setIsHopping(false), 400 + 700)
    return () => {
      clearTimeout(startTimer)
      clearTimeout(stopTimer)
    }
  }, [start, end])

  const range = max || 1
  const percentFor = (n: number) => (n / range) * 100
  const labelStep = max <= 20 ? 1 : max <= 50 ? 5 : 10
  const ticks = Array.from({ length: max + 1 }, (_, i) => i)
  const direction = end >= start ? 1 : -1

  return (
    <div className={`relative w-full pt-14 pb-8 ${className}`}>
      {/* Character */}
      <div
        className="absolute top-0 transition-[left] duration-700 ease-in-out"
        style={{ left: `${percentFor(position)}%`, transform: "translateX(-50%)" }}
      >
        <div
          className={`text-5xl inline-block ${isHopping ? "number-line-hop" : ""}`}
          style={{ transform: `scaleX(${direction})` }}
        >
          {CHARACTER_EMOJI[character]}
        </div>
      </div>

      {/* Line */}
      <div className="relative h-2 bg-white/60 rounded-full mt-2">
        {ticks.map((n) => (
          <div
            key={n}
            className="absolute top-1/2 flex flex-col items-center"
            style={{ left: `${percentFor(n)}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className={`w-1 rounded-full ${n === end ? "h-4 bg-yellow-400" : "h-2 bg-white/80"}`} />
            {n % labelStep === 0 && <span className="mt-1 text-xs font-bold text-white/90">{n}</span>}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes number-line-hop-arc {
          0%,
          100% {
            margin-top: 0;
          }
          50% {
            margin-top: -20px;
          }
        }
        .number-line-hop {
          animation: number-line-hop-arc 0.7s ease-in-out;
        }
      `}</style>
    </div>
  )
}
