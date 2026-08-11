// Named, dated custom word lists for the Spelling Game Suite. Replaces the
// old single flat `spelling-game-custom-words` array, which had no concept
// of separate lists or dates and silently accepted comma-glued paste text
// as one "word".
export interface CustomWordList {
  id: string
  words: string[]
  createdAt: string // ISO timestamp
}

const STORAGE_KEY = "spelling-game-custom-word-lists"
const LEGACY_STORAGE_KEY = "spelling-game-custom-words"

function splitWords(raw: string): string[] {
  return raw
    .split(/[,\n]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean)
}

function readRaw(): CustomWordList[] {
  if (typeof window === "undefined") return []
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // fall through to legacy migration
  }

  // One-time migration: the old key stored a flat string[] with no dates,
  // and a since-fixed bug let comma-separated paste text through as a
  // single "word" (e.g. "this,then,with,thin,think, thick") — re-split
  // those on migration so existing users don't lose what they typed.
  try {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const legacyWords: string[] = JSON.parse(legacy)
      const words = [...new Set(legacyWords.flatMap(splitWords))]
      if (words.length > 0) {
        const migrated: CustomWordList[] = [{ id: crypto.randomUUID(), words, createdAt: new Date().toISOString() }]
        write(migrated)
        window.localStorage.removeItem(LEGACY_STORAGE_KEY)
        return migrated
      }
    }
  } catch {
    // ignore corrupt legacy data
  }

  return []
}

function write(lists: CustomWordList[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

export function getCustomWordLists(): CustomWordList[] {
  return readRaw()
}

/** Splits `raw` on commas/newlines so pasting "cat, dog, sun" adds 3 words instead of 1. */
export function parseWordsInput(raw: string): string[] {
  return splitWords(raw)
}

export function addCustomWordList(words: string[]): CustomWordList {
  const unique = [...new Set(words.map((w) => w.trim().toLowerCase()).filter(Boolean))]
  const list: CustomWordList = { id: crypto.randomUUID(), words: unique, createdAt: new Date().toISOString() }
  const lists = [list, ...readRaw()]
  write(lists)
  return list
}

export function deleteCustomWordList(id: string) {
  write(readRaw().filter((l) => l.id !== id))
}
