"use client"

/**
 * Kannada Letters page
 * ─────────────────────
 * Same pattern as Hindi Letters / Telugu Letters.
 * useTTS() picks the best kn-IN voice automatically.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Volume2 } from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import { WiggleEmoji } from "@/components/animated-mascots"

const KANNADA_VOWELS = ["ಅ", "ಆ", "ಇ", "ಈ", "ಉ", "ಊ", "ಋ", "ಎ", "ಏ", "ಐ", "ಒ", "ಓ", "ಔ", "ಅಂ", "ಅಃ"]
const KANNADA_CONSONANTS = [
  "ಕ", "ಖ", "ಗ", "ಘ", "ಙ",
  "ಚ", "ಛ", "ಜ", "ಝ", "ಞ",
  "ಟ", "ಠ", "ಡ", "ಢ", "ಣ",
  "ತ", "ಥ", "ದ", "ಧ", "ನ",
  "ಪ", "ಫ", "ಬ", "ಭ", "ಮ",
  "ಯ", "ರ", "ಲ", "ವ", "ಶ",
  "ಷ", "ಸ", "ಹ", "ಳ",
]

const EXAMPLE_WORDS: Record<string, string> = {
  "ಅ": "ಅರಳು (Blossom)", "ಆ": "ಆನೆ (Elephant)", "ಇ": "ಇರುವೆ (Ant)",
  "ಈ": "ಈಚಲು (Palm)", "ಉ": "ಉಪ್ಪು (Salt)", "ಊ": "ಊರು (Village)",
  "ಎ": "ಎಮ್ಮೆ (Buffalo)", "ಏ": "ಏಣಿ (Ladder)", "ಐ": "ಐದು (Five)",
  "ಒ": "ಒಂಟೆ (Camel)", "ಓ": "ಓಡು (Run)", "ಔ": "ಔಷಧ (Medicine)",
  "ಕ": "ಕಮಲ (Lotus)", "ಖ": "ಖರ್ಜೂರ (Date)", "ಗ": "ಗಿಣಿ (Parrot)",
  "ಘ": "ಘಂಟೆ (Bell)", "ಚ": "ಚಂದ್ರ (Moon)", "ಛ": "ಛತ್ರಿ (Umbrella)",
  "ಜ": "ಜಲ (Water)", "ಝ": "ಝರಿ (Stream)", "ಟ": "ಟೊಮೆಟೊ (Tomato)",
  "ಡ": "ಡಮರು (Drum)", "ತ": "ತಾಮರೆ (Lotus)", "ಥ": "ಥಟ್ಟನೆ (Suddenly)",
  "ದ": "ದ್ರಾಕ್ಷಿ (Grape)", "ಧ": "ಧನ (Wealth)", "ನ": "ನದಿ (River)",
  "ಪ": "ಪತಂಗ (Kite)", "ಫ": "ಫಲ (Fruit)", "ಬ": "ಬಾಳೆ (Banana)",
  "ಭ": "ಭೂಮಿ (Earth)", "ಮ": "ಮೀನು (Fish)", "ಯ": "ಯಂತ್ರ (Machine)",
  "ರ": "ರಥ (Chariot)", "ಲ": "ಲಿಂಬೆ (Lemon)", "ವ": "ವಾನರ (Monkey)",
  "ಶ": "ಶಾಲೆ (School)", "ಷ": "ಷಡ್ಭುಜ (Hexagon)", "ಸ": "ಸೂರ್ಯ (Sun)",
  "ಹ": "ಹಾವು (Snake)", "ಳ": "ಳಕಾರ",
}

export default function KannadaLettersPage() {
  const router = useRouter()
  const { speak, isSpeaking } = useTTS()
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<"vowels" | "consonants">("vowels")

  const handleTap = (letter: string) => {
    setSelected(letter)
    const word = EXAMPLE_WORDS[letter] ?? ""
    speak(`${letter}. ${word.split("(")[0].trim()}`, "kn")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500">
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
            <h1 className="text-2xl font-black text-white drop-shadow">Kannada Letters</h1>
            <p className="text-white/80 text-sm font-semibold">ಕನ್ನಡ ವರ್ಣಮಾಲೆ — Tap a letter to hear it!</p>
          </div>
          <div className="ml-auto text-4xl"><WiggleEmoji emoji="ಅ" /></div>
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
              className="inline-flex items-center gap-2 bg-white text-amber-600 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-60"
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
                  ? "bg-white text-amber-600 shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {t === "vowels" ? "ಸ್ವರಗಳು (Vowels)" : "ವ್ಯಂಜನಗಳು (Consonants)"}
            </button>
          ))}
        </div>

        {/* Letter grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {(tab === "vowels" ? KANNADA_VOWELS : KANNADA_CONSONANTS).map(letter => (
            <button
              key={letter}
              onClick={() => handleTap(letter)}
              aria-label={`Letter ${letter}`}
              className={`
                aspect-square rounded-2xl flex items-center justify-center
                text-3xl font-black border-4 transition-all duration-200
                hover:scale-110 active:scale-95 shadow-md hover:shadow-xl
                ${selected === letter
                  ? "bg-white text-amber-600 border-white scale-110 shadow-xl"
                  : "bg-white/25 text-white border-white/40 hover:bg-white/40"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-8 font-semibold">
          💡 Tap any letter to hear it spoken in Kannada
        </p>
      </div>
    </div>
  )
}
