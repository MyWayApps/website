"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Volume2 } from "lucide-react"
import { useLanguageSpeak } from "@/hooks/use-language-speak"
import { sanskritVowels, sanskritConsonants, LetterType } from "@/lib/sanskrit-letters-data"
import { romanize } from "@/lib/transliteration"

export default function SanskritLettersFlashcardsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = (searchParams.get("type") as LetterType) || "vowels"
  const { speakNative: speak, isSpeaking } = useLanguageSpeak("sanskrit")
  const [tab, setTab] = useState<"vowels" | "consonants">(initialType === "consonants" ? "consonants" : "vowels")
  const initialLetters = initialType === "consonants" ? sanskritConsonants : sanskritVowels
  const [selected, setSelected] = useState<string | null>(initialLetters[0]?.letter ?? null)

  const letters = tab === "vowels" ? sanskritVowels : sanskritConsonants
  const selectedItem = selected ? letters.find((l) => l.letter === selected) : undefined

  const handleTap = (letter: string) => {
    setSelected(letter)
    speak(letter)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 via-yellow-700 to-orange-800 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 text-[16rem] leading-none opacity-10 pointer-events-none select-none z-0">
        ॐ
      </div>

      <header className="bg-white/15 backdrop-blur-sm border-b-2 border-white/30 px-4 py-4 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push("/sanskrit-letters")}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow">Sanskrit Letters</h1>
            <p className="text-white/80 text-sm font-semibold">संस्कृतवर्णमाला — Tap a letter to hear it!</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {selected && (
          <div className="mb-8 bg-white/20 backdrop-blur-sm rounded-3xl p-6 text-center border-2 border-white/40 shadow-xl">
            <div className="text-8xl font-black text-white mb-2 drop-shadow-lg">{selected}</div>
            <div className="text-lg text-white/70 italic mb-2">{romanize(selected, "devanagari")}</div>
            {selectedItem?.word && (
              <div className="text-xl text-white/90 font-bold mb-1">{selectedItem.word}</div>
            )}
            {selectedItem?.word && (
              <div className="text-base text-white/70 italic mb-4">
                {romanize(selectedItem.word.split("(")[0].trim(), "devanagari")}
              </div>
            )}
            <button
              onClick={() => handleTap(selected)}
              disabled={isSpeaking}
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-60"
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
                const newLetters = t === "vowels" ? sanskritVowels : sanskritConsonants
                setSelected(newLetters[0]?.letter ?? null)
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${
                tab === t ? "bg-white text-orange-600 shadow-lg scale-105" : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {t === "vowels" ? "स्वराः (Vowels)" : "व्यञ्जनानि (Consonants)"}
            </button>
          ))}
        </div>

        <div className={`grid gap-3 ${tab === "consonants" ? "grid-cols-5" : "grid-cols-4 sm:grid-cols-6"}`}>
          {letters.map(({ letter }) => (
            <button
              key={letter}
              onClick={() => handleTap(letter)}
              aria-label={`Letter ${letter}`}
              className={`
                rounded-2xl flex flex-col items-center justify-center gap-0.5 py-3
                text-3xl font-black border-4 transition-all duration-200
                hover:scale-110 active:scale-95 shadow-md hover:shadow-xl
                ${
                  selected === letter
                    ? "bg-white text-orange-600 border-white scale-110 shadow-xl"
                    : "bg-white/90 text-gray-700 border-white/70 hover:bg-white"
                }
              `}
            >
              <span>{letter}</span>
              <span className="text-xs font-normal opacity-70">{romanize(letter, "devanagari")}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-white/60 text-sm mt-8 font-semibold">
          💡 Tap any letter to hear it (spoken via Kannada transliteration)
        </p>
      </div>
    </div>
  )
}
