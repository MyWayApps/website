"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Play, Sparkles } from "lucide-react"
import { BUILTIN_SENTENCES } from "@/lib/sentences-data"
import { getCustomSentences, addCustomSentence, deleteCustomSentence, type CustomSentence } from "@/lib/custom-sentences"
import { pickUnseen } from "@/lib/question-history"
import JumbledWordsGame from "./jumbled-words-game"
import TypeSentenceGame from "./type-sentence-game"
import ListenSentenceGame from "./listen-sentence-game"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type SuiteMode = "menu" | "sentence-selection" | "game-selection" | "playing"

interface GameData {
  mode: string
  gameType: string
  sentenceList: string[]
  completionTime: number
}

interface EnglishSentencesProps {
  userId?: string
  applicationId?: string
  onGameComplete?: (score: number, maxScore: number, gameData: GameData) => void
  onBackToHome?: () => void
}

const ROUND_SIZE = 5

const GAME_TYPES = [
  {
    id: "jumbled-words",
    name: "Jumbled Words",
    emoji: "🧩",
    description: "Drag the words into the right order to build the sentence!",
    color: "from-teal-200 to-cyan-300",
  },
  {
    id: "type-sentence",
    name: "Type the Sentence",
    emoji: "⌨️",
    description: "Read it, then type it exactly — capitals, spacing and all!",
    color: "from-purple-200 to-pink-300",
  },
  {
    id: "listen-sentence",
    name: "Listen & Type",
    emoji: "🎧",
    description: "Listen carefully, then type the whole sentence correctly!",
    color: "from-orange-200 to-amber-300",
  },
]

