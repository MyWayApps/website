"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

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

  // Create audio context for click sound
  const playClickSound = useCallback(() => {
    // Create a simple beep sound using Web Audio API
    //const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const audioContext = new (window.AudioContext ?? (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }, [])

  const spawnAnimal = useCallback(() => {
    // Determine available animal types based on current level
    //const availableTypes = Object.entries(animalConfig).filter(([_, config]) => config.minLevel <= level)
    const availableTypes = Object.entries(animalConfig).filter(([, config]) => config.minLevel <= level)

    const [animalType, config] = availableTypes[Math.floor(Math.random() * availableTypes.length)]

    const newAnimal: Animal = {
      id: animalIdCounter,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 200) + 100,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      size: Math.random() * 30 + 40,
      type: animalType as "rabbit" | "lion" | "tiger",
      points: config.points,
    }

    setAnimals((prev) => [...prev, newAnimal])
    setAnimalIdCounter((prev) => prev + 1)

    // Remove animal after 3 seconds if not clicked (tigers disappear faster)
    const disappearTime = animalType === "tiger" ? 2000 : 3000
    setTimeout(() => {
      setAnimals((prev) => prev.filter((animal) => animal.id !== newAnimal.id))
    }, disappearTime)
  }, [animalIdCounter, level])

  const clickAnimal = useCallback(
    (animalId: number) => {
      const clickedAnimal = animals.find((animal) => animal.id === animalId)
      if (clickedAnimal) {
        setAnimals((prev) => prev.filter((animal) => animal.id !== animalId))
        setScore((prev) => prev + clickedAnimal.points)
        playClickSound()
      }
    },
    [animals, playClickSound],
  )

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setLevel(1)
    setTargetScore(10)
    setTimeLeft(60)
    setAnimals([])
  }

  const endGame = () => {
    setGameActive(false)
    setAnimals([])
  }

  // Game timer
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
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
      ) // Faster spawning at higher levels
      return () => clearInterval(spawnInterval)
    }
  }, [gameActive, spawnAnimal, level])

  // Level progression
  useEffect(() => {
    if (score >= targetScore && gameActive) {
      setLevel((prev) => prev + 1)
      setTargetScore((prev) => prev + 15) // Increase target score for next level
      setTimeLeft((prev) => prev + 10) // Bonus time for reaching next level
    }
  }, [score, targetScore, gameActive])

  return (
    <div
      className="relative w-full h-screen overflow-hidden cursor-crosshair"
      style={{ backgroundColor: "#FF8C00" }} // Orange background
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 rounded-lg p-4 shadow-lg">
        <div className="text-2xl font-bold text-orange-800 mb-2">Score: {score}</div>
        <div className="text-lg font-semibold text-purple-700 mb-1">Level: {level}</div>
        <div className="text-sm text-gray-600 mb-2">Target: {targetScore}</div>
        {gameActive && <div className="text-lg font-semibold text-orange-700">Time: {timeLeft}s</div>}
      </div>

      {/* Start/Restart Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={startGame}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        >
          {gameActive ? "Restart Game" : "Start Game"}
        </Button>
      </div>

      {/* Game Over Screen */}
      {!gameActive && score > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
          <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Game Over!</h2>
            <p className="text-xl text-gray-700 mb-4">Final Score: {score}</p>
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
        <div className="absolute inset-0 flex items-center justify-center z-10">
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
        Click the rabbits to score points! 🎯
      </div>
    </div>
  )
}
