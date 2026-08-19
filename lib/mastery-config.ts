// Per-activity mastery requirements, keyed by a stable slug (not the DB
// Applications UUID, which varies by environment/seed data). computeMastery()
// in lib/mastery.ts never branches on activity type — this file is where each
// activity declares what evidence it needs, per the plan's "configuration, not
// hardcoded branches" principle.

import type { MasteryRequirements } from "./mastery"

/** Used by any app-level card that doesn't have a specific config below yet — accuracy + consistency only. */
export const DEFAULT_REQUIREMENTS: MasteryRequirements = {
  qualifyingSessions: 2,
}

export const MASTERY_CONFIGS: Record<string, MasteryRequirements> = {
  "clock-reading:hours": {
    qualifyingSessions: 2,
    coverage: { poolSize: 12, threshold: 0.9 },
  },
  "clock-reading:half-hour": {
    qualifyingSessions: 2,
    coverage: { poolSize: 24, threshold: 0.9 },
  },
  "clock-reading:quarter-hour": {
    qualifyingSessions: 2,
    coverage: { poolSize: 48, threshold: 0.9 },
  },
  "clock-reading:all-times": {
    qualifyingSessions: 2,
    coverage: { poolSize: 144, threshold: 0.9 },
  },

  "number-sequence:number-compare:10": {
    qualifyingSessions: 2,
  },
  "number-sequence:number-compare:50": {
    qualifyingSessions: 2,
    breadthEvidence: { label: "a boundary question (49 or 50) answered correctly" },
  },
  "number-sequence:number-compare:100": {
    qualifyingSessions: 2,
    breadthEvidence: { label: "a boundary question (99 or 100) answered correctly" },
  },
  "number-sequence:number-compare:1000": {
    qualifyingSessions: 3,
    breadthEvidence: { label: "a boundary question (999 or 1000) answered correctly" },
  },

  // Comprehension lesson games: tiny fixed pools (2-5 questions per game).
  // No coverage requirement — clearing 90% on a pool this small already
  // requires near-total correctness that round, so a separate coverage
  // dimension would be redundant (see plan's worked बिल्ली example).
  "hindi-comprehension:1:game1": { qualifyingSessions: 2 },
  "hindi-comprehension:1:game2": { qualifyingSessions: 2 },
}

export function getMasteryRequirements(configKey: string): MasteryRequirements {
  return MASTERY_CONFIGS[configKey] ?? DEFAULT_REQUIREMENTS
}

export interface AppSubmode {
  /** Matches the id used in that activity's own UI (e.g. a Number Sequence TopicId). */
  id: string
  configKey: string
  modeFilter: (gameData: Record<string, unknown> | null | undefined) => boolean
}

/**
 * Declares which apps are actually a bundle of independently-tracked
 * sub-activities sharing one Applications row/applicationId — used to compute
 * a parent card's tier as the weakest *attempted* sub-activity (minAttemptedTier
 * in lib/mastery.ts) instead of pooling every attempt into one bucket, and to
 * render a badge per sub-activity on that app's own topic-select screen.
 * Apps not listed here fall back to one pooled tier across all their attempts.
 */
const DIGIT_LEVELS = ["1", "2", "3"] as const

/** Same digit-level breakdown (1/2/3-digit) applies uniformly across every math operation — one generator instead of hand-writing 4 identical blocks. */
function digitLevelSubmodes(operation: string): AppSubmode[] {
  return DIGIT_LEVELS.map((level) => ({
    id: level,
    configKey: `math-operations:${operation}:${level}`,
    modeFilter: (g) => g?.digitLevel === level,
  }))
}

export const APP_SUBMODES: Record<string, AppSubmode[]> = {
  "math-3": digitLevelSubmodes("add"),
  "math-4": digitLevelSubmodes("subtract"),
  "math-5": digitLevelSubmodes("multiply"),
  "math-6": digitLevelSubmodes("divide"),

  "2": [
    { id: "hours", configKey: "clock-reading:hours", modeFilter: (g) => g?.mode === "hours" },
    { id: "half-hour", configKey: "clock-reading:half-hour", modeFilter: (g) => g?.mode === "half-hour" },
    { id: "quarter-hour", configKey: "clock-reading:quarter-hour", modeFilter: (g) => g?.mode === "quarter-hour" },
    { id: "all-times", configKey: "clock-reading:all-times", modeFilter: (g) => g?.mode === "all-times" },
  ],
  "1": [
    { id: "forward-backward", configKey: "number-sequence:forward-backward", modeFilter: (g) => g?.topicId === "forward-backward" },
    { id: "counting-shapes", configKey: "number-sequence:counting-shapes", modeFilter: (g) => g?.topicId === "counting-shapes" },
    { id: "number-neighbors", configKey: "number-sequence:number-neighbors", modeFilter: (g) => g?.topicId === "number-neighbors" },
    { id: "number-compare", configKey: "number-sequence:number-compare", modeFilter: (g) => g?.topicId === "number-compare" },
    { id: "who-has-more", configKey: "number-sequence:who-has-more", modeFilter: (g) => g?.topicId === "who-has-more" },
    { id: "place-value", configKey: "number-sequence:place-value", modeFilter: (g) => g?.topicId === "place-value" },
    { id: "neighbor-grid", configKey: "number-sequence:neighbor-grid", modeFilter: (g) => g?.topicId === "neighbor-grid" },
    { id: "number-words", configKey: "number-sequence:number-words", modeFilter: (g) => g?.topicId === "number-words" },
    { id: "arrange-order", configKey: "number-sequence:arrange-order", modeFilter: (g) => g?.topicId === "arrange-order" },
    { id: "greatest-smallest", configKey: "number-sequence:greatest-smallest", modeFilter: (g) => g?.topicId === "greatest-smallest" },
    { id: "tens-ones-count", configKey: "number-sequence:tens-ones-count", modeFilter: (g) => g?.topicId === "tens-ones-count" },
  ],
}
