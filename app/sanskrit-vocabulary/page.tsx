"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { vocabularyCategories } from "@/lib/sanskrit-vocabulary-data"

export default function SanskritVocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<string>("days")

  const handleBackToHome = () => {
    window.location.href = "/#sanskrit"
  }

  const selectedCategoryData = vocabularyCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 relative overflow-hidden">
      {/* Decorative Symbol */}
      <div className="absolute bottom-0 right-0 text-[16rem] leading-none opacity-10 pointer-events-none select-none z-10">
        ॐ
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        {/* Back to Home Button */}
        <div className="w-full max-w-[900px] mb-8">
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
            संस्कृतशब्दावली
          </h1>
          <p className="text-2xl text-amber-100 font-semibold">
            Sanskrit Vocabulary
          </p>
        </div>

        {/* Game Options */}
        <Card className="w-full max-w-[900px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learn with Flashcards */}
              <Link href={`/sanskrit-vocabulary-flashcards?category=${selectedCategory}`}>
                <Card className="bg-gradient-to-br from-amber-100 to-amber-300 hover:from-amber-200 hover:to-amber-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-amber-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-amber-800 mb-2">
                      शब्दान् पठामः
                    </h3>
                    <p className="text-amber-600 text-lg">
                      Learn words with flashcards
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Vocabulary Game */}
              <Link href={`/sanskrit-vocabulary-game?category=${selectedCategory}`}>
                <Card className="bg-gradient-to-br from-orange-100 to-orange-300 hover:from-orange-200 hover:to-orange-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-orange-700 mb-2">
                      शब्दक्रीडा
                    </h3>
                    <p className="text-orange-600 text-lg">
                      Read in English, find the Sanskrit word
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Selected Category Info */}
        {selectedCategoryData && (
          <div className="text-center mb-4">
            <p className="text-lg text-white font-semibold">
              Selected: {selectedCategoryData.nameSanskrit} ({selectedCategoryData.nameEnglish}) - {selectedCategoryData.items.length} words
            </p>
          </div>
        )}

        {/* Category Selection - Moved to bottom */}
        <Card className="w-full max-w-[900px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
              कः विभागः पठनीयः? (Select Category)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {vocabularyCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedCategory === category.id
                      ? "bg-amber-200 border-amber-600 shadow-lg scale-105"
                      : "bg-white/80 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                  }`}
                >
                  {selectedCategory === category.id && (
                    <div className="absolute top-2 right-2 bg-amber-600 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="text-lg font-bold text-amber-800">
                    {category.nameSanskrit}
                  </div>
                  <div className="text-sm text-amber-600">
                    {category.nameEnglish}
                  </div>
                  <div className="text-xs text-amber-400 mt-1">
                    {category.items.length} words
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
