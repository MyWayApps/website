"use client"

import SentenceWriter from "./sentence-writer"

interface TypeSentenceGameProps {
  sentenceList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

export default function TypeSentenceGame({ sentenceList, onGameComplete, onBackToGames }: TypeSentenceGameProps) {
  return (
    <SentenceWriter
      sentenceList={sentenceList}
      onGameComplete={onGameComplete}
      onBackToGames={onBackToGames}
      mode="read"
      title="Type the Sentence"
      emoji="⌨️"
      instructions="Read it, then type it exactly — capitals, spacing and all!"
      gradientClass="from-purple-300 via-pink-400 to-rose-500"
      accentTextClass="text-purple-700"
      accentBgFromTo="from-purple-500 to-pink-600"
      accentDotBgClass="bg-purple-500"
    />
  )
}
