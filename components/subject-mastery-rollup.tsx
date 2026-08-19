"use client"

import { useEffect, useState } from "react"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"

interface SubjectMasteryRollupProps {
  userId: string
  apps: { id: string }[]
}

const TIER_ORDER: MasteryTier[] = ["mastered", "proficient", "developing", "practicing", "not_started"]

const TIER_BAR_COLORS: Record<MasteryTier, string> = {
  mastered: "bg-yellow-400",
  proficient: "bg-green-500",
  developing: "bg-blue-500",
  practicing: "bg-blue-300",
  not_started: "bg-white/30",
}

/**
 * "X/Y mastered" + a stacked tier-distribution bar for a subject (e.g. Math),
 * computed at render time from each child app's own mastery tier — count-based
 * rather than one averaged percentage, so it stays readable as "14/20 mastered"
 * the way a parent/child would actually read progress.
 */
export function SubjectMasteryRollup({ userId, apps }: SubjectMasteryRollupProps) {
  const [tiers, setTiers] = useState<MasteryTier[]>([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const results = await Promise.all(apps.map((app) => getActivityMasteryTier(userId, app.id, "default")))
      if (!cancelled) setTiers(results)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId, apps])

  if (tiers.length === 0) return null

  const total = tiers.length
  const masteredCount = tiers.filter((t) => t === "mastered").length

  return (
    <div className="max-w-md mx-auto mb-2">
      <div className="text-center text-white/90 font-bold text-sm mb-1">
        {masteredCount}/{total} mastered
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-white/20">
        {TIER_ORDER.map((tier) => {
          const count = tiers.filter((t) => t === tier).length
          if (count === 0) return null
          return <div key={tier} className={TIER_BAR_COLORS[tier]} style={{ width: `${(count / total) * 100}%` }} />
        })}
      </div>
    </div>
  )
}
