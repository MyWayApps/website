// Shared data layer for the cross-language word games (Picture Vocabulary,
// Word Search, Crossword) — pulls straight from each language's existing
// lib/*-vocabulary-data.ts (same 14 categories / 166 words everywhere, only
// the native-script field name differs), so no new vocabulary needs curating.

import { vocabularyCategories as teluguCategories } from "@/lib/telugu-vocabulary-data"
import { vocabularyCategories as hindiCategories } from "@/lib/hindi-vocabulary-data"
import { vocabularyCategories as kannadaCategories } from "@/lib/kannada-vocabulary-data"
import { vocabularyCategories as tamilCategories } from "@/lib/tamil-vocabulary-data"
import { vocabularyCategories as malayalamCategories } from "@/lib/malayalam-vocabulary-data"
import { vocabularyCategories as sanskritCategories } from "@/lib/sanskrit-vocabulary-data"
import { VOCABULARY_EMOJI } from "@/lib/vocabulary-emoji-map"
import { segmentGraphemes } from "@/lib/word-grid"

export type LanguageCode = "telugu" | "hindi" | "kannada" | "tamil" | "malayalam" | "sanskrit"

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  telugu: "Telugu",
  hindi: "Hindi",
  kannada: "Kannada",
  tamil: "Tamil",
  malayalam: "Malayalam",
  sanskrit: "Sanskrit",
}

/** Maps each language to the script lib/transliteration.ts's romanize() needs — hindi and sanskrit both use Devanagari. */
export const LANGUAGE_SCRIPT: Record<LanguageCode, "devanagari" | "telugu" | "kannada" | "tamil" | "malayalam"> = {
  telugu: "telugu",
  hindi: "devanagari",
  kannada: "kannada",
  tamil: "tamil",
  malayalam: "malayalam",
  sanskrit: "devanagari",
}

interface RawVocabCategory {
  id: string
  nameEnglish: string
  items: { english: string; [nativeKey: string]: string }[]
}

const CATEGORY_MAP: Record<LanguageCode, RawVocabCategory[]> = {
  telugu: teluguCategories as unknown as RawVocabCategory[],
  hindi: hindiCategories as unknown as RawVocabCategory[],
  kannada: kannadaCategories as unknown as RawVocabCategory[],
  tamil: tamilCategories as unknown as RawVocabCategory[],
  malayalam: malayalamCategories as unknown as RawVocabCategory[],
  sanskrit: sanskritCategories as unknown as RawVocabCategory[],
}

export interface WordPair {
  english: string
  native: string
  categoryId: string
  categoryName: string
}

export interface CategoryInfo {
  id: string
  nameEnglish: string
  wordCount: number
}

export function getCategories(lang: LanguageCode): CategoryInfo[] {
  return CATEGORY_MAP[lang].map((c) => ({ id: c.id, nameEnglish: c.nameEnglish, wordCount: c.items.length }))
}

export function getWordPairs(lang: LanguageCode, categoryId: string): WordPair[] {
  const category = CATEGORY_MAP[lang].find((c) => c.id === categoryId)
  if (!category) return []
  return category.items.map((item) => ({
    english: item.english,
    native: item[lang],
    categoryId: category.id,
    categoryName: category.nameEnglish,
  }))
}

/** Word pairs that also have a mapped picture — the pool Picture Vocabulary draws from. */
export function getPicturableWordPairs(lang: LanguageCode, categoryId: string): (WordPair & { emoji: string })[] {
  return getWordPairs(lang, categoryId)
    .filter((w) => VOCABULARY_EMOJI[w.english])
    .map((w) => ({ ...w, emoji: VOCABULARY_EMOJI[w.english] }))
}

/** Categories that have at least `min` picturable words — what Picture Vocabulary's category picker offers. */
export function getPicturableCategories(lang: LanguageCode, min = 4): CategoryInfo[] {
  return getCategories(lang)
    .map((c) => ({ ...c, wordCount: getPicturableWordPairs(lang, c.id).length }))
    .filter((c) => c.wordCount >= min)
}

/** Categories with enough short, grid-friendly (<=10 letter) English words — Crossword fills its grid in English. */
export function getGridFriendlyCategories(lang: LanguageCode, min = 5): CategoryInfo[] {
  return getCategories(lang)
    .map((c) => ({
      ...c,
      wordCount: getWordPairs(lang, c.id).filter((w) => /^[A-Za-z]+$/.test(w.english) && w.english.length <= 10).length,
    }))
    .filter((c) => c.wordCount >= min)
}

export function getGridFriendlyWordPairs(lang: LanguageCode, categoryId: string): WordPair[] {
  return getWordPairs(lang, categoryId).filter((w) => /^[A-Za-z]+$/.test(w.english) && w.english.length <= 10)
}

/** Strips parenthetical asides (e.g. "వసంత ఋతువు (వసంతం)") and spaces so a phrase-like entry can still sit in one grid run. */
export function cleanNativeForGrid(native: string): string {
  return native.replace(/\([^)]*\)/g, "").replace(/\s+/g, "").trim()
}

/** Categories with enough native words short enough (<=10 grapheme clusters) to fit the Word Search grid. */
export function getNativeSearchCategories(lang: LanguageCode, min = 5, maxTokens = 10): CategoryInfo[] {
  return getCategories(lang)
    .map((c) => ({
      ...c,
      wordCount: getWordPairs(lang, c.id).filter((w) => {
        const tokens = segmentGraphemes(cleanNativeForGrid(w.native))
        return tokens.length > 0 && tokens.length <= maxTokens
      }).length,
    }))
    .filter((c) => c.wordCount >= min)
}

export function getNativeSearchWordPairs(lang: LanguageCode, categoryId: string, maxTokens = 10): WordPair[] {
  return getWordPairs(lang, categoryId).filter((w) => {
    const tokens = segmentGraphemes(cleanNativeForGrid(w.native))
    return tokens.length > 0 && tokens.length <= maxTokens
  })
}
