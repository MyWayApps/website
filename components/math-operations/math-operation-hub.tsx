"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { mathVideoLessons, type VideoLesson } from "@/lib/math-videos-data"
import { YouTubeEmbed } from "@/components/youtube-embed"
import MathQuizEngine from "./math-quiz-engine"
import MathMatchingMode from "./math-matching-mode"
import {
  DIGIT_LEVEL_LABELS,
  mechanicsForLevel,
  type DigitLevel,
  type Format,
  type Mechanic,
  type Operation,
} from "@/lib/math-operations-data"

type Step = "digit-level" | "format" | "mechanic" | "playing"

const MECHANIC_META: Record<Mechanic, { label: string; emoji: string; description: string }> = {
  "number-line": { label: "Number Line Hop", emoji: "🦘", description: "Watch the hop, then type the landing number" },
  mcq: { label: "Multiple Choice", emoji: "✅", description: "Pick the correct answer" },
  typed: { label: "Typed Answer", emoji: "⌨️", description: "Type in the answer" },
  column: { label: "Column Method", emoji: "📐", description: "Solve it the way it's taught in school" },
  "missing-operand": { label: "Missing Number", emoji: "❓", description: "Find the missing number in the equation" },
  matching: { label: "Matching Game", emoji: "🧩", description: "Pair each equation with its answer" },
}

export interface MathOperationMeta {
  operation: Operation
  title: string
  emoji: string
  gradient: string
  applicationName: string
  videoIds?: string[]
}

export default function MathOperationHub({ operation, title, emoji, gradient, applicationName, videoIds }: MathOperationMeta) {
  const [digitLevel, setDigitLevel] = useState<DigitLevel | null>(null)
  const [format, setFormat] = useState<Format | null>(null)
  const [mechanic, setMechanic] = useState<Mechanic | null>(null)
  const [step, setStep] = useState<Step>("digit-level")

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
    // Return to the Math section on the homepage instead of the very top.
    window.location.href = "/#math"
  }

  const handlePickDigitLevel = (level: DigitLevel) => {
    setDigitLevel(level)
    setStep("format")
  }

  const handlePickFormat = (f: Format) => {
    setFormat(f)
    setStep("mechanic")
  }

  const handlePickMechanic = (m: Mechanic) => {
    setMechanic(m)
    setRoundStartTime(Date.now())
    setStep("playing")
  }

  const handleBackOneStep = () => {
    if (step === "mechanic") setStep("format")
    else if (step === "format") setStep("digit-level")
  }

  const handleComplete = (score: number, maxScore: number) => {
    if (!user || !app) return
    saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score,
      maxScore,
      completionTimeSec: Math.floor((Date.now() - roundStartTime) / 1000),
      difficultyLevel: `${digitLevel}:${format}:${mechanic}`,
      gameData: { operation, digitLevel, format, mechanic },
      isConnected,
      subject: "Math",
    }).catch((error) => console.error(`Error saving ${applicationName} score:`, error))
  }

  const handleBackToModes = () => setStep("mechanic")

  if (step === "playing" && digitLevel && format && mechanic) {
    if (mechanic === "matching") {
      return (
        <MathMatchingMode
          operation={operation}
          digitLevel={digitLevel}
          gradientClass={gradient}
          onBackToModes={handleBackToModes}
          onComplete={handleComplete}
        />
      )
    }
    return (
      <MathQuizEngine
        operation={operation}
        digitLevel={digitLevel}
        format={format}
        mechanic={mechanic}
        gradientClass={gradient}
        onBackToModes={handleBackToModes}
        onComplete={handleComplete}
      />
    )
  }

  const relatedVideos: VideoLesson[] = videoIds ? mathVideoLessons.filter((v) => videoIds.includes(v.id)) : []

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={step === "digit-level" ? handleBackToHome : handleBackOneStep}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {step === "digit-level" ? "Back to Home" : "Back"}
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 font-sans tracking-tight">
            {emoji} {title}
          </h1>
          {step !== "format" && (
            <p className="text-xl text-white/90 font-medium">
              {step === "digit-level" && "Choose a difficulty level to begin"}
              {step === "mechanic" && "Choose how you'd like to practice"}
            </p>
          )}
        </div>

        {step === "digit-level" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            {(["1", "2", "3"] as DigitLevel[]).map((level) => (
              <Card
                key={level}
                onClick={() => handlePickDigitLevel(level)}
                className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <CardContent className="p-10 text-center">
                  <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-4xl font-black">
                    {level === "3" ? "3+" : level}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800">{DIGIT_LEVEL_LABELS[level]}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === "format" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <Card
              onClick={() => handlePickFormat("numerical")}
              className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardContent className="p-10 text-center">
                <div className="text-6xl mb-4">🧮</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Numerical</h3>
                <p className="text-lg text-gray-600">Straightforward equations</p>
              </CardContent>
            </Card>
            <Card
              onClick={() => handlePickFormat("word-problem")}
              className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CardContent className="p-10 text-center">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Word Problem</h3>
                <p className="text-lg text-gray-600">Solve a short story problem</p>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "mechanic" && digitLevel && format && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {(format === "numerical" ? mechanicsForLevel(digitLevel, operation) : (["typed", "mcq"] as Mechanic[])).map((m) => {
              const meta = MECHANIC_META[m]
              return (
                <Card
                  key={m}
                  onClick={() => handlePickMechanic(m)}
                  className="bg-white/90 border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl mb-4">{meta.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{meta.label}</h3>
                    <p className="text-base text-gray-600">{meta.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {step === "digit-level" && relatedVideos.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">🎬 Watch &amp; Learn</h2>
            <div className="space-y-8">
              {relatedVideos.map((lesson) => (
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
