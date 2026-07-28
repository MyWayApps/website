"use client"

import { useEffect, useState } from "react"
import { Star, RotateCcw, ArrowLeft, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuizResultsProps {
  score: number
  maxScore: number
  onPlayAgain: () => void
  onBackToTopics: () => void
  title?: string
  gradientClass?: string
}

function starsEarned(percent: number): number {
  if (percent === 1) return 3
  if (percent >= 0.6) return 2
  if (percent > 0) return 1
  return 0
}

export function QuizResults({
  score,
  maxScore,
  onPlayAgain,
  onBackToTopics,
  title = "Great Job!",
  gradientClass = "from-blue-300 via-indigo-400 to-purple-500",
}: QuizResultsProps) {
  const percent = maxScore > 0 ? score / maxScore : 0
  const stars = starsEarned(percent)
  const isPerfect = percent === 1

  const AUTO_BACK_SECONDS = 5
  const [secondsLeft, setSecondsLeft] = useState(AUTO_BACK_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onBackToTopics()
      return
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft, onBackToTopics])

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 flex items-center justify-center relative overflow-hidden`}>
      {isPerfect && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-50px",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"][
                    Math.floor(Math.random() * 8)
                  ],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-indigo-800 mb-2">{title}</h2>
          <p className="text-2xl font-bold text-gray-700 mb-4">
            Score: {score}/{maxScore}
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className={`h-12 w-12 ${i <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onPlayAgain}
              className="h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
            <Button
              onClick={onBackToTopics}
              variant="outline"
              className="h-14 text-lg font-bold bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-indigo-300"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Topics
            </Button>
          </div>

          <p className="mt-4 text-sm text-gray-500">Returning to topics in {secondsLeft}s…</p>
        </CardContent>
      </Card>
    </div>
  )
}
