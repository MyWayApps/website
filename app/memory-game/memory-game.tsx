"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import WhatDidYouSee from "./what-did-you-see"
import WhatChanged from "./what-changed"
import WhereWasIt from "./where-was-it"
import RememberTheOrder from "./remember-the-order"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"

type Mode = "see" | "changed" | "where" | "order" | null

const MODES: {
  id: Exclude<Mode, null>
  name: string
  emoji: string
  description: string
  colorScheme: string
}[] = [
  {
    id: "see",
    name: "What Did You See?",
    emoji: "👀",
    description: "Look closely, then remember what you saw",
    colorScheme: "from-sky-200 to-blue-500",
  },
  {
    id: "changed",
    name: "What Changed?",
    emoji: "🔄",
    description: "Spot what's different after the scene changes",
    colorScheme: "from-emerald-200 to-teal-500",
  },
  {
    id: "where",
    name: "Where Was It?",
    emoji: "📍",
    description: "Remember where each object was hiding",
    colorScheme: "from-violet-200 to-purple-500",
  },
  {
    id: "order",
    name: "Remember the Order",
    emoji: "🔢",
    description: "Watch the sequence, then repeat it back",
    colorScheme: "from-amber-200 to-orange-500",
  },
]

export default function MemoryGameHub() {
  const [mode, setMode] = useState<Mode>(null)
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

        const application = await getApplicationByName("Memory Game")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing Memory Game scoring data:", error)
    }
  }

  if (mode === "see")
    return <WhatDidYouSee onExit={() => setMode(null)} user={user} applicationId={app?.id} isConnected={isConnected} />
  if (mode === "changed")
    return <WhatChanged onExit={() => setMode(null)} user={user} applicationId={app?.id} isConnected={isConnected} />
  if (mode === "where")
    return <WhereWasIt onExit={() => setMode(null)} user={user} applicationId={app?.id} isConnected={isConnected} />
  if (mode === "order")
    return <RememberTheOrder onExit={() => setMode(null)} user={user} applicationId={app?.id} isConnected={isConnected} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => window.history.back()}
            className="bg-white/20 hover:bg-white/30 text-indigo-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow mb-2">🧠 Memory Game</h1>
          <p className="text-lg text-indigo-100">Pick a game to test your memory!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MODES.map((m) => (
            <Card
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`cursor-pointer border-0 bg-gradient-to-br ${m.colorScheme} shadow-xl hover:scale-105 transition-transform duration-150`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-3">{m.emoji}</div>
                <h2 className="text-2xl font-bold text-white drop-shadow mb-1">{m.name}</h2>
                <p className="text-white/90">{m.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
