"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import EnglishSentences from "./english-sentences"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"

interface GameData {
  mode: string
  gameType: string
  sentenceList: string[]
  completionTime: number
}

export default function EnglishSentencesPage() {
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

        const application = await getApplicationByName("English Sentences")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing English Sentences:", error)
    }
  }

  const handleGameComplete = async (score: number, maxScore: number, gameData: GameData) => {
    if (!user || !app) return
    await saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score,
      maxScore,
      completionTimeSec: gameData.completionTime ? Math.floor((Date.now() - gameData.completionTime) / 1000) : undefined,
      difficultyLevel: gameData.gameType,
      gameData: { ...gameData },
      isConnected,
    })
  }

  return (
    <EnglishSentences
      userId={user?.id}
      applicationId={app?.id}
      onGameComplete={handleGameComplete}
      onBackToHome={() => router.push("/#english")}
    />
  )
}
