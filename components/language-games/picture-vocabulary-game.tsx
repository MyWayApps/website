"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { VisualMCQGame, type MCQQuestion } from "@/components/math-topics/visual-mcq-game"
import { CategoryPicker } from "@/components/language-games/category-picker"
import { pickUnseen } from "@/lib/question-history"
import { getPicturableCategories, getPicturableWordPairs, LANGUAGE_SCRIPT, type LanguageCode } from "@/lib/language-games-data"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { romanize } from "@/lib/transliteration"

interface PictureVocabularyGameProps {
  lang: LanguageCode
  gradientClass: string
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

interface PictureQuestion extends MCQQuestion {
  emoji: string
  englishWord: string
  nativeWord: string
}

function PicturePrompt({ question, onReplay }: { question: PictureQuestion; onReplay: () => void }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-700 mb-4">What is this called?</p>
      <div className="text-8xl mb-3">{question.emoji}</div>
      <div className="text-lg font-semibold text-gray-500 mb-4">{question.englishWord}</div>
      <Button
        onClick={onReplay}
        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-full px-5 py-2"
        variant="outline"
      >
        <Volume2 className="mr-2 h-5 w-5" />
        Hear it again
      </Button>
    </div>
  )
}

export function PictureVocabularyGame({ lang, gradientClass, onBackToModes, onComplete }: PictureVocabularyGameProps) {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const { speakNative } = useLanguageSpeak(lang)

  if (categoryId === null) {
    return (
      <CategoryPicker
        title="Picture Vocabulary"
        subtitle="Pick a category to practice"
        categories={getPicturableCategories(lang)}
        gradientClass={gradientClass}
        onBack={onBackToModes}
        onPick={setCategoryId}
      />
    )
  }

  const gameKey = `word-games:${lang}:picture-vocab:${categoryId}`

  const generateQuestion = (): PictureQuestion => {
    const pool = getPicturableWordPairs(lang, categoryId)
    const target = pickUnseen(gameKey, pool, (w) => w.english)
    const distractorPool = pool.filter((w) => w.english !== target.english)
    const distractors: typeof pool = []
    const shuffledPool = [...distractorPool].sort(() => Math.random() - 0.5)
    for (const item of shuffledPool) {
      if (distractors.length >= 3) break
      distractors.push(item)
    }
    const choices = [target, ...distractors].map((w) => w.native).sort(() => Math.random() - 0.5)
    setTimeout(() => speakNative(target.native), 300)
    return {
      emoji: target.emoji,
      englishWord: target.english,
      nativeWord: target.native,
      prompt: null,
      choices,
      correctChoice: target.native,
      choiceSubtext: (choice: string) => romanize(choice, LANGUAGE_SCRIPT[lang]),
    }
  }

  return (
    <VisualMCQGame
      title="Picture Vocabulary"
      gradientClass={gradientClass}
      onBackToModes={() => setCategoryId(null)}
      onComplete={onComplete}
      generateQuestion={() => {
        const q = generateQuestion()
        return { ...q, prompt: <PicturePrompt question={q} onReplay={() => speakNative(q.nativeWord)} /> }
      }}
    />
  )
}
