"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Clock, CheckCircle, XCircle } from "lucide-react"
import { pickUnseenRandom, recordAnswer, getCoverageStats } from "@/lib/question-history"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type GameMode = "menu" | "setup" | "playing"
type GameType = "multiple-choice" | "text-input"
type TimeType = "hours" | "half-hour" | "quarter-hour" | "all-times"

interface User {
  id: string
  name: string
  email?: string
}

interface GameData {
  mode: string
  gameType: string
  completionTime: number
}

interface ClockTime {
  hours: number
  minutes: number
}

interface Question {
  time: ClockTime
  /** The pickUnseenRandom-tracked code for this time — also this question's coverage signature. */
  code: number
  choices?: string[]
  correctAnswer: string
}

interface ClockReadingGameProps {
  user?: User | null
  applicationId?: string
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

// Sound effect frequencies
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function ClockReadingGame({ user, applicationId, onGameComplete, onBackToHome }: ClockReadingGameProps = {}) {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [gameType, setGameType] = useState<GameType>("multiple-choice")
  const [timeType, setTimeType] = useState<TimeType>("hours")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [userInput, setUserInput] = useState({ hours: "", minutes: "" })
  const [modeTiers, setModeTiers] = useState<Partial<Record<TimeType, MasteryTier>>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (currentMode !== "menu" || !user?.id || !applicationId) return
    let cancelled = false

    const loadTiers = async () => {
      const types: TimeType[] = ["hours", "half-hour", "quarter-hour", "all-times"]
      const entries = await Promise.all(
        types.map(async (type) => {
          const poolSize = maxCodeForType[type] + 1
          const { correctCount } = getCoverageStats(`clock-reading:${type}`, poolSize)
          const tier = await getActivityMasteryTier(user.id, applicationId, `clock-reading:${type}`, {
            modeFilter: (gameData) => gameData?.mode === type,
            coverageNumerator: correctCount,
          })
          return [type, tier] as const
        }),
      )
      if (!cancelled) setModeTiers(Object.fromEntries(entries) as Record<TimeType, MasteryTier>)
    }

    loadTiers()
    return () => {
      cancelled = true
    }
  }, [currentMode, user?.id, applicationId])

  // Audio context for sound effects
  const playSound = (frequencies: number[], isCorrect: boolean) => {
    try {
      const audioContext = new (
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()

      if (isCorrect) {
        const randomFreqs = frequencies.sort(() => Math.random() - 0.5).slice(0, 3)
        randomFreqs.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.15)
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.15 + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3)

          oscillator.start(audioContext.currentTime + index * 0.15)
          oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3)
        })
      } else {
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.2)
          oscillator.type = "sawtooth"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.2)
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + index * 0.2 + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.2 + 0.4)

          oscillator.start(audioContext.currentTime + index * 0.2)
          oscillator.stop(audioContext.currentTime + index * 0.2 + 0.4)
        })
      }
    } catch {
      console.log("Audio not supported")
    }
  }

  // Generate random time based on selected type
  const generateRandomTime = (type: TimeType): ClockTime => {
    const hours = Math.floor(Math.random() * 12) + 1 // 1-12
    let minutes = 0

    switch (type) {
      case "hours":
        minutes = 0 // Only :00
        break
      case "half-hour":
        minutes = Math.random() < 0.5 ? 0 : 30 // :00 or :30
        break
      case "quarter-hour":
        const quarterOptions = [0, 15, 30, 45]
        minutes = quarterOptions[Math.floor(Math.random() * quarterOptions.length)]
        break
      case "all-times":
        minutes = Math.floor(Math.random() * 12) * 5 // 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
        break
    }

    return { hours, minutes }
  }

  // Encodes a ClockTime into a single integer in [0, maxCodeForType[type]] so
  // the "correct" time for a new question can be tracked/no-repeated via
  // pickUnseenRandom, which only understands plain integer ranges.
  const QUARTER_OPTIONS = [0, 15, 30, 45]
  const maxCodeForType: Record<TimeType, number> = {
    hours: 11,
    "half-hour": 23,
    "quarter-hour": 47,
    "all-times": 143,
  }

  const codeToTime = (code: number, type: TimeType): ClockTime => {
    switch (type) {
      case "hours":
        return { hours: code + 1, minutes: 0 }
      case "half-hour":
        return { hours: Math.floor(code / 2) + 1, minutes: (code % 2) * 30 }
      case "quarter-hour":
        return { hours: Math.floor(code / 4) + 1, minutes: QUARTER_OPTIONS[code % 4] }
      case "all-times":
        return { hours: Math.floor(code / 12) + 1, minutes: (code % 12) * 5 }
    }
  }

  // Generate a random time for the *correct* answer, tracked so a user
  // doesn't see the same clock face again until every time in the range
  // for this timeType has been shown.
  const generateUnseenTime = (type: TimeType): { time: ClockTime; code: number } => {
    const code = pickUnseenRandom(`clock-reading:${type}`, 0, maxCodeForType[type])
    return { time: codeToTime(code, type), code }
  }

  // Format time to string
  const formatTime = (time: ClockTime): string => {
    const { hours, minutes } = time
    if (minutes === 0) {
      return `${hours}:00`
    } else if (minutes === 30) {
      return `${hours}:30`
    } else if (minutes === 15) {
      return `${hours}:15`
    } else if (minutes === 45) {
      return `${hours}:45`
    } else {
      return `${hours}:${minutes.toString().padStart(2, "0")}`
    }
  }

  // Generate wrong choices for multiple choice
  const generateWrongChoices = (correctTime: ClockTime, type: TimeType): string[] => {
    const wrongChoices: string[] = []
    const correctAnswer = formatTime(correctTime)

    while (wrongChoices.length < 2) {
      const wrongTime = generateRandomTime(type)
      const wrongAnswer = formatTime(wrongTime)

      if (wrongAnswer !== correctAnswer && !wrongChoices.includes(wrongAnswer)) {
        wrongChoices.push(wrongAnswer)
      }
    }

    return wrongChoices
  }

  // Generate questions
  const generateQuestions = (gameType: GameType, timeType: TimeType): Question[] => {
    const newQuestions: Question[] = []

    for (let i = 0; i < 5; i++) {
      const { time, code } = generateUnseenTime(timeType)
      const correctAnswer = formatTime(time)

      if (gameType === "multiple-choice") {
        const wrongChoices = generateWrongChoices(time, timeType)
        const allChoices = [correctAnswer, ...wrongChoices].sort(() => Math.random() - 0.5)

        newQuestions.push({
          time,
          code,
          choices: allChoices,
          correctAnswer,
        })
      } else {
        newQuestions.push({
          time,
          code,
          correctAnswer,
        })
      }
    }

    return newQuestions
  }

  // Draw analog clock
  const drawClock = (time: ClockTime) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw clock face
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw hour markers
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 3
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180)
      const startX = centerX + Math.cos(angle) * (radius - 15)
      const startY = centerY + Math.sin(angle) * (radius - 15)
      const endX = centerX + Math.cos(angle) * (radius - 5)
      const endY = centerY + Math.sin(angle) * (radius - 5)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Draw numbers
      ctx.fillStyle = "#333333"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const numX = centerX + Math.cos(angle) * (radius - 30)
      const numY = centerY + Math.sin(angle) * (radius - 30)
      ctx.fillText(i.toString(), numX, numY)
    }

    // Draw minute markers
    ctx.strokeStyle = "#666666"
    ctx.lineWidth = 1
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        // Skip hour markers
        const angle = (i * 6 - 90) * (Math.PI / 180)
        const startX = centerX + Math.cos(angle) * (radius - 10)
        const startY = centerY + Math.sin(angle) * (radius - 10)
        const endX = centerX + Math.cos(angle) * (radius - 5)
        const endY = centerY + Math.sin(angle) * (radius - 5)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    }

    // Calculate hand angles
    const hourAngle = ((time.hours % 12) * 30 + time.minutes * 0.5 - 90) * (Math.PI / 180)
    const minuteAngle = (time.minutes * 6 - 90) * (Math.PI / 180)

    // Draw hour hand
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(hourAngle) * (radius * 0.5), centerY + Math.sin(hourAngle) * (radius * 0.5))
    ctx.stroke()

    // Draw minute hand
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(minuteAngle) * (radius * 0.8), centerY + Math.sin(minuteAngle) * (radius * 0.8))
    ctx.stroke()

    // Draw center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "#333333"
    ctx.fill()
  }

  useEffect(() => {
    if (currentMode === "playing" && questions.length > 0) {
      drawClock(questions[currentQuestionIndex].time)
    }
  }, [currentMode, currentQuestionIndex, questions])

  const handleStartGame = () => {
    setCurrentMode("playing")
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowFeedback(false)
    setUserInput({ hours: "", minutes: "" })
    setGameStartTime(Date.now())

    const newQuestions = generateQuestions(gameType, timeType)
    setQuestions(newQuestions)
  }

  const handleMultipleChoiceAnswer = (selectedAnswer: string) => {
    if (showFeedback) return // lock during feedback — same single-shot pattern as every other topic

    const currentQuestion = questions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correctAnswer
    const newScore = correct ? score + 1 : score

    setIsCorrect(correct)
    setShowFeedback(true)
    correct ? playCorrectSound() : playWrongSound()
    recordAnswer(`clock-reading:${timeType}`, String(currentQuestion.code), correct)

    setTimeout(() => {
      setShowFeedback(false)
      setScore(newScore)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        handleGameComplete(newScore)
      }
    }, correct ? 2000 : 1500)
  }

  const handleTextInputSubmit = () => {
    if (showFeedback) return

    const currentQuestion = questions[currentQuestionIndex]
    const userTime = `${userInput.hours}:${userInput.minutes.padStart(2, "0")}`
    const correct = userTime === currentQuestion.correctAnswer
    const newScore = correct ? score + 1 : score

    setIsCorrect(correct)
    setShowFeedback(true)
    correct ? playCorrectSound() : playWrongSound()
    recordAnswer(`clock-reading:${timeType}`, String(currentQuestion.code), correct)

    setTimeout(() => {
      setShowFeedback(false)
      setUserInput({ hours: "", minutes: "" })
      setScore(newScore)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        handleGameComplete(newScore)
      }
    }, correct ? 2000 : 1500)
  }

  const handleGameComplete = (finalScore: number) => {
    playSound(successSoundFreqs, true)

    if (onGameComplete) {
      onGameComplete(finalScore, 5, {
        mode: timeType,
        gameType,
        completionTime: gameStartTime,
      })
    }

    setTimeout(() => {
      if (onBackToHome) {
        onBackToHome()
      } else {
        setCurrentMode("menu")
        setScore(0)
        setCurrentQuestionIndex(0)
        setQuestions([])
      }
    }, 3000)
  }

  const resetGame = () => {
    setCurrentMode("menu")
    setScore(0)
    setCurrentQuestionIndex(0)
    setQuestions([])
    setShowFeedback(false)
    setUserInput({ hours: "", minutes: "" })
    setGameType("multiple-choice")
    setTimeType("hours")
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-300 to-pink-500 p-4 relative overflow-hidden">
        {/* Decorative Character */}
        <img 
          src="/characters/bunny.png" 
          alt="Bunny" 
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => (onBackToHome ? onBackToHome() : resetGame())}
              className="bg-white/20 hover:bg-white/30 text-orange-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {onBackToHome ? "Back to Home" : "Back to Menu"}
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-orange-800">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-orange-800 mb-4 font-sans tracking-tight">
                  🕐 Clock Reading Challenge
                </h1>
                <p className="text-xl text-orange-700 font-medium">Learn to read analog clocks!</p>
                <p className="text-sm text-orange-600 mt-2">Choose your game settings - 5 questions each</p>
              </div>

              <div className="space-y-8">
                {/* Game Type Selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Game Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button
                      onClick={() => setGameType("multiple-choice")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        gameType === "multiple-choice"
                          ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="h-8 w-8" />
                        <span>Multiple Choice</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => setGameType("text-input")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        gameType === "text-input"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <XCircle className="h-8 w-8" />
                        <span>Type the Time</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Time Type Selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Time Type</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      onClick={() => setTimeType("hours")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        timeType === "hours"
                          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🕐</span>
                        <span>Hours Only</span>
                        <span className="text-xs">(1:00, 2:00...)</span>
                        {modeTiers.hours && <MasteryBadge tier={modeTiers.hours} size="sm" />}
                      </div>
                    </Button>

                    <Button
                      onClick={() => setTimeType("half-hour")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        timeType === "half-hour"
                          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🕕</span>
                        <span>Half Hours</span>
                        <span className="text-xs">(:00, :30)</span>
                        {modeTiers["half-hour"] && <MasteryBadge tier={modeTiers["half-hour"]} size="sm" />}
                      </div>
                    </Button>

                    <Button
                      onClick={() => setTimeType("quarter-hour")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        timeType === "quarter-hour"
                          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🕒</span>
                        <span>Quarter Hours</span>
                        <span className="text-xs">(:00, :15, :30, :45)</span>
                        {modeTiers["quarter-hour"] && <MasteryBadge tier={modeTiers["quarter-hour"]} size="sm" />}
                      </div>
                    </Button>

                    <Button
                      onClick={() => setTimeType("all-times")}
                      className={`h-28 text-lg font-bold border-4 transition-all duration-300 ${
                        timeType === "all-times"
                          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">🕐</span>
                        <span>All Times</span>
                        <span className="text-xs">(Every 5 min)</span>
                        {modeTiers["all-times"] && <MasteryBadge tier={modeTiers["all-times"]} size="sm" />}
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <Button
                    onClick={handleStartGame}
                    className="h-16 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚀</span>
                      <span>Start Game!</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isGameComplete = currentQuestionIndex >= questions.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-400 to-pink-500 p-4 relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/bunny.png" 
        alt="Bunny" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => (onBackToHome ? onBackToHome() : resetGame())}
            className="bg-white/20 hover:bg-white/30 text-orange-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {onBackToHome ? "Back to Home" : "Back to Menu"}
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            {Array.from({ length: questions.length }, (_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 transition-all ${i < score ? "fill-yellow-300 text-yellow-300 scale-110" : "text-white/40"}`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-orange-800 mb-2 font-sans">
                {gameType === "multiple-choice" ? "Multiple Choice Mode" : "Type the Time Mode"}
              </h2>
              <div className="text-lg text-orange-700 font-medium">Question {currentQuestionIndex + 1} of 5</div>
            </div>

            {!isGameComplete && currentQuestion && (
              <>
                {/* Clock Display */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border-4 border-white shadow-lg">
                    <canvas ref={canvasRef} width={300} height={300} className="rounded-xl" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    <Clock className="inline-block mr-2 h-8 w-8" />
                    What time is shown on the clock?
                  </h3>
                </div>

                {gameType === "multiple-choice" ? (
                  /* Multiple Choice Options */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {currentQuestion.choices?.map((choice, index) => (
                      <Button
                        key={index}
                        onClick={() => handleMultipleChoiceAnswer(choice)}
                        className="h-16 text-xl font-bold bg-white/20 hover:bg-white/30 text-gray-800 border-2 border-gray-300 hover:border-orange-500 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        variant="outline"
                        disabled={showFeedback}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                ) : (
                  /* Text Input Mode */
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <label className="text-lg font-bold text-gray-700">Hours:</label>
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        value={userInput.hours}
                        onChange={(e) => setUserInput({ ...userInput, hours: e.target.value })}
                        className="no-spinner w-20 h-12 text-xl text-center border-4 border-orange-300 focus:border-orange-500 rounded-xl font-bold"
                        placeholder="0"
                        disabled={showFeedback}
                      />
                    </div>

                    <span className="text-3xl font-bold text-gray-700">:</span>

                    <div className="flex items-center gap-2">
                      <label className="text-lg font-bold text-gray-700">Minutes:</label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        step="5"
                        value={userInput.minutes}
                        onChange={(e) => setUserInput({ ...userInput, minutes: e.target.value })}
                        className="no-spinner w-20 h-12 text-xl text-center border-4 border-orange-300 focus:border-orange-500 rounded-xl font-bold"
                        placeholder="00"
                        disabled={showFeedback}
                      />
                    </div>

                    <Button
                      onClick={handleTextInputSubmit}
                      disabled={!userInput.hours || !userInput.minutes || showFeedback}
                      className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold text-xl px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Submit ✨
                    </Button>
                  </div>
                )}

                {/* Feedback */}
                {showFeedback && (
                  <div
                    className={`text-center p-6 rounded-2xl ${isCorrect ? "bg-green-100" : "bg-red-100"} border-4 ${isCorrect ? "border-green-300" : "border-red-300"}`}
                  >
                    <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                      {isCorrect ? "🎉 Excellent!" : "🤔 Try Again!"}
                    </div>
                    <div className="text-xl font-medium text-gray-700">
                      {isCorrect
                        ? `Correct! The time is ${currentQuestion.correctAnswer}`
                        : `The correct time is ${currentQuestion.correctAnswer}`}
                    </div>
                  </div>
                )}
              </>
            )}

            {isGameComplete && (
              <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-4 border-green-300">
                <div className="text-4xl font-bold text-green-600 mb-4">🏆 Congratulations!</div>
                <div className="text-2xl text-gray-700 mb-4">You completed all 5 questions!</div>
                <div className="text-xl text-gray-600 mb-2">Final Score: {score}/5</div>
                <div className="text-lg text-orange-600 mb-2">
                  Mode: {gameType === "multiple-choice" ? "Multiple Choice" : "Type the Time"} 🕐
                </div>
                <div className="mt-4 text-lg text-gray-500">Returning to home...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
