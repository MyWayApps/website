"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { MathScratchpad } from "@/components/math-operations/math-scratchpad"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"

export interface FractionTarget {
  numerator: number
  denominator: number
}

interface ShadeFractionGameProps {
  gradientClass: string
  roundLength?: number
  generateFraction: () => FractionTarget
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

/** Tap segments of a bar until the shaded count matches the target fraction. */
export function ShadeFractionGame({ gradientClass, roundLength = 5, generateFraction, onBackToModes, onComplete }: ShadeFractionGameProps) {
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState<FractionTarget | null>(null)
  const [shaded, setShaded] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)

  useEffect(() => {
    const t = generateFraction()
    setTarget(t)
    setShaded(Array(t.denominator).fill(false))
    setShowResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  const toggleSegment = (idx: number) => {
    if (showResult) return
    setShaded((prev) => prev.map((v, i) => (i === idx ? !v : v)))
  }

  const handleCheck = () => {
    if (!target || showResult) return
    const shadedCount = shaded.filter(Boolean).length
    const correct = shadedCount === target.numerator
    setShowResult(correct ? "correct" : "wrong")
    if (correct) playCorrectSound()
    else playWrongSound()

    setTimeout(
      () => {
        const nextScore = correct ? score + 1 : score
        if (correct) setScore(nextScore)
        if (roundIndex < roundLength - 1) {
          setRoundIndex((i) => i + 1)
        } else {
          onComplete(nextScore, roundLength)
          setPhase("results")
        }
      },
      correct ? 1500 : 1300,
    )
  }

  const handleRestart = () => {
    setScore(0)
    setRoundIndex(0)
    setPhase("playing")
  }

  if (phase === "results") {
    return (
      <QuizResults
        score={score}
        maxScore={roundLength}
        onPlayAgain={handleRestart}
        onBackToTopics={onBackToModes}
        title="Fraction Star!"
        gradientClass={gradientClass}
      />
    )
  }

  if (!target) return null

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            <span className="text-white font-bold">
              Question {roundIndex + 1}/{roundLength}
            </span>
            {Array.from({ length: roundLength }, (_, i) => (
              <Star key={i} className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-10 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Shade{" "}
              <span className="text-indigo-600">
                {target.numerator}/{target.denominator}
              </span>{" "}
              of the bar
            </h2>

            <div className="flex justify-center gap-1 mb-10">
              {shaded.map((isShaded, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleSegment(idx)}
                  disabled={!!showResult}
                  className={`h-24 flex-1 max-w-[80px] border-2 border-gray-400 first:rounded-l-xl last:rounded-r-xl transition-colors ${
                    isShaded ? "bg-indigo-500" : "bg-white hover:bg-indigo-50"
                  }`}
                  aria-label={`Segment ${idx + 1}`}
                />
              ))}
            </div>

            {!showResult && (
              <Button
                onClick={handleCheck}
                className="h-16 px-10 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-2xl shadow-lg"
              >
                Check
              </Button>
            )}

            {showResult && (
              <div
                className={`mt-6 text-center p-6 rounded-2xl ${showResult === "correct" ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${showResult === "correct" ? "text-green-600" : "text-red-600"}`}>
                  {showResult === "correct" ? "🎉 Correct!" : `🤔 That's ${target.numerator}/${target.denominator}`}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <MathScratchpad />
      </div>
    </div>
  )
}
