"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { getCategoryById, VocabularyItem } from "@/lib/sanskrit-vocabulary-data"

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

// Sanskrit has no TTS voice of its own — audio is spoken by transliterating
// to Kannada script and using the Kannada voice/fallback (see lib/sanskrit-tts.ts).
export default function SanskritVocabularyFlashcards() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || "days"
  const { speakNative: speak, isSpeaking } = useLanguageSpeak("sanskrit")

  const [items, setItems] = useState<VocabularyItem[]>([])
  const [categoryName, setCategoryName] = useState({ sanskrit: "", english: "" })
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize items based on category
  useEffect(() => {
    const category = getCategoryById(categoryId)
    if (category) {
      setItems(category.items)
      setCategoryName({ sanskrit: category.nameSanskrit, english: category.nameEnglish })
      setIndex(0)
      setIsFlipped(false)
    }
  }, [categoryId])

  // Play Sanskrit audio (transliterated to Kannada script, spoken with Kannada voice)
  const playSanskritAudio = () => {
    if (items.length === 0) return
    speak(items[index].sanskrit)
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

  // Auto-play Sanskrit audio when card changes (Sanskrit is the front)
  useEffect(() => {
    if (items.length === 0) return
    const timer = setTimeout(() => {
      playSanskritAudio()
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
    window.location.href = "/sanskrit-vocabulary"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800">
        <div className="text-2xl text-amber-50">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 relative overflow-hidden">
      {/* Decorative Symbol — pulses while either side's audio is playing */}
      <div
        className={`absolute bottom-0 left-0 text-[14rem] leading-none opacity-10 pointer-events-none select-none z-10 ${
          isSpeaking || isPlaying ? "animate-pulse" : ""
        }`}
      >
        ॐ
      </div>

      {/* Header */}
      <div className="w-full max-w-[600px] mb-6 flex items-center justify-between">
        <Button
          onClick={onBackToVocabulary}
          className="bg-white/20 hover:bg-white/30 text-amber-50 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <div className="bg-white/30 px-4 py-2 rounded-full">
          <span className="text-amber-50 font-bold text-lg">{categoryName.sanskrit}</span>
          <span className="text-amber-100 ml-2">({categoryName.english})</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-amber-50">
          Tap the card to flip!
        </h1>
        <p className="text-lg text-amber-100 mt-2">
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
            className={`min-h-[300px] md:min-h-[350px] shadow-2xl transition-all duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              width: `clamp(300px, ${Math.max(items[index].sanskrit.length, items[index].english.length) + 4}ch, min(90vw, 700px))`,
            }}
          >
            {/* Front - Sanskrit */}
            <CardContent
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-100 to-amber-300 rounded-xl backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-sm text-amber-600 mb-2 font-semibold">संस्कृतम्</div>
              <div className="text-5xl md:text-6xl font-bold break-words text-amber-800 text-center mb-6">
                {items[index].sanskrit}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playSanskritAudio()
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
              className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-100 to-orange-300 rounded-xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-sm text-orange-600 mb-2 font-semibold">ENGLISH</div>
              <div className="text-4xl md:text-5xl font-bold text-orange-800 text-center mb-6">
                {items[index].english}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  playEnglishAudio()
                }}
                variant="outline"
                className="bg-orange-200 hover:bg-orange-300 text-orange-800 border-2 border-orange-400 px-6 py-4"
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
      <div className="mt-8 text-center text-amber-100">
        <p className="text-sm">Use ← → arrow keys to navigate, Space to flip</p>
      </div>
    </div>
  )
}
