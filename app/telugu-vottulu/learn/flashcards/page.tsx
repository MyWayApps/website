"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { vottuluCategories } from "@/lib/telugu-vottulu-data"

export default function VottuluFlashcardsMain() {
  const handleBackToLearn = () => {
    window.location.href = "/telugu-vottulu/learn"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/rabbit.png" 
        alt="Rabbit" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToLearn}
          className="bg-white/20 hover:bg-white/30 text-pink-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Learn Vottulu
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-pink-900 mb-4">
          Flash Cards
        </h1>
        <p className="text-xl text-pink-700 font-semibold">
          Select a category to learn
        </p>
      </div>

      {/* Categories Card */}
      <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="space-y-4">
            {vottuluCategories.map((category) => (
              <Link key={category.id} href={`/telugu-vottulu/learn/flashcards/${category.id}`}>
                <Card className="bg-gradient-to-br from-pink-100 to-pink-300 hover:from-pink-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
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
        </CardContent>
      </Card>
    </div>
  )
}
