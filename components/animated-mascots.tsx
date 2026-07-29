"use client"

import { useEffect, useState } from "react"

interface FloatingItem {
  id: number
  emoji: string
  x: number       // % from left
  delay: number   // animation-delay seconds
  duration: number // animation-duration seconds
  size: number    // rem
}

const EMOJIS = ["⭐", "🌈", "🎈", "🦋", "🌸", "🎵", "🌟", "🎨", "🦄", "🍭", "🎠", "🐝"]

export function AnimatedMascots() {
  const [items, setItems] = useState<FloatingItem[]>([])

  useEffect(() => {
    // Generate stable random items client-side to avoid SSR mismatch
    setItems(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        emoji: EMOJIS[i % EMOJIS.length],
        x: 5 + (i * 9.5) % 90,
        delay: (i * 0.7) % 4,
        duration: 4 + (i * 0.4) % 3,
        size: 1.5 + (i * 0.2) % 1.2,
      }))
    )
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
      {items.map(item => (
        <span
          key={item.id}
          className="absolute select-none animate-float"
          style={{
            left: `${item.x}%`,
            bottom: "-2rem",
            fontSize: `${item.size}rem`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            opacity: 0.7,
          }}
        >
          {item.emoji}
        </span>
      ))}

      <style jsx>{`
        @keyframes float-up {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation: float-up linear infinite;
        }
      `}</style>
    </div>
  )
}

// ── Bounce animation for the app cards ──────────────────────────────────────

export function BouncingEmoji({ emoji, size = "text-4xl" }: { emoji: string; size?: string }) {
  return (
    <span
      className={`${size} inline-block select-none`}
      style={{ animation: "emoji-bounce 1.8s ease-in-out infinite" }}
      aria-hidden="true"
    >
      {emoji}
      <style jsx>{`
        @keyframes emoji-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          40%       { transform: translateY(-10px) scale(1.15); }
          60%       { transform: translateY(-6px) scale(1.08); }
        }
      `}</style>
    </span>
  )
}

// ── Wiggle on hover ──────────────────────────────────────────────────────────

export function WiggleEmoji({ emoji, size = "text-4xl" }: { emoji: string; size?: string }) {
  const [wiggle, setWiggle] = useState(false)
  return (
    <span
      className={`${size} inline-block select-none cursor-pointer`}
      style={wiggle ? { animation: "wiggle 0.5s ease" } : {}}
      onMouseEnter={() => setWiggle(true)}
      onAnimationEnd={() => setWiggle(false)}
      aria-hidden="true"
    >
      {emoji}
      <style jsx>{`
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg) scale(1); }
          20%      { transform: rotate(-12deg) scale(1.2); }
          40%      { transform: rotate(12deg) scale(1.2); }
          60%      { transform: rotate(-8deg) scale(1.1); }
          80%      { transform: rotate(8deg) scale(1.1); }
        }
      `}</style>
    </span>
  )
}
