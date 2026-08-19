"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { pickUnseen } from "@/lib/question-history"
import { SCENES, applyDifference, differenceTarget, type Scene, type SceneElement } from "@/lib/spot-the-difference-data"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"
import type { User } from "@/lib/database-supabase"

interface BigPictureGameProps {
  onBackToModes: () => void
  user?: User | null
  applicationId?: string
  isConnected?: boolean
}

const ROUND_COUNT = 3
const TOLERANCE_FRACTION = 0.08 // ±8% of the smaller panel dimension

function pickRounds(): Scene[] {
  const chosen: Scene[] = []
  let remaining = [...SCENES]
  const count = Math.min(ROUND_COUNT, SCENES.length)
  for (let i = 0; i < count; i++) {
    const scene = pickUnseen("spot-diff-big", remaining, (s) => s.id)
    chosen.push(scene)
    remaining = remaining.filter((s) => s.id !== scene.id)
  }
  return chosen
}

interface MissMarker {
  panel: "A" | "B"
  xPct: number
  yPct: number
}

export default function BigPictureGame({ onBackToModes, user, applicationId, isConnected = false }: BigPictureGameProps) {
  const [rounds, setRounds] = useState<Scene[]>(() => pickRounds())
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [found, setFound] = useState(false)
  const [missMarker, setMissMarker] = useState<MissMarker | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const scene = rounds[roundIndex]
  const elementsB = applyDifference(scene)
  const target = differenceTarget(scene)

  // Persist the session score and refresh the mastery tier once the round set ends.
  useEffect(() => {
    if (!sessionComplete || !user || !applicationId) return
    saveGameScore({
      userId: user.id,
      applicationId,
      score,
      maxScore: ROUND_COUNT,
      gameData: { mode: "big-picture", roundCount: ROUND_COUNT },
      isConnected,
    })
      .then(() =>
        getActivityMasteryTier(user.id, applicationId, "spot-the-difference:big-picture").then(setMasteryTier),
      )
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionComplete])

  const handlePlayAgain = () => {
    setRounds(pickRounds())
    setRoundIndex(0)
    setScore(0)
    setFound(false)
    setMissMarker(null)
    setShowConfetti(false)
    setSessionComplete(false)
    setMasteryTier(null)
  }

  const handlePanelClick = (panel: "A" | "B", e: React.MouseEvent<HTMLDivElement>) => {
    if (found) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickXPx = e.clientX - rect.left
    const clickYPx = e.clientY - rect.top
    const targetXPx = (target.xPct / 100) * rect.width
    const targetYPx = (target.yPct / 100) * rect.height
    const distancePx = Math.hypot(clickXPx - targetXPx, clickYPx - targetYPx)
    const tolerancePx = TOLERANCE_FRACTION * Math.min(rect.width, rect.height)

    if (distancePx <= tolerancePx) {
      setFound(true)
      setScore((s) => s + 1)
      setShowConfetti(true)
      playCorrectSound()

      setTimeout(() => {
        setShowConfetti(false)
        setFound(false)
        if (roundIndex < ROUND_COUNT - 1) {
          setRoundIndex((i) => i + 1)
        } else {
          setSessionComplete(true)
        }
      }, 1200)
    } else {
      playWrongSound()
      setMissMarker({ panel, xPct: (clickXPx / rect.width) * 100, yPct: (clickYPx / rect.height) * 100 })
      setTimeout(() => setMissMarker(null), 400)
    }
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-fuchsia-400 to-pink-500 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-fuchsia-600 mb-4">Great Job!</h2>
            <p className="text-2xl text-gray-700 mb-6">You found {score}/{ROUND_COUNT}!</p>
            {masteryTier && (
              <div className="flex justify-center mb-6">
                <MasteryBadge tier={masteryTier} showLabel />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handlePlayAgain}
                className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-2xl px-8 py-4"
              >
                Play Again
              </Button>
              <Button
                onClick={onBackToModes}
                className="bg-white/50 hover:bg-white/70 text-gray-800 border-2 border-gray-200 font-bold rounded-2xl px-8 py-4"
                variant="outline"
              >
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderElement = (el: SceneElement) => (
    <span
      key={el.id}
      className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: `${el.xPct}%`, top: `${el.yPct}%`, fontSize: `${el.sizeRem ?? 3}rem`, lineHeight: 1 }}
    >
      {el.emoji}
    </span>
  )

  const renderPanel = (panel: "A" | "B", elements: SceneElement[]) => (
    <div
      onClick={(e) => handlePanelClick(panel, e)}
      className={`relative aspect-[4/3] w-full rounded-3xl border-4 border-white shadow-lg overflow-hidden cursor-pointer ${scene.backgroundClass}`}
    >
      {elements.map(renderElement)}

      {found && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-green-400 animate-ping pointer-events-none"
          style={{ left: `${target.xPct}%`, top: `${target.yPct}%` }}
        />
      )}

      {missMarker?.panel === panel && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl text-red-500 font-bold pointer-events-none"
          style={{ left: `${missMarker.xPct}%`, top: `${missMarker.yPct}%` }}
        >
          ✕
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-fuchsia-400 to-pink-500 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-fuchsia-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            {Array.from({ length: ROUND_COUNT }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-fuchsia-700 mb-2">🖼️ Big Picture</h2>
              <p className="text-lg text-fuchsia-600">
                Find the difference between the two pictures of {scene.name} — tap it!
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {renderPanel("A", scene.elements)}
              {renderPanel("B", elementsB)}
            </div>

            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none z-50">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full ${["bg-yellow-400", "bg-pink-400", "bg-blue-400", "bg-green-400"][i % 4]}`}></div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-2 mt-8">
              {rounds.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < roundIndex ? "bg-green-500" : index === roundIndex ? "bg-fuchsia-500 scale-125" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