export default function EnglishSentences({ userId, applicationId, onGameComplete, onBackToHome }: EnglishSentencesProps = {}) {
  const [currentMode, setCurrentMode] = useState<SuiteMode>("menu")
  const [customSentences, setCustomSentences] = useState<CustomSentence[]>([])
  const [newSentenceInput, setNewSentenceInput] = useState("")
  const [currentSentenceList, setCurrentSentenceList] = useState<string[]>([])
  const [selectedSentences, setSelectedSentences] = useState<Set<string>>(new Set())
  const [selectedGame, setSelectedGame] = useState<string>("")
  const [score, setScore] = useState(0)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [gameTiers, setGameTiers] = useState<Partial<Record<string, MasteryTier>>>({})

  // Custom sentences live in localStorage, so load after mount (SSR has no window).
  useEffect(() => {
    setCustomSentences(getCustomSentences())
  }, [])

  // Per-game-type mastery badges on the game-selection screen — game_data
  // already records which sub-game was played via `gameType`.
  useEffect(() => {
    if (currentMode !== "game-selection" || !userId || !applicationId) return
    let cancelled = false

    const loadTiers = async () => {
      const entries = await Promise.all(
        GAME_TYPES.map(async (game) => {
          const tier = await getActivityMasteryTier(userId, applicationId, `english-sentences:${game.id}`, {
            modeFilter: (gameData) => gameData?.gameType === game.id,
          })
          return [game.id, tier] as const
        }),
      )
      if (!cancelled) setGameTiers(Object.fromEntries(entries))
    }

    loadTiers()
    return () => {
      cancelled = true
    }
  }, [currentMode, userId, applicationId])

  const handleAddSentence = () => {
    const entry = addCustomSentence(newSentenceInput)
    if (entry) {
      setCustomSentences((prev) => [entry, ...prev])
      setNewSentenceInput("")
    }
  }

  const handleDeleteSentence = (id: string) => {
    const deleted = customSentences.find((s) => s.id === id)
    deleteCustomSentence(id)
    setCustomSentences((prev) => prev.filter((s) => s.id !== id))
    if (deleted) {
      setSelectedSentences((prev) => {
        const next = new Set(prev)
        next.delete(deleted.text)
        return next
      })
    }
  }

  const toggleSentenceSelection = (text: string) => {
    setSelectedSentences((prev) => {
      const next = new Set(prev)
      if (next.has(text)) next.delete(text)
      else next.add(text)
      return next
    })
  }

  const handleSelectOnlyMine = () => {
    setSelectedSentences(new Set(customSentences.map((s) => s.text)))
  }

  const handleClearSelection = () => {
    setSelectedSentences(new Set())
  }

  const shuffle = <T,>(items: T[]): T[] => {
    const result = [...items]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  const pickSentenceRound = (): string[] => {
    const pool = [...new Set([...BUILTIN_SENTENCES, ...customSentences.map((s) => s.text)])]
    const picked: string[] = []
    let remaining = [...pool]
    const pickCount = Math.min(ROUND_SIZE, pool.length)
    for (let i = 0; i < pickCount; i++) {
      const sentence = pickUnseen("english-sentences", remaining, (s) => s)
      picked.push(sentence)
      remaining = remaining.filter((s) => s !== sentence)
    }
    return picked
  }

  // "Play Now" jumps straight to picking a game with an auto-picked round —
  // adding/browsing sentences is an optional side trip, not a required step.
  const handlePlayNow = () => {
    setCurrentSentenceList(pickSentenceRound())
    setCurrentMode("game-selection")
  }

  const handleConfirmSentences = () => {
    setCurrentSentenceList(selectedSentences.size > 0 ? shuffle(Array.from(selectedSentences)) : pickSentenceRound())
    setCurrentMode("game-selection")
  }

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
    setCurrentMode("playing")
    setScore(0)
    setGameStartTime(Date.now())
  }

  const handleGameComplete = (finalScore: number) => {
    if (onGameComplete) {
      onGameComplete(finalScore, currentSentenceList.length, {
        mode: "english-sentences",
        gameType: selectedGame,
        sentenceList: currentSentenceList,
        completionTime: gameStartTime,
      })
    }

    setTimeout(() => {
      setCurrentMode("menu")
      setScore(0)
      setSelectedGame("")
      setCurrentSentenceList([])
    }, 3000)
  }

  const resetGame = () => {
    setCurrentMode("menu")
    setScore(0)
    setSelectedGame("")
    setCurrentSentenceList([])
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400 p-4 relative overflow-hidden">
        <img
          src="/characters/monkey-1.png"
          alt="Monkey"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => (onBackToHome ? onBackToHome() : resetGame())}
              className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {onBackToHome ? "Back to Home" : "Back to Menu"}
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-blue-900">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-blue-900 mb-4 font-sans tracking-tight">
                  📝 English Sentences
                </h1>
                <p className="text-xl text-blue-800 font-medium">Build, type, and listen to sentences!</p>
              </div>

              <div className="text-center space-y-6">
                <Button
                  onClick={handlePlayNow}
                  className="h-48 w-48 rounded-3xl text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">🎮</span>
                    <span className="font-sans">Play Now!</span>
                  </div>
                </Button>

                <div>
                  <Button
                    onClick={() => setCurrentMode("sentence-selection")}
                    className="h-16 text-xl bg-gradient-to-r from-amber-300 to-orange-400 hover:from-amber-400 hover:to-orange-500 text-orange-950 border-4 border-white font-bold rounded-2xl px-10 py-4 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📝</span>
                      <span>Add / Manage Sentences</span>
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

  if (currentMode === "sentence-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400 p-4 relative overflow-hidden">
        <img
          src="/characters/monkey-1.png"
          alt="Monkey"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentMode("menu")}
              className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Menu
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-900 mb-4 font-sans">Add / Manage Sentences</h2>
                <p className="text-lg text-blue-800 font-medium">
                  Add your own sentences, then check the ones you want to practice. Leave nothing checked (or just hit
                  Play Now from the menu) and every round auto-picks 5 sentences you haven't seen recently.
                </p>
              </div>

              <div className="space-y-10">
                {/* Add a custom sentence */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Add Your Own Sentence</h3>
                  <div className="flex gap-2 max-w-xl mx-auto">
                    <Input
                      value={newSentenceInput}
                      onChange={(e) => setNewSentenceInput(e.target.value)}
                      placeholder="Type a full sentence..."
                      className="text-lg rounded-2xl"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSentence()}
                    />
                    <Button
                      onClick={handleAddSentence}
                      disabled={!newSentenceInput.trim()}
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl"
                    >
                      Add
                    </Button>
                  </div>

                  {customSentences.length > 0 && (
                    <div className="max-w-xl mx-auto mt-6 space-y-2">
                      {customSentences.map((s) => (
                        <label
                          key={s.id}
                          className="flex items-center justify-between gap-3 bg-blue-50 border-2 border-blue-200 rounded-2xl px-4 py-2 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              className="h-5 w-5 shrink-0 accent-blue-600"
                              checked={selectedSentences.has(s.text)}
                              onChange={() => toggleSentenceSelection(s.text)}
                            />
                            <div>
                              <p className="text-base font-medium text-gray-800">{s.text}</p>
                              <p className="text-xs text-gray-500">
                                Added{" "}
                                {new Date(s.createdAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleDeleteSentence(s.id)
                            }}
                            className="text-red-500 hover:text-red-700 font-bold shrink-0"
                            aria-label="Delete this sentence"
                          >
                            🗑
                          </button>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ready-made sentences */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Ready-Made Sentences</h3>
                  <div className="max-w-xl mx-auto space-y-2">
                    {BUILTIN_SENTENCES.map((s) => (
                      <label
                        key={s}
                        className="flex items-center gap-3 bg-white/70 text-gray-800 px-4 py-2 rounded-2xl border-2 border-gray-200 text-left text-base font-medium cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 shrink-0 accent-blue-600"
                          checked={selectedSentences.has(s)}
                          onChange={() => toggleSentenceSelection(s)}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {customSentences.length > 0 && (
                      <Button
                        onClick={handleSelectOnlyMine}
                        variant="outline"
                        className="rounded-2xl border-2 border-blue-300 text-blue-800 font-semibold"
                      >
                        Select Only My Sentences
                      </Button>
                    )}
                    {selectedSentences.size > 0 && (
                      <Button
                        onClick={handleClearSelection}
                        variant="outline"
                        className="rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold"
                      >
                        Clear Selection
                      </Button>
                    )}
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    {selectedSentences.size > 0
                      ? `${selectedSentences.size} sentence${selectedSentences.size === 1 ? "" : "s"} selected — these will be used instead of an auto-picked round.`
                      : "No sentences selected — a round of 5 will be auto-picked."}
                  </p>
                  <Button
                    onClick={handleConfirmSentences}
                    className="h-16 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-6 w-6" />
                      <span>Start Playing</span>
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

  if (currentMode === "game-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400 p-4 relative overflow-hidden">
        <img
          src="/characters/monkey-1.png"
          alt="Monkey"
          className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
        />
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setCurrentMode("menu")}
              className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Menu
            </Button>

            <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <Star className="h-6 w-6 text-yellow-600" />
              <span className="text-xl font-bold text-blue-900">Score: {score}</span>
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-blue-900 mb-4 font-sans">Choose Your Game</h2>
                <p className="text-lg text-blue-800 font-medium">Select a fun way to practice your sentences!</p>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-200">
                  <p className="text-lg font-bold text-gray-700">Your Sentences:</p>
                  <div className="mt-2 space-y-1">
                    {currentSentenceList.map((sentence, index) => (
                      <p key={index} className="text-sm font-medium text-purple-800">
                        {sentence}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GAME_TYPES.map((game) => (
                  <Card
                    key={game.id}
                    className={`group transition-all duration-300 bg-gradient-to-br ${game.color} border-4 border-white shadow-lg hover:scale-105 hover:shadow-xl cursor-pointer`}
                    onClick={() => handleGameSelect(game.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="text-5xl mb-1 group-hover:animate-bounce">{game.emoji}</div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-gray-800 font-sans">{game.name}</h3>
                          <p className="text-sm text-gray-700 min-h-[2.5rem]">{game.description}</p>
                        </div>
                        {gameTiers[game.id] && <MasteryBadge tier={gameTiers[game.id]!} showLabel />}
                        <Button
                          className="w-full bg-white/30 hover:bg-white/40 text-gray-800 font-bold border-2 border-white/60 hover:border-white transition-all duration-300"
                          variant="outline"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Playing mode
  if (selectedGame === "jumbled-words") {
    return (
      <JumbledWordsGame
        sentenceList={currentSentenceList}
        onGameComplete={handleGameComplete}
        onBackToGames={() => setCurrentMode("game-selection")}
      />
    )
  }

  if (selectedGame === "type-sentence") {
    return (
      <TypeSentenceGame
        sentenceList={currentSentenceList}
        onGameComplete={handleGameComplete}
        onBackToGames={() => setCurrentMode("game-selection")}
      />
    )
  }

  if (selectedGame === "listen-sentence") {
    return (
      <ListenSentenceGame
        sentenceList={currentSentenceList}
        onGameComplete={handleGameComplete}
        onBackToGames={() => setCurrentMode("game-selection")}
      />
    )
  }

  return null
}
