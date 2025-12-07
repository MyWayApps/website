"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { getLettersByType, getLetterTypeLabel, LetterType, TeluguLetterWithWord } from "@/lib/telugu-letters-data"

export default function TeluguFlashCards() {
  const searchParams = useSearchParams()
  const letterType = (searchParams.get("type") as LetterType) || "vowels"
  
  const [letters, setLetters] = useState<TeluguLetterWithWord[]>([])
  const [index, setIndex] = useState(0)
  const [showWord, setShowWord] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize letters based on type
  useEffect(() => {
    const letterData = getLettersByType(letterType)
    setLetters(letterData)
    setIndex(0)
  }, [letterType])

  const typeLabel = getLetterTypeLabel(letterType)

  // Play audio for current letter using TTS
  const playAudio = async () => {
    if (isPlaying || letters.length === 0) return
    
    try {
      setIsPlaying(true)
      const textToSpeak = letters[index].letter
      await playTeluguTTS(textToSpeak)
    } catch (error) {
      console.error("TTS play failed:", error)
    } finally {
      setIsPlaying(false)
    }
  }

  // Play word audio using TTS
  const playWordAudio = async (word: string) => {
    try {
      await playTeluguTTS(word)
    } catch (error) {
      console.error("TTS play failed for word:", error)
    }
  }

  // Handle letter click - replace letter with word, play audio, then bounce back
  const handleLetterClick = () => {
    if (letters.length === 0) return
    setShowWord(true)
    
    // Play the word audio
    const word = letters[index].word
    if (word && word !== letters[index].letter) {
      playWordAudio(word)
    }
    
    // Hide word and bounce back to letter after 2.5 seconds
    setTimeout(() => {
      setShowWord(false)
    }, 2500)
  }

  // Auto-play audio when index changes
  useEffect(() => {
    if (letters.length === 0) return
    console.log("Index changed to:", index, "Letter:", letters[index].letter)
    // Small delay to ensure component is ready
    const timer = setTimeout(() => {
      playAudio()
    }, 300)
    return () => clearTimeout(timer)
  }, [index, letters])


  // Add keyboard event listeners for arrow keys
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setShowWord(false) // Clear word display immediately
        prev()
      } else if (event.key === 'ArrowRight') {
        setShowWord(false) // Clear word display immediately
        next()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [letters])

  // Go back to Telugu Letters page
  const onBackToHome = () => {
    window.location.href = "/telugu-letters"
  }

  // Reset the flashcards game
  const resetGame = () => {
    setIndex(0)
  }

  const prev = () => {
    if (letters.length === 0) return
    setShowWord(false) // Clear any word display immediately
    setIndex((i) => {
      const newIndex = i === 0 ? letters.length - 1 : i - 1
      return newIndex
    })
  }
  
  const next = () => {
    if (letters.length === 0) return
    setShowWord(false) // Clear any word display immediately
    setIndex((i) => {
      const newIndex = i === letters.length - 1 ? 0 : i + 1
      return newIndex
    })
  }

  if (letters.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 to-amber-400">
        <div className="text-2xl text-amber-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 to-amber-400">
      
      {/* Header - Aligned with rectangle */}
      <div className="w-1/2 min-w-[400px] mb-6 flex items-center justify-between">
        <Button
          onClick={onBackToHome}
          className="bg-white/20 hover:bg-white/30 text-amber-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Telugu Letters
        </Button>
        <div className="bg-white/30 px-4 py-2 rounded-full">
          <span className="text-amber-800 font-bold text-lg">{typeLabel.telugu}</span>
          <span className="text-amber-600 ml-2">({typeLabel.english})</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-amber-900">
          Tap the letter
        </h1>
        <p className="text-lg text-amber-700 mt-2">
          {index + 1} / {letters.length}
        </p>
      </div>

      <div className="flex items-center justify-center">
        {/* Back Button - Left of Rectangle */}
        <Button 
          onClick={prev} 
          variant="outline" 
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-2 border-amber-400 font-bold text-lg px-6 py-3 mr-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <Card className="w-1/2 h-1/2 min-w-[400px] min-h-[400px] flex flex-col items-center justify-center shadow-2xl bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            {/* Clickable Telugu Letter/Word Container */}
            <div 
              className="text-9xl font-bold mb-4 text-amber-800 cursor-pointer hover:scale-110 transition-all duration-300 select-none min-h-[120px] flex items-center justify-center"
              onClick={handleLetterClick}
            >
              {showWord && letters[index].word && letters[index].word !== letters[index].letter ? (
                <div className="text-6xl font-bold text-amber-700 text-center bg-yellow-200 px-8 py-6 rounded-xl shadow-lg">
                  <div className="text-2xl text-amber-600 mb-2">పదం</div>
                  <div>{letters[index].word}</div>
                </div>
              ) : (
                letters[index].letter
              )}
            </div>
            
            {/* Volume Button - Center */}
            <div className="flex items-center justify-center w-full px-4">
              <Button 
                onClick={playAudio} 
                variant="outline" 
                className="bg-amber-200 hover:bg-amber-300 text-amber-800 border-2 border-amber-400 px-8 py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <Volume2 className="h-8 w-8 animate-pulse" />
                ) : (
                  <Volume2 className="h-8 w-8" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Next Button - Right of Rectangle */}
        <Button 
          onClick={next} 
          variant="outline" 
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-2 border-amber-400 font-bold text-lg px-6 py-3 ml-8"
        >
          <ArrowRight className="mr-2 h-5 w-5" />
          Next
        </Button>
      </div>
    </div>
  )
}
