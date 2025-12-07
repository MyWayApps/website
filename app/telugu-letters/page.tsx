"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { LetterType } from "@/lib/telugu-letters-data"

export default function TeluguLetters() {
  const [selectedType, setSelectedType] = useState<LetterType>("vowels")

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const letterTypes: { type: LetterType; telugu: string; english: string; description: string; note?: string }[] = [
    { 
      type: "vowels", 
      telugu: "అచ్చులు", 
      english: "Vowels",
      description: "అ, ఆ, ఇ, ఈ, ఉ, ఊ, ఋ, ౠ, ఌ, ౡ, ఎ, ఏ, ఐ, ఒ, ఓ, ఔ, అం, అః",
      note: "Note: ఉభయాక్షరమలు (ఁ ం ః)"
    },
    { 
      type: "consonants", 
      telugu: "హల్లులు", 
      english: "Consonants",
      description: "క, ఖ, గ, ఘ..."
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-amber-400 p-4">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Back to Home Button */}
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-amber-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-amber-900 mb-4">
            తెలుగు అక్షరాలు
          </h1>
          <p className="text-2xl text-amber-700 font-semibold">
            Learn Telugu Letters
          </p>
        </div>

        {/* Letter Type Selection */}
        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
              ఏ అక్షరాలు నేర్చుకోవాలి? (Select Letter Type)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {letterTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className={`relative p-4 rounded-xl border-3 transition-all duration-300 ${
                    selectedType === item.type
                      ? "bg-amber-200 border-amber-500 shadow-lg scale-105"
                      : "bg-white/80 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                  }`}
                >
                  {selectedType === item.type && (
                    <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="text-3xl font-bold text-amber-800 mb-1">
                    {item.telugu}
                  </div>
                  <div className="text-lg text-amber-600 font-semibold">
                    {item.english}
                  </div>
                  <div className="text-sm text-amber-500 mt-1">
                    {item.description}
                  </div>
                  {item.note && (
                    <div className="text-xs text-amber-400 mt-2 italic">
                      {item.note}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Options */}
        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Learn with Flashcards */}
              <Link href={`/telugu-letters-flashcards?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-yellow-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">
                      అక్షరాలు నేర్చుకుందాం
                    </h3>
                    <p className="text-yellow-600 text-lg">
                      Learn letters with flashcards
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Letter Game */}
              <Link href={`/telugu-letters-game?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-amber-100 to-amber-300 hover:from-amber-200 hover:to-amber-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-amber-700 mb-2">
                      అక్షరాల ఆట
                    </h3>
                    <p className="text-amber-600 text-lg">
                      Listen and identify letters
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
