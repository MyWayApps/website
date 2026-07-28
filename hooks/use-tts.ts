"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useLanguage, type Language } from "@/lib/language-context"

// ─── Voice quality scoring ────────────────────────────────────────────────────
// Prefers neural / natural / premium voices over generic ones.
// Order matters: higher index = higher priority.

const QUALITY_KEYWORDS = [
  "compact", "standard",                   // low quality — deprioritise
  "enhanced", "premium", "natural", "neural", "wavenet", "journey", "studio",
]

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase()
  let score = 0
  QUALITY_KEYWORDS.forEach((kw, i) => {
    if (name.includes(kw)) score = i
  })
  // Prefer non-remote (local) voices for reliability
  if (!voice.localService) score -= 1
  return score
}

// ─── Language → BCP-47 locale preferences ────────────────────────────────────

const LANG_LOCALES: Record<Language, string[]> = {
  en: ["en-IN", "en-GB", "en-US", "en-AU"],   // en-IN first so Indian names sound natural
  hi: ["hi-IN", "hi"],
  kn: ["kn-IN", "kn"],
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTTS() {
  const { language } = useLanguage()
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Load voices — they arrive asynchronously in most browsers
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    setIsSupported(true)

    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    load()
    window.speechSynthesis.addEventListener("voiceschanged", load)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load)
  }, [])

  const getBestVoice = useCallback(
    (lang: Language): SpeechSynthesisVoice | null => {
      const voices = voicesRef.current
      if (!voices.length) return null

      const preferredLocales = LANG_LOCALES[lang]

      // Try each preferred locale in order, pick highest-scored voice within it
      for (const locale of preferredLocales) {
        const candidates = voices.filter((v) =>
          v.lang.toLowerCase().startsWith(locale.toLowerCase())
        )
        if (candidates.length) {
          return candidates.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
        }
      }

      // Fallback: any voice with the right base language code
      const baseLang = preferredLocales[0].split("-")[0]
      const fallbacks = voices.filter((v) => v.lang.toLowerCase().startsWith(baseLang))
      if (fallbacks.length) {
        return fallbacks.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
      }

      // Last resort: default browser voice
      return voices.find((v) => v.default) ?? voices[0] ?? null
    },
    []
  )

  const speak = useCallback(
    (text: string, overrideLang?: Language) => {
      if (!isSupported) return

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      setIsSpeaking(false)

      const lang = overrideLang ?? language
      const voice = getBestVoice(lang)

      const utt = new SpeechSynthesisUtterance(text)
      if (voice) utt.voice = voice
      utt.lang = LANG_LOCALES[lang][0]

      // Tuned for clarity with children: slightly slower, moderate pitch
      utt.rate = 0.88
      utt.pitch = 1.05
      utt.volume = 1

      utt.onstart = () => setIsSpeaking(true)
      utt.onend = () => setIsSpeaking(false)
      utt.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utt
      window.speechSynthesis.speak(utt)
    },
    [isSupported, language, getBestVoice]
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  // Expose available voices for the language (useful for a voice-picker UI)
  const getAvailableVoices = useCallback(
    (lang?: Language): SpeechSynthesisVoice[] => {
      const target = lang ?? language
      const locales = LANG_LOCALES[target]
      return voicesRef.current
        .filter((v) => locales.some((l) => v.lang.toLowerCase().startsWith(l.toLowerCase())))
        .sort((a, b) => scoreVoice(b) - scoreVoice(a))
    },
    [language]
  )

  return { speak, stop, isSpeaking, isSupported, getAvailableVoices }
}
