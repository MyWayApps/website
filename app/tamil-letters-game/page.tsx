"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { getLettersByType, getLetterTypeLabel, LetterType, TamilLetter } from "@/lib/tamil-letters-data"
import { romanize } from "@/lib/transliteration"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { pickUnseenRandom } from "@/lib/question-history"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

const ROUND_LENGTH = 10

const successMessages = [
  "Good job!", "Excellent!", "Amazing work!", "Fantastic!", "Outstanding!",
  "Brilliant!", "Perfect!", "Wonderful!", "Great job!", "Superb!",
]

function randomChoiceIndices(correctIndex: number, total: number): number[] {
  const indices = [correctIndex]
  while (indices.length < Math.min(3, total)) {
    const idx = Math.floor(Math.random() * total)
    if (!indices.includes(idx)) indices.push(idx)
  }
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

export default function TamilLettersGame() {
  const searchParams = useSearchParams()
  const letterType = (searchParams.get("type") as LetterType) || "vowels"
  const { speakNative: speak, isSpeaking } = useLanguageSpeak("tamil")

  const [letters, setLetters] = useState<TamilLetter[]>([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("Good job!")
  const [isReady, setIsReady] = useState(false)

  // Scoring/persistence
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const typeLabel = getLetterTypeLabel(letterType)

  useEffect(() => {
    setLetters(getLettersByType(letterType))
    setIsReady(true)
  }, [letterType])

  useEffect(() => {
    setRoundStartTime(Date.now())
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

        const application = await getApplicationByName("Tamil Letters")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing Tamil Letters scoring data:", error)
    }
  }

  const playLetterAudio = (letterIdx: number) => {
    if (letters.length === 0) return
    speak(letters[letterIdx].letter)
  }

  useEffect(() => {
    if (!isReady || letters.length === 0) return
    if (round > ROUND_LENGTH) {
      setGameOver(true)
      if (user && app) {
        saveGameScore({
          userId: user.id,
          applicationId: app.id,
          score,
          maxScore: ROUND_LENGTH,
          completionTimeSec: Math.floor((Date.now() - roundStartTime) / 1000),
          difficultyLevel: letterType,
          gameData: { letterType },
          isConnected,
        })
          .then(() =>
            getActivityMasteryTier(user.id, app.id, `letters-game:tamil`)
              .then(setMasteryTier)
              .catch((error) => console.error("Error fetching Tamil Letters mastery tier:", error)),
          )
          .catch((error) => console.error("Error saving Tamil Letters score:", error))
      }
      return
    }
    const correct = pickUnseenRandom(`tamil-letters-game:${letterType}`, 0, letters.length - 1)
    setCorrectIdx(correct)
    setChoices(randomChoiceIndices(correct, letters.length))
    setShowResult(null)
    const timer = setTimeout(() => playLetterAudio(correct), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, isReady, letters])

  const handleCardClick = (idx: number) => {
    if (showResult || gameOver || letters.length === 0) return
    if (choices[idx] === correctIdx) {
      setShowResult("correct")
      setScore((s) => s + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
      playCorrectSound()
      setCurrentMessage(successMessages[Math.floor(Math.random() * successMessages.length)])
      setTimeout(() => setRound((r) => r + 1), 1800)
    } else {
      setShowResult("wrong")
      playWrongSound()
      setTimeout(() => setRound((r) => r + 1), 1400)
    }
  }

  const handleReplayAudio = () => playLetterAudio(correctIdx)
  const handleBackToHome = () => {
    window.location.href = "/tamil-letters"
  }
  const handleRestart = () => {
    setScore(0)
    setRound(1)
    setGameOver(false)
    setRoundStartTime(Date.now())
  }

  if (!isReady || letters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-[800px] flex items-center justify-between mb-6 flex-wrap gap-3">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Tamil Letters
        </Button>
        <div className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm flex-wrap">
          <span className="text-white font-bold">{typeLabel.native}</span>
          {Array.from({ length: ROUND_LENGTH }, (_, i) => (
            <Star key={i} className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`} />
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white drop-shadow">Tap the letter</h1>
      </div>

      <Card className="w-full max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          {gameOver ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="text-3xl font-bold text-green-800 mb-4">Game Over!</div>
              <div className="text-2xl text-pink-900 mb-2">Your Score: {score} / {ROUND_LENGTH}</div>
              {masteryTier && (
                <div className="mb-4">
                  <MasteryBadge tier={masteryTier} showLabel />
                </div>
              )}
              <Button onClick={handleRestart} className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3" variant="outline">
                Play Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center">
                <div className="text-xl text-pink-900 font-semibold mb-3">
                  Question {round} of {ROUND_LENGTH}
                </div>
                <Button
                  onClick={handleReplayAudio}
                  disabled={isSpeaking}
                  className="bg-white/30 hover:bg-white/40 text-pink-800 border-white font-bold text-lg px-6 py-3"
                  variant="outline"
                >
                  🔊 Hear the Letter
                </Button>
              </div>
              <div className="flex flex-row gap-6 mt-4 justify-center flex-wrap">
                {choices.map((letterIdx, idx) => (
                  <Card
                    key={idx}
                    className={`w-36 h-52 flex flex-col items-center justify-center gap-1 text-7xl font-bold cursor-pointer transition-all duration-200 ${
                      showResult && choices[idx] === correctIdx && showResult === "correct"
                        ? "bg-green-200 border-green-500 scale-110"
                        : showResult && idx === choices.findIndex((i) => i === correctIdx) && showResult === "wrong"
                          ? "bg-red-200 border-red-500"
                          : "bg-white/80 hover:bg-pink-100"
                    }`}
                    onClick={() => handleCardClick(idx)}
                  >
                    <span>{letters[letterIdx].letter}</span>
                    <span className="text-base font-normal opacity-70">
                      {romanize(letters[letterIdx].letter, "tamil")}
                    </span>
                  </Card>
                ))}
              </div>
              {showResult === "correct" && (
                <div className="mt-4 text-green-700 font-bold text-xl animate-bounce text-center">{currentMessage}</div>
              )}
              {showResult === "wrong" && <div className="mt-4 text-red-700 font-bold text-xl text-center">Try again!</div>}
            </>
          )}
        </CardContent>
      </Card>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
