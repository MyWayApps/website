"use client"

import { ComingSoon } from "@/components/coming-soon"

interface SpellingBeeGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function SpellingBeeGame({ onBackToGames, onBackToHome }: SpellingBeeGameProps) {
  return (
    <ComingSoon
      appName="Spelling Bee"
      appDescription="Guide the bee to spell words on flowers!"
      iconEmoji="🐝"
      colorScheme="from-yellow-200 to-orange-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}
