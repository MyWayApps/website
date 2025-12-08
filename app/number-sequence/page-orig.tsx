"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NumberSequenceGame from "./number-sequence-game"

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
  order: string
  maxNumber: number
  completionTime: number
}

export default function NumberSequencePage() {
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
    if (user && app) {
      try {
        // Save score locally
        const scoreData = {
          user_id: user.id,
          application_id: app.id,
          score,
          max_score: maxScore,
          completion_time: gameData.completionTime
            ? Math.floor((Date.now() - gameData.completionTime) / 1000)
            : undefined,
          difficulty_level: `${gameData.order}-${gameData.maxNumber}`,
          game_data: gameData,
          created_at: new Date().toISOString(),
        }

        // Store in localStorage
        const existingScores = JSON.parse(localStorage.getItem("mywayapps_offline_scores") || "[]")
        existingScores.push(scoreData)
        localStorage.setItem("mywayapps_offline_scores", JSON.stringify(existingScores))

        console.log("Game completed and saved locally:", scoreData)
      } catch (error) {
        console.error("Error saving score:", error)
      }
    }
  }

  return <NumberSequenceGame user={user} onGameComplete={handleGameComplete} onBackToHome={() => router.push("/")} />
}
