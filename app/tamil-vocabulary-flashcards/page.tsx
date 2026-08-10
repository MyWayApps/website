"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { getCategoryById, VocabularyItem } from "@/lib/tamil-vocabulary-data"
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

export default function TamilVocabularyFlashcards() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || "days"
  const { speakNative: speak, isSpeaking } = useLanguageSpeak("tamil")

  const [items, setItems] = useState<VocabularyItem[]>([])
  const [categoryName, setCategoryName] = useState({ tamil: "", english: "" })
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize items based on category
  useEffect(() => {
    const category = getCategoryById(categoryId)
    if (category) {
      setItems(category.items)
      setCategoryName({ tamil: category.nameTamil, english: category.nameEnglish })
      setIndex(0)
      setIsFlipped(false)
    }
  }, [categoryId])

  // Play Tamil audio
  const playTamilAudio = () => {
    if (items.length === 0) return
    speak(items[index].tamil)
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

  // Auto-play Tamil audio when card changes (Tamil is the front)
  useEffect(() => {
    if (items.length === 0) return
    const timer = setTimeout(() => {
      playTamilAudio()
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
    window.location.href = "/tamil-vocabulary"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500">
        <div className="text-2xl text-pink-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/aligator.png"
        alt="Alligator"
        className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header */}
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-between">
        <Button
          onClick={onBackToVocabulary}
          className="bg-white/20 hover:bg-white/30 text-pink-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <div className="bg-white/30 px-4 py-2 rounded-full">
          <span className="text-pink-900 font-bold text-lg">{categoryName.tamil}</span>
          <span className="text-pink-700 ml-2">({categoryName.english})</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-pink-900">
          Tap the card to flip!
        </h1>
        <p className="text-lg text-pink-800 mt-2">
          {index + 1} / {items.length}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Back Button */}
        <Button
          onClick={prev}
          variant="outline"
          className="bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-pink-400 font-bold text-lg px-4 py-3"
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
              {items[index].tamil.length >= items[index].english.length ? items[index].tamil : items[index].english}
            </div>
            {/* Front - Tamil */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-100 to-pink-300 rounded-xl backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-sm text-pink-600 mb-2 font-semibold">தமிழ்</div>
              <div className="text-5xl md:text-6xl font-bold break-words text-pink-800 text-center mb-1">
                {items[index].tamil}
              </div>
              <div className="text-lg md:text-xl text-pink-600/80 italic text-center mb-6">
                {romanize(items[index].tamil, "tamil")}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playTamilAudio()
                }}
                variant="outline"
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-2 border-pink-400 px-6 py-4"
                disabled={isSpeaking}
              >
                <Volume2 className={`h-6 w-6 ${isSpeaking ? 'animate-pulse' : ''}`} />
              </Button>
            </CardContent>

            {/* Back - English (on flip) */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-100 to-rose-300 rounded-xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-sm text-rose-600 mb-2 font-semibold">ENGLISH</div>
              <div className="text-4xl md:text-5xl font-bold text-rose-800 text-center mb-6">
                {items[index].english}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playEnglishAudio()
                }}
                variant="outline"
                className="bg-rose-200 hover:bg-rose-300 text-rose-800 border-2 border-rose-400 px-6 py-4"
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
          className="bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-pink-400 font-bold text-lg px-4 py-3"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-pink-800">
        <p className="text-sm">Use ← → arrow keys to navigate, Space to flip</p>
      </div>
    </div>
  )
}
