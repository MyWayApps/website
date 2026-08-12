"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import JumbledWordsGame from "@/components/language-sentences/jumbled-words-game"
import TypeSentenceGame from "@/components/language-sentences/type-sentence-game"
import ListenSentenceGame from "@/components/language-sentences/listen-sentence-game"
import ManageSentences from "@/components/language-sentences/manage-sentences"
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/language-games-data"
import { LANGUAGE_SENTENCES } from "@/lib/language-sentences-data"
import { getCustomSentences } from "@/lib/language-custom-sentences"

const GRADIENT = "from-cyan-300 via-blue-400 to-indigo-500"

const VALID_LANGS = new Set<string>(Object.keys(LANGUAGE_LABELS))

function modesForLanguage(lang: LanguageCode, label: string, sentenceSource: string[]): TopicMode[] {
  return [
    {
      id: "jumbled-words",
      label: "Jumbled Words",
      emoji: "🧩",
      description: "Drag the words into the right order to build the sentence",
      render: ({ onBackToModes, onComplete }) => (
        <JumbledWordsGame lang={lang} sentenceSource={sentenceSource} onComplete={onComplete} onBackToModes={onBackToModes} />
      ),
    },
    {
      id: "type-sentence",
      label: "Type the Sentence",
      emoji: "⌨️",
      description: "Read it, then type it exactly",
      render: ({ onBackToModes, onComplete }) => (
        <TypeSentenceGame lang={lang} sentenceSource={sentenceSource} onComplete={onComplete} onBackToModes={onBackToModes} />
      ),
    },
    {
      id: "listen-sentence",
      label: "Listen & Type",
      emoji: "🎧",
      description: "Listen carefully, then type the whole sentence",
      render: ({ onBackToModes, onComplete }) => (
        <ListenSentenceGame lang={lang} sentenceSource={sentenceSource} onComplete={onComplete} onBackToModes={onBackToModes} />
      ),
    },
    {
      id: "manage-sentences",
      label: "Add / Manage Sentences",
      emoji: "📝",
      description: "Add your own sentences to practice with",
      render: ({ onBackToModes }) => <ManageSentences lang={lang} label={label} onBackToModes={onBackToModes} />,
    },
  ]
}

export default function SentencesPage() {
  const params = useParams()
  const langParam = params.lang as string
  const [customSentences, setCustomSentences] = useState<string[]>([])

  useEffect(() => {
    if (VALID_LANGS.has(langParam)) {
      setCustomSentences(getCustomSentences(langParam as LanguageCode).map((s) => s.text))
    }
  }, [langParam])

  if (!VALID_LANGS.has(langParam)) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 flex items-center justify-center`}>
        <p className="text-2xl font-bold text-white">Unknown language.</p>
      </div>
    )
  }

  const lang = langParam as LanguageCode
  const label = LANGUAGE_LABELS[lang]
  const sentenceSource = [...LANGUAGE_SENTENCES[lang], ...customSentences]

  return (
    <TopicHub
      title={`${label} Sentences`}
      emoji="📝"
      gradient={GRADIENT}
      applicationName={`${label} Sentences`}
      modes={modesForLanguage(lang, label, sentenceSource)}
      subject={label}
    />
  )
}
