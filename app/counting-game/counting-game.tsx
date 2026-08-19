"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

interface Animal {
  id: number
  x: number
  y: number
  color: string
  size: number
  type: "rabbit" | "lion" | "tiger"
  points: number
}

const animalConfig = {
  rabbit: {
    colors: ["#FF69B4", "#FFB6C1", "#FF1493", "#FFC0CB", "#DA70D6", "#DDA0DD", "#EE82EE", "#BA55D3"],
    emoji: "🐰",
    points: 1,
    minLevel: 1,
  },
  lion: {
    colors: ["#DAA520", "#FFD700", "#FFA500", "#FF8C00", "#CD853F"],
    emoji: "🦁",
    points: 3,
    minLevel: 2,
  },
  tiger: {
    colors: ["#FF4500", "#FF6347", "#FF7F50", "#FFA500", "#FF8C00"],
    emoji: "🐅",
    points: 5,
    minLevel: 3,
  },
}

export default function RabbitGame() {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [score, setScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [animalIdCounter, setAnimalIdCounter] = useState(0)
  const [level, setLevel] = useState(1)
  const [targetScore, setTargetScore] = useState(10)

  // Scoring/persistence
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  // Guards against a single animal being caught more than once: two rapid
  // clicks/taps on the same animal can both fire before the setAnimals()
  // removal re-renders, otherwise double-counting its points.
  const caughtIdsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
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

        const application = await getApplicationByName("Catch Me")
        setUser(currentUser)
        setApp(application)
      } else {
        const userData = localStorage.getItem("mywayapps_current_user")
        const appData = localStorage.getItem("mywayapps_current_app")
        if (userData) setUser(JSON.parse(userData))
        if (appData) setApp(JSON.parse(appData))
      }
    } catch (error) {
      console.error("Error initializing scoring data:", error)
    }
  }

  // Create audio context for click sound
  const playClickSound = useCallback(() => {
    const audioContext = new (window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.type = "sine"
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }, [])

  const spawnAnimal = useCallback(() => {
    const availableTypes: Array<keyof typeof animalConfig> = []
    if (level >= animalConfig.rabbit.minLevel) availableTypes.push("rabbit")
    if (level >= animalConfig.lion.minLevel) availableTypes.push("lion")
    if (level >= animalConfig.tiger.minLevel) availableTypes.push("tiger")
    
    const animalType = availableTypes[Math.floor(Math.random() * availableTypes.length)]
    const config = animalConfig[animalType]
    
    // Define the game area rectangle (centered on screen)
    const gameAreaWidth = Math.min(window.innerWidth - 40, window.innerWidth - 40) // Leave 20px margin on each side
    const gameAreaHeight = Math.min(window.innerHeight - 120, window.innerHeight - 120) // Leave space for buttons
    const gameAreaX = 20 // 20px from left edge
    const gameAreaY = 80 // Start below the top buttons
    
    const newAnimal: Animal = {
      id: animalIdCounter,
      x: gameAreaX + Math.random() * gameAreaWidth,
      y: gameAreaY + Math.random() * gameAreaHeight,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: Math.random() * 20 + 30,
      type: animalType,
      points: config.points,
    }
    
    setAnimals((prev) => [...prev, newAnimal])
    setAnimalIdCounter((prev) => prev + 1)
    
    // Remove animal after some time
    setTimeout(() => {
      setAnimals((prev) => prev.filter((animal) => animal.id !== newAnimal.id))
    }, 3000)
  }, [animalIdCounter, level])

  const clickAnimal = (animalId: number) => {
    if (caughtIdsRef.current.has(animalId)) return
    const animal = animals.find((a) => a.id === animalId)
    if (animal) {
      caughtIdsRef.current.add(animalId)
      setScore((prev) => prev + animal.points)
      setAnimals((prev) => prev.filter((a) => a.id !== animalId))
      playClickSound()
    }
  }

  const startGame = () => {
    caughtIdsRef.current = new Set()
    setGameActive(true)
    setScore(0)
    setTimeLeft(60)
    setLevel(1)
    setTargetScore(10)
    setAnimals([])
    setMasteryTier(null)
  }

  const endGame = () => {
    setGameActive(false)
    setAnimals([])

    if (user && app) {
      saveGameScore({
        userId: user.id,
        applicationId: app.id,
        score,
        maxScore: targetScore,
        gameData: { level, targetScore },
        isConnected,
      })
        .then(() =>
          getActivityMasteryTier(user.id, app.id, "counting-game:default")
            .then(setMasteryTier)
            .catch((error) => console.error("Error fetching Catch Me mastery tier:", error)),
        )
        .catch((error) => console.error("Error saving Catch Me score:", error))
    }
  }

  // Game timer
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      endGame()
    }
  }, [gameActive, timeLeft])

  // Spawn animals during game
  useEffect(() => {
    if (gameActive) {
      const spawnInterval = setInterval(
        () => {
          const spawnChance = level === 1 ? 0.7 : level === 2 ? 0.8 : 0.9
          if (Math.random() < spawnChance) {
            spawnAnimal()
          }
        },
        Math.max(800 - level * 100, 400),
      )
      return () => clearInterval(spawnInterval)
    }
  }, [gameActive, spawnAnimal, level])

  // Level progression
  useEffect(() => {
    if (score >= targetScore && gameActive) {
      setLevel((prev) => prev + 1)
      setTargetScore((prev) => prev + 15)
      setTimeLeft((prev) => prev + 10)
    }
  }, [score, targetScore, gameActive])

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-crosshair bg-gradient-to-br from-purple-200 to-pink-500">
      {/* Game Over Screen */}
      {!gameActive && score > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Game Over!</h2>
            <p className="text-xl text-gray-700 mb-4">Final Score: {score}</p>
            {masteryTier && (
              <div className="mb-4 flex justify-center">
                <MasteryBadge tier={masteryTier} showLabel />
              </div>
            )}
            <Button
              onClick={startGame}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!gameActive && score === 0 && (
        <div className="absolute inset-0 z-10 p-4">
          {/* Header with Back to Home Button - Aligned with white rectangle */}
          <div className="flex items-center justify-between mb-6 max-w-md mx-auto">
            <Button
              onClick={() => window.history.back()}
              className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2 text-purple-800 font-bold">
              <Star className="h-5 w-5" />
              <span>Score: 0</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="bg-white/90 rounded-lg p-8 text-center shadow-2xl max-w-md">
              <h1 className="text-3xl font-bold text-orange-800 mb-4">🐰 Animal Hunt!</h1>
              <p className="text-lg text-gray-700 mb-2">Click on animals to score points!</p>
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p>🐰 Rabbits: 1 point (Level 1+)</p>
                <p>🦁 Lions: 3 points (Level 2+)</p>
                <p>🐅 Tigers: 5 points (Level 3+)</p>
              </div>
              <p className="text-md text-gray-600 mb-6">Reach the target score to advance levels!</p>
              <Button
                onClick={startGame}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Start Hunting! 🎯
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Game UI - Only show when game is active */}
      {gameActive && (
        <>
          {/* Back to Home Button */}
          <div className="absolute top-4 left-4 z-10">
            <Button
              onClick={() => window.history.back()}
              className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </div>

          {/* Game UI - Score Window */}
          <div className="absolute top-20 left-4 z-10 bg-white/90 rounded-lg p-4 shadow-lg">
            <div className="text-2xl font-bold text-orange-800 mb-2">Score: {score}</div>
            <div className="text-lg font-semibold text-purple-700 mb-1">Level: {level}</div>
            <div className="text-sm text-gray-600 mb-2">Target: {targetScore}</div>
            <div className="text-lg font-semibold text-orange-700">Time: {timeLeft}s</div>
          </div>

          {/* Start/Restart Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={startGame}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
            >
              Restart Game
            </Button>
          </div>
        </>
      )}

      {/* Game Area Rectangle */}
      {gameActive && (
        <div 
          className="absolute border-4 border-white/30 rounded-lg shadow-lg"
          style={{
            left: '20px',
            top: '80px',
            width: window.innerWidth - 40,
            height: window.innerHeight - 120,
          }}
        >
          <div className="w-full h-full bg-white/10 rounded-lg backdrop-blur-sm"></div>
        </div>
      )}

      {/* Animals */}
      {animals.map((animal) => {
        const config = animalConfig[animal.type]
        return (
          <div
            key={animal.id}
            className="absolute cursor-pointer transform hover:scale-110 transition-transform duration-150 animate-bounce"
            style={{
              left: animal.x,
              top: animal.y,
              fontSize: animal.size,
            }}
            onClick={() => clickAnimal(animal.id)}
          >
            <div className="relative inline-block" style={{ color: animal.color }}>
              <span className="relative z-10">{config.emoji}</span>
              <div
                className="absolute inset-0 rounded-full opacity-60 mix-blend-multiply"
                style={{ backgroundColor: animal.color }}
              />
              {/* Point indicator */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {animal.points}
              </div>
            </div>
          </div>
        )
      })}

      {/* Decorative elements */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/30 text-sm">
        Click the animals in the rectangle to score points! 🎯
      </div>
    </div>
  )
}