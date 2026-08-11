"use client"

import SentenceWriter from "./sentence-writer"

interface ListenSentenceGameProps {
  sentenceList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

export default function ListenSentenceGame({ sentenceList, onGameComplete, onBackToGames }: ListenSentenceGameProps) {
  return (
    <SentenceWriter
      sentenceList={sentenceList}
      onGameComplete={onGameComplete}
      onBackToGames={onBackToGames}
      mode="listen"
      title="Listen & Type"
      emoji="🎧"
      instructions="Listen carefully, then type the whole sentence correctly!"
      gradientClass="from-orange-300 via-amber-400 to-yellow-500"
      accentTextClass="text-orange-700"
      accentBgFromTo="from-orange-500 to-amber-600"
      accentDotBgClass="bg-orange-500"
    />
  )
}
