"use client"

import { ComingSoon } from "@/components/coming-soon"

export default function MemoryGamePage() {
  return (
    <ComingSoon
      appName="Memory Game"
      appDescription="Test your memory with colorful cards"
      iconEmoji="🧠"
      colorScheme="from-blue-200 to-indigo-500"
      onBackToHome={() => window.history.back()}
    />
  )
}
