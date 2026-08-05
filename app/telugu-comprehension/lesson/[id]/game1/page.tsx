"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, Star } from "lucide-react"
import { getLessonById } from "@/lib/telugu-comprehension-data"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"

export default function Game1Page() {
  const params = useParams()
  const lessonId = parseInt(params.id as string)
  const lesson = getLessonById(lessonId)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSadFace, setShowSadFace] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)

  const handleBackToLesson = () => {
    window.location.href = `/telugu-comprehension/lesson/${lessonId}`
  }

  const handlePlayAudio = async (text: string) => {
    if (isPlayingTTS) return
    
    try {
      setIsPlayingTTS(true)
      await playTeluguTTS(text)
    } catch (error) {
      console.log("TTS error:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    const currentQuestion = lesson!.game1Questions[currentQuestionIndex]
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1)
      playCorrectSound()
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    } else {
      playWrongSound()
      setShowSadFace(true)
      setTimeout(() => setShowSadFace(false), 2000)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < lesson!.game1Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Game complete
      const percentage = Math.round((score / lesson!.game1Questions.length) * 100)
      alert(`🎉 Game Complete!\n\nYou got ${score} out of ${lesson!.game1Questions.length} correct!\nScore: ${percentage}%`)
      handleBackToLesson()
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-emerald-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Lesson not found</div>
      </div>
    )
  }

  const currentQuestion = lesson.game1Questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-emerald-400 p-4 relative overflow-hidden">
      {/* Animated Character */}
      <img 
        src={lesson.image}
        alt={lesson.title} 
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
        <Button
          onClick={handleBackToLesson}
          className="bg-white/20 hover:bg-white/30 text-green-900 border-2 border-white font-bold"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Lesson
        </Button>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-green-900 mb-2">
          {lesson.teluguTitle} - Question Set 1
        </h1>
        <p className="text-xl text-green-800 font-semibold">
          Multiple Choice Questions
        </p>
      </div>

      {/* Score and Progress */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/80 rounded-lg p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-900">
            Question {currentQuestionIndex + 1} / {lesson.game1Questions.length}
          </div>
          <div className="text-2xl font-bold text-green-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Score: {score}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Question Card */}
        <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-white shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-green-900 flex-1">
                {currentQuestion.question}
              </h2>
              <Button
                onClick={() => handlePlayAudio(currentQuestion.question)}
                disabled={isPlayingTTS}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 disabled:opacity-50"
                size="sm"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctAnswer
            const isSelected = option === selectedAnswer
            
            let cardClass = "bg-white hover:bg-gray-50"
            if (isAnswered) {
              if (isCorrect) {
                cardClass = "bg-green-100 border-green-500 border-4"
              } else if (isSelected && !isCorrect) {
                cardClass = "bg-red-100 border-red-500 border-4"
              }
            }

            return (
              <Card
                key={index}
                className={`${cardClass} cursor-pointer transition-all duration-300 hover:scale-102 shadow-lg ${
                  isAnswered ? "cursor-not-allowed" : ""
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl font-bold text-gray-700 bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{option}</p>
                  </div>
                  
                  {isAnswered && (
                    <div className="text-4xl">
                      {isCorrect ? "✅" : isSelected ? "❌" : ""}
                    </div>
                  )}
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlayAudio(option)
                    }}
                    disabled={isPlayingTTS}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 ml-4 disabled:opacity-50"
                    size="sm"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg"
              size="lg"
            >
              {currentQuestionIndex < lesson.game1Questions.length - 1 ? "Next Question →" : "Complete Game 🎉"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

