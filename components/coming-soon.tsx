"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Construction, Star } from "lucide-react"

interface ComingSoonProps {
  appName: string
  appDescription: string
  iconEmoji: string
  colorScheme: string
  onBackToHome?: () => void
}

export function ComingSoon({ 
  appName, 
  appDescription, 
  iconEmoji, 
  colorScheme,
  onBackToHome 
}: ComingSoonProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Back to Home Button */}
        <div className="flex items-center justify-between mb-6">
          {onBackToHome && (
            <Button
              onClick={onBackToHome}
              className="bg-white/20 hover:bg-white/30 text-gray-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          )}
          <div className="flex items-center gap-2 text-gray-800 font-bold">
            <Star className="h-5 w-5" />
            <span>Coming Soon!</span>
          </div>
        </div>
        
        <Card className="w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center">
              {/* Construction Icon */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-orange-200 to-yellow-300 rounded-full mb-6">
                  <Construction className="h-16 w-16 text-orange-600" />
                </div>
              </div>
              
              {/* App Icon and Name */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-6xl">{iconEmoji}</span>
                <h1 className="text-5xl font-bold text-gray-800 font-sans tracking-tight">
                  {appName}
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-xl text-gray-700 font-medium mb-4">
                {appDescription}
              </p>
              
              {/* Coming Soon Message */}
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 border-2 border-orange-200 mb-8">
                <h2 className="text-3xl font-bold text-orange-800 mb-4">
                  🚧 Under Construction 🚧
                </h2>
                <p className="text-lg text-orange-700 mb-4">
                  We're working hard to bring you an amazing experience!
                </p>
                <p className="text-md text-orange-600">
                  This feature will be available soon. Check back later for updates!
                </p>
              </div>
              
              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/50 rounded-lg p-4 border border-gray-200">
                  <div className="text-3xl mb-2">🎮</div>
                  <h3 className="font-bold text-gray-800 mb-2">Interactive Games</h3>
                  <p className="text-sm text-gray-600">Fun and engaging activities</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 border border-gray-200">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-bold text-gray-800 mb-2">Educational Content</h3>
                  <p className="text-sm text-gray-600">Learn while having fun</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 border border-gray-200">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-bold text-gray-800 mb-2">Achievements</h3>
                  <p className="text-sm text-gray-600">Track your progress</p>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
