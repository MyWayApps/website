"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlayCircle } from "lucide-react"
import Link from "next/link"
import { scienceLessons } from "@/lib/science-videos-data"

export default function ScienceHub() {
  const handleBackToHome = () => {
    window.location.href = "/#science"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 to-green-600 p-4 flex flex-col items-center relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/cow.png"
        alt="Cow"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header with Back Button */}
      <div className="w-full max-w-6xl mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-emerald-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-emerald-950 mb-4">
          Science
        </h1>
        <p className="text-xl text-emerald-900 mt-2">
          Watch and learn — pick a topic to get started!
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {scienceLessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/science/${lesson.id}`}>
            <Card className="bg-gradient-to-br from-white to-emerald-100 hover:from-emerald-50 hover:to-emerald-200 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white h-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <PlayCircle className="h-8 w-8 text-emerald-600" />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-emerald-700">
                    {lesson.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
