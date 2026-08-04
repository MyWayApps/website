"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { comprehensionLessons } from "@/lib/tamil-comprehension-data"

export default function TamilComprehensionMain() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 flex flex-col items-center relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/chick.png"
        alt="Chick"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10 animate-bounce"
      />

      {/* Header with Back Button */}
      <div className="w-full max-w-6xl mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-pink-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-pink-900 mb-4">
          தமிழ் உரைநடை
        </h1>
        <p className="text-2xl text-pink-800 font-semibold">
          Tamil Comprehension
        </p>
        <p className="text-xl text-pink-700 mt-2">
          Read stories and test your understanding!
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {comprehensionLessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/tamil-comprehension/lesson/${lesson.id}`}>
            <Card className="bg-gradient-to-br from-white to-pink-100 hover:from-pink-50 hover:to-pink-200 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-6">
                {/* Lesson Number Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <BookOpen className="h-8 w-8 text-pink-600" />
                </div>

                {/* Image */}
                <div className="mb-4 flex justify-center">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/characters/bunny.png'
                    }}
                  />
                </div>

                {/* Title */}
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-pink-900 mb-2">
                    {lesson.tamilTitle}
                  </h3>
                  <p className="text-lg text-pink-700 font-semibold">
                    {lesson.title}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-pink-300">
                  <div className="flex justify-around text-sm text-pink-700">
                    <div className="text-center">
                      <div className="font-bold">{lesson.game1Questions.length}</div>
                      <div>Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">2</div>
                      <div>Games</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
