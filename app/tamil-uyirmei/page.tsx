"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Search, Puzzle } from "lucide-react"
import Link from "next/link"

export default function TamilUyirmei() {
  const handleBackToHome = () => {
    window.location.href = "/#tamil"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/bird.png"
        alt="Bird"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center">
        {/* Back to Home Button */}
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-indigo-900 mb-4">
            உயிர்மெய் எழுத்துக்கள் (Uyirmei)
          </h1>
          <p className="text-2xl text-indigo-700 font-semibold">
            Learn Tamil Consonant-Vowel Combinations
          </p>
        </div>

        {/* Game Options */}
        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Learn Uyirmei */}
              <Link href="/tamil-uyirmei/learn">
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-yellow-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">
                      உயிர்மெய் கற்போம்
                    </h3>
                    <p className="text-yellow-600 text-lg">
                      Master consonant-vowel combinations
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Sequence Game */}
              <Link href="/tamil-uyirmei/sequence">
                <Card className="bg-gradient-to-br from-teal-100 to-teal-300 hover:from-teal-200 hover:to-teal-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-teal-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-teal-700 mb-2">
                      வரிசையில் வைப்போம்
                    </h3>
                    <p className="text-teal-600 text-lg">
                      Drag and drop letters in correct order
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Missing Letters Game */}
              <Link href="/tamil-uyirmei/missing">
                <Card className="bg-gradient-to-br from-teal-100 to-teal-300 hover:from-teal-200 hover:to-teal-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Search className="h-16 w-16 text-teal-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-teal-700 mb-2">
                      காலியை நிரப்பு
                    </h3>
                    <p className="text-teal-600 text-lg">
                      Find the missing letters in sequence
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Match the Pair Game */}
              <Link href="/tamil-uyirmei/match">
                <Card className="bg-gradient-to-br from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Puzzle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-yellow-700 mb-2">
                      இணையைத் தேடு
                    </h3>
                    <p className="text-yellow-600 text-lg">
                      Match consonants with vowels
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
