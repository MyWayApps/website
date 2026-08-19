"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import NinePicturesGame from "./nine-pictures-game"
import BigPictureGame from "./big-picture-game"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"

type Mode = "menu" | "nine-pictures" | "big-picture"

const GRADIENT = "from-orange-200 via-red-300 to-pink-400"

export default function SpotTheDifferencePage() {
  const [mode, setMode] = useState<Mode>("menu")
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    initializeScoringData()
  }, [])

  const initializeScoringData = async () => {
    try {
      const connected = await testConnection()
      setIsConnected(connected)

      if (connected) {
        const userData = localStorage.getItem("mywayapps_current_user")
        let currentUser: User | null = null

        if (userData) {
          const parsedUser = JSON.parse(userData)
          currentUser = await findOrCreateUser({
            name: parsedUser.name,
            email: parsedUser.email,
            age: parsedUser.age,
            grade: parsedUser.grade,
          })
        } else {
          currentUser = await findOrCreateUser({
            name: "Demo User",
            email: "demo@mywayapps.com",
            age: 8,
            grade: "3rd Grade",
          })
        }

        const application = await getApplicationByName("Spot the Difference")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing scoring data:", error)
    }
  }

  if (mode === "nine-pictures") {
    return (
      <NinePicturesGame
        onBackToModes={() => setMode("menu")}
        user={user}
        applicationId={app?.id}
        isConnected={isConnected}
      />
    )
  }

  if (mode === "big-picture") {
    return (
      <BigPictureGame
        onBackToModes={() => setMode("menu")}
        user={user}
        applicationId={app?.id}
        isConnected={isConnected}
      />
    )
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
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-3 tracking-tight">🔍 Spot the Difference</h1>
          <p className="text-xl text-white/90 font-medium">Choose how you'd like to play</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card
            onClick={() => setMode("nine-pictures")}
            className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🔢</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Nine Pictures</h3>
              <p className="text-base text-gray-600">Two boards of nine pictures — spot the one that's different</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setMode("big-picture")}
            className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Big Picture</h3>
              <p className="text-base text-gray-600">Two big scenes — find the one small thing that's different</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
