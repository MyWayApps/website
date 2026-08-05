"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { LetterType } from "@/lib/hindi-letters-data"

export default function HindiLetters() {
  const [selectedType, setSelectedType] = useState<LetterType>("vowels")

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const letterTypes: { type: LetterType; native: string; english: string; description: string }[] = [
    { type: "vowels", native: "स्वर", english: "Vowels", description: "अ, आ, इ, ई..." },
    { type: "consonants", native: "व्यंजन", english: "Consonants", description: "क, ख, ग, घ..." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-400 to-rose-500 p-4 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white drop-shadow mb-4">हिंदी वर्णमाला</h1>
          <p className="text-2xl text-white/90 font-semibold">Learn Hindi Letters</p>
        </div>

        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">Select Letter Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {letterTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className={`relative p-4 rounded-xl border-3 transition-all duration-300 ${
                    selectedType === item.type
                      ? "bg-red-200 border-red-500 shadow-lg scale-105"
                      : "bg-white/80 border-red-200 hover:bg-red-50 hover:border-red-300"
                  }`}
                >
                  {selectedType === item.type && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="text-3xl font-bold text-red-800 mb-1">{item.native}</div>
                  <div className="text-lg text-red-600 font-semibold">{item.english}</div>
                  <div className="text-sm text-red-500 mt-1">{item.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <Link href={`/hindi-letters-flashcards?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-orange-100 to-orange-300 hover:from-orange-200 hover:to-orange-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-orange-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-orange-800 mb-2">सीखें</h3>
                    <p className="text-orange-600 text-lg">Learn letters, tap to hear</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/hindi-letters-game?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-red-100 to-red-300 hover:from-red-200 hover:to-red-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-2">खेल</h3>
                    <p className="text-red-600 text-lg">Listen and identify letters</p>
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
