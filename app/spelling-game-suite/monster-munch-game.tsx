"use client"

import { ComingSoon } from "@/components/coming-soon"

interface MonsterMunchGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function MonsterMunchGame({ onBackToGames, onBackToHome }: MonsterMunchGameProps) {
  return (
    <ComingSoon
      appName="Monster Munch"
      appDescription="Feed the monster letters in the right order!"
      iconEmoji="🍪"
      colorScheme="from-orange-200 to-red-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}
