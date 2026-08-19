// Sitewide "don't repeat questions" tracking. Every game's random-question
// generator should route through pickUnseen()/pickUnseenRandom() instead of
// raw Math.random()/randInt(), so a signed-in user doesn't see the same
// question twice until the full pool for that game has been exhausted, at
// which point it transparently resets and starts a fresh cycle.
//
// Guests (no signed-in user) degrade gracefully to plain random selection —
// there's no user id to key storage off of, so nothing is tracked.

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null
  try {
    const saved = localStorage.getItem("mywayapps_current_user")
    if (!saved) return null
    const parsed = JSON.parse(saved)
    return parsed?.id ?? null
  } catch {
    return null
  }
}

function storageKey(gameKey: string, userId: string): string {
  return `mywayapps_seen_${userId}_${gameKey}`
}

export function getSeenKeys(gameKey: string): Set<string> {
  const userId = getCurrentUserId()
  if (!userId) return new Set()
  try {
    const raw = localStorage.getItem(storageKey(gameKey, userId))
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function resetSeen(gameKey: string): void {
  const userId = getCurrentUserId()
  if (!userId) return
  try {
    localStorage.removeItem(storageKey(gameKey, userId))
  } catch {
    // ignore
  }
}

export function recordSeen(gameKey: string, signature: string): void {
  const userId = getCurrentUserId()
  if (!userId) return
  try {
    const seen = getSeenKeys(gameKey)
    seen.add(signature)
    localStorage.setItem(storageKey(gameKey, userId), JSON.stringify([...seen]))
  } catch {
    // ignore quota errors — tracking is best-effort, never blocks gameplay
  }
}

/** Pick a random item from `pool` that this user hasn't seen for `gameKey` yet. */
export function pickUnseen<T>(gameKey: string, pool: T[], keyFn: (item: T) => string): T {
  const seen = getSeenKeys(gameKey)
  let unseen = pool.filter((item) => !seen.has(keyFn(item)))
  if (unseen.length === 0) {
    resetSeen(gameKey)
    unseen = pool
  }
  const picked = unseen[Math.floor(Math.random() * unseen.length)]
  recordSeen(gameKey, keyFn(picked))
  return picked
}

/** Pick a random integer in [min, max] this user hasn't seen for `gameKey` yet. */
export function pickUnseenRandom(gameKey: string, min: number, max: number, maxAttempts = 20): number {
  const seen = getSeenKeys(gameKey)
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = Math.floor(Math.random() * (max - min + 1)) + min
    if (!seen.has(String(candidate))) {
      recordSeen(gameKey, String(candidate))
      return candidate
    }
  }
  // Couldn't find an unseen value in maxAttempts tries — pool is exhausted
  // for this range. Reset and start a fresh cycle rather than looping forever.
  resetSeen(gameKey)
  const candidate = Math.floor(Math.random() * (max - min + 1)) + min
  recordSeen(gameKey, String(candidate))
  return candidate
}

// ─── Coverage tracking (which questions has this user ever answered right?) ──
//
// Separate from the seen/no-repeat tracking above: recordSeen() fires when a
// question is *picked*, this fires when the game knows whether the answer was
// *correct*. Used by fixed-pool activities (e.g. Clock Reading) whose mastery
// requires broad coverage of the pool, not just a high score on one sample.

function correctStorageKey(gameKey: string, userId: string): string {
  return `mywayapps_correct_${userId}_${gameKey}`
}

function getCorrectKeys(gameKey: string): Set<string> {
  const userId = getCurrentUserId()
  if (!userId) return new Set()
  try {
    const raw = localStorage.getItem(correctStorageKey(gameKey, userId))
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

/** Call once an answer is known to be right or wrong — ratchets: a question that's ever been answered correctly stays covered. */
export function recordAnswer(gameKey: string, signature: string, isCorrect: boolean): void {
  const userId = getCurrentUserId()
  if (!userId) return

  if (isCorrect) {
    try {
      const correct = getCorrectKeys(gameKey)
      correct.add(signature)
      localStorage.setItem(correctStorageKey(gameKey, userId), JSON.stringify([...correct]))
    } catch {
      // ignore quota errors — best-effort
    }
  }
}

/** Coverage = share of a fixed-size pool ever answered correctly. */
export function getCoverageStats(gameKey: string, poolSize: number): { coverage: number; correctCount: number } {
  const correctCount = getCorrectKeys(gameKey).size
  return { coverage: poolSize > 0 ? correctCount / poolSize : 0, correctCount }
}

// ─── Local export ────────────────────────────────────────────────────────
//
// Per-question detail (seen questions + correct answers, keyed by game) lives
// only in this browser's localStorage — it's never sent to Supabase. This
// lets a user save a copy of that detail to their own device instead.

function listGameKeysForPrefix(userId: string, prefix: string): { gameKey: string; storageKey: string }[] {
  const keyPrefix = `${prefix}_${userId}_`
  const results: { gameKey: string; storageKey: string }[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(keyPrefix)) {
      results.push({ gameKey: key.slice(keyPrefix.length), storageKey: key })
    }
  }
  return results
}

/** Builds a JSON-serializable snapshot of this user's per-question history for export. */
export function buildQuestionHistoryExport(userId: string): Record<string, unknown> {
  const seenByGame: Record<string, string[]> = {}
  for (const { gameKey, storageKey } of listGameKeysForPrefix(userId, "mywayapps_seen")) {
    try {
      seenByGame[gameKey] = JSON.parse(localStorage.getItem(storageKey) || "[]")
    } catch {
      seenByGame[gameKey] = []
    }
  }

  const correctByGame: Record<string, string[]> = {}
  for (const { gameKey, storageKey } of listGameKeysForPrefix(userId, "mywayapps_correct")) {
    try {
      correctByGame[gameKey] = JSON.parse(localStorage.getItem(storageKey) || "[]")
    } catch {
      correctByGame[gameKey] = []
    }
  }

  return {
    exportedAt: new Date().toISOString(),
    userId,
    seenQuestionsByGame: seenByGame,
    correctAnswersByGame: correctByGame,
  }
}

/** Downloads this user's per-question history as a JSON file onto their device. */
export function downloadQuestionHistory(userId: string): void {
  if (typeof window === "undefined") return
  const data = buildQuestionHistoryExport(userId)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `mywayapps-question-history-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
