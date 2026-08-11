"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { YouTubeEmbed } from "@/components/youtube-embed"
import type { VideoLesson } from "@/lib/math-videos-data"

export interface TopicMode {
  id: string
  label: string
  emoji: string
  description: string
  render: (props: { onBackToModes: () => void; onComplete: (score: number, maxScore: number) => void }) => ReactNode
}

export interface TopicHubProps {
  title: string
  emoji: string
  gradient: string
  applicationName: string
  modes: TopicMode[]
  videos?: VideoLesson[]
  /** Overrides the top-level "Back" button — defaults to navigating home. Used by
   * multi-level hubs (e.g. Memorize Tables) where this picker is nested one level in. */
  onBack?: () => void
  backLabel?: string
  /** Rolls the score into a per-subject progress total — defaults to "Math" since every prior caller is a Math topic. */
  subject?: string
}

/**
 * Shared picker + scoring scaffold for the Shapes/Fractions/Money/Measurement
 * topics — each just supplies a mode list; this handles user/app init,
 * the mode-picker grid, dispatch, and saveGameScore(subject: "Math").
 */
export default function TopicHub({ title, emoji, gradient, applicationName, modes, videos, onBack, backLabel, subject = "Math" }: TopicHubProps) {
  const [activeModeId, setActiveModeId] = useState<string | null>(null)

  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)

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
          currentUser = await findOrCreateUser({ name: "Demo User", email: "demo@mywayapps.com", age: 8, grade: "3rd Grade" })
        }
        const application = await getApplicationByName(applicationName)
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error(`Error initializing ${applicationName} scoring data:`, error)
    }
  }

  const handleBackToHome = () => {
    // Return to this topic's own section on the homepage (it already has a
    // matching `id`, see app/page.tsx's topicSlug()) instead of the very top.
    window.location.href = `/#${subject.toLowerCase().replace(/\s+/g, "-")}`
  }

  const handlePickMode = (modeId: string) => {
    setActiveModeId(modeId)
    setRoundStartTime(Date.now())
  }

  const handleBackToModes = () => setActiveModeId(null)

  const handleComplete = (score: number, maxScore: number) => {
    if (!user || !app) return
    saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score,
      maxScore,
      completionTimeSec: Math.floor((Date.now() - roundStartTime) / 1000),
      difficultyLevel: activeModeId ?? undefined,
      gameData: { mode: activeModeId },
      isConnected,
      subject,
    }).catch((error) => console.error(`Error saving ${applicationName} score:`, error))
  }

  const activeMode = modes.find((m) => m.id === activeModeId)
  if (activeMode) {
    return <>{activeMode.render({ onBackToModes: handleBackToModes, onComplete: handleComplete })}</>
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack ?? handleBackToHome}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {backLabel ?? "Back to Home"}
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 tracking-tight">
            {emoji} {title}
          </h1>
          <p className="text-xl text-white/90 font-medium">Choose a game to play</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              onClick={() => handlePickMode(mode.id)}
              className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{mode.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{mode.label}</h3>
                <p className="text-base text-gray-600">{mode.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos && videos.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">🎬 Watch &amp; Learn</h2>
            <div className="space-y-8">
              {videos.map((lesson) => (
                <Card key={lesson.id} className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{lesson.title}</h3>
                    <p className="text-lg text-gray-600 mb-6 text-center">{lesson.description}</p>
                    <YouTubeEmbed videoId={lesson.youtubeId} title={lesson.title} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
