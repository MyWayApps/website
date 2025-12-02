"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, RotateCcw, Volume2 } from "lucide-react"
import { useParams } from "next/navigation"
import { playTeluguTTS } from "@/lib/telugu-tts"

// Matra mapping data - works for all consonants
const matraData = [
  { matra: "", name: "అ కారము", audio: "tbd.mp3" },
  { matra: "ా", name: "ఆ కారము", audio: "tbd.mp3" },
  { matra: "ి", name: "ఇ కారము", audio: "tbd.mp3" },
  { matra: "ీ", name: "ఈ కారము", audio: "tbd.mp3" },
  { matra: "ు", name: "ఉ కారము", audio: "tbd.mp3" },
  { matra: "ూ", name: "ఊ కారము", audio: "tbd.mp3" },
  { matra: "ృ", name: "ఋ కారము", audio: "tbd.mp3" },
  { matra: "ౄ", name: "ౠ కారము", audio: "tbd.mp3" },
  { matra: "ె", name: "ఎ కారము", audio: "tbd.mp3" },
  { matra: "ే", name: "ఏ కారము", audio: "tbd.mp3" },
  { matra: "ై", name: "ఐ కారము", audio: "tbd.mp3" },
  { matra: "ొ", name: "ఒ కారము", audio: "tbd.mp3" },
  { matra: "ో", name: "ఓ కారము", audio: "tbd.mp3" },
  { matra: "ౌ", name: "ఔ కారము", audio: "tbd.mp3" },
  { matra: "ం", name: "పూర్ణాను స్వారము", audio: "tbd.mp3" },
  { matra: "ః", name: "విసర్గం", audio: "tbd.mp3" }
]

export default function GunintaaluDetail() {
  const params = useParams()
  const consonant = decodeURIComponent(params.consonant as string)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Update matra data with the selected consonant
  const updatedMatraData = matraData.map(item => ({
    ...item,
    result: consonant + item.matra
  }))

  const currentMatra = updatedMatraData[currentIndex]

  // Play audio for current matra using TTS
  const playAudio = async () => {
    if (isPlayingTTS) return
    
    try {
      setIsPlayingTTS(true)
      const textToSpeak = currentMatra.result
      await playTeluguTTS(textToSpeak)
    } catch (error) {
      console.error("TTS play failed:", error)
      // Fallback to audio file if TTS fails
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(err => {
          console.error("Audio play failed:", err)
        })
      }
    } finally {
      setIsPlayingTTS(false)
    }
  }

  // Auto-play audio when index changes
  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio()
    }, 300)
    return () => clearTimeout(timer)
  }, [currentIndex])

  // Add keyboard event listeners for arrow keys
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious()
      } else if (event.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < updatedMatraData.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
  }

  const handleBackToLearn = () => {
    window.location.href = "/telugu-gunintaalu/learn"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToLearn}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Learn
        </Button>
      </div>


      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="text-lg text-indigo-700 font-semibold">
          {currentIndex + 1} of {updatedMatraData.length}
        </div>
        <div className="w-80 bg-indigo-200 rounded-full h-3 mt-2">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / updatedMatraData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Learning Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-6">
          <div className="text-center">
            {/* Consonant + Matra Display */}
            <div className="mb-12">
              <div className="text-4xl font-bold text-indigo-800 mb-4 whitespace-nowrap overflow-hidden">
                {consonant} + {currentMatra.matra} ({currentMatra.name}) = {currentMatra.result}
              </div>
            </div>

            {/* All Buttons in One Row */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 border-2 border-indigo-400 font-bold text-lg px-6 py-3 disabled:opacity-50"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              <Button
                onClick={playAudio}
                disabled={isPlayingTTS}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3 disabled:opacity-50"
                variant="outline"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {isPlayingTTS ? "Playing..." : "🔊 Play Audio"}
              </Button>

              <Button
                onClick={handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Start Over
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentIndex === updatedMatraData.length - 1}
                className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 border-2 border-indigo-400 font-bold text-lg px-6 py-3 disabled:opacity-50"
                variant="outline"
              >
                Next
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={`/audio/${currentMatra.audio}`}
        preload="auto"
        onError={(e) => console.error("Audio error:", e)}
      />
    </div>
  )
}
