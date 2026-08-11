"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { LetterType } from "@/lib/sanskrit-letters-data"

export default function SanskritLetters() {
  const [selectedType, setSelectedType] = useState<LetterType>("vowels")

  const handleBackToHome = () => {
    window.location.href = "/#sanskrit"
  }

  const letterTypes: { type: LetterType; native: string; english: string; description: string }[] = [
    { type: "vowels", native: "स्वराः", english: "Vowels", description: "अ, आ, इ, ई..." },
    { type: "consonants", native: "व्यञ्जनानि", english: "Consonants", description: "क, ख, ग, घ..." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 text-[16rem] leading-none opacity-10 pointer-events-none select-none z-0">
        ॐ
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-amber-50 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-amber-50 drop-shadow mb-4">संस्कृतवर्णमाला</h1>
          <p className="text-2xl text-amber-100 font-semibold">Learn Sanskrit Letters</p>
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
              <Link href={`/sanskrit-letters-flashcards?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-amber-100 to-amber-300 hover:from-amber-200 hover:to-amber-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-amber-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-amber-800 mb-2">अध्ययनम्</h3>
                    <p className="text-amber-600 text-lg">Learn letters, tap to hear</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/sanskrit-letters-game?type=${selectedType}`}>
                <Card className="bg-gradient-to-br from-orange-100 to-orange-300 hover:from-orange-200 hover:to-orange-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-orange-700 mb-2">क्रीडा</h3>
                    <p className="text-orange-600 text-lg">Listen and identify letters</p>
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
