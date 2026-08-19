"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, Star, RotateCcw } from "lucide-react"
import { getLessonById } from "@/lib/telugu-comprehension-data"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { useCurrentUser } from "@/hooks/use-current-user"
import { playCorrectSound, playWrongSound } from "@/lib/feedback-audio"
import { romanize } from "@/lib/transliteration"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

export default function Game2Page() {
  const params = useParams()
  const lessonId = parseInt(params.id as string)
  const lesson = getLessonById(lessonId)
  const { user, isConnected } = useCurrentUser()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSadFace, setShowSadFace] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

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

    const currentQuestion = lesson!.game2Questions[currentQuestionIndex]
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

  const handleNext = async () => {
    if (currentQuestionIndex < lesson!.game2Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      return
    }

    // Game complete
    setIsComplete(true)
    if (!user) return

    const applicationId = `telugu-comprehension-lesson-${lessonId}-game2`
    await saveGameScore({
      userId: user.id,
      applicationId,
      score,
      maxScore: lesson!.game2Questions.length,
      subject: "Telugu",
      isConnected,
    })

    const tier = await getActivityMasteryTier(user.id, applicationId, `telugu-comprehension:${lessonId}:game2`)
    setMasteryTier(tier)
  }

  const handleReset = () => {
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Lesson not found</div>
      </div>
    )
  }

  if (isComplete) {
    const percentage = Math.round((score / lesson.game2Questions.length) * 100)
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-400 flex items-center justify-center p-4">
        <Card className="bg-white/95 shadow-2xl border-4 border-white max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold text-purple-900">Game Complete!</h2>
            <p className="text-xl text-purple-800">
              You got {score} out of {lesson.game2Questions.length} correct! ({percentage}%)
            </p>
            {masteryTier && (
              <div className="flex justify-center py-2">
                <MasteryBadge tier={masteryTier} />
              </div>
            )}
            <Button
              onClick={handleBackToLesson}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg"
              size="lg"
            >
              Back to Lesson
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = lesson.game2Questions[currentQuestionIndex]

  // Replace blank with selected answer or show blank placeholder
  const getSentenceWithAnswer = () => {
    if (!selectedAnswer) {
      return currentQuestion.sentence.replace(currentQuestion.blank, "______")
    }
    return currentQuestion.sentence.replace(currentQuestion.blank, selectedAnswer)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-400 p-4 relative overflow-hidden">
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
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackToLesson}
            className="bg-white/20 hover:bg-white/30 text-purple-900 border-2 border-white font-bold"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Lesson
          </Button>

          {!isAnswered && selectedAnswer && (
            <Button
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-purple-900 border-2 border-white font-bold"
              variant="outline"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">
          {lesson.teluguTitle} - Question Set 2
        </h1>
        <p className="text-xl text-purple-800 font-semibold">
          Fill in the Blanks
        </p>
      </div>

      {/* Score and Progress */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/80 rounded-lg p-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-900">
            Question {currentQuestionIndex + 1} / {lesson.game2Questions.length}
          </div>
          <div className="text-2xl font-bold text-purple-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Score: {score}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Sentence Card with Blank */}
        <Card className={`bg-gradient-to-br border-4 border-white shadow-2xl ${
          isAnswered 
            ? selectedAnswer === currentQuestion.correctAnswer
              ? "from-green-100 to-emerald-200"
              : "from-red-100 to-pink-200"
            : "from-purple-100 to-pink-200"
        }`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-purple-900">{getSentenceWithAnswer()}</h2>
                <p className="text-base text-purple-700/70 italic mt-1">{romanize(getSentenceWithAnswer(), "telugu")}</p>
              </div>
              <Button
                onClick={() => handlePlayAudio(getSentenceWithAnswer())}
                disabled={isPlayingTTS}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 disabled:opacity-50"
                size="sm"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>

            {/* Show result after answering */}
            {isAnswered && (
              <div className="mt-6 text-center">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <div className="text-3xl font-bold text-green-700 flex items-center justify-center gap-3">
                    ✅ Correct! Great Job!
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-red-700">
                    ❌ Wrong! Correct answer: <span className="text-green-700">{currentQuestion.correctAnswer}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        {!isAnswered && (
          <div className="text-center">
            <p className="text-xl text-purple-900 font-semibold">
              👇 Click on the correct word to fill the blank
            </p>
          </div>
        )}

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = option === selectedAnswer
            const isCorrect = option === currentQuestion.correctAnswer
            
            let cardClass = "bg-white hover:bg-purple-50"
            if (isAnswered) {
              if (isCorrect) {
                cardClass = "bg-green-200 border-green-500 border-4"
              } else if (isSelected) {
                cardClass = "bg-red-200 border-red-500 border-4"
              } else {
                cardClass = "bg-gray-200"
              }
            } else if (isSelected) {
              cardClass = "bg-blue-200 border-blue-500 border-4"
            }

            return (
              <Card
                key={index}
                className={`${cardClass} cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${
                  isAnswered ? "cursor-not-allowed" : ""
                }`}
                onClick={() => !isAnswered && handleAnswerSelect(option)}
              >
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-bold text-gray-800">{option}</p>
                  <p className="text-sm text-gray-500 italic">{romanize(option, "telugu")}</p>
                  {isAnswered && isCorrect && (
                    <div className="mt-2 text-3xl">✅</div>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <div className="mt-2 text-3xl">❌</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Check Answer Button */}
        {!isAnswered && selectedAnswer && (
          <div className="flex justify-center">
            <Button
              onClick={() => handleAnswerSelect(selectedAnswer)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg"
              size="lg"
            >
              Check Answer ✓
            </Button>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-2xl px-12 py-6 rounded-full shadow-lg"
              size="lg"
            >
              {currentQuestionIndex < lesson.game2Questions.length - 1 ? "Next Question →" : "Complete Game 🎉"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

