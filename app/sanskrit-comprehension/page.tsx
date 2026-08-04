"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { comprehensionLessons } from "@/lib/sanskrit-comprehension-data"

export default function SanskritComprehensionMain() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 flex flex-col items-center relative overflow-hidden">
      {/* Decorative Symbol */}
      <div className="absolute bottom-10 right-10 text-[10rem] leading-none opacity-10 pointer-events-none select-none z-10">
        ॐ
      </div>

      {/* Header with Back Button */}
      <div className="w-full max-w-6xl mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-amber-50 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-amber-50 mb-4">
          संस्कृतगद्यम्
        </h1>
        <p className="text-2xl text-amber-100 font-semibold">
          Sanskrit Comprehension
        </p>
        <p className="text-xl text-amber-100/90 mt-2">
          Read stories and test your understanding!
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {comprehensionLessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/sanskrit-comprehension/lesson/${lesson.id}`}>
            <Card className="bg-gradient-to-br from-white to-amber-100 hover:from-amber-50 hover:to-amber-200 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-6">
                {/* Lesson Number Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <BookOpen className="h-8 w-8 text-amber-600" />
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
                  <h3 className="text-3xl font-bold text-amber-900 mb-2">
                    {lesson.sanskritTitle}
                  </h3>
                  <p className="text-lg text-amber-700 font-semibold">
                    {lesson.title}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-amber-300">
                  <div className="flex justify-around text-sm text-amber-700">
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
