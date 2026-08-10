"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, CheckCircle, Edit3 } from "lucide-react"
import Link from "next/link"
import { getLessonById } from "@/lib/hindi-comprehension-data"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { romanize } from "@/lib/transliteration"
import { useState } from "react"

export default function LessonPage() {
  const params = useParams()
  const lessonId = parseInt(params.id as string)
  const lesson = getLessonById(lessonId)
  const { speakNativeAsync } = useLanguageSpeak("hindi")
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)

  const handleBackToMenu = () => {
    window.location.href = "/hindi-comprehension"
  }

  const handlePlayPassage = async () => {
    if (isPlayingTTS) return

    try {
      setIsPlayingTTS(true)
      // Play each line of the passage
      for (const line of lesson!.passage) {
        await speakNativeAsync(line)
        // Small pause between lines
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.log("TTS error:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 to-red-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 to-red-400 p-4 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <Button
          onClick={handleBackToMenu}
          className="bg-white/20 hover:bg-white/30 text-red-900 border-2 border-white font-bold"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Lessons
        </Button>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-red-900 mb-2">
          {lesson.hindiTitle}
        </h1>
        <p className="text-2xl text-red-800 font-semibold">
          {lesson.title}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Story Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-white">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-red-900">
                कहानी (Story)
              </h2>
              <Button
                onClick={handlePlayPassage}
                disabled={isPlayingTTS}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 disabled:opacity-50"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>

            {/* Image */}
            <div className="mb-6 flex justify-center">
              <img
                src={lesson.image}
                alt={lesson.title}
                className="w-48 h-48 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/characters/bunny.png'
                }}
              />
            </div>

            {/* Passage */}
            <div className="space-y-4">
              {lesson.passage.map((line, index) => (
                <div key={index}>
                  <p className="text-2xl text-red-900 leading-relaxed">{line}</p>
                  <p className="text-base text-red-600/70 italic leading-relaxed">{romanize(line, "devanagari")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Games Card */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-red-900 text-center">
            खेल (Games)
          </h2>

          {/* Game 1 - Multiple Choice */}
          <Link href={`/hindi-comprehension/lesson/${lessonId}/game1`}>
            <Card className="bg-gradient-to-br from-green-100 to-emerald-300 hover:from-green-200 hover:to-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-20 w-20 text-green-700 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-green-800 mb-3">
                  Question Set 1
                </h3>
                <p className="text-xl text-green-700 mb-4">
                  चुनें (Multiple Choice)
                </p>
                <div className="flex justify-center gap-4 text-sm text-green-700">
                  <div className="bg-white/50 rounded-full px-4 py-2">
                    <span className="font-bold">{lesson.game1Questions.length}</span> Questions
                  </div>
                  <div className="bg-white/50 rounded-full px-4 py-2">
                    3 Options Each
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Game 2 - Fill in the Blanks */}
          <Link href={`/hindi-comprehension/lesson/${lessonId}/game2`}>
            <Card className="bg-gradient-to-br from-purple-100 to-pink-300 hover:from-purple-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-8 text-center">
                <Edit3 className="h-20 w-20 text-purple-700 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-purple-800 mb-3">
                  Question Set 2
                </h3>
                <p className="text-xl text-purple-700 mb-4">
                  खाली स्थान भरें (Fill in the Blanks)
                </p>
                <div className="flex justify-center gap-4 text-sm text-purple-700">
                  <div className="bg-white/50 rounded-full px-4 py-2">
                    <span className="font-bold">{lesson.game2Questions.length}</span> Questions
                  </div>
                  <div className="bg-white/50 rounded-full px-4 py-2">
                    Drag & Drop
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
