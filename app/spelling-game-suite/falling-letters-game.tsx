"use client"

import { ComingSoon } from "@/components/coming-soon"

interface FallingLettersGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function FallingLettersGame({ onBackToGames, onBackToHome }: FallingLettersGameProps) {
  return (
    <ComingSoon
      appName="Catch Letters"
      appDescription="Catch falling letters to spell words!"
      iconEmoji="🍎"
      colorScheme="from-cyan-200 to-sky-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}
