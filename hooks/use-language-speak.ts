"use client"

import { useTTS } from "@/hooks/use-tts"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { transliterateToKannada } from "@/lib/sanskrit-tts"
import type { LanguageCode } from "@/lib/language-games-data"

const TTS_LANG_MAP: Record<Exclude<LanguageCode, "telugu">, "hi" | "kn" | "ta" | "ml"> = {
  hindi: "hi",
  kannada: "kn",
  tamil: "ta",
  malayalam: "ml",
  sanskrit: "kn", // no Sanskrit voice exists — transliterate to Kannada script, speak with a Kannada voice
}

/** Speaks native-script and English text for any of the 6 app languages, one hook to cover every quirk. */
export function useLanguageSpeak(lang: LanguageCode) {
  const { speak, isSpeaking } = useTTS()

  const speakNative = (text: string) => {
    if (lang === "telugu") {
      void playTeluguTTS(text)
      return
    }
    if (lang === "sanskrit") {
      speak(transliterateToKannada(text), "kn")
      return
    }
    speak(text, TTS_LANG_MAP[lang])
  }

  const speakEnglish = (text: string) => {
    speak(text, "en")
  }

  return { speakNative, speakEnglish, isSpeaking }
}
