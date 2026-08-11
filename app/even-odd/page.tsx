"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import EvenOddGame from "./even-odd-game"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"

type GameData = {
  mode?: string
  gameType?: string
  rangeMax?: number
  completionTime?: number
  [key: string]: unknown
}

export default function EvenOddPage() {
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
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

        const application = await getApplicationByName("Even and Odd")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing Even & Odd:", error)
    }
  }

  const handleGameComplete = async (_score: number, _maxScore: number, data: GameData) => {
    if (!user || !app) return
    await saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score: 1,
      maxScore: 1,
      completionTimeSec: data.completionTime ? Math.floor((Date.now() - data.completionTime) / 1000) : undefined,
      difficultyLevel: `${data.gameType || "unknown"}-${data.rangeMax || ""}`,
      gameData: { ...data, mode: data.mode || "even-odd" },
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

      <EvenOddGame user={user} onGameComplete={handleGameComplete} onBackToHome={() => router.push("/#math")} />
    </div>
  )
}
