"use client"

import { useParams } from "next/navigation"
import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { PictureVocabularyGame } from "@/components/language-games/picture-vocabulary-game"
import { WordSearchGame } from "@/components/language-games/word-search-game"
import { CrosswordGame } from "@/components/language-games/crossword-game"
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/language-games-data"

const GRADIENT = "from-teal-300 via-cyan-400 to-blue-500"

const VALID_LANGS = new Set<string>(Object.keys(LANGUAGE_LABELS))

function modesForLanguage(lang: LanguageCode): TopicMode[] {
  return [
    {
      id: "picture-vocab",
      label: "Picture Vocabulary",
      emoji: "🖼️",
      description: "See a picture, pick the matching word",
      render: ({ onBackToModes, onComplete }) => (
        <PictureVocabularyGame lang={lang} gradientClass={GRADIENT} onBackToModes={onBackToModes} onComplete={onComplete} />
      ),
    },
    {
      id: "word-search",
      label: "Word Search",
      emoji: "🔍",
      description: "Find hidden words in the letter grid",
      render: ({ onBackToModes, onComplete }) => (
        <WordSearchGame lang={lang} gradientClass={GRADIENT} onBackToModes={onBackToModes} onComplete={onComplete} />
      ),
    },
    {
      id: "crossword",
      label: "Crossword Puzzle",
      emoji: "📝",
      description: "Solve the clues and fill the grid",
      render: ({ onBackToModes, onComplete }) => (
        <CrosswordGame lang={lang} gradientClass={GRADIENT} onBackToModes={onBackToModes} onComplete={onComplete} />
      ),
    },
  ]
}

export default function WordGamesPage() {
  const params = useParams()
  const langParam = params.lang as string

  if (!VALID_LANGS.has(langParam)) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 flex items-center justify-center`}>
        <p className="text-2xl font-bold text-white">Unknown language.</p>
      </div>
    )
  }

  const lang = langParam as LanguageCode
  const label = LANGUAGE_LABELS[lang]

  return (
    <TopicHub
      title={`${label} Word Games`}
      emoji="📚"
      gradient={GRADIENT}
      applicationName={`${label} Word Games`}
      modes={modesForLanguage(lang)}
      subject={label}
    />
  )
}
