"use client"

import { ComingSoon } from "@/components/coming-soon"

interface TypingRaceGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function TypingRaceGame({ onBackToGames, onBackToHome }: TypingRaceGameProps) {
  return (
    <ComingSoon
      appName="Typing Race"
      appDescription="Race against time to spell words quickly!"
      iconEmoji="🏎️"
      colorScheme="from-orange-200 to-red-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}
