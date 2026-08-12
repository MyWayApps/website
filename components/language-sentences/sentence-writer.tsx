"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2 } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { pickSentenceRound } from "@/lib/language-sentences-data"
import type { LanguageCode } from "@/lib/language-games-data"

interface SentenceWriterProps {
  lang: LanguageCode
  /** Full built-in + custom sentence pool — a 5-sentence round is picked once on mount, not per render. */
  sentenceSource: string[]
  onComplete: (score: number, maxScore: number) => void
  onBackToModes: () => void
  /** "read": the sentence is shown on screen to copy exactly.
   *  "listen": the sentence is hidden — the player must listen and type it from memory. */
  mode: "read" | "listen"
  title: string
  emoji: string
  instructions: string
  gradientClass: string
  accentTextClass: string
  accentBgFromTo: string
  accentDotBgClass: string
}

function diffWords(target: string, attempt: string): { word: string; correct: boolean }[] {
  const targetWords = target.split(" ")
  const attemptWords = attempt.split(" ")
  const max = Math.max(targetWords.length, attemptWords.length)
  const result: { word: string; correct: boolean }[] = []
  for (let i = 0; i < max; i++) {
    const word = attemptWords[i] ?? ""
    result.push({ word: word || "·", correct: word.length > 0 && word === targetWords[i] })
  }
  return result
}

export default function SentenceWriter({
  lang,
  sentenceSource,
  onComplete,
  onBackToModes,
  mode,
  title,
  emoji,
  instructions,
  gradientClass,
  accentTextClass,
  accentBgFromTo,
  accentDotBgClass,
}: SentenceWriterProps) {
  const { speakNative } = useLanguageSpeak(lang)
  const [sentenceList] = useState<string[]>(() => pickSentenceRound(lang, sentenceSource))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [typed, setTyped] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentSentence = sentenceList[currentIndex] || ""

  useEffect(() => {
    if (currentSentence) {
      setTyped("")
      setShowFeedback(false)
      setTimeout(() => inputRef.current?.focus(), 300)
      if (mode === "listen") {
        setTimeout(() => speakNative(currentSentence), 500)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, sentenceList])

  const checkAnswer = () => {
    const attempt = typed.trim()
    const correct = attempt === currentSentence.trim()
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setScore((s) => s + 1)
      setShowConfetti(true)
      playCorrectSound()

      setTimeout(() => {
        setShowFeedback(false)
        setShowConfetti(false)

        if (currentIndex < sentenceList.length - 1) {
          setCurrentIndex((i) => i + 1)
        } else {
          setGameComplete(true)
          onComplete(score + 1, sentenceList.length)
        }
      }, 3500)
    } else {
      playWrongSound()
    }
  }

  const tryAgain = () => {
    setShowFeedback(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  if (gameComplete) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 flex items-center justify-center`}>
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className={`text-4xl font-bold ${accentTextClass} mb-4`}>Fantastic!</h2>
            <p className="text-2xl text-gray-700 mb-4">You wrote every sentence!</p>
            <p className="text-xl text-gray-600 mb-6">Final Score: {score}/{sentenceList.length}</p>
            <div className="text-lg text-gray-500">Returning to games...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const diff = showFeedback && !isCorrect ? diffWords(currentSentence.trim(), typed.trim()) : []

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className={`bg-white/20 hover:bg-white/30 ${accentTextClass} border-2 border-white font-bold text-lg px-6 py-3`}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
            {Array.from({ length: sentenceList.length }, (_, i) => (
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
              <h2 className={`text-4xl font-bold ${accentTextClass} mb-2`}>
                {emoji} {title}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <p className={`text-lg ${accentTextClass}`}>{instructions}</p>
                {mode === "listen" && (
                  <button
                    onClick={() => speakNative(currentSentence)}
                    aria-label="Listen to the sentence"
                    className={`${accentTextClass} hover:scale-110 transition-transform`}
                  >
                    <Volume2 className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            {mode === "read" && (
              <div className="text-center mb-8">
                <p className="inline-block text-2xl font-bold text-gray-800 bg-gray-100 px-6 py-4 rounded-2xl border-4 border-gray-200">
                  {currentSentence}
                </p>
              </div>
            )}

            <div className="max-w-xl mx-auto mb-6">
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !showFeedback && checkAnswer()}
                placeholder={mode === "read" ? "Type the sentence exactly as shown..." : "Type the sentence you heard..."}
                disabled={showFeedback && isCorrect}
                className="w-full text-xl text-center border-4 border-gray-300 focus:border-gray-500 focus:outline-none rounded-xl font-medium py-4 px-4 disabled:opacity-60"
              />
            </div>

            {!showFeedback && (
              <div className="text-center mb-6">
                <Button
                  onClick={checkAnswer}
                  disabled={!typed.trim()}
                  className={`bg-gradient-to-r ${accentBgFromTo} text-white font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50`}
                >
                  ✓ Check My Answer
                </Button>
              </div>
            )}

            {showFeedback && (
              <div
                className={`text-center p-6 rounded-2xl ${
                  isCorrect ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"
                }`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-3`}>
                  {isCorrect ? "🎉 Perfect!" : "🤔 Not Quite!"}
                </div>

                {!isCorrect && (
                  <>
                    <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                      {diff.map((d, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-lg font-mono font-bold ${
                            d.correct ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                          }`}
                        >
                          {d.word}
                        </span>
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 mb-4">Check spacing and punctuation — then try again!</p>
                    <Button
                      onClick={tryAgain}
                      className={`bg-gradient-to-r ${accentBgFromTo} text-white font-bold px-8 py-3 rounded-2xl`}
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            )}

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

            <div className="flex justify-center gap-2 mt-6">
              {sentenceList.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentIndex ? "bg-green-500" : index === currentIndex ? `${accentDotBgClass} scale-125` : "bg-gray-300"
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
