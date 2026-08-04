import { saveUserScore, saveSubjectProgress } from "@/lib/database-supabase"

/**
 * Consolidated scoring/progress persistence, used by every game page instead of
 * each duplicating its own "try Supabase, fall back to localStorage" block.
 */

export interface UserProgressEntry {
  best_score: number
  total_attempts: number
  total_time_spent: number
  last_played_at: string
  streak_count: number
  achievements: string[]
}

export interface SaveGameScoreInput {
  userId: string
  applicationId: string
  score: number
  maxScore: number
  /** Pre-computed elapsed seconds — callers already do this Date.now() math themselves. */
  completionTimeSec?: number
  difficultyLevel?: string
  gameData?: Record<string, unknown>
  /** Caller already knows this from its own testConnection() call in initializeData(). */
  isConnected: boolean
  /**
   * The app catalogue's subcategory (e.g. "Math", "Telugu", "Kannada") — rolls
   * this score up into a per-subject total in addition to the per-app one.
   * Optional so existing call sites keep working while being retrofitted.
   */
  subject?: string
}

export interface SubjectProgressEntry {
  totalScore: number
  totalAttempts: number
  bestPercentage: number
  lastPlayedAt: string
}

export interface SaveGameScoreResult {
  savedTo: "supabase" | "local"
  progress: UserProgressEntry
}

const PASS_THRESHOLD = 0.6 // >=60% of a round counts as a "pass" toward the streak

function progressKey(userId: string) {
  return `mywayapps_progress_${userId}`
}

function computeAchievements(
  prev: UserProgressEntry,
  input: SaveGameScoreInput,
  percent: number,
  nextStreak: number,
): string[] {
  const achievements = new Set(prev.achievements)
  if (prev.total_attempts === 0) achievements.add("first-completion")
  if (percent === 1) achievements.add("perfect-round")
  if (input.score > prev.best_score) achievements.add("new-best-score")
  if (nextStreak >= 3) achievements.add("streak-3")
  if (nextStreak >= 5) achievements.add("streak-5")
  return Array.from(achievements)
}

function updateLocalProgress(input: SaveGameScoreInput): UserProgressEntry {
  const key = progressKey(input.userId)
  const all: Record<string, UserProgressEntry> = JSON.parse(localStorage.getItem(key) || "{}")
  const prev: UserProgressEntry = all[input.applicationId] ?? {
    best_score: 0,
    total_attempts: 0,
    total_time_spent: 0,
    last_played_at: "",
    streak_count: 0,
    achievements: [],
  }

  const percent = input.maxScore > 0 ? input.score / input.maxScore : 0
  const nextStreak = percent >= PASS_THRESHOLD ? prev.streak_count + 1 : 0

  const next: UserProgressEntry = {
    best_score: Math.max(prev.best_score, input.score),
    total_attempts: prev.total_attempts + 1,
    total_time_spent: prev.total_time_spent + (input.completionTimeSec ?? 0),
    last_played_at: new Date().toISOString(),
    streak_count: nextStreak,
    achievements: computeAchievements(prev, input, percent, nextStreak),
  }

  all[input.applicationId] = next
  localStorage.setItem(key, JSON.stringify(all))
  return next
}

function subjectProgressKey(userId: string) {
  return `mywayapps_subject_progress_${userId}`
}

function updateLocalSubjectProgress(input: SaveGameScoreInput): SubjectProgressEntry | null {
  if (!input.subject) return null

  const key = subjectProgressKey(input.userId)
  const all: Record<string, SubjectProgressEntry> = JSON.parse(localStorage.getItem(key) || "{}")
  const prev: SubjectProgressEntry = all[input.subject] ?? {
    totalScore: 0,
    totalAttempts: 0,
    bestPercentage: 0,
    lastPlayedAt: "",
  }

  const percent = input.maxScore > 0 ? input.score / input.maxScore : 0
  const next: SubjectProgressEntry = {
    totalScore: prev.totalScore + input.score,
    totalAttempts: prev.totalAttempts + 1,
    bestPercentage: Math.max(prev.bestPercentage, percent),
    lastPlayedAt: new Date().toISOString(),
  }

  all[input.subject] = next
  localStorage.setItem(key, JSON.stringify(all))
  return next
}

/** Reads the per-subject rollup (e.g. for a "Your Math score" dashboard). */
export function getSubjectProgress(userId: string): Record<string, SubjectProgressEntry> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(subjectProgressKey(userId)) || "{}")
  } catch {
    return {}
  }
}

function saveScoreToOfflineStorage(record: {
  user_id: string
  application_id: string
  score: number
  max_score: number
  completion_time?: number
  difficulty_level?: string
  game_data?: unknown
  created_at: string
}) {
  const existing = JSON.parse(localStorage.getItem("mywayapps_offline_scores") || "[]")
  existing.push(record)
  localStorage.setItem("mywayapps_offline_scores", JSON.stringify(existing))
}

export async function saveGameScore(input: SaveGameScoreInput): Promise<SaveGameScoreResult> {
  const record = {
    user_id: input.userId,
    application_id: input.applicationId,
    score: input.score,
    max_score: input.maxScore,
    completion_time: input.completionTimeSec,
    difficulty_level: input.difficultyLevel,
    game_data: input.gameData,
  }

  let savedTo: "supabase" | "local" = "local"
  if (input.isConnected) {
    try {
      const saved = await saveUserScore(record as any)
      if (saved) savedTo = "supabase"
    } catch (error) {
      console.error("❌ Error saving score to Supabase:", error)
    }
  }
  if (savedTo === "local") {
    saveScoreToOfflineStorage({ ...record, created_at: new Date().toISOString() })
  }

  // Local progress tracking is a client-only concern the homepage reads directly
  // from localStorage — kept independent of whether Supabase save succeeded.
  const progress = updateLocalProgress(input)
  updateLocalSubjectProgress(input)

  if (input.subject && input.isConnected) {
    try {
      await saveSubjectProgress(input.userId, input.subject, input.score, input.maxScore)
    } catch (error) {
      console.error("❌ Error saving subject progress to Supabase:", error)
    }
  }

  return { savedTo, progress }
}
