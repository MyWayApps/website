"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lightbulb, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function TeluguRiddlesMain() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-red-400 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/monkey-1.png" 
        alt="Monkey" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10 animate-bounce"
      />
      
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-orange-900 mb-4">
          తెలుగు పొడుపు కథలు
        </h1>
        <p className="text-xl text-orange-800 font-semibold">
          Telugu Riddles - Test Your Brain!
        </p>
      </div>

      {/* Game Selection Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-800 mb-6">
              Choose a Game Mode
            </h2>
          </div>

          {/* Game Options */}
          <div className="grid grid-cols-2 gap-6">
            {/* Flip Card Game */}
            <Link href="/telugu-riddles/flip-card">
              <Card className="bg-gradient-to-br from-yellow-100 to-orange-300 hover:from-yellow-200 hover:to-orange-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-orange-800 mb-2">
                    Flip Card Game
                  </h3>
                  <p className="text-orange-700 text-lg">
                    Click to reveal riddle, click again for answer
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Multiple Choice Game */}
            <Link href="/telugu-riddles/multiple-choice">
              <Card className="bg-gradient-to-br from-red-100 to-pink-300 hover:from-red-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-800 mb-2">
                    Multiple Choice
                  </h3>
                  <p className="text-red-700 text-lg">
                    Choose the best answer from three options
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

