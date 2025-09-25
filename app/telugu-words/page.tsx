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
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 p-4 flex flex-col items-center justify-center">
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

      {/* Game Selection Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
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
    </div>
  )
}
