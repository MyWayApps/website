"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2 } from "lucide-react"
import Link from "next/link"

export default function TeluguVottulu() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/rabbit.png" 
        alt="Rabbit" 
        className="absolute bottom-10 right-0 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-pink-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-pink-900 mb-4">
          తెలుగు వత్తులు
        </h1>
        <p className="text-xl text-pink-700 font-semibold">
          Learn Telugu Subscripts (Vottulu)
        </p>
      </div>

      {/* Main Options Card */}
      <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Learn Vottulu */}
            <Link href="/telugu-vottulu/learn">
              <Card className="bg-gradient-to-br from-pink-100 to-pink-300 hover:from-pink-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-16 w-16 text-pink-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-pink-800 mb-2">
                    వత్తులు నేర్చుకుందాం
                  </h3>
                  <p className="text-pink-600 text-lg">
                    Learn Vottulu
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Words with Vottulu */}
            <Link href="/telugu-vottulu/words">
              <Card className="bg-gradient-to-br from-pink-100 to-pink-300 hover:from-pink-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                <CardContent className="p-6 text-center">
                  <Gamepad2 className="h-16 w-16 text-pink-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-pink-800 mb-2">
                    వత్తులతో మాటలు
                  </h3>
                  <p className="text-pink-600 text-lg">
                    Words with Vottulu
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
