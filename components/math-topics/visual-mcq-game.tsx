"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { QuizResults } from "@/components/quiz-results"
import { MathScratchpad } from "@/components/math-operations/math-scratchpad"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"

export interface MCQQuestion {
  /** The question display — a shape icon, a comparison pair, shaded fraction, etc. */
  prompt: ReactNode
  choices: string[]
  correctChoice: string
  /** Optional per-choice subtext (e.g. romanized pronunciation for native-script choices) — unused by non-language topics. */
  choiceSubtext?: (choice: string) => string
}

interface VisualMCQGameProps {
  title: string
  gradientClass: string
  roundLength?: number
  generateQuestion: () => MCQQuestion
  onBackToModes: () => void
  onComplete: (score: number, maxScore: number) => void
}

/**
 * Generic MCQ quiz engine shared across the Shapes/Fractions/Money/Measurement
 * topics — each topic just supplies a `generateQuestion()` function returning
 * a prompt (any visual) plus choices. Handles round loop, scoring, star
 * display, and audio feedback identically everywhere.
 */
export function VisualMCQGame({ title, gradientClass, roundLength = 5, generateQuestion, onBackToModes, onComplete }: VisualMCQGameProps) {
  const [phase, setPhase] = useState<"playing" | "results">("playing")
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<MCQQuestion | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)

  useEffect(() => {
    setQuestion(generateQuestion())
    setSelected(null)
    setShowResult(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  const handleChoice = (choice: string) => {
    if (!question || showResult) return
    setSelected(choice)
    const correct = choice === question.correctChoice
    setShowResult(correct ? "correct" : "wrong")
    if (correct) playCorrectSound()
    else playWrongSound()

    setTimeout(() => {
      const nextScore = correct ? score + 1 : score
      if (correct) setScore(nextScore)
      if (roundIndex < roundLength - 1) {
        setRoundIndex((i) => i + 1)
      } else {
        onComplete(nextScore, roundLength)
        setPhase("results")
      }
    }, 5000)
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
        title="Great Job!"
        gradientClass={gradientClass}
      />
    )
  }

  if (!question) return null

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

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow">{title}</h1>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-10 md:p-12">
            <div className="mb-8">{question.prompt}</div>

            <div className="grid grid-cols-2 gap-5">
              {question.choices.map((choice) => {
                const isSelected = selected === choice
                const isCorrectChoice = choice === question.correctChoice
                let cardClass = "bg-white hover:bg-indigo-50 text-gray-800 border-indigo-200 hover:border-indigo-500"
                if (showResult && isCorrectChoice) cardClass = "bg-green-200 border-green-500 text-green-900"
                else if (showResult && isSelected && !isCorrectChoice) cardClass = "bg-red-200 border-red-500 text-red-900"

                return (
                  <Button
                    key={choice}
                    onClick={() => handleChoice(choice)}
                    disabled={!!showResult}
                    className={`h-20 md:h-24 text-2xl md:text-3xl font-bold border-2 rounded-2xl shadow-md ${cardClass}`}
                    variant="outline"
                  >
                    {question.choiceSubtext ? (
                      <div className="flex flex-col items-center">
                        <span>{choice}</span>
                        <span className="text-xs md:text-sm font-normal opacity-70">{question.choiceSubtext(choice)}</span>
                      </div>
                    ) : (
                      choice
                    )}
                  </Button>
                )
              })}
            </div>

            {showResult && (
              <div
                className={`mt-6 text-center p-6 rounded-2xl ${showResult === "correct" ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"}`}
              >
                <div className={`text-3xl font-bold ${showResult === "correct" ? "text-green-600" : "text-red-600"}`}>
                  {showResult === "correct" ? "🎉 Correct!" : `🤔 The answer was ${question.correctChoice}`}
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
