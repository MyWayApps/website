// Gathers RawEvidence (lib/mastery.ts) for a game card from the attempt-level
// history that's already being saved (localStorage mywayapps_offline_scores +
// Supabase mywayapps_user_scores), instead of the single per-app aggregate row
// in mywayapps_user_progress. That aggregate row can't tell "mastered Hours"
// apart from "mastered All Times" on the same game — the attempt log can,
// since every saveGameScore() call already records game_data per round.

import { computeMastery, minAttemptedTier, type MasteryAttempt, type MasteryTier, type RawEvidence } from "./mastery"
import { getMasteryRequirements, APP_SUBMODES } from "./mastery-config"

interface ScoreRecord {
  user_id: string
  application_id: string
  score: number
  max_score: number
  game_data?: Record<string, unknown> | null
  created_at: string
}

function readOfflineScores(userId: string, applicationId: string): ScoreRecord[] {
  if (typeof window === "undefined") return []
  try {
    const all: ScoreRecord[] = JSON.parse(localStorage.getItem("mywayapps_offline_scores") || "[]")
    return all.filter((r) => r.user_id === userId && r.application_id === applicationId)
  } catch {
    return []
  }
}

async function readSupabaseScores(userId: string, applicationId: string): Promise<ScoreRecord[]> {
  try {
    const { getUserScoreHistory } = await import("./database-supabase")
    return await getUserScoreHistory(userId, applicationId)
  } catch {
    return []
  }
}

export interface EvidenceOptions {
  /** Narrow attempts to the submode/range this card covers (e.g. clock reading's timeType). Omit for whole-app cards. */
  modeFilter?: (gameData: Record<string, unknown> | null | undefined) => boolean
  /** Does this attempt's game_data show the activity's breadth/difficulty requirement was met? */
  breadthCheck?: (gameData: Record<string, unknown> | null | undefined) => boolean
  /** Coverage numerator (unique questions ever answered correctly) — only for activities with a `coverage` requirement; comes from lib/question-history.ts's getCoverageStats(). */
  coverageNumerator?: number
}

export async function gatherGameEvidence(
  userId: string,
  applicationId: string,
  options: EvidenceOptions = {},
): Promise<RawEvidence> {
  const [offline, remote] = await Promise.all([
    Promise.resolve(readOfflineScores(userId, applicationId)),
    readSupabaseScores(userId, applicationId),
  ])

  // De-dupe: an attempt saved while online exists in both lists (offline
  // write happens only when saveGameScore's Supabase path fails), so merging
  // by timestamp+score is close enough for v1 evidence gathering rather than
  // needing a shared attempt id across both storage paths.
  const seen = new Set<string>()
  const merged: ScoreRecord[] = []
  for (const record of [...remote, ...offline]) {
    const key = `${record.created_at}:${record.score}:${record.max_score}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(record)
  }

  const relevant = options.modeFilter ? merged.filter((r) => options.modeFilter!(r.game_data)) : merged

  const attempts: MasteryAttempt[] = relevant.map((r) => ({
    percent: r.max_score > 0 ? r.score / r.max_score : 0,
    timestamp: r.created_at,
    independent: true, // no hints/reveal feature exists yet — every v1 attempt is independent
  }))

  return {
    attempts,
    breadthSatisfied: options.breadthCheck ? relevant.some((r) => options.breadthCheck!(r.game_data)) : undefined,
    coverageNumerator: options.coverageNumerator,
  }
}

export async function getActivityMasteryTier(
  userId: string,
  applicationId: string,
  configKey: string,
  options: EvidenceOptions = {},
): Promise<MasteryTier> {
  const evidence = await gatherGameEvidence(userId, applicationId, options)
  return computeMastery(evidence, getMasteryRequirements(configKey))
}

/**
 * An app's card-level tier. Apps declared in APP_SUBMODES (lib/mastery-config.ts)
 * are a bundle of independently-tracked sub-activities sharing one
 * applicationId (e.g. Number Sequence's 11 topics) — their card shows the
 * weakest *attempted* sub-activity (lib/mastery.ts's minAttemptedTier), not
 * one tier pooled across every attempt regardless of which sub-activity it
 * was. Apps without a submode declaration fall back to that pooled tier.
 */
export async function getAppMasteryTier(userId: string, applicationId: string): Promise<MasteryTier> {
  const submodes = APP_SUBMODES[applicationId]
  if (!submodes) return getActivityMasteryTier(userId, applicationId, "default")

  const tiers = await Promise.all(
    submodes.map((s) => getActivityMasteryTier(userId, applicationId, s.configKey, { modeFilter: s.modeFilter })),
  )
  return minAttemptedTier(tiers)
}
