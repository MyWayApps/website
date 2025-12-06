"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2, BookOpen, Edit3, Sparkles, Brain } from "lucide-react"
import BalloonPopGame from "./balloon-pop-game"
import WordRocketGame from "./word-rocket-game"
import TreasureHuntGame from "./treasure-hunt-game"
import TypingRaceGame from "./typing-race-game"
import PuzzleBuilderGame from "./puzzle-builder-game"
import SpellingBeeGame from "./spelling-bee-game"
import FallingLettersGame from "./falling-letters-game"
import MemoryMatchGame from "./memory-match-game"
import MonsterMunchGame from "./monster-munch-game"
import MagicGardenGame from "./magic-garden-game"
import SpellTheWordGame from "./spell-the-word-game"
import TypeTheWordGame from "./type-the-word-game"
import SearchTheWordGame from "./search-the-word-game"
import { generateWords, generateWordsLocal } from "@/lib/word-generator"

type GameMode = "menu" | "word-selection" | "game-selection" | "playing"
type WordSource = "custom" | "letter-count" | "ai-generated"
type LetterCount = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface User {
  id: string
  name: string
  email: string
}

interface GameData {
  mode: string
  gameType: string
  wordList: string[]
  completionTime: number
}

interface SpellingGameSuiteProps {
  user?: User | null
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

// Static word lists by letter count
const WORD_LISTS: Record<LetterCount, string[]> = {
  3: ["cat", "dog", "sun", "hat", "car", "cup", "pen", "box", "key", "toy", "run", "fun", "big", "red", "hot"],
  4: ["book", "tree", "bird", "fish", "hand", "foot", "moon", "star", "blue", "pink", "play", "jump", "walk", "talk", "sing"],
  5: ["house", "water", "happy", "green", "black", "white", "small", "large", "light", "heavy", "quick", "slow", "young", "old", "clean"],
  6: ["purple", "orange", "yellow", "brown", "friend", "family", "school", "garden", "forest", "castle", "dragon", "prince", "princess", "magic", "wonder"],
  7: ["rainbow", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "mountain", "ocean", "forest", "village"],
  8: ["adventure", "treasure", "mountain", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "village", "computer"],
  9: ["adventure", "treasure", "mountain", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "village", "computer"],
  10: ["adventure", "treasure", "mountain", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "village", "computer"]
}

// Game types with descriptions and emojis
const GAME_TYPES = [
  {
    id: "spell-the-word",
    name: "Spell the Word",
    emoji: "✨",
    description: "Listen and tap letters to spell the word!",
    color: "from-teal-200 to-cyan-300",
    implemented: true
  },
  {
    id: "type-the-word",
    name: "Type the Word",
    emoji: "⌨️",
    description: "Listen and type the word you hear!",
    color: "from-purple-200 to-pink-300",
    implemented: true
  },
  {
    id: "search-the-word",
    name: "Search the Word",
    emoji: "🔍",
    description: "Listen and find the correct word!",
    color: "from-orange-200 to-amber-300",
    implemented: true
  },
  {
    id: "balloon-pop",
    name: "Balloon Pop",
    emoji: "🎈",
    description: "Words float inside balloons. Type correctly to pop them!",
    color: "from-rose-200 to-pink-300",
    implemented: true
  },
  {
    id: "word-rocket",
    name: "Word Rocket",
    emoji: "🚀",
    description: "Launch a rocket by spelling words correctly!",
    color: "from-sky-200 to-blue-300",
    implemented: true
  },
  {
    id: "magic-garden",
    name: "Magic Garden",
    emoji: "🌸",
    description: "Make flowers bloom with correct spelling!",
    color: "from-emerald-200 to-green-300",
    implemented: true
  },
  {
    id: "treasure-hunt",
    name: "Treasure Hunt",
    emoji: "🏴‍☠️",
    description: "Find treasure by spelling words correctly!",
    color: "from-amber-200 to-yellow-300",
    implemented: false // Disabled as requested
  },
  {
    id: "typing-race",
    name: "Typing Race",
    emoji: "🏎️",
    description: "Race against time to spell words quickly!",
    color: "from-orange-200 to-red-300",
    implemented: false
  },
  {
    id: "puzzle-builder",
    name: "Puzzle Builder",
    emoji: "🧩",
    description: "Build a puzzle by spelling words correctly!",
    color: "from-violet-200 to-purple-300",
    implemented: false
  },
  {
    id: "spelling-bee",
    name: "Spelling Bee",
    emoji: "🐝",
    description: "Guide the bee to spell words on flowers!",
    color: "from-yellow-200 to-orange-300",
    implemented: false
  },
  {
    id: "falling-letters",
    name: "Catch Letters",
    emoji: "🍎",
    description: "Catch falling letters to spell words!",
    color: "from-cyan-200 to-sky-300",
    implemented: false
  },
  {
    id: "memory-match",
    name: "Memory Match",
    emoji: "🃏",
    description: "Match pictures with their correct spelling!",
    color: "from-indigo-200 to-violet-300",
    implemented: false
  },
  {
    id: "monster-munch",
    name: "Monster Munch",
    emoji: "🍪",
    description: "Feed the monster letters in the right order!",
    color: "from-orange-200 to-red-300",
    implemented: false
  }
]

// Sound effect frequencies
const correctSoundFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
const wrongSoundFreqs = [220, 196, 174.61] // A3, G3, F3
const successSoundFreqs = [523.25, 659.25, 783.99, 1046.5] // Success melody

export default function SpellingGameSuite({ onGameComplete, onBackToHome }: SpellingGameSuiteProps = {}) {
  const [currentMode, setCurrentMode] = useState<GameMode>("menu")
  const [wordSource, setWordSource] = useState<WordSource>("letter-count")
  const [selectedLetterCount, setSelectedLetterCount] = useState<LetterCount>(3)
  const [customWords, setCustomWords] = useState<string[]>(() => {
    // Load custom words from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spelling-game-custom-words')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [customWordInput, setCustomWordInput] = useState("")
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [currentWordList, setCurrentWordList] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [isGeneratingWords, setIsGeneratingWords] = useState(false)
  const [aiWords, setAiWords] = useState<string[]>([])

  // Initialize words when component loads
  useEffect(() => {
    console.log('useEffect triggered, wordSource:', wordSource, 'currentWordList.length:', currentWordList.length)
    if (wordSource === "letter-count" && currentWordList.length === 0) {
      console.log('Loading initial words for letter count:', selectedLetterCount)
      handleLetterCountSelect(selectedLetterCount)
    }
  }, [wordSource])

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

  // Text-to-speech function
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleStartGame = () => {
    setCurrentMode("word-selection")
  }

  const handleWordSourceSelect = (source: WordSource) => {
    setWordSource(source)
    if (source === "custom") {
      setAiWords([])
      // Keep custom words when selecting custom source
    } else if (source === "letter-count") {
      setAiWords([])
      // Only clear custom words if user explicitly switches away from custom
      // Don't clear them automatically when returning to the game
    } else if (source === "ai-generated") {
      // Only clear custom words if user explicitly switches away from custom
      // Don't clear them automatically when returning to the game
    }
  }

  const handleLetterCountSelect = (count: LetterCount) => {
    setSelectedLetterCount(count)
    
    if (wordSource === "ai-generated") {
      handleGenerateAIWords(count)
    } else {
      // Get 5 random words from the selected letter count
      const words = WORD_LISTS[count]
      
      // First, remove any duplicates from the word list itself
      const uniqueWords = [...new Set(words)]
      
      // Then shuffle and select 5 unique words
      const shuffled = [...uniqueWords].sort(() => Math.random() - 0.5)
      const selectedWords = shuffled.slice(0, 5)
      
      setCurrentWordList(selectedWords)
    }
  }

  const handleGenerateAIWords = async (count: LetterCount) => {
    setIsGeneratingWords(true)
    try {
      // Try LLM generation first, fallback to local generation
      const result = await generateWords({
        letterCount: count,
        count: 5,
        difficulty: 'medium',
        category: 'general'
      })
      
      if (result.success && result.words.length > 0) {
        setAiWords(result.words)
        setCurrentWordList(result.words)
      } else {
        // Fallback to local generation
        const localResult = generateWordsLocal({
          letterCount: count,
          count: 5,
          difficulty: 'medium',
          category: 'general'
        })
        setAiWords(localResult.words)
        setCurrentWordList(localResult.words)
      }
    } catch (error) {
      console.error('Error generating AI words:', error)
      // Fallback to local generation
      const localResult = generateWordsLocal({
        letterCount: count,
        count: 5,
        difficulty: 'medium',
        category: 'general'
      })
      setAiWords(localResult.words)
      setCurrentWordList(localResult.words)
    } finally {
      setIsGeneratingWords(false)
    }
  }

  // Save custom words to localStorage whenever they change
  const saveCustomWordsToStorage = (words: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spelling-game-custom-words', JSON.stringify(words))
    }
  }

  const handleCustomWordAdd = () => {
    const word = customWordInput.trim().toLowerCase()
    if (word && !customWords.includes(word) && customWords.length < 20) {
      const newCustomWords = [...customWords, word]
      setCustomWords(newCustomWords)
      saveCustomWordsToStorage(newCustomWords)
      setCustomWordInput("")
    }
  }

  const handleCustomWordRemove = (index: number) => {
    const newCustomWords = customWords.filter((_, i) => i !== index)
    setCustomWords(newCustomWords)
    saveCustomWordsToStorage(newCustomWords)
  }

  const handleCustomWordsConfirm = () => {
    if (customWords.length >= 1) {
      // Ensure no duplicates in custom words
      const uniqueCustomWords = [...new Set(customWords)]
      // Use up to 5 words, but allow fewer if that's all the user provided
      setCurrentWordList(uniqueCustomWords.slice(0, Math.min(5, uniqueCustomWords.length)))
      setCurrentMode("game-selection")
    }
  }

  const handleLetterCountConfirm = () => {
    console.log('Confirm button clicked, currentWordList:', currentWordList)
    if (currentWordList.length > 0) {
      setCurrentMode("game-selection")
    } else {
      // If no words loaded, try to load them for the selected letter count
      handleLetterCountSelect(selectedLetterCount)
      setTimeout(() => {
        setCurrentMode("game-selection")
      }, 100)
    }
  }

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
    setCurrentMode("playing")
    setScore(0)
    setGameStartTime(Date.now())
  }

  const handleGameComplete = (finalScore: number) => {
    playSound(successSoundFreqs, true)
    
    if (onGameComplete) {
      onGameComplete(finalScore, 5, {
        mode: "spelling-game-suite",
        gameType: selectedGame,
        wordList: currentWordList,
        completionTime: gameStartTime,
      })
    }

    setTimeout(() => {
      setCurrentMode("menu")
      setScore(0)
      setSelectedGame("")
      setCurrentWordList([])
    }, 3000)
  }

  const resetGame = () => {
    setCurrentMode("menu")
    setScore(0)
    setSelectedGame("")
    setCurrentWordList([])
    // Don't clear custom words - keep them for user to select
    setCustomWordInput("")
    setWordSource("letter-count")
    setSelectedLetterCount(3)
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-300 to-indigo-400 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => (onBackToHome ? onBackToHome() : resetGame())}
              className="bg-white/20 hover:bg-white/30 text-rose-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {onBackToHome ? "Back to Home" : "Back to Menu"}
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-rose-800">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-rose-800 mb-4 font-sans tracking-tight">
                  ✨ Spelling Game Suite
                </h1>
                <p className="text-xl text-rose-700 font-medium">Master spelling with 10 fun games!</p>
                <p className="text-sm text-rose-600 mt-2">Choose your words and game - 5 words per round</p>
              </div>

              <div className="text-center">
                <Button
                  onClick={handleStartGame}
                  className="h-32 text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl px-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">🎮</span>
                    <span className="font-sans">Play Now!</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentMode === "word-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-300 to-indigo-400 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentMode("menu")}
              className="bg-white/20 hover:bg-white/30 text-rose-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Menu
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-rose-800">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-rose-800 mb-4 font-sans">Choose Your Words</h2>
                <p className="text-lg text-rose-700 font-medium">Select how you want to get your spelling words</p>
              </div>

              <div className="space-y-8">
                {/* Word Source Selection */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Word Source</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Button
                      onClick={() => handleWordSourceSelect("letter-count")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        wordSource === "letter-count"
                          ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="h-8 w-8" />
                        <span>By Letter Count</span>
                        <span className="text-sm">(3-10 letters)</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleWordSourceSelect("custom")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        wordSource === "custom"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Edit3 className="h-8 w-8" />
                        <span>Custom Words</span>
                        <span className="text-sm">(Up to 20 words)</span>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleWordSourceSelect("ai-generated")}
                      className={`h-24 text-xl font-bold border-4 transition-all duration-300 ${
                        wordSource === "ai-generated"
                          ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-white shadow-lg scale-105"
                          : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                      }`}
                      variant="outline"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Brain className="h-8 w-8" />
                        <span>AI Generated</span>
                        <span className="text-sm">(Smart words)</span>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* AI Generated Words Selection */}
                {wordSource === "ai-generated" && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Letter Count for AI Words</h3>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                        <Button
                          key={count}
                          onClick={() => handleLetterCountSelect(count as LetterCount)}
                          disabled={isGeneratingWords}
                          className={`h-20 text-xl font-bold border-4 transition-all duration-300 ${
                            selectedLetterCount === count
                              ? "bg-gradient-to-r from-rose-300 to-pink-400 text-white border-white shadow-lg scale-105"
                              : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                          } ${isGeneratingWords ? "opacity-50 cursor-not-allowed" : ""}`}
                          variant="outline"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl">🤖</span>
                            <span>{count} letters</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    {isGeneratingWords && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
                        <div className="flex items-center justify-center gap-3">
                          <Brain className="h-6 w-6 text-rose-600 animate-pulse" />
                          <span className="text-lg font-bold text-rose-800">AI is generating smart words...</span>
                        </div>
                      </div>
                    )}
                    
                    {aiWords.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
                        <p className="text-lg font-bold text-gray-700 mb-2">AI Generated Words:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {aiWords.map((word, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-purple-200 to-pink-200 px-3 py-1 rounded-full text-lg font-medium border-2 border-purple-300"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button
                            onClick={() => setCurrentMode("game-selection")}
                            className="h-16 text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">🎮</span>
                              <span>Play with AI Words!</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Letter Count Selection */}
                {wordSource === "letter-count" && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-6">Choose Letter Count</h3>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                        <Button
                          key={count}
                          onClick={() => handleLetterCountSelect(count as LetterCount)}
                          className={`h-20 text-xl font-bold border-4 transition-all duration-300 ${
                            selectedLetterCount === count
                              ? "bg-gradient-to-r from-rose-300 to-pink-400 text-white border-white shadow-lg scale-105"
                              : "bg-white/20 text-gray-700 border-gray-300 hover:bg-white/30"
                          }`}
                          variant="outline"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl">🔤</span>
                            <span>{count} letters</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button
                        onClick={handleLetterCountConfirm}
                        disabled={false}
                        className="h-16 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <span>Confirm Selection</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Custom Words Input */}
                {wordSource === "custom" && (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-6">Enter Your Words</h3>
                    
                    {/* Previously Saved Custom Words */}
                    {customWords.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-600 mb-4">Previously Saved Words</h4>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {customWords.map((word, index) => (
                            <Button
                              key={index}
                              onClick={() => {
                                if (customWords.length >= 5) {
                                  setCurrentWordList(customWords.slice(0, 5))
                                  setCurrentMode("game-selection")
                                }
                              }}
                              className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border-2 border-rose-300 hover:from-rose-200 hover:to-pink-200 px-4 py-2 rounded-full"
                            >
                              {word}
                            </Button>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Click any word above to use your saved words, or add new words below
                        </p>
                        <div className="border-t border-gray-300 pt-4">
                          <h4 className="text-lg font-semibold text-gray-600 mb-4">Add New Words</h4>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex gap-2 max-w-md mx-auto">
                        <Input
                          value={customWordInput}
                          onChange={(e) => setCustomWordInput(e.target.value)}
                          placeholder="Enter a word..."
                          className="text-lg"
                          onKeyPress={(e) => e.key === 'Enter' && handleCustomWordAdd()}
                        />
                        <Button
                          onClick={handleCustomWordAdd}
                          disabled={!customWordInput.trim() || customWords.length >= 20}
                          className="bg-gradient-to-r from-rose-400 to-pink-500 text-white"
                        >
                          Add
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">Add up to 20 words (need at least 5 to play)</p>
                      
                      {/* Display added words */}
                      {customWords.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {customWords.map((word, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-rose-100 to-pink-100 px-3 py-1 rounded-full border-2 border-rose-300 flex items-center gap-2"
                              >
                                <span className="text-lg font-medium">{word}</span>
                                <button
                                  onClick={() => handleCustomWordRemove(index)}
                                  className="text-red-500 hover:text-red-700 font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {customWords.length}/20 words added
                          </p>
                        </div>
                      )}

                      <div className="mt-6">
                        <Button
                          onClick={handleCustomWordsConfirm}
                          disabled={customWords.length < 1}
                          className="h-16 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <span>Confirm Words ({customWords.length})</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentMode === "game-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-300 to-indigo-400 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentMode("word-selection")}
              className="bg-white/20 hover:bg-white/30 text-rose-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Word Selection
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-rose-800">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-rose-800 mb-4 font-sans">Choose Your Game</h2>
                <p className="text-lg text-rose-700 font-medium">Select a fun way to practice your spelling!</p>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-200">
                  <p className="text-lg font-bold text-gray-700">Your Words:</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {currentWordList.map((word, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-purple-200 to-pink-200 px-3 py-1 rounded-full text-lg font-medium border-2 border-purple-300"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GAME_TYPES.map((game) => (
                  <Button
                    key={game.id}
                    onClick={() => game.implemented ? handleGameSelect(game.id) : null}
                    disabled={!game.implemented}
                    className={`h-32 text-lg font-bold border-4 transition-all duration-300 ${
                      game.implemented 
                        ? `bg-gradient-to-r ${game.color} text-white border-white shadow-lg hover:shadow-xl transform hover:scale-105` 
                        : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    variant="outline"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">{game.emoji}</span>
                      <span className="font-sans">{game.name}</span>
                      <span className="text-sm text-center opacity-90">
                        {game.implemented ? game.description : 'Coming Soon!'}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Playing mode - render individual game components
  if (currentMode === "playing") {
    // Render Spell the Word Game
    if (selectedGame === "spell-the-word") {
      return (
        <SpellTheWordGame
          wordList={currentWordList}
          onGameComplete={handleGameComplete}
          onBackToGames={() => setCurrentMode("game-selection")}
        />
      )
    }

    // Render Type the Word Game
    if (selectedGame === "type-the-word") {
      return (
        <TypeTheWordGame
          wordList={currentWordList}
          onGameComplete={handleGameComplete}
          onBackToGames={() => setCurrentMode("game-selection")}
        />
      )
    }

    // Render Search the Word Game
    if (selectedGame === "search-the-word") {
      return (
        <SearchTheWordGame
          wordList={currentWordList}
          onGameComplete={handleGameComplete}
          onBackToGames={() => setCurrentMode("game-selection")}
        />
      )
    }

    // Render Balloon Pop Game
    if (selectedGame === "balloon-pop") {
      return (
        <BalloonPopGame
          wordList={currentWordList}
          onGameComplete={handleGameComplete}
          onBackToGames={() => setCurrentMode("game-selection")}
        />
      )
    }

    // Render Word Rocket Game
    if (selectedGame === "word-rocket") {
      return (
        <WordRocketGame
          wordList={currentWordList}
          onGameComplete={handleGameComplete}
          onBackToGames={() => setCurrentMode("game-selection")}
        />
      )
    }

    // Render Treasure Hunt Game
    if (selectedGame === "treasure-hunt") {
      return (
        <TreasureHuntGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Render Magic Garden Game
    if (selectedGame === "magic-garden") {
      return (
        <MagicGardenGame
          wordList={currentWordList}
          onGameComplete={handleGameComplete}
          onBackToGames={() => setCurrentMode("game-selection")}
        />
      )
    }

    // Render Typing Race Game
    if (selectedGame === "typing-race") {
      return (
        <TypingRaceGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Render Puzzle Builder Game
    if (selectedGame === "puzzle-builder") {
      return (
        <PuzzleBuilderGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Render Spelling Bee Game
    if (selectedGame === "spelling-bee") {
      return (
        <SpellingBeeGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Render Falling Letters Game
    if (selectedGame === "falling-letters") {
      return (
        <FallingLettersGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Render Memory Match Game
    if (selectedGame === "memory-match") {
      return (
        <MemoryMatchGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Render Monster Munch Game
    if (selectedGame === "monster-munch") {
      return (
        <MonsterMunchGame
          onBackToGames={() => setCurrentMode("game-selection")}
          onBackToHome={onBackToHome}
        />
      )
    }

    // Placeholder for other games
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-300 to-indigo-400 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentMode("game-selection")}
              className="bg-white/20 hover:bg-white/30 text-rose-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Games
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-rose-800">Score: {score}/5</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-rose-800 mb-4">
                  {GAME_TYPES.find(g => g.id === selectedGame)?.name} Game
                </h2>
                <p className="text-lg text-rose-700 mb-6">
                  {GAME_TYPES.find(g => g.id === selectedGame)?.description}
                </p>
                <div className="text-xl text-gray-600">
                  Game implementation coming soon! This will be replaced with the actual game component.
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => handleGameComplete(5)}
                    className="h-16 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎉</span>
                      <span>Complete Game (Demo)</span>
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

  return null
}
