"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getGrammarLessonById } from "@/lib/english-grammar-data"
import { YouTubeEmbed } from "@/components/youtube-embed"

export default function EnglishGrammarLessonPage() {
  const params = useParams()
  const lesson = getGrammarLessonById(params.id as string)

  const handleBackToGrammar = () => {
    window.location.href = "/english-grammar"
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Lesson not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 p-4 flex flex-col items-center relative overflow-hidden">
      <div className="w-full max-w-3xl mb-6">
        <Button
          onClick={handleBackToGrammar}
          className="bg-white/20 hover:bg-white/30 text-purple-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Grammar
        </Button>
      </div>

      <Card className="w-full max-w-3xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2 text-center">
            {lesson.title}
          </h1>
          <p className="text-lg text-purple-700 mb-6 text-center">
            {lesson.description}
          </p>

          <YouTubeEmbed videoId={lesson.youtubeId} title={lesson.title} />
        </CardContent>
      </Card>
    </div>
  )
}
