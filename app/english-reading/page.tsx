"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mic } from "lucide-react"
import Link from "next/link"
import { readingPassages } from "@/lib/english-reading-data"

export default function EnglishReadingMain() {
  const handleBackToHome = () => {
    window.location.href = "/#english"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 to-orange-400 p-4 flex flex-col items-center relative overflow-hidden">
      <img
        src="/characters/bunny.png"
        alt="Reading Buddy"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10 animate-bounce"
      />

      <div className="w-full max-w-6xl mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-orange-900 mb-4">Reading Coach</h1>
        <p className="text-2xl text-orange-800 font-semibold">
          Read the story out loud and get feedback!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {readingPassages.map((p, index) => (
          <Link key={p.id} href={`/english-reading/lesson/${p.id}`}>
            <Card className="bg-gradient-to-br from-white to-orange-100 hover:from-orange-50 hover:to-orange-200 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <Mic className="h-8 w-8 text-orange-600" />
                </div>

                <div className="mb-4 flex justify-center">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/characters/bunny.png"
                    }}
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-orange-900">{p.title}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
