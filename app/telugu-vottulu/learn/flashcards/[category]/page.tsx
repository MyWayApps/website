"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Volume2 } from "lucide-react"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { getVottuluByCategory, getCategoryLabel, VottuluCategory } from "@/lib/telugu-vottulu-data"

export default function VottuluFlashcards() {
  const params = useParams()
  const category = (params.category as VottuluCategory) || "different-shapes"
  
  const [items, setItems] = useState<Array<{ letter: string; vottu: string; description: string }>>([])
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)

  // Initialize items based on category
  useEffect(() => {
    const itemData = getVottuluByCategory(category)
    setItems(itemData)
  }, [category])

  const categoryLabel = getCategoryLabel(category)

  // Play audio for a specific item
  const playAudio = async (index: number, type: 'letter' | 'vottu') => {
    if (playingIndex !== null) return
    
    try {
      setPlayingIndex(index)
      const textToSpeak = type === 'letter' ? items[index].letter : items[index].vottu
      await playTeluguTTS(textToSpeak, false)
    } catch (error) {
      console.error("TTS play failed:", error)
    } finally {
      setPlayingIndex(null)
    }
  }

  const handleBackToFlashcards = () => {
    window.location.href = "/telugu-vottulu/learn/flashcards"
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-pink-500">
        <div className="text-2xl text-pink-800">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8 bg-gradient-to-br from-pink-200 to-pink-500 relative overflow-hidden">
      {/* Decorative Character */}
      <img 
        src="/characters/rabbit.png" 
        alt="Rabbit" 
        className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain opacity-90 pointer-events-none z-10"
      />
      
      {/* Header */}
      <div className="w-full max-w-6xl px-4 mb-6 flex items-center justify-between">
        <Button
          onClick={handleBackToFlashcards}
          className="bg-white/20 hover:bg-white/30 text-pink-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <div className="bg-white/30 px-4 py-2 rounded-full">
          <span className="text-pink-800 font-bold text-lg">{categoryLabel.telugu}</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-pink-900 mb-2">
          Vottulu Table
        </h1>
        <p className="text-lg text-pink-700">
          {categoryLabel.english}
        </p>
      </div>

      {/* Table Card */}
      <Card className="w-full max-w-6xl mx-4 shadow-2xl bg-white/90 backdrop-blur-sm border-0">
        <CardContent className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-pink-100">
                  <th className="border-2 border-pink-300 px-6 py-4 text-left text-xl font-bold text-pink-800">
                    అక్షరం (Letter)
                  </th>
                  <th className="border-2 border-pink-300 px-6 py-4 text-left text-xl font-bold text-pink-800">
                    వత్తు (Subscript)
                  </th>
                  <th className="border-2 border-pink-300 px-6 py-4 text-left text-xl font-bold text-pink-800">
                    వివరణ (Description)
                  </th>
                  <th className="border-2 border-pink-300 px-6 py-4 text-center text-xl font-bold text-pink-800">
                    Audio
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-pink-50 transition-colors"
                  >
                    <td className="border-2 border-pink-200 px-6 py-4 text-4xl font-bold text-pink-800 text-center">
                      {item.letter}
                    </td>
                    <td className="border-2 border-pink-200 px-6 py-4 text-4xl font-bold text-pink-800 text-center">
                      {item.vottu}
                    </td>
                    <td className="border-2 border-pink-200 px-6 py-4 text-lg text-pink-700">
                      {item.description}
                    </td>
                    <td className="border-2 border-pink-200 px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => playAudio(index, 'letter')}
                          disabled={playingIndex === index}
                          variant="outline"
                          className="bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-pink-400 px-4 py-2"
                          title="Play letter audio"
                        >
                          {playingIndex === index ? (
                            <Volume2 className="h-5 w-5 animate-pulse" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                        <Button
                          onClick={() => playAudio(index, 'vottu')}
                          disabled={playingIndex === index}
                          variant="outline"
                          className="bg-pink-100 hover:bg-pink-200 text-pink-800 border-2 border-pink-400 px-4 py-2"
                          title="Play vottu audio"
                        >
                          {playingIndex === index ? (
                            <Volume2 className="h-5 w-5 animate-pulse" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
