"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { YouTubeEmbed } from "@/components/youtube-embed"

const SHAPE_VIDEOS = [
  {
    id: "solid-shapes",
    title: "Solid Shapes",
    youtubeId: "LHmupcXiWh8",
    description: "3D shapes like cubes, spheres and cones, and where we see them around us.",
  },
  {
    id: "plane-shapes",
    title: "Plane Shapes",
    youtubeId: "4PlMoMVIP6M",
    description: "Flat 2D shapes like circles, squares and triangles.",
  },
]

export default function ShapePuzzlePage() {
  const handleBackToHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-teal-500 p-4 flex flex-col items-center relative overflow-hidden">
      {/* Decorative Character */}
      <img
        src="/characters/tiger.png"
        alt="Tiger"
        className="absolute bottom-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />

      {/* Header with Back Button */}
      <div className="w-full max-w-4xl mb-8">
        <Button
          onClick={handleBackToHome}
          className="bg-white/20 hover:bg-white/30 text-teal-900 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-teal-950 mb-4">
          🔺 Shape Puzzle
        </h1>
        <p className="text-xl text-teal-900 mt-2">
          Watch and learn about solid and plane shapes
        </p>
      </div>

      {/* Video List */}
      <div className="w-full max-w-4xl space-y-8">
        {SHAPE_VIDEOS.map((video) => (
          <Card key={video.id} className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-teal-900 mb-2 text-center">
                {video.title}
              </h2>
              <p className="text-lg text-teal-700 mb-6 text-center">
                {video.description}
              </p>
              <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
