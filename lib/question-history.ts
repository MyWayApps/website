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
  void mirrorToSupabase(gameKey, userId, signature)
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

async function mirrorToSupabase(gameKey: string, userId: string, signature: string): Promise<void> {
  try {
    const { supabase } = await import("./supabase-client")
    if (!supabase) return
    await supabase
      .from("mywayapps_user_question_history")
      .insert([{ user_id: userId, game_key: gameKey, question_signature: signature }])
  } catch {
    // best-effort — localStorage above is the source of truth for gameplay
  }
}
