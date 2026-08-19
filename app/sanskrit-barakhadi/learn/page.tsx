"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { barakhadiConsonants } from "@/lib/sanskrit-barakhadi-data"

export default function SanskritLearnPicker() {
  const handleBack = () => {
    window.location.href = "/sanskrit-barakhadi"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
        <Button
          onClick={handleBack}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-indigo-900 mb-4 flex items-center justify-center">
          <BookOpen className="mr-4 h-12 w-12" />
          बारहखड़ी पठामः
        </h1>
        <p className="text-xl text-indigo-700 font-semibold">
          Select a consonant to learn its combinations with vowels
        </p>
      </div>

      {/* Consonant Grid */}
      <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-4 gap-4">
            {barakhadiConsonants.map((consonant, index) => (
              <Link key={index} href={`/sanskrit-barakhadi/learn/${consonant}`}>
                <Card className="bg-gradient-to-br from-blue-100 to-indigo-200 hover:from-blue-200 hover:to-indigo-300 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl font-bold text-indigo-800 mb-2">
                      {consonant}
                    </div>
                    <div className="text-xs text-indigo-600 font-semibold">
                      बारहखड़ी
                    </div>
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
