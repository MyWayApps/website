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

interface CategorySectionProps {
  category: string
  apps: Application[]
  userProgress: UserProgress
  onPlayApp: (app: Application) => void
}

export function CategorySection({ category, apps, userProgress, onPlayApp }: CategorySectionProps) {
  const categoryApps = apps.filter((app) => app.category === category)

  if (categoryApps.length === 0) return null

  // Group by subcategory
  const subcategories = categoryApps.reduce(
    (acc, app) => {
      const sub = app.subcategory || "General"
      if (!acc[sub]) acc[sub] = []
      acc[sub].push(app)
      return acc
    },
    {} as Record<string, Application[]>,
  )

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white mb-6">{category}</h2>

      {Object.entries(subcategories).map(([subcategory, subApps]) => {
        // Create ID from subcategory name (e.g., "Math" -> "math", "Life Skills" -> "life-skills")
        const subcategoryId = subcategory.toLowerCase().replace(/\s+/g, '-')
        
        return (
        <div key={subcategory} id={subcategoryId} className="space-y-4 scroll-mt-24">
          {Object.keys(subcategories).length > 1 && (
            <h3 className="text-xl font-semibold text-white/90 text-center">{subcategory}</h3>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subApps.map((app) => (
              <AppCard key={app.id} app={app} userProgress={userProgress[app.id]} onPlay={onPlayApp} />
            ))}
          </div>
        </div>
        )
      })}
    </div>
  )
}
