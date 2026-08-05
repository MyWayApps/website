"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { LetterType } from "@/lib/tamil-letters-data"

export default function TamilLetters() {
  const [selectedType, setSelectedType] = useState<LetterType>("vowels")

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const letterTypes: { type: LetterType; native: string; english: string; description: string }[] = [
    { type: "vowels", native: "உயிர் எழுத்துக்கள்", english: "Vowels", description: "அ, ஆ, இ, ஈ..." },
    { type: "consonants", native: "மெய் எழுத்துக்கள்", english: "Consonants", description: "க, ங, ச, ஞ..." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 relative overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-pink-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white drop-shadow mb-4">தமிழ் எழுத்துக்கள்</h1>
          <p className="text-2xl text-white/90 font-semibold">Learn Tamil Letters</p>
        </div>

        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-pink-800 mb-4 text-center">Select Letter Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {letterTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className={`relative p-4 rounded-xl border-3 transition-all duration-300 ${
                    selectedType === item.type
                      ? "bg-pink-200 border-pink-500 shadow-lg scale-105"
                      : "bg-white/80 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
                  }`}
                >
                  {selectedType === item.type && (
                    <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="text-3xl font-bold text-pink-800 mb-1">{item.native}</div>
                  <div className="text-lg text-pink-600 font-semibold">{item.english}</div>
                  <div className="text-sm text-pink-500 mt-1">{item.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              <Link href={`/tamil-letters-flashcards?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-rose-100 to-rose-300 hover:from-rose-200 hover:to-rose-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-rose-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-rose-800 mb-2">கற்போம்</h3>
                    <p className="text-rose-600 text-lg">Learn letters, tap to hear</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/tamil-letters-game?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-fuchsia-100 to-fuchsia-300 hover:from-fuchsia-200 hover:to-fuchsia-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-fuchsia-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-fuchsia-700 mb-2">விளையாட்டு</h3>
                    <p className="text-fuchsia-600 text-lg">Listen and identify letters</p>
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
