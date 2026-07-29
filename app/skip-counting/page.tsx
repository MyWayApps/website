"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SkipCountingGame from "./skip-counting-game"
import { saveGameScore } from "@/lib/scoring"

interface User {
  id: string
  name: string
  email?: string
}

interface Application {
  id: string
  name: string
}

interface GameData {
  mode: string
  pictureSet?: string
  completionTime: number
}

export default function SkipCountingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user and app data from localStorage
    try {
      const userData = localStorage.getItem("mywayapps_current_user")
      const appData = localStorage.getItem("mywayapps_current_app")

      if (userData) setUser(JSON.parse(userData))
      if (appData) setApp(JSON.parse(appData))
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }, [])

  const handleGameComplete = async (score: number, maxScore: number, gameData: GameData) => {
    if (!user || !app) return
    await saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score,
      maxScore,
      completionTimeSec: gameData.completionTime
        ? Math.floor((Date.now() - gameData.completionTime) / 1000)
        : undefined,
      difficultyLevel: gameData.mode,
      gameData: { ...gameData },
      isConnected: false,
    })
  }

  return <SkipCountingGame user={user} onGameComplete={handleGameComplete} onBackToHome={() => router.push("/")} />
}
