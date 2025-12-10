"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Volume2, Star, Frown } from "lucide-react"
import { teluguRiddles, TeluguRiddle, getWrongAnswers } from "@/lib/telugu-riddles-data"
import { playTeluguTTS } from "@/lib/telugu-tts"

const GOOD_JOB_AUDIO = "/audio/happy_tune.mp3"
const BUZZ_AUDIO = "/audio/buzz_audio.mp3"

interface QuestionData {
  riddle: TeluguRiddle
  choices: string[]
  correctAnswer: string
}

export default function MultipleChoiceGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSadFace, setShowSadFace] = useState(false)

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    // Shuffle riddles
    const shuffled = [...teluguRiddles].sort(() => Math.random() - 0.5)
    
    // Create questions with multiple choices
    const newQuestions = shuffled.map(riddle => {
      const wrongAnswers = getWrongAnswers(riddle, teluguRiddles, 2)
      const allChoices = [riddle.vidupu, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      return {
        riddle,
        choices: allChoices,
        correctAnswer: riddle.vidupu
      }
    })
    
    setQuestions(newQuestions)
  }

  const currentQuestion = questions[currentQuestionIndex]

  const handleBackToMenu = () => {
    window.location.href = "/telugu-riddles"
  }

  const handleRestart = () => {
    generateQuestions()
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1)
      playGoodJobSound()
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    } else {
      playBuzzSound()
      setShowSadFace(true)
      setTimeout(() => setShowSadFace(false), 2000)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Game complete
      const percentage = Math.round((score / questions.length) * 100)
      alert(`🎉 Game Complete!\n\nYou got ${score} out of ${questions.length} riddles correct!\nScore: ${percentage}%`)
      handleRestart()
    }
  }

  const playGoodJobSound = () => {
    try {
      const audio = new Audio(GOOD_JOB_AUDIO)
      audio.play().catch(err => console.log("Audio play failed:", err))
    } catch (error) {
      console.log("Audio error:", error)
    }
  }

  const playBuzzSound = () => {
    try {
      const audio = new Audio(BUZZ_AUDIO)
      audio.play().catch(err => console.log("Audio play failed:", err))
    } catch (error) {
      console.log("Audio error:", error)
    }
  }

  const handlePlayAudio = async (text: string) => {
    try {
      await playTeluguTTS(text)
    } catch (error) {
      console.log("TTS error:", error)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-200 to-pink-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading riddles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 to-pink-400 p-4 relative overflow-hidden">
      {/* Animated Character */}
      <img 
        src="/characters/peacock.png" 
        alt="Peacock" 
        className="absolute bottom-10 right-10 w-32 h-32 md:w-40 md:h-40 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Sad Face Effect */}
      {showSadFace && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-9xl animate-bounce">😢</div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackToMenu}
            className="bg-white/20 hover:bg-white/30 text-red-900 border-2 border-white font-bold"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
          
          <Button
            onClick={handleRestart}
            className="bg-white/20 hover:bg-white/30 text-red-900 border-2 border-white font-bold"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-red-900 mb-2">
          Multiple Choice Game
        </h1>
        <p className="text-2xl text-red-800 font-semibold">
          Choose the correct answer!
        </p>
      </div>

      {/* Score and Progress */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/80 rounded-lg p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-red-900">
            Question {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="text-2xl font-bold text-red-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Score: {score}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Question Card */}
        <Card className="bg-gradient-to-br from-pink-100 to-red-200 border-4 border-white shadow-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4 text-center">
              పొడుపు (Riddle):
            </h2>
            <div className="flex items-center justify-center gap-4">
              <p className="text-3xl text-red-800 text-center leading-relaxed">
                {currentQuestion.riddle.podupu}
              </p>
              <Button
                onClick={() => handlePlayAudio(currentQuestion.riddle.podupu)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3"
                size="sm"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Choices */}
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.choices.map((choice, index) => {
            const isCorrect = choice === currentQuestion.correctAnswer
            const isSelected = choice === selectedAnswer
            
            let cardClass = "bg-white hover:bg-gray-50"
            if (isAnswered) {
              if (isCorrect) {
                cardClass = "bg-green-100 border-green-500 border-4"
              } else if (isSelected && !isCorrect) {
                cardClass = "bg-red-100 border-red-500 border-4"
              }
            } else if (isSelected) {
              cardClass = "bg-blue-100"
            }

            return (
              <Card
                key={index}
                className={`${cardClass} cursor-pointer transition-all duration-300 hover:scale-102 shadow-lg ${
                  isAnswered ? "cursor-not-allowed" : ""
                }`}
                onClick={() => handleAnswerSelect(choice)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl font-bold text-gray-700 bg-white rounded-full w-12 h-12 flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{choice}</p>
                  </div>
                  
                  {isAnswered && (
                    <div className="text-4xl">
                      {isCorrect ? "✅" : isSelected ? "❌" : ""}
                    </div>
                  )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayAudio(choice)
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 ml-4"
                    size="sm"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Explanation (shown after answering) */}
        {isAnswered && (
          <Card className="bg-gradient-to-br from-blue-100 to-purple-200 border-4 border-white shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                💡 Explanation
              </h3>
              <p className="text-xl text-blue-800 text-center mb-4">
                {currentQuestion.riddle.reason}
              </p>
              <p className="text-lg text-blue-700 text-center">
                English: {currentQuestion.riddle.englishAnswer}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg"
              size="lg"
            >
              Next Riddle →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

