"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { wordCategories } from "@/lib/telugu-vottulu-data"

export default function FindWordCategories() {
  const handleBackToWords = () => {
    window.location.href = "/telugu-vottulu/words"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/rabbit.png" 
        alt="Rabbit" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center">
        {/* Back Button */}
        <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
          <Button
            onClick={handleBackToWords}
            className="bg-white/20 hover:bg-white/30 text-pink-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Words with Vottulu
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-pink-900 mb-4">
            పదం కనుగొనండి
          </h1>
          <p className="text-2xl text-pink-700 font-semibold">
            Find the word - Choose a Category
          </p>
        </div>

        {/* Category Cards */}
        <div className="w-1/2 min-w-[500px] max-w-[800px] space-y-4">
          {wordCategories.map((category) => (
            <Link key={category.id} href={`/telugu-vottulu/words/find-word/${category.id}`}>
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-pink-800 mb-2">
                    {category.telugu}
                  </h3>
                  <p className="text-pink-600 text-lg">
                    {category.english}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

