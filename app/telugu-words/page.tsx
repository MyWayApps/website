"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, Puzzle, Image, Edit3 } from "lucide-react"
import Link from "next/link"

export default function TeluguWordsMain() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/rabbit.png" 
        alt="Rabbit" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-purple-900 mb-4">
          తెలుగు పదాలు
        </h1>
        <p className="text-xl text-purple-700 font-semibold">
          Learn Telugu words through interactive games
        </p>
      </div>

      {/* Main Content - Two Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-[1600px]">
        {/* Game Selection Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">
              Choose a Game
            </h2>
          </div>

          {/* Game Options */}
          <div className="grid grid-cols-2 gap-6">
            {/* Listen & Point */}
            <Link href="/telugu-words/listen-point">
              <Card className="bg-gradient-to-br from-purple-100 to-pink-300 hover:from-purple-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Volume2 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-purple-700 mb-2">
                    వినండి – గుర్తించండి
                  </h3>
                  <p className="text-purple-600 text-lg">
                    Listen and select the correct word
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Word Puzzle */}
            <Card className="bg-gradient-to-br from-pink-100 to-purple-300 cursor-not-allowed opacity-60">
              <CardContent className="p-6 text-center">
                <Puzzle className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-pink-700 mb-2">
                  Word Puzzle
                </h3>
                <p className="text-pink-600 text-lg">
                  Coming Soon
                </p>
              </CardContent>
            </Card>

            {/* Picture-Word Match */}
            <Card className="bg-gradient-to-br from-purple-100 to-pink-300 cursor-not-allowed opacity-60">
              <CardContent className="p-6 text-center">
                <Image className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-purple-700 mb-2">
                  Picture-Word Match
                </h3>
                <p className="text-purple-600 text-lg">
                  Coming Soon
                </p>
              </CardContent>
            </Card>

            {/* Fill in Missing Letter */}
            <Card className="bg-gradient-to-br from-pink-100 to-purple-300 cursor-not-allowed opacity-60">
              <CardContent className="p-6 text-center">
                <Edit3 className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-pink-700 mb-2">
                  Fill Missing Letter
                </h3>
                <p className="text-pink-600 text-lg">
                  Coming Soon
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        </Card>

        {/* Learn by Word Length */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">
              Learn by Word Length
            </h2>
            <p className="text-lg text-purple-600">
              Practice words organized by the number of letters
            </p>
          </div>

          {/* Word Length Options */}
          <div className="grid grid-cols-2 gap-6">
            {/* 2-Letter Words */}
            <Link href="/telugu-words/by-length?length=2">
              <Card className="bg-gradient-to-br from-green-100 to-emerald-300 hover:from-green-200 hover:to-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-green-700 mb-4">2</div>
                  <h3 className="text-2xl font-bold text-green-700 mb-2">
                    2-Letter Words
                  </h3>
                  <p className="text-green-600 text-lg">
                    Learn basic two-letter Telugu words
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* 3-Letter Words */}
            <Link href="/telugu-words/by-length?length=3">
              <Card className="bg-gradient-to-br from-blue-100 to-cyan-300 hover:from-blue-200 hover:to-cyan-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-blue-700 mb-4">3</div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    3-Letter Words
                  </h3>
                  <p className="text-blue-600 text-lg">
                    Practice three-letter Telugu words
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* 4-Letter Words */}
            <Link href="/telugu-words/by-length?length=4">
              <Card className="bg-gradient-to-br from-yellow-100 to-orange-300 hover:from-yellow-200 hover:to-orange-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-orange-700 mb-4">4</div>
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">
                    4-Letter Words
                  </h3>
                  <p className="text-orange-600 text-lg">
                    Master four-letter Telugu words
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Other Words */}
            <Link href="/telugu-words/by-length?length=other">
              <Card className="bg-gradient-to-br from-red-100 to-pink-300 hover:from-red-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl font-bold text-red-700 mb-4">5+</div>
                  <h3 className="text-2xl font-bold text-red-700 mb-2">
                    Other Words
                  </h3>
                  <p className="text-red-600 text-lg">
                    Explore longer Telugu words
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
