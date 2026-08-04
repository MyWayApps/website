"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2, CheckCircle, Edit3 } from "lucide-react"
import Link from "next/link"
import { getLessonById } from "@/lib/sanskrit-comprehension-data"
import { useTTS } from "@/hooks/use-tts"
import { transliterateToKannada } from "@/lib/sanskrit-tts"
import { useState } from "react"

// Sanskrit has no TTS voice of its own — the passage is transliterated to
// Kannada script and spoken with the Kannada voice/fallback (lib/sanskrit-tts.ts).
export default function LessonPage() {
  const params = useParams()
  const lessonId = parseInt(params.id as string)
  const lesson = getLessonById(lessonId)
  const { speakAsync } = useTTS()
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)

  const handleBackToMenu = () => {
    window.location.href = "/sanskrit-comprehension"
  }

  const handlePlayPassage = async () => {
    if (isPlayingTTS || !lesson) return

    try {
      setIsPlayingTTS(true)
      // Play each line of the passage
      for (const line of lesson.passage) {
        await speakAsync(transliterateToKannada(line), "kn")
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
      <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 p-4 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <Button
          onClick={handleBackToMenu}
          className="bg-white/20 hover:bg-white/30 text-amber-50 border-2 border-white font-bold"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Lessons
        </Button>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-amber-50 mb-2">
          {lesson.sanskritTitle}
        </h1>
        <p className="text-2xl text-amber-100 font-semibold">
          {lesson.title}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Story Card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-white">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-amber-900">
                कथा (Story)
              </h2>
              <Button
                onClick={handlePlayPassage}
                disabled={isPlayingTTS}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-3 disabled:opacity-50"
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
                <p key={index} className="text-2xl text-amber-900 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Games Card */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-amber-50 text-center">
            क्रीडाः (Games)
          </h2>

          {/* Game 1 - Multiple Choice */}
          <Link href={`/sanskrit-comprehension/lesson/${lessonId}/game1`}>
            <Card className="bg-gradient-to-br from-green-100 to-emerald-300 hover:from-green-200 hover:to-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-20 w-20 text-green-700 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-green-800 mb-3">
                  Question Set 1
                </h3>
                <p className="text-xl text-green-700 mb-4">
                  विकल्पं चिनोतु (Multiple Choice)
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
          <Link href={`/sanskrit-comprehension/lesson/${lessonId}/game2`}>
            <Card className="bg-gradient-to-br from-purple-100 to-pink-300 hover:from-purple-200 hover:to-pink-400 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border-4 border-white">
              <CardContent className="p-8 text-center">
                <Edit3 className="h-20 w-20 text-purple-700 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-purple-800 mb-3">
                  Question Set 2
                </h3>
                <p className="text-xl text-purple-700 mb-4">
                  रिक्तस्थानं पूरयतु (Fill in the Blanks)
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
