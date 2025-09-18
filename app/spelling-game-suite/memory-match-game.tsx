"use client"

import { ComingSoon } from "@/components/coming-soon"

interface MemoryMatchGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function MemoryMatchGame({ onBackToGames, onBackToHome }: MemoryMatchGameProps) {
  return (
    <ComingSoon
      appName="Memory Match"
      appDescription="Match pictures with their correct spelling!"
      iconEmoji="🃏"
      colorScheme="from-indigo-200 to-violet-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}
