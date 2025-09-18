"use client"

import { ComingSoon } from "@/components/coming-soon"

interface PuzzleBuilderGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function PuzzleBuilderGame({ onBackToGames, onBackToHome }: PuzzleBuilderGameProps) {
  return (
    <ComingSoon
      appName="Puzzle Builder"
      appDescription="Build a puzzle by spelling words correctly!"
      iconEmoji="🧩"
      colorScheme="from-violet-200 to-purple-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}
