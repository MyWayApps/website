"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { getVottuluByCategory, getCategoryLabel, VottuluCategory } from "@/lib/telugu-vottulu-data"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { findOrCreateUser, getApplicationByName, testConnection } from "@/lib/database-supabase"
import type { User, Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

export default function MatchVottuGame() {
  const params = useParams()
  const category = (params.category as VottuluCategory) || "different-shapes"
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "wrong" | "question-complete" | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [matchedPairs, setMatchedPairs] = useState<Record<string, any>>({})
  const [showConfetti, setShowConfetti] = useState(false)

  // Scoring/persistence
  const [user, setUser] = useState<User | null>(null)
  const [app, setApp] = useState<Application | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  const categoryLabel = getCategoryLabel(category)

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
        const application = await getApplicationByName("Telugu Vottulu")
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

  // Generate 5 questions with matching pairs
  const generateQuestions = () => {
    const vottuluData = getVottuluByCategory(category)
    const questions = []
    
    for (let i = 0; i < 5; i++) {
      // Select 3 random items for questions 1-3, 5 for questions 4-5
      const numPairs = i < 3 ? 3 : 5
      const shuffledItems = [...vottuluData].sort(() => Math.random() - 0.5).slice(0, numPairs)
      
      // Create left side options (letters)
      const leftOptions = shuffledItems.map((item, idx) => ({
        id: `left-${item.letter}-${idx}`,
        text: item.letter,
        letter: item.letter,
        vottu: item.vottu,
        description: item.description
      }))
      
      // Create right side answers (vottulu - correct + wrong options, jumbled)
      const correctAnswers = shuffledItems.map((item, idx) => ({
        id: `right-${item.letter}-${idx}`,
        text: item.vottu,
        letter: item.letter,
        vottu: item.vottu,
        description: item.description
      }))
      
      // Add wrong options (2-3 extra wrong answers)
      const remainingItems = vottuluData.filter(item => 
        !shuffledItems.some(selected => selected.letter === item.letter)
      )
      const numWrongOptions = numPairs === 3 ? 2 : 3
      const wrongAnswers = remainingItems
        .sort(() => Math.random() - 0.5)
        .slice(0, numWrongOptions)
        .map((item, idx) => ({
          id: `wrong-${item.letter}-${idx}`,
          text: item.vottu,
          letter: item.letter,
          vottu: item.vottu,
          description: item.description
        }))
      
      // Combine and shuffle all answers
      const allAnswers = [...correctAnswers, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      questions.push({
        leftOptions,
        rightAnswers: allAnswers
      })
    }
    
    return questions
  }

  // Initialize questions
  useEffect(() => {
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
    setIsLoading(false)
    setMatchedPairs({})
    setShowConfetti(false)
  }, [category])

  // Reset state when question changes
  useEffect(() => {
    if (questions[currentQuestion]) {
      setMatchedPairs({})
      setShowResult(null)
      setShowConfetti(false)
      setDraggedItem(null)
    }
  }, [currentQuestion, questions])

  const currentQ = questions[currentQuestion]

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, answer: any) => {
    setDraggedItem(answer)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop on left option
  const handleDropOnLeft = (e: React.DragEvent, leftOption: any) => {
    e.preventDefault()
    
    if (draggedItem && !matchedPairs[leftOption.id]) {
      const newMatchedPairs: Record<string, any> = { ...matchedPairs, [leftOption.id]: draggedItem }
      setMatchedPairs(newMatchedPairs)
      
      // Check if all pairs are matched, then validate
      if (Object.keys(newMatchedPairs).length === currentQ.leftOptions.length) {
        const allCorrect = currentQ.leftOptions.every((option: any) => {
          const matchedAnswer = newMatchedPairs[option.id as string]
          return matchedAnswer && option.letter === matchedAnswer.letter
        })
        
        if (allCorrect) {
          const newScore = score + 1
          setScore(newScore)
          setShowResult("question-complete")
          setShowConfetti(true)
          playCorrectSound()
          setTimeout(() => {
            setShowConfetti(false)
            if (currentQuestion < 4) {
              setCurrentQuestion(currentQuestion + 1)
            } else {
              setGameOver(true)
              if (user && app) {
                saveGameScore({
                  userId: user.id,
                  applicationId: app.id,
                  score: newScore,
                  maxScore: 5,
                  subject: "Telugu",
                  isConnected,
                  gameData: { mode: "match", category },
                })
                  .then(() =>
                    getActivityMasteryTier(user.id, app.id, `telugu-vottulu:match:${category}`)
                      .then(setMasteryTier)
                      .catch((error) => console.error("Error fetching Telugu Vottulu mastery tier:", error)),
                  )
                  .catch((error) => console.error("Error saving Telugu Vottulu score:", error))
              }
            }
          }, 3000)
        } else {
          setShowResult("wrong")
          playWrongSound()
          const updatedPairs = { ...matchedPairs }
          delete updatedPairs[leftOption.id]
          setMatchedPairs(updatedPairs)
          setTimeout(() => {
            setShowResult(null)
          }, 1500)
        }
      }
    }
    
    setDraggedItem(null)
  }

  const handleBackToMatch = () => {
    window.location.href = "/telugu-vottulu/learn/match"
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setShowResult(null)
    setMatchedPairs({})
    setShowConfetti(false)
    setDraggedItem(null)
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
  }

  if (isLoading || !currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-pink-800 font-bold">Loading...</div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center">
        <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-pink-800 mb-4">Game Over!</h1>
            <p className="text-2xl text-pink-600 mb-6">Your Score: {score} / 5</p>
            {masteryTier && (
              <div className="mb-6 flex justify-center">
                <MasteryBadge tier={masteryTier} showLabel />
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-2 border-pink-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={handleBackToMatch}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500 p-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToMatch}
          className="bg-white/20 hover:bg-white/30 text-pink-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Selection
        </Button>
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-900 mb-2">
          {categoryLabel.telugu}
        </h1>
        <p className="text-xl text-pink-700">
          Question {currentQuestion + 1} of 5 | Score: {score}
        </p>
      </div>

      {/* Game Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Instructions */}
            <p className="text-lg text-pink-700 mb-6">
              Drag the vottulu from the right to match with the letters on the left
            </p>

            {/* Game Layout */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Side - Options (Letters) */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-pink-800 text-center mb-4">Letters</h3>
                {currentQ.leftOptions.map((option: any) => (
                  <div
                    key={option.id}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-300 ${
                      matchedPairs[option.id]
                        ? 'border-yellow-500 bg-yellow-100 text-yellow-800'
                        : 'border-dashed border-pink-300 bg-pink-50 text-pink-600'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnLeft(e, option)}
                  >
                    <div className="text-4xl font-bold">
                      {matchedPairs[option.id] 
                        ? `${option.text} = ${matchedPairs[option.id].text}`
                        : option.text
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side - Answers (Vottulu) */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-pink-800 text-center mb-4">Vottulu</h3>
                {currentQ.rightAnswers.map((answer: any) => {
                  const isMatched = Object.values(matchedPairs).some(pair => pair.id === answer.id)
                  return (
                    <div
                      key={answer.id}
                      draggable={!isMatched}
                      onDragStart={(e) => handleDragStart(e, answer)}
                      className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 ${
                        isMatched
                          ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                          : 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200 hover:border-green-500'
                      }`}
                    >
                      <div className="text-4xl font-bold">
                        {answer.text}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="mb-6">
                {showResult === "question-complete" ? (
                  <div className="flex items-center justify-center text-yellow-600 text-3xl font-bold">
                    <CheckCircle className="mr-2 h-10 w-10" />
                    Excellent! Question Complete! 🎉
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-red-600 text-2xl font-bold">
                    <XCircle className="mr-2 h-8 w-8" />
                    Wrong! Try Again!
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'][Math.floor(Math.random() * 10)]
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
