// User-added sentences for the English Sentences suite: a single flat,
// dated pool (unlike the Spelling Suite's grouped word "lists" — sentences
// are practiced one at a time, so there's no need to group them into
// separate named rounds) stored in localStorage.
export interface CustomSentence {
  id: string
  text: string
  createdAt: string // ISO timestamp
}

const STORAGE_KEY = "english-sentences-custom"

function read(): CustomSentence[] {
  if (typeof window === "undefined") return []
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function write(sentences: CustomSentence[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sentences))
}

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ")
}

export function getCustomSentences(): CustomSentence[] {
  return read()
}

export function addCustomSentence(text: string): CustomSentence | null {
  const clean = normalize(text)
  if (!clean) return null
  const entry: CustomSentence = { id: crypto.randomUUID(), text: clean, createdAt: new Date().toISOString() }
  write([entry, ...read()])
  return entry
}

export function deleteCustomSentence(id: string) {
  write(read().filter((s) => s.id !== id))
}
