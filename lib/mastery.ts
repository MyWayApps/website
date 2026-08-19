// Single source of truth for mastery tiers across game cards, comprehension lesson
// cards, and subject rollups. Each activity supplies its own MasteryRequirements
// (accuracy thresholds are shared, but coverage/breadth/independence are opt-in)
// so computeMastery() never branches on activity type — new activity shapes plug
// in by declaring requirements, not by adding a case here.

export type MasteryTier = "not_started" | "practicing" | "developing" | "proficient" | "mastered"

export const DEVELOPING_THRESHOLD = 0.6
export const PROFICIENT_THRESHOLD = 0.8
export const MASTERY_THRESHOLD = 0.9

// Two attempts belong to the same session if they're close in time AND on the
// same calendar date — crossing midnight (even by a few minutes) still counts
// as a new session, matching how a parent/child would describe "yesterday" vs
// "today" rather than a pure rolling time window.
const SESSION_GAP_MINUTES = 45

export interface MasteryAttempt {
  percent: number
  timestamp: string
  independent: boolean
}

export interface RawEvidence {
  attempts: MasteryAttempt[]
  /** Unique questions ever answered correctly — only meaningful when requirements.coverage is set. */
  coverageNumerator?: number
  /** Has the activity's breadth/difficulty check (e.g. a boundary question) been satisfied? */
  breadthSatisfied?: boolean
}

export interface MasteryRequirements {
  developingThreshold?: number
  proficientThreshold?: number
  masteryThreshold?: number
  /** Separate qualifying sessions (not rounds) needed at masteryThreshold+ to reach Mastered. */
  qualifyingSessions: number
  /** Only for pools bigger than one round — coverage is meaningless when a round shows everything. */
  coverage?: { poolSize: number; threshold: number }
  breadthEvidence?: { label: string }
  /** Unused by every activity in v1 — no hints/reveal feature exists yet, wired in for later. */
  independenceRequired?: boolean
}

export interface TierMeta {
  stars: number
  color: "gray" | "blue" | "green" | "gold"
  badge: "none" | "crown"
  label: string
}

function sameCalendarDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function clusterIntoSessions(attempts: MasteryAttempt[]): MasteryAttempt[][] {
  const sorted = [...attempts].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
  const sessions: MasteryAttempt[][] = []

  for (const attempt of sorted) {
    const current = sessions[sessions.length - 1]
    const last = current?.[current.length - 1]
    const gapMinutes = last ? (Date.parse(attempt.timestamp) - Date.parse(last.timestamp)) / 60000 : Infinity
    const sameSession = last !== undefined && gapMinutes <= SESSION_GAP_MINUTES && sameCalendarDate(new Date(last.timestamp), new Date(attempt.timestamp))

    if (sameSession) {
      current.push(attempt)
    } else {
      sessions.push([attempt])
    }
  }

  return sessions
}

/** How many distinct sessions had at least one attempt at/above `masteryThreshold`. */
export function qualifyingSessionCount(attempts: MasteryAttempt[], masteryThreshold: number): number {
  return clusterIntoSessions(attempts).filter((session) => session.some((a) => a.percent >= masteryThreshold)).length
}

export function computeMastery(evidence: RawEvidence, requirements: MasteryRequirements): MasteryTier {
  if (evidence.attempts.length === 0) return "not_started"

  const developing = requirements.developingThreshold ?? DEVELOPING_THRESHOLD
  const proficient = requirements.proficientThreshold ?? PROFICIENT_THRESHOLD
  const mastery = requirements.masteryThreshold ?? MASTERY_THRESHOLD

  const bestPercent = Math.max(...evidence.attempts.map((a) => a.percent))

  if (bestPercent < developing) return "practicing"
  if (bestPercent < proficient) return "developing"
  if (bestPercent < mastery) return "proficient"

  // bestPercent already clears the mastery bar — Mastered still needs consistency
  // (+ coverage/breadth/independence where the activity requires them).
  if (qualifyingSessionCount(evidence.attempts, mastery) < requirements.qualifyingSessions) return "proficient"

  if (requirements.coverage) {
    const coverageRatio = (evidence.coverageNumerator ?? 0) / requirements.coverage.poolSize
    if (coverageRatio < requirements.coverage.threshold) return "proficient"
  }

  if (requirements.breadthEvidence && !evidence.breadthSatisfied) return "proficient"

  if (requirements.independenceRequired) {
    const independentBest = Math.max(0, ...evidence.attempts.filter((a) => a.independent).map((a) => a.percent))
    if (independentBest < mastery) return "proficient"
  }

  return "mastered"
}

const TIER_ORDER: MasteryTier[] = ["not_started", "practicing", "developing", "proficient", "mastered"]

/** Weakest-component rule for multi-part activities (e.g. a lesson's two games) — not mastered until every required part is. */
export function minTier(a: MasteryTier, b: MasteryTier): MasteryTier {
  return TIER_ORDER.indexOf(a) <= TIER_ORDER.indexOf(b) ? a : b
}

/**
 * Weakest-*attempted*-child rule for a parent card made of many sub-activities
 * (e.g. Number Sequence's 11 topics). Untouched children are excluded rather
 * than dragging the parent to Not Started forever — a child you haven't tried
 * yet isn't evidence of struggling, it's just untried. If a child that IS
 * being played is stuck at Practicing, the parent should say so rather than
 * averaging it away against strong scores elsewhere.
 */
export function minAttemptedTier(tiers: MasteryTier[]): MasteryTier {
  const attempted: MasteryTier[] = tiers.filter((t) => t !== "not_started")
  if (attempted.length === 0) return "not_started"
  return attempted.reduce((a, b) => minTier(a, b))
}

export function tierMeta(tier: MasteryTier): TierMeta {
  switch (tier) {
    case "not_started":
      return { stars: 0, color: "gray", badge: "none", label: "Not Started" }
    case "practicing":
      return { stars: 1, color: "blue", badge: "none", label: "Practicing" }
    case "developing":
      return { stars: 2, color: "blue", badge: "none", label: "Developing" }
    case "proficient":
      return { stars: 3, color: "green", badge: "none", label: "Proficient" }
    case "mastered":
      return { stars: 3, color: "gold", badge: "crown", label: "Mastered" }
  }
}
