"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { MasteryBadge } from "@/components/mastery-badge"
import { getAppMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"

interface Application {
  id: string
  name: string
  category: string
  subcategory?: string
  description: string
  icon_emoji: string
  color_scheme: string
  route: string
  created_at: string
}

interface AppCardProps {
  app: Application
  userProgress?: {
    best_score: number
    total_attempts: number
    last_played_at: string
  }
  onPlay: (app: Application) => void
  userId?: string
}

export function AppCard({ app, onPlay, userId }: AppCardProps) {
  const [tier, setTier] = useState<MasteryTier | null>(null)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    getAppMasteryTier(userId, app.id).then((t) => {
      if (!cancelled) setTier(t)
    })

    return () => {
      cancelled = true
    }
  }, [userId, app.id])

  return (
    <Card
      className={`group hover:scale-105 transition-all duration-300 bg-gradient-to-br ${app.color_scheme} border-4 border-white shadow-lg hover:shadow-xl cursor-pointer`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* App Icon */}
          <div className="text-6xl mb-2 group-hover:animate-bounce">{app.icon_emoji}</div>

          {/* App Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">{app.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{app.description}</p>
          </div>

          {/* Mastery badge */}
          {tier && <MasteryBadge tier={tier} showLabel />}

          {/* Play Button */}
          <Button
            onClick={() => onPlay(app)}
            className="w-full bg-white/20 hover:bg-white/30 text-gray-800 font-bold border-2 border-white/50 hover:border-white transition-all duration-300"
            variant="outline"
          >
            <Play className="mr-2 h-4 w-4" />
            Play Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
