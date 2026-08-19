"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ClockReadingGame from "./clock-reading-game"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"

interface GameData {
  mode: string
  gameType: string
  completionTime: number
}

export default function ClockReadingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      // Test connection
      const connected = await testConnection()
      setIsConnected(connected)

      if (connected) {
        // Get user data from localStorage or create demo user
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
          // Create demo user if no user found
          currentUser = await findOrCreateUser({
            name: "Demo User",
            email: "demo@mywayapps.com",
            age: 8,
            grade: "3rd Grade",
          })
        }

        // Get application data
        const application = await getApplicationByName("Clock Reading")

        setUser(currentUser)
        setApp(application)
        console.log("✅ Initialized - User:", currentUser?.name, "App:", application?.name)
      } else {
        // Fallback to localStorage for offline mode
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")

        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
        console.log("⚠️ Using offline mode")
      }
    } catch (error) {
      console.error("❌ Error initializing data:", error)
    }
  }

  const handleGameComplete = async (score: number, maxScore: number, gameData: GameData) => {
    if (!user || !app) {
      console.error("❌ Missing user or app data")
      return
    }

    await saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score,
      maxScore,
      completionTimeSec: gameData.completionTime
        ? Math.floor((Date.now() - gameData.completionTime) / 1000)
        : undefined,
      difficultyLevel: gameData.gameType,
      gameData: { ...gameData },
      isConnected,
    })
  }

  return (
    <div>
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
          }`}
        >
          {isConnected ? "🟢 Connected to Database" : "🟡 Offline Mode"}
        </div>
      </div>

      <ClockReadingGame
        user={user}
        applicationId={app?.id}
        onGameComplete={handleGameComplete}
        onBackToHome={() => router.push("/#math")}
      />
    </div>
  )
}
