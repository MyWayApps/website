"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2 } from "lucide-react"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { speakSentence } from "@/lib/sentence-audio"

interface JumbledWordsGameProps {
  sentenceList: string[]
  onGameComplete: (score: number) => void
  onBackToGames: () => void
}

interface Token {
  id: number
  text: string
}

function tokenize(sentence: string): string[] {
  return sentence.trim().split(/\s+/)
}

function shuffleTokens(words: string[]): Token[] {
  const tokens = words.map((text, id) => ({ id, text }))
  // Re-shuffle if we happen to land on the original order (common with short sentences).
  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = tokens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tokens[i], tokens[j]] = [tokens[j], tokens[i]]
    }
    if (tokens.length < 2 || tokens.some((t, i) => t.id !== i)) break
  }
  return tokens
}

export default function JumbledWordsGame({ sentenceList, onGameComplete, onBackToGames }: JumbledWordsGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [bank, setBank] = useState<Token[]>([])
  const [built, setBuilt] = useState<Token[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [draggedTokenId, setDraggedTokenId] = useState<number | null>(null)

  const currentSentence = sentenceList[currentIndex] || ""

  useEffect(() => {
    if (currentSentence) {
      setBank(shuffleTokens(tokenize(currentSentence)))
      setBuilt([])
      setShowFeedback(false)
    }
  }, [currentIndex, sentenceList])

  const addToBuilt = (token: Token) => {
    if (showFeedback) return
    setBank((prev) => prev.filter((t) => t.id !== token.id))
    setBuilt((prev) => [...prev, token])
  }

  const removeFromBuilt = (token: Token) => {
    if (showFeedback) return
    setBuilt((prev) => prev.filter((t) => t.id !== token.id))
    setBank((prev) => [...prev, token])
  }

  // Auto-check once every word has been placed.
  useEffect(() => {
    const totalWords = tokenize(currentSentence).length
    if (totalWords > 0 && built.length === totalWords && !showFeedback) {
      checkAnswer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built])

  const checkAnswer = () => {
    const attempt = built.map((t) => t.text).join(" ")
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
          onGameComplete(score + 1)
        }
      }, 3000)
    } else {
      playWrongSound()
      setTimeout(() => setShowFeedback(false), 1800)
    }
  }

  const handleBankDragStart = (token: Token) => setDraggedTokenId(token.id)
  const handleBuiltDragStart = (token: Token) => setDraggedTokenId(token.id)

  const handleDropOnBuilt = (e: React.DragEvent) => {
    e.preventDefault()
    const token = bank.find((t) => t.id === draggedTokenId)
    if (token) addToBuilt(token)
    setDraggedTokenId(null)
  }

  const handleDropOnBank = (e: React.DragEvent) => {
    e.preventDefault()
    const token = built.find((t) => t.id === draggedTokenId)
    if (token) removeFromBuilt(token)
    setDraggedTokenId(null)
  }

  const allowDrop = (e: React.DragEvent) => e.preventDefault()

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-teal-600 mb-4">Wonderful!</h2>
            <p className="text-2xl text-gray-700 mb-4">You built every sentence!</p>
            <p className="text-xl text-cyan-600 mb-6">Final Score: {score}/{sentenceList.length}</p>
            <div className="text-lg text-gray-500">Returning to games...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToGames}
            className="bg-white/20 hover:bg-white/30 text-teal-800 border-2 border-white font-bold text-lg px-6 py-3"
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
              <h2 className="text-4xl font-bold text-teal-700 mb-2">🧩 Jumbled Words</h2>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg text-teal-600">Drag the words into the right order to build the sentence!</p>
                <button
                  onClick={() => speakSentence(currentSentence)}
                  aria-label="Listen to the sentence"
                  className="text-teal-600 hover:text-teal-800 hover:scale-110 transition-transform"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Build area */}
            <div
              onDragOver={allowDrop}
              onDrop={handleDropOnBuilt}
              className="min-h-[5rem] flex flex-wrap content-start gap-3 mb-6 p-4 rounded-2xl border-4 border-dashed border-teal-300 bg-teal-50"
            >
              {built.length === 0 && (
                <span className="text-teal-400 font-medium m-auto">Drag words here to build your sentence...</span>
              )}
              {built.map((token) => (
                <div
                  key={token.id}
                  draggable={!showFeedback}
                  onDragStart={() => handleBuiltDragStart(token)}
                  onClick={() => removeFromBuilt(token)}
                  className="cursor-pointer select-none bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold text-lg px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  {token.text}
                </div>
              ))}
            </div>

            {/* Word bank */}
            <div
              onDragOver={allowDrop}
              onDrop={handleDropOnBank}
              className="min-h-[5rem] flex flex-wrap justify-center gap-3 mb-8 p-4 rounded-2xl border-4 border-white bg-white/60"
            >
              {bank.map((token) => (
                <div
                  key={token.id}
                  draggable={!showFeedback}
                  onDragStart={() => handleBankDragStart(token)}
                  onClick={() => addToBuilt(token)}
                  className="cursor-pointer select-none bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-bold text-lg px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  {token.text}
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mb-6">
              Tip: tap or drag a word to move it — tap a word in your sentence to send it back.
            </p>

            {showFeedback && (
              <div
                className={`text-center p-6 rounded-2xl ${
                  isCorrect ? "bg-green-100 border-4 border-green-300" : "bg-red-100 border-4 border-red-300"
                }`}
              >
                <div className={`text-3xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"} mb-2`}>
                  {isCorrect ? "🎉 Perfect!" : "🤔 Not Quite!"}
                </div>
                <div className="text-xl font-medium text-gray-700">
                  {isCorrect ? "That's the right order!" : "The word order isn't right yet — keep trying!"}
                </div>
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
                    index < currentIndex ? "bg-green-500" : index === currentIndex ? "bg-teal-500 scale-125" : "bg-gray-300"
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
