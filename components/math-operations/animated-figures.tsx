"use client"

import { useEffect, useState } from "react"

interface AnimatedFiguresProps {
  a: number
  b: number
  operation: "add" | "subtract"
  emoji?: string
}

/**
 * Visual hint panel: shows `a` objects appearing first, then (for addition)
 * `b` more joining them, or (for subtraction) the last `b` of them fading
 * away. Only meaningful with small counts, so callers should only render
 * this at the 1-digit level — a 2 or 3-digit sum would mean dozens of icons.
 */
export function AnimatedFigures({ a, b, operation, emoji = "🍎" }: AnimatedFiguresProps) {
  const [showSecondGroup, setShowSecondGroup] = useState(false)

  useEffect(() => {
    setShowSecondGroup(false)
    const timer = setTimeout(() => setShowSecondGroup(true), 1100)
    return () => clearTimeout(timer)
  }, [a, b])

  const firstGroup = Array.from({ length: a }, (_, i) => i)
  const secondGroup = Array.from({ length: b }, (_, i) => i)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-2">
      {operation === "add" ? (
        <>
          {firstGroup.map((i) => (
            <span key={`a-${i}`} className="text-4xl inline-block figure-pop" style={{ animationDelay: `${i * 120}ms` }}>
              {emoji}
            </span>
          ))}
          <span className="text-3xl font-black text-gray-500 mx-1">+</span>
          {secondGroup.map((i) => (
            <span
              key={`b-${i}`}
              className={`text-4xl inline-block ${showSecondGroup ? "figure-pop" : "opacity-0"}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {emoji}
            </span>
          ))}
        </>
      ) : (
        firstGroup.map((i) => {
          const isRemoved = i >= a - b
          return (
            <span
              key={`a-${i}`}
              className={`text-4xl inline-block figure-pop ${showSecondGroup && isRemoved ? "figure-fade-out" : ""}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {emoji}
            </span>
          )
        })
      )}

      <style jsx>{`
        @keyframes figure-pop-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          70% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .figure-pop {
          animation: figure-pop-in 0.4s ease-out both;
        }
        @keyframes figure-fade {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.4);
            opacity: 0.15;
          }
        }
        .figure-fade-out {
          animation: figure-fade 0.6s ease-in forwards;
        }
      `}</style>
    </div>
  )
}
