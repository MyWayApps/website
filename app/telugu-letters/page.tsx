"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function TeluguLetters() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

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

        {/* Game Options */}
        <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-6">
              {/* Learn with Flashcards */}
              <Link href="/telugu-letters-flashcards">
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
              <Link href="/telugu-letters-game">
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

