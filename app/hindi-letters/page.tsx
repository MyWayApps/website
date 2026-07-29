"use client"

/**
 * Hindi Letters page
 * ──────────────────
 * Mirrors the pattern of /telugu-letters.
 * Uses useTTS() so it automatically picks the best hi-IN voice
 * instead of the robotic default.
 *
 * TODO: Replace the placeholder letter grid below with your own
 *       component (e.g. <LetterGrid> from telugu-letters) once
 *       you confirm the route wires up correctly.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Volume2 } from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import { WiggleEmoji } from "@/components/animated-mascots"

const HINDI_VOWELS = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "अं", "अः"]
const HINDI_CONSONANTS = [
  "क", "ख", "ग", "घ", "ङ",
  "च", "छ", "ज", "झ", "ञ",
  "ट", "ठ", "ड", "ढ", "ण",
  "त", "थ", "द", "ध", "न",
  "प", "फ", "ब", "भ", "म",
  "य", "र", "ल", "व", "श",
  "ष", "स", "ह",
]

// Simple example word for each letter (extend as needed)
const EXAMPLE_WORDS: Record<string, string> = {
  "अ": "अनार (Pomegranate)", "आ": "आम (Mango)", "इ": "इमली (Tamarind)",
  "ई": "ईख (Sugarcane)", "उ": "उल्लू (Owl)", "ऊ": "ऊँट (Camel)",
  "ए": "एड़ी (Heel)", "ऐ": "ऐनक (Spectacles)", "ओ": "ओखली (Mortar)",
  "औ": "औजार (Tool)", "क": "कमल (Lotus)", "ख": "खरगोश (Rabbit)",
  "ग": "गाय (Cow)", "घ": "घर (House)", "च": "चाँद (Moon)",
  "छ": "छाता (Umbrella)", "ज": "जहाज (Ship)", "झ": "झील (Lake)",
  "ट": "टमाटर (Tomato)", "ठ": "ठंड (Cold)", "ड": "डमरू (Drum)",
  "ढ": "ढोल (Dhol)", "त": "तरबूज (Watermelon)", "थ": "थाली (Plate)",
  "द": "दरवाजा (Door)", "ध": "धनुष (Bow)", "न": "नल (Tap)",
  "प": "पतंग (Kite)", "फ": "फूल (Flower)", "ब": "बकरी (Goat)",
  "भ": "भालू (Bear)", "म": "मछली (Fish)", "य": "यज्ञ (Yajna)",
  "र": "रथ (Chariot)", "ल": "लड्डू (Laddu)", "व": "वन (Forest)",
  "श": "शेर (Lion)", "ष": "षट्कोण (Hexagon)", "स": "सूरज (Sun)",
  "ह": "हाथी (Elephant)",
}

export default function HindiLettersPage() {
  const router = useRouter()
  const { speak, isSpeaking } = useTTS()
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<"vowels" | "consonants">("vowels")

  const handleTap = (letter: string) => {
    setSelected(letter)
    // Speak letter + example word in Hindi
    const word = EXAMPLE_WORDS[letter] ?? ""
    speak(`${letter}. ${word.split("(")[0].trim()}`, "hi")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-400 to-rose-500">
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
            <h1 className="text-2xl font-black text-white drop-shadow">Hindi Letters</h1>
            <p className="text-white/80 text-sm font-semibold">हिंदी वर्णमाला — Tap a letter to hear it!</p>
          </div>
          <div className="ml-auto text-4xl"><WiggleEmoji emoji="अ" /></div>
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
              className="inline-flex items-center gap-2 bg-white text-red-500 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-60"
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
                  ? "bg-white text-red-500 shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {t === "vowels" ? "स्वर (Vowels)" : "व्यंजन (Consonants)"}
            </button>
          ))}
        </div>

        {/* Letter grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {(tab === "vowels" ? HINDI_VOWELS : HINDI_CONSONANTS).map(letter => (
            <button
              key={letter}
              onClick={() => handleTap(letter)}
              aria-label={`Letter ${letter}`}
              className={`
                aspect-square rounded-2xl flex items-center justify-center
                text-3xl font-black border-4 transition-all duration-200
                hover:scale-110 active:scale-95 shadow-md hover:shadow-xl
                ${selected === letter
                  ? "bg-white text-red-500 border-white scale-110 shadow-xl"
                  : "bg-white/25 text-white border-white/40 hover:bg-white/40"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-8 font-semibold">
          💡 Tap any letter to hear it spoken in Hindi
        </p>
      </div>
    </div>
  )
}
