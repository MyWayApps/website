"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Gamepad2, Check } from "lucide-react"
import Link from "next/link"
import { vocabularyCategories } from "@/lib/tamil-vocabulary-data"

export default function TamilVocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<string>("days")

  const handleBackToHome = () => {
    window.location.href = "/"
  }

  const selectedCategoryData = vocabularyCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/zebra.png"
        alt="Zebra"
        className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        {/* Back to Home Button */}
        <div className="w-full max-w-[900px] mb-8">
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
            தமிழ் சொல்வளம்
          </h1>
          <p className="text-2xl text-pink-700 font-semibold">
            Tamil Vocabulary
          </p>
        </div>

        {/* Game Options */}
        <Card className="w-full max-w-[900px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learn with Flashcards */}
              <Link href={`/tamil-vocabulary-flashcards?category=${selectedCategory}`}>
                <Card className="bg-gradient-to-br from-rose-100 to-rose-300 hover:from-rose-200 hover:to-rose-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-16 w-16 text-rose-700 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-rose-800 mb-2">
                      சொற்களைக் கற்போம்
                    </h3>
                    <p className="text-rose-600 text-lg">
                      Learn words with flashcards
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Vocabulary Game */}
              <Link href={`/tamil-vocabulary-game?category=${selectedCategory}`}>
                <Card className="bg-gradient-to-br from-fuchsia-100 to-fuchsia-300 hover:from-fuchsia-200 hover:to-fuchsia-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg h-full">
                  <CardContent className="p-6 text-center">
                    <Gamepad2 className="h-16 w-16 text-fuchsia-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-fuchsia-700 mb-2">
                      சொல் விளையாட்டு
                    </h3>
                    <p className="text-fuchsia-600 text-lg">
                      Listen in English, find the Tamil word
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
              Selected: {selectedCategoryData.nameTamil} ({selectedCategoryData.nameEnglish}) - {selectedCategoryData.items.length} words
            </p>
          </div>
        )}

        {/* Category Selection - Moved to bottom */}
        <Card className="w-full max-w-[900px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-pink-800 mb-4 text-center">
              எந்தப் பிரிவைக் கற்க வேண்டும்? (Select Category)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {vocabularyCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedCategory === category.id
                      ? "bg-pink-200 border-pink-500 shadow-lg scale-105"
                      : "bg-white/80 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
                  }`}
                >
                  {selectedCategory === category.id && (
                    <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div className="text-lg font-bold text-pink-800">
                    {category.nameTamil}
                  </div>
                  <div className="text-sm text-pink-600">
                    {category.nameEnglish}
                  </div>
                  <div className="text-xs text-pink-400 mt-1">
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
