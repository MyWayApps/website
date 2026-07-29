"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CookingRecipesApp from "./cooking-recipes-app"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"

type CookingGameData = {
  mode?: string
  recipeCompleted?: string
  completionTime?: number
  [key: string]: unknown
}

// Remove the props interface and make this a standard Next.js page component
export default function CookingRecipesPage() {
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

        const application = await getApplicationByName("Cooking Recipes")
        setUser(currentUser)
        setApp(application)
        console.log("✅ Initialized - User:", currentUser?.name, "App:", application?.name)
      } else {
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

  const handleRecipeComplete = (recipeName: string, stepsCompleted: number, gameData: CookingGameData) => {
    if (!user || !app) {
      console.error("❌ Missing user or app data")
      return
    }

    setTimeout(async () => {
      await saveGameScore({
        userId: user.id,
        applicationId: app.id,
        score: stepsCompleted,
        maxScore: stepsCompleted,
        completionTimeSec: gameData.completionTime
          ? Math.floor((Date.now() - gameData.completionTime) / 1000)
          : undefined,
        difficultyLevel: recipeName,
        gameData: {
          mode: gameData.mode || "cooking-recipes",
          recipeCompleted: gameData.recipeCompleted || recipeName,
          completionTime: gameData.completionTime || Date.now(),
        },
        isConnected,
      })
    }, 0)
  }

  return (
    <div>
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

      <CookingRecipesApp user={user} onRecipeComplete={handleRecipeComplete} onBackToHome={() => router.push("/")} />
    </div>
  )
}
