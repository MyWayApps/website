"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

const teluguLetters = [
  "అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ",
  "క", "ఖ", "గ", "ఘ", "ఙ",
  "చ", "ఛ", "జ", "ఝ", "ఞ",
  "ట", "ఠ", "డ", "ఢ", "ణ",
  "త", "థ", "ద", "ధ", "న",
  "ప", "ఫ", "బ", "భ", "మ",
  "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ"
]

export default function TeluguFlashCards() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)

  // Play Telugu letter using browser TTS
  const speakTelugu = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = "te-IN"
    window.speechSynthesis.speak(utterance)
  }

    // Go back to home page
  const onBackToHome = () => {
    window.location.href = "/"
  }

  // Reset the flashcards game
  const resetGame = () => {
    setIndex(0)
    setScore(0)
  }

  const prev = () => setIndex((i) => (i === 0 ? teluguLetters.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === teluguLetters.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-300 to-green-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full max-w-lg">
        <Button
          onClick={onBackToHome}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>

        <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
          <Star className="h-6 w-6 text-yellow-600" />
          <span className="text-xl font-bold text-indigo-800">Score: {score}</span>
        </div>
      </div>

      <Card className="w-80 h-80 flex flex-col items-center justify-center shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="text-8xl font-bold mb-4">{teluguLetters[index]}</div>
          <div className="flex space-x-6 mt-8">
            <Button onClick={prev} variant="outline">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button onClick={() => speakTelugu(teluguLetters[index])} variant="outline">
            🔊
            </Button>
            <Button onClick={next} variant="outline">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Link href="/" className="mt-8 text-white underline">
        ← Back to Home
      </Link>
    </div>
  )
}