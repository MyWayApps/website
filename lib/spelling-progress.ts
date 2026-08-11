// Tracks, per word, which of the 6 spelling games the player has completed
// (answered correctly) at least once. Used to show a mastery checkmark once
// a word has been won in all 6 games.
const STORAGE_KEY = "spelling-game-word-progress"

export const SPELLING_GAME_IDS = [
  "spell-the-word",
  "type-the-word",
  "search-the-word",
  "balloon-pop",
  "word-rocket",
  "magic-garden",
] as const

type Progress = Record<string, string[]>

function load(): Progress {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(progress: Progress) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function markWordGameComplete(word: string, gameId: string) {
  const key = word.trim().toLowerCase()
  if (!key) return
  const progress = load()
  const completed = new Set(progress[key] || [])
  completed.add(gameId)
  progress[key] = Array.from(completed)
  save(progress)
}

export function isWordFullyComplete(word: string): boolean {
  const progress = load()
  const completed = progress[word.trim().toLowerCase()] || []
  return SPELLING_GAME_IDS.every((id) => completed.includes(id))
}

export function getCompletedGameCount(word: string): number {
  const progress = load()
  return (progress[word.trim().toLowerCase()] || []).length
}
