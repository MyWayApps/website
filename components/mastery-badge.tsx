"use client"

import { Star, Crown } from "lucide-react"
import { tierMeta, type MasteryTier } from "@/lib/mastery"

interface MasteryBadgeProps {
  tier: MasteryTier
  size?: "sm" | "md"
  /** Show the tier name ("Developing", "Proficient", ...) next to the stars — off by default so compact spots (mode-select buttons) stay just stars. */
  showLabel?: boolean
}

const STAR_COLOR_CLASSES: Record<string, string> = {
  gray: "text-gray-300",
  blue: "text-blue-500",
  green: "text-green-700",
  gold: "text-yellow-500",
}

const LABEL_COLOR_CLASSES: Record<string, string> = {
  gray: "text-gray-500",
  blue: "text-blue-600",
  green: "text-green-800",
  gold: "text-yellow-600",
}

/**
 * Shared stars + tier badge — the single place every card type (game, lesson,
 * subject) and the post-game results screen render mastery, so the visual
 * language never diverges between them. Mastered gets a distinct crown, not
 * just a gold-tinted version of the same 3 stars, so it reads as a different
 * state at a glance.
 */
export function MasteryBadge({ tier, size = "md", showLabel = false }: MasteryBadgeProps) {
  const meta = tierMeta(tier)

  if (meta.badge === "crown") {
    return (
      <div className="flex items-center gap-1.5" title={meta.label}>
        <Crown className={`${size === "sm" ? "h-4 w-4" : "h-6 w-6"} text-yellow-500 fill-yellow-400`} />
        <span className={`font-bold text-yellow-600 ${size === "sm" ? "text-xs" : "text-sm"}`}>{meta.label}</span>
      </div>
    )
  }

  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"

  return (
    <div className="flex items-center gap-1.5" title={meta.label}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }, (_, i) => (
          <Star
            key={i}
            className={`${starSize} ${i < meta.stars ? `fill-current ${STAR_COLOR_CLASSES[meta.color]}` : "text-gray-200"}`}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`font-semibold ${LABEL_COLOR_CLASSES[meta.color]} ${size === "sm" ? "text-xs" : "text-sm"}`}>
          {meta.label}
        </span>
      )}
    </div>
  )
}
