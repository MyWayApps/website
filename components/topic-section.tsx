import { AppCard } from "./app-card"

interface Application {
  id: string
  name: string
  category: string
  subcategory?: string
  description: string
  icon_emoji: string
  color_scheme: string
  route: string
  created_at: string
}

interface UserProgress {
  [appId: string]: {
    best_score: number
    total_attempts: number
    total_time_spent: number
    last_played_at: string
    streak_count: number
    achievements: string[]
  }
}

interface TopicSectionProps {
  topic: string
  apps: Application[]
  userProgress: UserProgress
  onPlayApp: (app: Application) => void
}

export function TopicSection({ topic, apps, userProgress, onPlayApp }: TopicSectionProps) {
  if (apps.length === 0) return null

  return (
    <div className="space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white">{topic}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} userProgress={userProgress[app.id]} onPlay={onPlayApp} />
        ))}
      </div>
    </div>
  )
}
