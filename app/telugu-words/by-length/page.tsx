"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { getWordsByLength, TeluguWord } from "@/lib/telugu-words-by-length-data"

function WordLengthGame() {
  const searchParams = useSearchParams()
  const length = searchParams.get("length") || "2"
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [words, setWords] = useState<TeluguWord[]>([])
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const [showTransliteration, setShowTransliteration] = useState(true)

  useEffect(() => {
    const wordsList = getWordsByLength(length as "2" | "3" | "4" | "other")
    setWords(wordsList)
    setCurrentIndex(0)
  }, [length])

  const currentWord = words[currentIndex]

  const handleBackToMenu = () => {
    window.location.href = "/telugu-words"
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePlayAudio = async (text: string) => {
    if (isPlayingTTS) return
    
    try {
      setIsPlayingTTS(true)
      await playTeluguTTS(text)
    } catch (error) {
      console.log("TTS error:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  const getLengthTitle = () => {
    switch (length) {
      case "2":
        return "2-Letter Words (రెండు అక్షరాలు)"
      case "3":
        return "3-Letter Words (మూడు అక్షరాలు)"
      case "4":
        return "4-Letter Words (నాలుగు అక్షరాలు)"
      case "other":
        return "Longer Words (పొడవైన పదాలు)"
      default:
        return "Telugu Words"
    }
  }

  const getColorScheme = () => {
    switch (length) {
      case "2":
        return {
          gradient: "from-green-200 to-emerald-400",
          card: "from-green-100 to-emerald-300",
          text: "text-green-900",
          button: "bg-green-500 hover:bg-green-600"
        }
      case "3":
        return {
          gradient: "from-blue-200 to-cyan-400",
          card: "from-blue-100 to-cyan-300",
          text: "text-blue-900",
          button: "bg-blue-500 hover:bg-blue-600"
        }
      case "4":
        return {
          gradient: "from-yellow-200 to-orange-400",
          card: "from-yellow-100 to-orange-300",
          text: "text-orange-900",
          button: "bg-orange-500 hover:bg-orange-600"
        }
      case "other":
        return {
          gradient: "from-red-200 to-pink-400",
          card: "from-red-100 to-pink-300",
          text: "text-red-900",
          button: "bg-red-500 hover:bg-red-600"
        }
      default:
        return {
          gradient: "from-purple-200 to-pink-400",
          card: "from-purple-100 to-pink-300",
          text: "text-purple-900",
          button: "bg-purple-500 hover:bg-purple-600"
        }
    }
  }

  const colorScheme = getColorScheme()

  if (!currentWord || words.length === 0) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-4">
            No words available yet!
          </div>
          <p className="text-xl text-white/90 mb-6">
            This category is coming soon.
          </p>
          <Button
            onClick={handleBackToMenu}
            className="bg-white/20 hover:bg-white/30 border-2 border-white font-bold text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme.gradient} p-4 relative overflow-hidden`}>
      {/* Animated Character */}
      <img 
        src="/characters/panda.png" 
        alt="Panda" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackToMenu}
            className="bg-white/20 hover:bg-white/30 border-2 border-white font-bold"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
          
          <Button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className="bg-white/20 hover:bg-white/30 border-2 border-white font-bold"
            variant="outline"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            {showTransliteration ? "Hide" : "Show"} Transliteration
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className={`text-5xl font-bold ${colorScheme.text} mb-2`}>
          {getLengthTitle()}
        </h1>
        <p className={`text-2xl ${colorScheme.text} font-semibold`}>
          Word {currentIndex + 1} of {words.length}
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto">
        <Card className={`min-h-[400px] bg-gradient-to-br ${colorScheme.card} border-4 border-white shadow-2xl`}>
          <CardContent className="p-12 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center space-y-8 w-full">
              {/* Telugu Word */}
              <div className="flex items-center justify-center gap-6">
                <h2 className={`text-8xl font-bold ${colorScheme.text}`}>
                  {currentWord.word}
                </h2>
                <Button
                  onClick={() => handlePlayAudio(currentWord.word)}
                  disabled={isPlayingTTS}
                  className={`${colorScheme.button} text-white rounded-full p-4 disabled:opacity-50`}
                  size="lg"
                >
                  <Volume2 className="h-8 w-8" />
                </Button>
              </div>

              {/* Transliteration */}
              {showTransliteration && (
                <div className="bg-white/50 rounded-lg p-6">
                  <p className={`text-4xl ${colorScheme.text} font-semibold`}>
                    {currentWord.transliteration}
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-6 pt-8">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="bg-white/80 hover:bg-white text-gray-800 font-bold text-xl px-8 py-6 disabled:opacity-50"
                  size="lg"
                >
                  <ChevronLeft className="mr-2 h-6 w-6" />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={currentIndex === words.length - 1}
                  className="bg-white/80 hover:bg-white text-gray-800 font-bold text-xl px-8 py-6 disabled:opacity-50"
                  size="lg"
                >
                  Next
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6 bg-white/50 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full ${colorScheme.button} transition-all duration-300`}
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default function WordLengthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading...</div>
      </div>
    }>
      <WordLengthGame />
    </Suspense>
  )
}

