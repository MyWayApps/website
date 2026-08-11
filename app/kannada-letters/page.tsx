"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { LetterType } from "@/lib/kannada-letters-data"

export default function KannadaLetters() {
  const [selectedType, setSelectedType] = useState<LetterType>("vowels")

  const handleBackToHome = () => {
    window.location.href = "/#kannada"
  }

  const letterTypes: { type: LetterType; native: string; english: string; description: string }[] = [
    { type: "vowels", native: "ಸ್ವರಗಳು", english: "Vowels", description: "ಅ, ಆ, ಇ, ಈ..." },
    { type: "consonants", native: "ವ್ಯಂಜನಗಳು", english: "Consonants", description: "ಕ, ಖ, ಗ, ಘ..." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 p-4 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-amber-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white drop-shadow mb-4">ಕನ್ನಡ ಅಕ್ಷರಗಳು</h1>
          <p className="text-2xl text-white/90 font-semibold">Learn Kannada Letters</p>
        </div>

        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">Select Letter Type</h2>
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
                  <div className="text-3xl font-bold text-amber-800 mb-1">{item.native}</div>
                  <div className="text-lg text-amber-600 font-semibold">{item.english}</div>
                  <div className="text-sm text-amber-500 mt-1">{item.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <Link href={`/kannada-letters-flashcards?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-yellow-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">ಕಲಿಯಿರಿ</h3>
                    <p className="text-yellow-600 text-lg">Learn letters, tap to hear</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/kannada-letters-game?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-amber-100 to-amber-300 hover:from-amber-200 hover:to-amber-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-amber-700 mb-2">ಆಟ</h3>
                    <p className="text-amber-600 text-lg">Listen and identify letters</p>
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
