"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { vocabularyCategories } from "@/lib/hindi-vocabulary-data"

export default function HindiVocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<string>("days")

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const selectedCategoryData = vocabularyCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-red-500 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/tiger.png"
        alt="Tiger"
        className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        {/* Back to Home Button */}
        <div className="w-full max-w-[900px] mb-8">
          <Button
            onClick={handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-red-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-red-900 mb-4">
            हिंदी शब्दावली
          </h1>
          <p className="text-2xl text-red-700 font-semibold">
            Hindi Vocabulary
          </p>
        </div>

        {/* Game Options */}
        <Card className="w-full max-w-[900px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learn with Flashcards */}
              <Link href={`/hindi-vocabulary-flashcards?category=${selectedCategory}`}>
                <Card className="bg-gradient-to-br from-orange-100 to-orange-300 hover:from-orange-200 hover:to-orange-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-orange-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-orange-800 mb-2">
                      शब्द सीखें
                    </h3>
                    <p className="text-orange-600 text-lg">
                      Learn words with flashcards
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Vocabulary Game */}
              <Link href={`/hindi-vocabulary-game?category=${selectedCategory}`}>
                <Card className="bg-gradient-to-br from-red-100 to-red-300 hover:from-red-200 hover:to-red-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-2">
                      शब्द खेल
                    </h3>
                    <p className="text-red-600 text-lg">
                      Listen in English, find the Hindi word
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
              Selected: {selectedCategoryData.nameHindi} ({selectedCategoryData.nameEnglish}) - {selectedCategoryData.items.length} words
            </p>
          </div>
        )}

        {/* Category Selection - Moved to bottom */}
        <Card className="w-full max-w-[900px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-4 text-center">
              कौन सा विभाग सीखना है? (Select Category)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {vocabularyCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedCategory === category.id
                      ? "bg-red-200 border-red-500 shadow-lg scale-105"
                      : "bg-white/80 border-red-200 hover:bg-red-50 hover:border-red-300"
                  }`}
                >
                  {selectedCategory === category.id && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="text-lg font-bold text-red-800">
                    {category.nameHindi}
                  </div>
                  <div className="text-sm text-red-600">
                    {category.nameEnglish}
                  </div>
                  <div className="text-xs text-red-400 mt-1">
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
