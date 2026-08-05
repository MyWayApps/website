"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Volume2 } from "lucide-react"
import { useTTS } from "@/hooks/use-tts"
import { WiggleEmoji } from "@/components/animated-mascots"
import { malayalamVowels, malayalamConsonants, LetterType } from "@/lib/malayalam-letters-data"

export default function MalayalamLettersFlashcardsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = (searchParams.get("type") as LetterType) || "vowels"
  const { speak, isSpeaking } = useTTS()
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<"vowels" | "consonants">(initialType === "consonants" ? "consonants" : "vowels")

  const letters = tab === "vowels" ? malayalamVowels : malayalamConsonants

  const handleTap = (letter: string) => {
    setSelected(letter)
    const item = letters.find((l) => l.letter === letter)
    const word = item?.word ?? ""
    speak(`${letter}. ${word.split("(")[0].trim()}`, "ml")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-cyan-400 to-sky-500">
      <header className="bg-white/15 backdrop-blur-sm border-b-2 border-white/30 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/malayalam-letters")}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow">Malayalam Letters</h1>
            <p className="text-white/80 text-sm font-semibold">മലയാള അക്ഷരമാല — Tap a letter to hear it!</p>
          </div>
          <div className="ml-auto text-4xl">
            <WiggleEmoji emoji="അ" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {selected && (
          <div className="mb-8 bg-white/20 backdrop-blur-sm rounded-3xl p-6 text-center border-2 border-white/40 shadow-xl">
            <div className="text-8xl font-black text-white mb-2 drop-shadow-lg">{selected}</div>
            {letters.find((l) => l.letter === selected)?.word && (
              <div className="text-xl text-white/90 font-bold mb-4">{letters.find((l) => l.letter === selected)?.word}</div>
            )}
            <button
              onClick={() => handleTap(selected)}
              disabled={isSpeaking}
              className="inline-flex items-center gap-2 bg-white text-cyan-600 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-60"
            >
              <Volume2 className="h-5 w-5" />
              {isSpeaking ? "Playing…" : "Hear it again"}
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(["vowels", "consonants"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t)
                setSelected(null)
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                tab === t ? "bg-white text-cyan-600 shadow-lg scale-105" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {t === "vowels" ? "സ്വരാക്ഷരങ്ങൾ (Vowels)" : "വ്യഞ്ജനാക്ഷരങ്ങൾ (Consonants)"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {letters.map(({ letter }) => (
            <button
              key={letter}
              onClick={() => handleTap(letter)}
              aria-label={`Letter ${letter}`}
              className={`
                aspect-square rounded-2xl flex items-center justify-center
                text-3xl font-black border-4 transition-all duration-200
                hover:scale-110 active:scale-95 shadow-md hover:shadow-xl
                ${
                  selected === letter
                    ? "bg-white text-cyan-600 border-white scale-110 shadow-xl"
                    : "bg-white/25 text-white border-white/40 hover:bg-white/40"
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-8 font-semibold">💡 Tap any letter to hear it spoken in Malayalam</p>
      </div>
    </div>
  )
}
