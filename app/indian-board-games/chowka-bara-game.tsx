"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, RotateCcw } from "lucide-react"
import { playCorrectSound } from "@/lib/feedback-audio"
import {
  GRID_SIZE,
  PATH_CELLS,
  FINISH_POSITION,
  createInitialTokens,
  cellForToken,
  rollDice,
  isTokenFinished,
  moveToken,
  pickComputerToken,
  hasPlayerWon,
  type PlayerId,
  type ChowkaBaraToken,
} from "@/lib/chowka-bara-data"

interface ChowkaBaraGameProps {
  onBackToModes: () => void
}

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]

const PLAYER_COLOR: Record<PlayerId, string> = {
  child: "bg-blue-500 border-blue-700",
  computer: "bg-rose-500 border-rose-700",
}

const HOW_TO_PLAY_STEPS = [
  { emoji: "🎲", text: "Roll the dice to get a number." },
  { emoji: "👆", text: "Tap a glowing token to move it." },
  { emoji: "🏁", text: "Race all 4 tokens to 🏠 Home." },
  { emoji: "🏆", text: "First to get all tokens home wins!" },
]

export default function ChowkaBaraGame({ onBackToModes }: ChowkaBaraGameProps) {
  const [tokens, setTokens] = useState<Record<PlayerId, ChowkaBaraToken[]>>({
    child: createInitialTokens(),
    computer: createInitialTokens(),
  })
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>("child")
  const [diceValue, setDiceValue] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [hasRolled, setHasRolled] = useState(false)
  const [winner, setWinner] = useState<PlayerId | null>(null)
  const [message, setMessage] = useState("Your turn! Tap Throw Dice.")
  const [showHowTo, setShowHowTo] = useState(false)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  // Win detection is a pure derived effect — decoupled from whichever move triggered it.
  useEffect(() => {
    if (winner) return
    if (hasPlayerWon(tokens.child)) setWinner("child")
    else if (hasPlayerWon(tokens.computer)) setWinner("computer")
  }, [tokens, winner])

  // Computer's automated turn.
  useEffect(() => {
    if (currentPlayer !== "computer" || winner) return
    setMessage("Computer's turn...")

    const rollTimeout = setTimeout(() => {
      const diceVal = rollDice()
      setDiceValue(diceVal)

      const moveTimeout = setTimeout(() => {
        setTokens((prev) => {
          const token = pickComputerToken(prev.computer, diceVal)
          if (!token) return prev
          const moved = moveToken(token, diceVal)
          return { ...prev, computer: prev.computer.map((t) => (t.id === token.id ? moved : t)) }
        })
        setDiceValue(null)
        setCurrentPlayer("child")
        setMessage("Your turn! Tap Throw Dice.")
      }, 800)

      return () => clearTimeout(moveTimeout)
    }, 900)

    return () => clearTimeout(rollTimeout)
  }, [currentPlayer, winner])

  const handleThrowDice = () => {
    if (isRolling || hasRolled || winner || currentPlayer !== "child") return
    setIsRolling(true)
    let ticks = 0
    const interval = setInterval(() => {
      setDiceValue(1 + Math.floor(Math.random() * 6))
      ticks++
      if (ticks > 8) {
        clearInterval(interval)
        const final = rollDice()
        setDiceValue(final)
        setIsRolling(false)
        setHasRolled(true)
        setMessage(`You rolled a ${final}! Tap a glowing token to move it.`)
      }
    }, 80)
  }

  const handleTokenClick = (tokenId: number) => {
    if (currentPlayer !== "child" || !hasRolled || diceValue === null || winner) return
    const token = tokens.child.find((t) => t.id === tokenId)
    if (!token || isTokenFinished(token)) return

    const moved = moveToken(token, diceValue)
    playCorrectSound()
    setTokens((prev) => ({ ...prev, child: prev.child.map((t) => (t.id === tokenId ? moved : t)) }))
    setHasRolled(false)
    setDiceValue(null)
    setMessage(isTokenFinished(moved) ? "You reached home! 🎉" : "Great move!")
    setCurrentPlayer("computer")
  }

  const handleRestart = () => {
    setTokens({ child: createInitialTokens(), computer: createInitialTokens() })
    setCurrentPlayer("child")
    setDiceValue(null)
    setIsRolling(false)
    setHasRolled(false)
    setWinner(null)
    setMessage("Your turn! Tap Throw Dice.")
  }

  // Group tokens by the cell they currently occupy, so multiple tokens sharing a cell render together.
  const cellTokens = new Map<string, { player: PlayerId; token: ChowkaBaraToken }[]>()
  ;(["child", "computer"] as PlayerId[]).forEach((player) => {
    tokens[player].forEach((token) => {
      const cell = cellForToken(player, token.position)
      const key = `${cell.row},${cell.col}`
      const list = cellTokens.get(key) ?? []
      list.push({ player, token })
      cellTokens.set(key, list)
    })
  })

  if (!hasSeenIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-5xl mb-2">🎲</div>
            <h2 className="text-3xl font-bold text-orange-700 mb-2">How to Play</h2>
            {HOW_TO_PLAY_STEPS.map((step, i) => (
              <p key={i} className="text-lg text-gray-700">
                {step.emoji} {step.text}
              </p>
            ))}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={() => setHasSeenIntro(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl px-10 py-4 text-xl"
              >
                Got it!
              </Button>
              <Button
                onClick={onBackToModes}
                className="bg-white/50 hover:bg-white/70 text-gray-800 border-2 border-gray-200 font-bold rounded-2xl px-8 py-4"
                variant="outline"
              >
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 p-4 flex items-center justify-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-lg w-full">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">{winner === "child" ? "🏆" : "🤖"}</div>
            <h2 className="text-4xl font-bold text-orange-700 mb-4">{winner === "child" ? "You Won!" : "Computer Won!"}</h2>
            <p className="text-xl text-gray-700 mb-6">
              {winner === "child" ? "All your tokens made it home!" : "Better luck next time — try again!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRestart} className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-2xl px-8 py-4">
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={onBackToModes}
                className="bg-white/50 hover:bg-white/70 text-gray-800 border-2 border-gray-200 font-bold rounded-2xl px-8 py-4"
                variant="outline"
              >
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>
          <Button
            onClick={() => setShowHowTo(true)}
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold px-4 py-3"
            variant="outline"
          >
            <HelpCircle className="mr-2 h-5 w-5" />
            How to Play
          </Button>
        </div>

        {/* Turn message + dice controls in one compact panel, above the board so they're visible without scrolling. */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-orange-700 mb-2">🎲 Chowka Bara</h1>
              <p className={`text-xl font-bold ${currentPlayer === "child" ? "text-blue-600" : "text-rose-600"}`}>{message}</p>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="text-6xl w-16 text-center">{diceValue ? DICE_FACES[diceValue - 1] : "❔"}</div>
              <Button
                onClick={handleThrowDice}
                disabled={isRolling || hasRolled || currentPlayer !== "child"}
                className="h-20 px-10 text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                🎲 Throw Dice
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-6 mb-6 text-sm font-bold">
          <span className="flex items-center gap-2 text-blue-700">
            <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-700 inline-block" /> You
          </span>
          <span className="flex items-center gap-2 text-rose-700">
            <span className="w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-700 inline-block" /> Computer
          </span>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 mb-6">
          <CardContent className="p-4 sm:p-6">
            <div
              className="grid gap-1 mx-auto bg-amber-50 rounded-2xl p-2 border-4 border-amber-800/30"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                maxWidth: "480px",
                aspectRatio: "1 / 1",
              }}
            >
              {PATH_CELLS.map((cell) => {
                const occupants = cellTokens.get(cell.key) ?? []
                return (
                  <div
                    key={cell.key}
                    style={{ gridColumn: cell.col + 1, gridRow: cell.row + 1 }}
                    className={`rounded-lg border-2 flex items-center justify-center flex-wrap gap-0.5 p-0.5 ${
                      cell.kind === "home"
                        ? "bg-yellow-300 border-yellow-600"
                        : cell.kind === "stretch-child"
                        ? "bg-blue-100 border-blue-400"
                        : cell.kind === "stretch-computer"
                        ? "bg-rose-100 border-rose-400"
                        : "bg-white border-amber-300"
                    }`}
                  >
                    {cell.kind === "home" && occupants.length === 0 && <span className="text-lg">🏠</span>}
                    {occupants.map(({ player, token }) => {
                      const canMove = player === "child" && currentPlayer === "child" && hasRolled && !winner
                      return (
                        <button
                          key={`${player}-${token.id}`}
                          onClick={() => canMove && handleTokenClick(token.id)}
                          disabled={!canMove}
                          className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-2 ${PLAYER_COLOR[player]} ${
                            canMove ? "animate-pulse ring-2 ring-yellow-300 cursor-pointer scale-110" : ""
                          }`}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {showHowTo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHowTo(false)}>
          <Card className="bg-white max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-bold text-orange-700 mb-4">How to Play 🎲</h3>
              <p className="text-lg">1️⃣ Tap "Throw Dice" to roll.</p>
              <p className="text-lg">2️⃣ Tap a glowing blue token to move it.</p>
              <p className="text-lg">3️⃣ Race all 4 tokens around the board to 🏠 Home.</p>
              <p className="text-lg">4️⃣ First to get all tokens home wins!</p>
              <Button onClick={() => setShowHowTo(false)} className="bg-orange-500 text-white font-bold rounded-2xl px-8 py-3 mt-2">
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
