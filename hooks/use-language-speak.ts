"use client"

import { useTTS } from "@/hooks/use-tts"
import { playTeluguTTS } from "@/lib/telugu-tts"
import { playStaticTTS } from "@/lib/static-tts"
import { transliterateToKannada } from "@/lib/sanskrit-tts"
import type { LanguageCode } from "@/lib/language-games-data"

const TTS_LANG_MAP: Record<Exclude<LanguageCode, "telugu">, "hi" | "kn" | "ta" | "ml"> = {
  hindi: "hi",
  kannada: "kn",
  tamil: "ta",
  malayalam: "ml",
  sanskrit: "kn", // no Sanskrit voice exists — transliterate to Kannada script, speak with a Kannada voice
}

// BCP-47 prefix used to match a browser voice for each language, before
// falling back to pre-generated static audio / live /api/tts.
const BROWSER_LOCALE_PREFIX: Record<"hi" | "kn" | "ta" | "ml", string> = {
  hi: "hi-IN",
  kn: "kn-IN",
  ta: "ta-IN",
  ml: "ml-IN",
}

/** Speaks native-script and English text for any of the 6 app languages, one hook to cover every quirk. */
export function useLanguageSpeak(lang: LanguageCode) {
  const { speak, isSpeaking } = useTTS()

  // Shared implementation — returns the playback promise so callers that
  // need to sequence multiple lines (e.g. reading a comprehension passage
  // one sentence at a time) can await it via speakNativeAsync below.
  const speakNativeAsync = (text: string): Promise<void> => {
    if (lang === "telugu") {
      return playTeluguTTS(text)
    }
    if (lang === "sanskrit") {
      // Pre-generated Sanskrit audio is cached under the post-transliteration
      // Kannada-script text (see scripts/generate-audio.js), so transliterate
      // before handing off to the same static-cache-first Kannada path.
      return playStaticTTS(transliterateToKannada(text), "kn", BROWSER_LOCALE_PREFIX.kn)
    }
    const ttsLang = TTS_LANG_MAP[lang]
    return playStaticTTS(text, ttsLang, BROWSER_LOCALE_PREFIX[ttsLang])
  }

  const speakNative = (text: string) => {
    void speakNativeAsync(text)
  }

  const speakEnglish = (text: string) => {
    speak(text, "en")
  }

  return { speakNative, speakNativeAsync, speakEnglish, isSpeaking }
}
