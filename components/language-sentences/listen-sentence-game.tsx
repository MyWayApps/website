"use client"

import SentenceWriter from "./sentence-writer"
import type { LanguageCode } from "@/lib/language-games-data"

interface ListenSentenceGameProps {
  lang: LanguageCode
  sentenceSource: string[]
  onComplete: (score: number, maxScore: number) => void
  onBackToModes: () => void
}

export default function ListenSentenceGame({ lang, sentenceSource, onComplete, onBackToModes }: ListenSentenceGameProps) {
  return (
    <SentenceWriter
      lang={lang}
      sentenceSource={sentenceSource}
      onComplete={onComplete}
      onBackToModes={onBackToModes}
      mode="listen"
      title="Listen & Type"
      emoji="🎧"
      instructions="Listen carefully, then type the whole sentence!"
      gradientClass="from-orange-300 via-amber-400 to-yellow-500"
      accentTextClass="text-orange-700"
      accentBgFromTo="from-orange-500 to-amber-600"
      accentDotBgClass="bg-orange-500"
    />
  )
}
