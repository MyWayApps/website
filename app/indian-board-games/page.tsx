"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import ChowkaBaraGame from "./chowka-bara-game"
import PuliMekaGame from "./puli-meka-game"

type Mode = "menu" | "chowka-bara" | "puli-meka"

const GRADIENT = "from-amber-200 via-orange-300 to-rose-400"

export default function IndianBoardGamesPage() {
  const [mode, setMode] = useState<Mode>("menu")

  if (mode === "chowka-bara") {
    return <ChowkaBaraGame onBackToModes={() => setMode("menu")} />
  }

  if (mode === "puli-meka") {
    return <PuliMekaGame onBackToModes={() => setMode("menu")} />
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/#games-section">
            <Button className="bg-white/60 hover:bg-white text-orange-900 border-2 border-white font-bold" variant="outline">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-3 tracking-tight">🎲 Indian Board Games</h1>
          <p className="text-xl text-white/90 font-medium">Choose a game to play</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card
            onClick={() => setMode("chowka-bara")}
            className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Chowka Bara</h3>
              <p className="text-base text-gray-600">Race your tokens around the board to home!</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setMode("puli-meka")}
            className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🐯</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Puli Meka</h3>
              <p className="text-base text-gray-600">Help the goats outsmart the tiger!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
