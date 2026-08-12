// User-added sentences for the per-language Sentences suite — same shape as
// lib/custom-sentences.ts (English), but keyed per language so each
// language keeps its own pool.
import type { LanguageCode } from "@/lib/language-games-data"

export interface CustomSentence {
  id: string
  text: string
  createdAt: string // ISO timestamp
}

function storageKey(lang: LanguageCode): string {
  return `language-sentences-custom-${lang}`
}

function read(lang: LanguageCode): CustomSentence[] {
  if (typeof window === "undefined") return []
  try {
    const saved = window.localStorage.getItem(storageKey(lang))
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function write(lang: LanguageCode, sentences: CustomSentence[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(storageKey(lang), JSON.stringify(sentences))
}

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ")
}

export function getCustomSentences(lang: LanguageCode): CustomSentence[] {
  return read(lang)
}

export function addCustomSentence(lang: LanguageCode, text: string): CustomSentence | null {
  const clean = normalize(text)
  if (!clean) return null
  const entry: CustomSentence = { id: crypto.randomUUID(), text: clean, createdAt: new Date().toISOString() }
  write(lang, [entry, ...read(lang)])
  return entry
}

export function deleteCustomSentence(lang: LanguageCode, id: string) {
  write(lang, read(lang).filter((s) => s.id !== id))
}
