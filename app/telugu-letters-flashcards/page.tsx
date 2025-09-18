"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

const teluguLetters = [
  "అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ",
  "క", "ఖ", "గ", "ఘ", "ఙ",
  "చ", "ఛ", "జ", "ఝ", "ఞ",
  "ట", "ఠ", "డ", "ఢ", "ణ",
  "త", "థ", "ద", "ధ", "న",
  "ప", "ఫ", "బ", "భ", "మ",
  "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ"
]

const teluguWords = [
  "అమ్మ", "ఆవు", "ఇల్లు", "ఈగ", "ఉడుత", "ఊరు", "ఋషి", "ఎలుక", "ఏనుగు", "ఐదు", "ఒంటె", "ఓడ", "ఔషధం",
  "కప్ప", "ఖడ్గం", "గుర్రం", "ఘంట", "ఙ", 
  "చిలుక", "ఛత్రం", "జింక", "ఝ", "ఞ",
  "టమాట", "ఠ", "డేగ", "ఢ", "ణ",
  "తాబేలు", "థ", "దీపం", "ధ", "నక్క",
  "పిల్లి", "ఫలం", "బావి", "భ", "మేక",
  "య", "రాజు", "లేడి", "వర్షం", "శ", "ష", "సింహం", "హంస", "ళ", "క్ష", "ఱ"
]

export default function TeluguFlashCards() {
  const [index, setIndex] = useState(0)

  // Play Telugu letter using browser TTS
  const speakTelugu = (text: string) => {
    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = "te-IN"
    window.speechSynthesis.speak(utterance)
  }

  // Auto-play audio when component mounts and when index changes
  useEffect(() => {
    speakTelugu(teluguLetters[index])
  }, [index])

  // Go back to home page
  const onBackToHome = () => {
    window.location.href = "/"
  }

  // Reset the flashcards game
  const resetGame = () => {
    setIndex(0)
  }

  const prev = () => setIndex((i) => (i === 0 ? teluguLetters.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === teluguLetters.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-300 to-green-500">
      
      {/* Header - Aligned with rectangle */}
      <div className="w-1/2 min-w-[400px] mb-6">
        <Button
          onClick={onBackToHome}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      <Card className="w-1/2 h-1/2 min-w-[400px] min-h-[400px] flex flex-col items-center justify-center shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center h-full p-8">
          <div className="text-9xl font-bold mb-8 text-indigo-800">{teluguLetters[index]}</div>
          
          {/* Word starting with the letter */}
          <div className="text-2xl font-semibold text-indigo-700 mb-8 text-center">
            {teluguWords[index] && teluguWords[index] !== teluguLetters[index] ? (
              <span>Word: {teluguWords[index]}</span>
            ) : (
              <span className="text-gray-500">No word available</span>
            )}
          </div>
          
          <div className="flex space-x-6">
            <Button onClick={prev} variant="outline" className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-indigo-300">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button onClick={() => speakTelugu(teluguLetters[index])} variant="outline" className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-indigo-300">
              🔊
            </Button>
            <Button onClick={next} variant="outline" className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-indigo-300">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}