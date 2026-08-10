"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { TalkingMascot } from "@/components/animated-mascots"
import { getCategoryById, VocabularyItem } from "@/lib/kannada-vocabulary-data"
import { romanize } from "@/lib/transliteration"

// Function to play English TTS
const playEnglishTTS = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      utterance.onend = () => resolve()
      utterance.onerror = (e) => reject(e)
      window.speechSynthesis.speak(utterance)
    } else {
      reject(new Error('Speech synthesis not supported'))
    }
  })
}

export default function KannadaVocabularyFlashcards() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || "days"
  const { speakNative: speak, isSpeaking } = useLanguageSpeak("kannada")

  const [items, setItems] = useState<VocabularyItem[]>([])
  const [categoryName, setCategoryName] = useState({ kannada: "", english: "" })
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize items based on category
  useEffect(() => {
    const category = getCategoryById(categoryId)
    if (category) {
      setItems(category.items)
      setCategoryName({ kannada: category.nameKannada, english: category.nameEnglish })
      setIndex(0)
      setIsFlipped(false)
    }
  }, [categoryId])

  // Play Kannada audio
  const playKannadaAudio = () => {
    if (items.length === 0) return
    speak(items[index].kannada)
  }

  // Play English audio
  const playEnglishAudio = async () => {
    if (isPlaying || items.length === 0) return

    try {
      setIsPlaying(true)
      await playEnglishTTS(items[index].english)
    } catch (error) {
      console.error("English TTS play failed:", error)
    } finally {
      setIsPlaying(false)
    }
  }

  // Auto-play Kannada audio when card changes (Kannada is the front)
  useEffect(() => {
    if (items.length === 0) return
    const timer = setTimeout(() => {
      playKannadaAudio()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prev()
      } else if (event.key === 'ArrowRight') {
        next()
      } else if (event.key === ' ') {
        event.preventDefault()
        handleCardClick()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, index, isFlipped])

  const onBackToVocabulary = () => {
    window.location.href = "/kannada-vocabulary"
  }

  const prev = () => {
    if (items.length === 0) return
    setIsFlipped(false)
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }

  const next = () => {
    if (items.length === 0) return
    setIsFlipped(false)
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }

  const handleCardClick = () => {
    setIsFlipped(f => !f)
    if (!isFlipped) {
      // When flipping to English side, play English audio
      setTimeout(() => playEnglishAudio(), 300)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 to-amber-500">
        <div className="text-2xl text-amber-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 to-amber-500 p-4 relative overflow-hidden">
      {/* Decorative Character — bounces while either side's audio is playing */}
      <TalkingMascot
        src="/characters/bunny.png"
        alt="Bunny"
        isSpeaking={isSpeaking || isPlaying}
        className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header */}
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-between">
        <Button
          onClick={onBackToVocabulary}
          className="bg-white/20 hover:bg-white/30 text-amber-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <div className="bg-white/30 px-4 py-2 rounded-full">
          <span className="text-amber-800 font-bold text-lg">{categoryName.kannada}</span>
          <span className="text-amber-600 ml-2">({categoryName.english})</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">
          Tap the card to flip!
        </h1>
        <p className="text-lg text-amber-700 mt-2">
          {index + 1} / {items.length}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Back Button */}
        <Button
          onClick={prev}
          variant="outline"
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-2 border-amber-400 font-bold text-lg px-4 py-3"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        {/* Flashcard */}
        <div
          className="perspective-1000 cursor-pointer"
          onClick={handleCardClick}
        >
          <Card
            className={`min-h-[340px] md:min-h-[390px] min-w-[300px] md:min-w-[400px] max-w-[90vw] w-fit mx-auto shadow-2xl transition-all duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Invisible sizer — sets the Card's real width from actual
                rendered glyph metrics (whichever face is longer) instead
                of a guessed character-count formula, which undershoots
                for wide Indic script conjuncts */}
            <div className="invisible text-5xl md:text-6xl font-bold whitespace-nowrap px-8" aria-hidden="true">
              {items[index].kannada.length >= items[index].english.length ? items[index].kannada : items[index].english}
            </div>
            {/* Front - Kannada */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-100 to-amber-300 rounded-xl backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-sm text-amber-600 mb-2 font-semibold">ಕನ್ನಡ</div>
              <div className="text-5xl md:text-6xl font-bold break-words text-amber-800 text-center mb-1">
                {items[index].kannada}
              </div>
              <div className="text-lg md:text-xl text-amber-600/80 italic text-center mb-6">
                {romanize(items[index].kannada, "kannada")}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playKannadaAudio()
                }}
                variant="outline"
                className="bg-amber-200 hover:bg-amber-300 text-amber-800 border-2 border-amber-400 px-6 py-4"
                disabled={isSpeaking}
              >
                <Volume2 className={`h-6 w-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
              </Button>
            </CardContent>

            {/* Back - English (on flip) */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-sm text-yellow-700 mb-2 font-semibold">ENGLISH</div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-800 text-center mb-6">
                {items[index].english}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playEnglishAudio()
                }}
                variant="outline"
                className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-2 border-yellow-400 px-6 py-4"
                disabled={isPlaying}
              >
                <Volume2 className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Button */}
        <Button
          onClick={next}
          variant="outline"
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-2 border-amber-400 font-bold text-lg px-4 py-3"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-amber-700">
        <p className="text-sm">Use ← → arrow keys to navigate, Space to flip</p>
      </div>
    </div>
  )
}
