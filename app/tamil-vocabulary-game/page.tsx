"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Volume2 } from "lucide-react"
import { getCategoryById, VocabularyItem } from "@/lib/tamil-vocabulary-data"
import { romanize } from "@/lib/transliteration"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { pickUnseenRandom } from "@/lib/question-history"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

// Function to play English TTS
const playEnglishTTS = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.onend = () => resolve()
      utterance.onerror = (e) => reject(e)
      window.speechSynthesis.speak(utterance)
    } else {
      reject(new Error('Speech synthesis not supported'))
    }
  })
}

// Success messages array
const successMessages = [
  "Good job!",
  "Excellent!",
  "Amazing work!",
  "Fantastic!",
  "Outstanding!",
  "Brilliant!",
  "Perfect!",
  "Wonderful!",
  "Great job!",
  "Superb!",
  "Terrific!",
  "Awesome!",
  "Incredible!",
  "Magnificent!",
  "Splendid!"
]

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

function getRandomChoices(correctIndex: number, totalItems: number, numChoices: number = 4): number[] {
  const indices = [correctIndex]
  while (indices.length < Math.min(numChoices, totalItems)) {
    const idx = getRandomInt(totalItems)
    if (!indices.includes(idx)) indices.push(idx)
  }
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

export default function TamilVocabularyGame() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || "days"

  const [items, setItems] = useState<VocabularyItem[]>([])
  const [categoryName, setCategoryName] = useState({ tamil: "", english: "" })
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(10)
  const [choices, setChoices] = useState<number[]>([])
  const [correctIdx, setCorrectIdx] = useState(0)
  const [showResult, setShowResult] = useState<null | "correct" | "wrong">(null)
  const [gameOver, setGameOver] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("Good job!")
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Scoring/persistence
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

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

        const application = await getApplicationByName("Tamil Vocabulary")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing Tamil Vocabulary scoring data:", error)
    }
  }

  // Initialize items based on category
  useEffect(() => {
    const category = getCategoryById(categoryId)
    if (category) {
      setItems(category.items)
      setCategoryName({ tamil: category.nameTamil, english: category.nameEnglish })
      setTotalRounds(Math.min(10, category.items.length))
      setIsReady(true)
    }
  }, [categoryId])

  // Play English word audio
  const playWordAudio = async (itemIndex: number) => {
    if (isPlayingTTS || items.length === 0) return

    try {
      setIsPlayingTTS(true)
      await playEnglishTTS(items[itemIndex].english)
    } catch (error) {
      console.error("English TTS play failed:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  // Setup new round
  useEffect(() => {
    if (!isReady || items.length === 0) return

    if (round > totalRounds) {
      setGameOver(true)
      if (user && app) {
        saveGameScore({
          userId: user.id,
          applicationId: app.id,
          score,
          maxScore: totalRounds,
          completionTimeSec: Math.floor((Date.now() - roundStartTime) / 1000),
          difficultyLevel: categoryId,
          gameData: { category: categoryId },
          isConnected,
        })
          .then(() =>
            getActivityMasteryTier(user.id, app.id, `vocabulary-game:tamil`)
              .then(setMasteryTier)
              .catch((error) => console.error("Error fetching Tamil Vocabulary mastery tier:", error)),
          )
          .catch((error) => console.error("Error saving Tamil Vocabulary score:", error))
      }
      return
    }

    const correct = pickUnseenRandom(`tamil-vocabulary-game:${categoryId}`, 0, items.length - 1)
    setCorrectIdx(correct)
    setChoices(getRandomChoices(correct, items.length, 4))
    setShowResult(null)

    // Play the English word audio after a short delay
    setTimeout(() => {
      playWordAudio(correct)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, isReady, items])

  const handleCardClick = (idx: number) => {
    if (showResult || gameOver || items.length === 0) return

    if (choices[idx] === correctIdx) {
      setShowResult("correct")
      setScore((s) => s + 1)

      // Show confetti
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)

      // Play happy tune
      playCorrectSound()

      // Set random success message
      setCurrentMessage(successMessages[Math.floor(Math.random() * successMessages.length)])

      setTimeout(() => setRound((r) => r + 1), 2000)
    } else {
      setShowResult("wrong")
      playWrongSound()
      setTimeout(() => setRound((r) => r + 1), 1500)
    }
  }

  const handleReplayAudio = () => {
    playWordAudio(correctIdx)
  }

  const handleBackToVocabulary = () => {
    window.location.href = "/tamil-vocabulary"
  }

  const handleRestart = () => {
    setScore(0)
    setRound(1)
    setGameOver(false)
    setRoundStartTime(Date.now())
  }

  if (!isReady || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-pink-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/monkey-2.png"
        alt="Monkey"
        className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header */}
      <div className="w-full max-w-[800px] flex items-center justify-between mb-6">
        <Button
          onClick={handleBackToVocabulary}
          className="bg-white/20 hover:bg-white/30 text-pink-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="bg-white/30 px-4 py-2 rounded-full">
            <span className="text-pink-900 font-bold">{categoryName.tamil}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-xl font-bold text-pink-900">Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-pink-900">
          Listen and find the Tamil word!
        </h1>
      </div>

      <Card className="w-full max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          {gameOver ? (
            <div className="flex flex-col items-center justify-center w-full py-8">
              <div className="text-4xl font-bold text-fuchsia-800 mb-4">🎉 Game Over!</div>
              <div className="text-2xl text-pink-900 mb-2">Your Score: {score} / {totalRounds}</div>
              {masteryTier && (
                <div className="mb-4">
                  <MasteryBadge tier={masteryTier} showLabel />
                </div>
              )}
              <div className="text-lg text-pink-600 mb-6">
                {score === totalRounds ? "Perfect! Amazing work!" :
                 score >= totalRounds * 0.8 ? "Great job!" :
                 score >= totalRounds * 0.6 ? "Good effort!" : "Keep practicing!"}
              </div>
              <Button
                onClick={handleRestart}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 text-lg"
              >
                Play Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center">
                <div className="text-xl text-pink-900 font-semibold mb-4">
                  Question {round} of {totalRounds}
                </div>

                {/* English Word Display */}
                <div className="bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl p-6 mb-4 text-center shadow-lg">
                  <div className="text-sm text-rose-600 mb-1">Listen to the English word:</div>
                  <div className="text-3xl font-bold text-rose-800 mb-3">
                    {items[correctIdx].english}
                  </div>
                  <Button
                    onClick={handleReplayAudio}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-lg px-6 py-3"
                    disabled={isPlayingTTS}
                  >
                    <Volume2 className={`mr-2 h-5 w-5 ${isPlayingTTS ? 'animate-pulse' : ''}`} />
                    Hear Again
                  </Button>
                </div>
              </div>

              {/* Tamil Word Choices */}
              <div className="text-center mb-4">
                <div className="text-lg text-pink-700 font-semibold">Select the correct Tamil word:</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {choices.map((itemIdx, idx) => (
                  <Card
                    key={idx}
                    className={`p-6 flex items-center justify-center text-3xl md:text-4xl font-bold cursor-pointer transition-all duration-200 ${
                      showResult && choices[idx] === correctIdx && showResult === "correct"
                        ? "bg-green-200 border-green-500 border-4 scale-105"
                        : showResult && idx === choices.findIndex(i => i === correctIdx) && showResult === "wrong"
                        ? "bg-red-100 border-red-400 border-2"
                        : "bg-white hover:bg-pink-50 border-2 border-pink-200 hover:border-pink-400"
                    }`}
                    onClick={() => handleCardClick(idx)}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-pink-800">{items[itemIdx].tamil}</span>
                      <span className="text-base md:text-lg font-normal text-pink-600/80 italic mt-1">
                        {romanize(items[itemIdx].tamil, "tamil")}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              {showResult === "correct" && (
                <div className="mt-6 text-center text-green-700 font-bold text-2xl animate-bounce">
                  ✨ {currentMessage} ✨
                </div>
              )}
              {showResult === "wrong" && (
                <div className="mt-6 text-center text-red-600 font-bold text-xl">
                  Try again! 🤔
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            </div>
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="w-2 h-2 bg-fuchsia-400 transform rotate-45"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
