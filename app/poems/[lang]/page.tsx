"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react"
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/language-games-data"
import { POEMS } from "@/lib/poems-data"
import { useLanguageSpeak } from "@/hooks/use-language-speak"

const GRADIENT = "from-rose-300 via-pink-400 to-fuchsia-500"

const VALID_LANGS = new Set<string>(Object.keys(LANGUAGE_LABELS))

export default function PoemsPage() {
  const params = useParams()
  const langParam = params.lang as string
  const [index, setIndex] = useState(0)
  const { speakNative, isSpeaking } = useLanguageSpeak((VALID_LANGS.has(langParam) ? langParam : "hindi") as LanguageCode)

  if (!VALID_LANGS.has(langParam)) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 flex items-center justify-center`}>
        <p className="text-2xl font-bold text-white">Unknown language.</p>
      </div>
    )
  }

  const lang = langParam as LanguageCode
  const label = LANGUAGE_LABELS[lang]
  const poems = POEMS[lang]
  const poem = poems[index]

  const handlePlay = () => {
    if (isSpeaking) return
    speakNative(poem.lines.join(" "))
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${GRADIENT} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          <span className="text-lg font-bold text-white bg-white/20 px-5 py-3 rounded-full backdrop-blur-sm">
            Poem {index + 1}/{poems.length}
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 tracking-tight">📜 {label} Poems</h1>
          <p className="text-xl text-white/90 font-medium">Read along and listen</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-fuchsia-700 mb-8 tracking-tight">{poem.title}</h2>

            <div className="space-y-3 mb-8">
              {poem.lines.map((line, i) => (
                <p key={i} className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            <Button
              onClick={handlePlay}
              className="h-16 px-10 text-xl font-bold bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white rounded-2xl shadow-lg"
            >
              <Volume2 className="mr-2 h-6 w-6" />
              Listen
            </Button>

            {poem.note && <p className="text-sm text-gray-500 mt-6 italic">{poem.note}</p>}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3 disabled:opacity-40"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>
          <Button
            onClick={() => setIndex((i) => Math.min(poems.length - 1, i + 1))}
            disabled={index === poems.length - 1}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3 disabled:opacity-40"
            variant="outline"
          >
            Next
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
