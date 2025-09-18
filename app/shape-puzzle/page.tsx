"use client"

import { ComingSoon } from "@/components/coming-soon"

export default function ShapePuzzlePage() {
  return (
    <ComingSoon
      appName="Shape Puzzle"
      appDescription="Identify and match different shapes"
      iconEmoji="🔺"
      colorScheme="from-green-200 to-teal-500"
      onBackToHome={() => window.history.back()}
    />
  )
}
