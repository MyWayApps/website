"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { socialStudiesLessons } from "@/lib/social-studies-data"
import { YouTubeEmbed } from "@/components/youtube-embed"

export default function SocialStudiesPage() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-400 to-violet-600 p-4 flex flex-col items-center relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/boy.png"
        alt="Boy"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header with Back Button */}
      <div className="w-full max-w-4xl mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-indigo-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-indigo-950 mb-4">
          Social Studies
        </h1>
        <p className="text-xl text-indigo-900 mt-2">
          Learn about India — its symbols, festivals and famous people
        </p>
      </div>

      {/* Video List */}
      <div className="w-full max-w-4xl space-y-8">
        {socialStudiesLessons.map((lesson) => (
          <Card key={lesson.id} className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2 text-center">
                {lesson.title}
              </h2>
              <p className="text-lg text-indigo-700 mb-6 text-center">
                {lesson.description}
              </p>
              <YouTubeEmbed videoId={lesson.youtubeId} title={lesson.title} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
