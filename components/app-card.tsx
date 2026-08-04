"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Star, Clock } from "lucide-react"

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
}

export function AppCard({ app, userProgress, onPlay }: AppCardProps) {
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

          {/* Progress Info */}
          {userProgress && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{userProgress.best_score}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{userProgress.total_attempts}</span>
              </div>
            </div>
          )}

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
