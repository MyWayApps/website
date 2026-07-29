"use client"

import { useState, useRef, useEffect } from "react"
import { useLanguage, type Language } from "@/lib/language-context"

const LANGUAGES: { code: Language; label: string; nativeLabel: string; emoji: string }[] = [
  { code: "en", label: "English",  nativeLabel: "English", emoji: "🔤" },
  { code: "hi", label: "Hindi",    nativeLabel: "हिंदी",   emoji: "🇮🇳" },
  { code: "kn", label: "Kannada",  nativeLabel: "ಕನ್ನಡ",  emoji: "🌺" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const current = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0]

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="
          flex items-center gap-2 px-4 py-2 rounded-2xl
          bg-white/25 hover:bg-white/40 backdrop-blur-sm
          border-2 border-white/50 text-white font-bold text-sm
          transition-all duration-200 shadow-lg hover:shadow-xl
          hover:scale-105 active:scale-95
        "
      >
        <span className="text-lg" role="img" aria-hidden="true">{current.emoji}</span>
        <span>{current.nativeLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="
            absolute right-0 mt-2 w-48 rounded-2xl
            bg-white/95 backdrop-blur-md shadow-2xl
            border-2 border-purple-200 overflow-hidden z-50
            animate-in fade-in slide-in-from-top-2 duration-150
          "
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false) }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                transition-all duration-150 hover:bg-purple-50
                ${language === lang.code
                  ? "bg-purple-100 text-purple-700 font-bold"
                  : "text-gray-700 font-semibold"
                }
              `}
            >
              <span className="text-xl" role="img" aria-label={lang.label}>{lang.emoji}</span>
              <div>
                <div className="text-sm leading-tight">{lang.nativeLabel}</div>
                <div className="text-xs text-gray-400 leading-tight">{lang.label}</div>
              </div>
              {language === lang.code && (
                <svg className="ml-auto w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
