"use client"

import { useEffect, useState } from "react"

type Character = "frog" | "kangaroo" | "rabbit"

interface NumberLineJumpProps {
  start: number
  end: number
  max: number
  character?: Character
  className?: string
}

const CHARACTER_EMOJI: Record<Character, string> = {
  frog: "🐸",
  kangaroo: "🦘",
  rabbit: "🐇",
}

const START_DELAY_MS = 900
const TRAVEL_DURATION_MS = 2200

/**
 * Animated number line: a character hops from `start` to `end` along a
 * 0..max line. Used to visualize counting sequences and simple addition/
 * subtraction ("start at 3, hop forward 4, land on 7"). Pauses visibly at
 * the start position first, then does one single big hop over to the answer.
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
    }, START_DELAY_MS)
    const stopTimer = setTimeout(() => setIsHopping(false), START_DELAY_MS + TRAVEL_DURATION_MS)
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
        className="absolute top-0 ease-in-out"
        style={{
          left: `${percentFor(position)}%`,
          transform: "translateX(-50%)",
          // Only animate the actual hop (start -> end). Without this guard,
          // resetting `position` back to the new round's start also picks up
          // this transition, making the character visibly slide backward
          // from the previous round's end position before hopping forward
          // again — the reset needs to be instant instead.
          transition: isHopping ? `left ${TRAVEL_DURATION_MS}ms ease-in-out` : "none",
        }}
      >
        <div
          className={`text-5xl inline-block ${isHopping ? "number-line-hop" : ""}`}
          style={{ transform: `scaleX(${-direction})` }}
        >
          {CHARACTER_EMOJI[character]}
        </div>
      </div>

      {/* Line */}
      <div className="relative h-2 bg-gray-700 rounded-full mt-2">
        {ticks.map((n) => (
          <div
            key={n}
            className="absolute top-1/2 flex flex-col items-center"
            style={{ left: `${percentFor(n)}%`, transform: "translate(-50%, -50%)" }}
          >
            {n === start && <div className="absolute -top-4 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-md" />}
            <div className={`w-1 rounded-full ${n === end ? "h-4 bg-emerald-600" : "h-2 bg-gray-700"}`} />
            {n % labelStep === 0 && <span className="mt-1 text-xs font-bold text-gray-800">{n}</span>}
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
            margin-top: -60px;
          }
        }
        .number-line-hop {
          animation: number-line-hop-arc ${TRAVEL_DURATION_MS}ms ease-in-out 1;
        }
      `}</style>
    </div>
  )
}
