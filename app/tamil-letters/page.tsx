"use client"

/**
 * Tamil Letters page
 * ──────────────────
 * Mirrors the pattern of /hindi-letters and /kannada-letters.
 * Uses useTTS() with overrideLang="ta" so it automatically picks the best
 * ta-IN voice, falling back to the server espeak voice if none exists.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Volume2 } from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import { WiggleEmoji } from "@/components/animated-mascots"

const TAMIL_VOWELS = ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"]
const TAMIL_CONSONANTS = [
  "க", "ங", "ச", "ஞ", "ட", "ண",
  "த", "ந", "ப", "ம", "ய", "ர",
  "ல", "வ", "ழ", "ள", "ற", "ன",
]

// Simple example word for each letter
const EXAMPLE_WORDS: Record<string, string> = {
  "அ": "அம்மா (Mother)", "ஆ": "ஆடு (Goat)", "இ": "இலை (Leaf)",
  "ஈ": "ஈ (Housefly)", "உ": "உடல் (Body)", "ஊ": "ஊஞ்சல் (Swing)",
  "எ": "எலி (Rat)", "ஏ": "ஏணி (Ladder)", "ஐ": "ஐந்து (Five)",
  "ஒ": "ஒட்டகம் (Camel)", "ஓ": "ஓடம் (Boat)", "ஔ": "ஔடதம் (Medicine)",
  "க": "கமலம் (Lotus)", "ங": "மாங்காய் (Raw Mango)", "ச": "சிங்கம் (Lion)",
  "ஞ": "ஞாயிறு (Sun)", "ட": "டமாரம் (Drum)", "ண": "கண் (Eye)",
  "த": "தலை (Head)", "ந": "நாய் (Dog)", "ப": "பூ (Flower)",
  "ம": "மீன் (Fish)", "ய": "யானை (Elephant)", "ர": "ரயில் (Train)",
  "ல": "லட்டு (Laddu)", "வ": "வானம் (Sky)", "ழ": "பழம் (Fruit)",
  "ள": "பள்ளி (School)", "ற": "ஆற்றல் (Strength)", "ன": "நன்றி (Thank You)",
}

export default function TamilLettersPage() {
  const router = useRouter()
  const { speak, isSpeaking } = useTTS()
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<"vowels" | "consonants">("vowels")

  const handleTap = (letter: string) => {
    setSelected(letter)
    const word = EXAMPLE_WORDS[letter] ?? ""
    speak(`${letter}. ${word.split("(")[0].trim()}`, "ta")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-fuchsia-500">
      {/* Header */}
      <header className="bg-white/15 backdrop-blur-sm border-b-2 border-white/30 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow">Tamil Letters</h1>
            <p className="text-white/80 text-sm font-semibold">தமிழ் எழுத்துக்கள் — Tap a letter to hear it!</p>
          </div>
          <div className="ml-auto text-4xl"><WiggleEmoji emoji="அ" /></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Selected letter display */}
        {selected && (
          <div className="mb-8 bg-white/20 backdrop-blur-sm rounded-3xl p-6 text-center border-2 border-white/40 shadow-xl">
            <div className="text-8xl font-black text-white mb-2 drop-shadow-lg">{selected}</div>
            {EXAMPLE_WORDS[selected] && (
              <div className="text-xl text-white/90 font-bold mb-4">{EXAMPLE_WORDS[selected]}</div>
            )}
            <button
              onClick={() => handleTap(selected)}
              disabled={isSpeaking}
              className="inline-flex items-center gap-2 bg-white text-pink-600 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-60"
            >
              <Volume2 className="h-5 w-5" />
              {isSpeaking ? "Playing…" : "Hear it again"}
            </button>
          </div>
        )}

        {/* Tab selector */}
        <div className="flex gap-2 mb-6">
          {(["vowels", "consonants"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                tab === t
                  ? "bg-white text-pink-600 shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {t === "vowels" ? "உயிர் எழுத்துக்கள் (Vowels)" : "மெய் எழுத்துக்கள் (Consonants)"}
            </button>
          ))}
        </div>

        {/* Letter grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {(tab === "vowels" ? TAMIL_VOWELS : TAMIL_CONSONANTS).map(letter => (
            <button
              key={letter}
              onClick={() => handleTap(letter)}
              aria-label={`Letter ${letter}`}
              className={`
                aspect-square rounded-2xl flex items-center justify-center
                text-3xl font-black border-4 transition-all duration-200
                hover:scale-110 active:scale-95 shadow-md hover:shadow-xl
                ${selected === letter
                  ? "bg-white text-pink-600 border-white scale-110 shadow-xl"
                  : "bg-white/25 text-white border-white/40 hover:bg-white/40"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-8 font-semibold">
          💡 Tap any letter to hear it spoken in Tamil
        </p>
      </div>
    </div>
  )
}
