"use client"

import { ComingSoon } from "@/components/coming-soon"

interface TreasureHuntGameProps {
  onBackToGames?: () => void
  onBackToHome?: () => void
}

export default function TreasureHuntGame({ onBackToGames, onBackToHome }: TreasureHuntGameProps) {
  return (
    <ComingSoon
      appName="Treasure Hunt"
      appDescription="Find treasure by spelling words correctly!"
      iconEmoji="🏴‍☠️"
      colorScheme="from-amber-200 to-yellow-300"
      onBackToHome={onBackToHome || onBackToGames}
    />
  )
}