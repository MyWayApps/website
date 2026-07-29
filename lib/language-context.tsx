"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Language = "en" | "hi" | "kn"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// ─── Translations ────────────────────────────────────────────────────────────

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.welcome": "Welcome to MyWayApps! 🌈",
    "app.subtitle": "A Colorful World of Learning!",
    "app.loading": "Loading MyWayApps...",
    "app.portal": "Educational Games Portal",
    "app.welcomeBack": "Welcome back",
    "app.contact": "Contact",
    "app.logout": "Logout",
    "app.contactUs": "Contact Us",
    "lang.choose": "Language",
    "lang.en": "English",
    "lang.hi": "हिंदी",
    "lang.kn": "ಕನ್ನಡ",
    // Kannada module entries
    "kn.letters.name": "Kannada Letters",
    "kn.letters.desc": "Learn Kannada alphabet with flashcards and games",
    "hi.letters.name": "Hindi Letters",
    "hi.letters.desc": "Learn Hindi alphabet with flashcards and games",
  },
  hi: {
    "app.welcome": "MyWayApps में आपका स्वागत है! 🌈",
    "app.subtitle": "सीखने की एक रंगीन दुनिया!",
    "app.loading": "MyWayApps लोड हो रहा है...",
    "app.portal": "शैक्षिक खेल पोर्टल",
    "app.welcomeBack": "वापस स्वागत है",
    "app.contact": "संपर्क",
    "app.logout": "लॉग आउट",
    "app.contactUs": "हमसे संपर्क करें",
    "lang.choose": "भाषा",
    "lang.en": "English",
    "lang.hi": "हिंदी",
    "lang.kn": "ಕನ್ನಡ",
    "kn.letters.name": "कन्नड़ अक्षर",
    "kn.letters.desc": "फ्लैशकार्ड और खेलों के साथ कन्नड़ वर्णमाला सीखें",
    "hi.letters.name": "हिंदी अक्षर",
    "hi.letters.desc": "फ्लैशकार्ड और खेलों के साथ हिंदी वर्णमाला सीखें",
  },
  kn: {
    "app.welcome": "MyWayApps ಗೆ ಸ್ವಾಗತ! 🌈",
    "app.subtitle": "ಕಲಿಕೆಯ ಬಣ್ಣಮಯ ಜಗತ್ತು!",
    "app.loading": "MyWayApps ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "app.portal": "ಶೈಕ್ಷಣಿಕ ಆಟಗಳ ಪೋರ್ಟಲ್",
    "app.welcomeBack": "ಮತ್ತೆ ಸ್ವಾಗತ",
    "app.contact": "ಸಂಪರ್ಕ",
    "app.logout": "ಲಾಗ್ ಔಟ್",
    "app.contactUs": "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
    "lang.choose": "ಭಾಷೆ",
    "lang.en": "English",
    "lang.hi": "हिंदी",
    "lang.kn": "ಕನ್ನಡ",
    "kn.letters.name": "ಕನ್ನಡ ಅಕ್ಷರಗಳು",
    "kn.letters.desc": "ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ಆಟಗಳ ಮೂಲಕ ಕನ್ನಡ ವರ್ಣಮಾಲೆ ಕಲಿಯಿರಿ",
    "hi.letters.name": "ಹಿಂದಿ ಅಕ್ಷರಗಳು",
    "hi.letters.desc": "ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ಆಟಗಳ ಮೂಲಕ ಹಿಂದಿ ವರ್ಣಮಾಲೆ ಕಲಿಯಿರಿ",
  },
}

// ─── Context ─────────────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("mywayapps_language") as Language | null
    if (saved && ["en", "hi", "kn"].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("mywayapps_language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] ?? translations["en"][key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
