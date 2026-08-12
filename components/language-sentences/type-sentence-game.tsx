"use client"

import SentenceWriter from "./sentence-writer"
import type { LanguageCode } from "@/lib/language-games-data"

interface TypeSentenceGameProps {
  lang: LanguageCode
  sentenceSource: string[]
  onComplete: (score: number, maxScore: number) => void
  onBackToModes: () => void
}

export default function TypeSentenceGame({ lang, sentenceSource, onComplete, onBackToModes }: TypeSentenceGameProps) {
  return (
    <SentenceWriter
      lang={lang}
      sentenceSource={sentenceSource}
      onComplete={onComplete}
      onBackToModes={onBackToModes}
      mode="read"
      title="Type the Sentence"
      emoji="⌨️"
      instructions="Read it, then type it exactly!"
      gradientClass="from-purple-300 via-pink-400 to-rose-500"
      accentTextClass="text-purple-700"
      accentBgFromTo="from-purple-500 to-pink-600"
      accentDotBgClass="bg-purple-500"
    />
  )
}
