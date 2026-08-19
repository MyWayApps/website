"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { chertthezhuthuConsonants } from "@/lib/malayalam-chertthezhuthu-data"

export default function MalayalamMissingPickerMain() {
  const [selectedConsonant, setSelectedConsonant] = useState("")
  const router = useRouter()

  const handleBack = () => {
    window.location.href = "/malayalam-chertthezhuthu"
  }

  const handleStartGame = () => {
    if (selectedConsonant) {
      router.push(`/malayalam-chertthezhuthu/missing/${selectedConsonant}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
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
        <h1 className="text-5xl font-bold text-indigo-900 mb-4">
          കാലി നിറയ്ക്കാം
        </h1>
        <p className="text-xl text-indigo-700 font-semibold">
          Choose a consonant and find the missing letters in the sequence
        </p>
      </div>

      {/* Game Selection Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Consonant Dropdown */}
            <div className="mb-8">
              <select
                value={selectedConsonant}
                onChange={(e) => setSelectedConsonant(e.target.value)}
                className="w-full max-w-md px-4 py-3 text-2xl font-bold text-indigo-800 bg-white border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select a consonant...</option>
                {chertthezhuthuConsonants.map((consonant, index) => (
                  <option key={index} value={consonant}>
                    {consonant} ചേർത്തെഴുത്ത്
                  </option>
                ))}
              </select>
            </div>

            {/* Start Game Button */}
            <Button
              onClick={handleStartGame}
              disabled={!selectedConsonant}
              className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 border-2 border-indigo-400 font-bold text-xl px-8 py-4 disabled:opacity-50"
              variant="outline"
            >
              <Play className="mr-2 h-6 w-6" />
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
