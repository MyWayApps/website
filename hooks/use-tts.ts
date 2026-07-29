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

// ─── Server TTS fallback (espeak via /api/tts) ───────────────────────────────
// Used when the browser has no voice at all for the target language — common
// for Kannada, whose OS/browser voice support is far patchier than Hindi's.
// Mirrors the same /api/tts endpoint lib/telugu-tts.ts already relies on.

let _fallbackAudio: HTMLAudioElement | null = null

function playViaServerTTS(text: string, lang: Language, onStart: () => void, onEnd: () => void): void {
  if (_fallbackAudio) {
    try { _fallbackAudio.pause() } catch {}
    _fallbackAudio = null
  }

  const url = `/api/tts?lang=${lang}&text=${encodeURIComponent(text)}`
  const audio = new Audio(url)
  _fallbackAudio = audio

  audio.onplaying = onStart
  audio.onended = onEnd
  audio.onerror = () => {
    console.warn(`Server TTS failed for lang="${lang}"`)
    onEnd()
  }

  audio.play().catch((err) => {
    console.warn(`Server TTS playback blocked for lang="${lang}":`, err)
    onEnd()
  })
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

  // Only returns a voice that genuinely speaks the requested language — no
  // generic-default fallback here, so callers can tell "no real voice for
  // this language" apart from "found one" and fall back to server TTS instead.
  const getMatchedVoice = useCallback(
    (lang: Language): SpeechSynthesisVoice | null => {
      const voices = voicesRef.current
      if (!voices.length) return null

      const preferredLocales = LANG_LOCALES[lang]

      for (const locale of preferredLocales) {
        const candidates = voices.filter((v) =>
          v.lang.toLowerCase().startsWith(locale.toLowerCase())
        )
        if (candidates.length) {
          return candidates.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
        }
      }

      const baseLang = preferredLocales[0].split("-")[0]
      const fallbacks = voices.filter((v) => v.lang.toLowerCase().startsWith(baseLang))
      if (fallbacks.length) {
        return fallbacks.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
      }

      return null
    },
    []
  )

  const speak = useCallback(
    (text: string, overrideLang?: Language) => {
      if (!isSupported) return

      // Cancel any ongoing speech (browser and server-fallback alike)
      window.speechSynthesis.cancel()
      if (_fallbackAudio) {
        try { _fallbackAudio.pause() } catch {}
        _fallbackAudio = null
      }
      setIsSpeaking(false)

      const lang = overrideLang ?? language
      const voice = getMatchedVoice(lang)

      if (!voice) {
        // No real voice on this device for the target language — use the
        // server-side espeak fallback instead of a wrong-language voice.
        playViaServerTTS(
          text,
          lang,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        )
        return
      }

      const utt = new SpeechSynthesisUtterance(text)
      utt.voice = voice
      utt.lang = voice.lang

      // Tuned for clarity with children: slightly slower, moderate pitch
      utt.rate = 0.88
      utt.pitch = 1.05
      utt.volume = 1

      utt.onstart = () => setIsSpeaking(true)
      utt.onend = () => setIsSpeaking(false)
      utt.onerror = (e) => {
        console.warn(`TTS failed for lang="${lang}" voice="${voice.name}":`, e.error)
        setIsSpeaking(false)
      }

      utteranceRef.current = utt
      window.speechSynthesis.speak(utt)
    },
    [isSupported, language, getMatchedVoice]
  )

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    if (_fallbackAudio) {
      try { _fallbackAudio.pause() } catch {}
      _fallbackAudio = null
    }
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
