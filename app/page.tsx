"use client"
import { useState, useEffect } from "react"
import { CategorySection } from "@/components/category-section"
import { UserAuth } from "@/components/user-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Mail, Phone, MapPin, LogOut, Loader2 } from "lucide-react"
import MainNavigationMenu from "@/components/main-navigation-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AnimatedMascots } from "@/components/animated-mascots"
import { useLanguage } from "@/lib/language-context"

// ─── Types (unchanged) ────────────────────────────────────────────────────────
interface User {
  id: string
  email?: string
  name: string
  age?: number
  grade?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}
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
interface UserStats {
  totalGamesPlayed: number
  totalScore: number
  averageScore: number
  timeSpent: number
}

// ─── App catalogue (all original apps preserved + Hindi + Kannada letters) ────
const fallbackApplications: Application[] = [
  // ── Math ──────────────────────────────────────────────────────────────────
  {
    id: "1", name: "Number Sequence", category: "Education", subcategory: "Math",
    description: "Practice forward and backward counting",
    icon_emoji: "📈", color_scheme: "from-blue-200 to-indigo-400",
    route: "/number-sequence", created_at: new Date().toISOString(),
  },
  {
    id: "2", name: "Clock Reading", category: "Education", subcategory: "Math",
    description: "Learn to read clocks with interactive games",
    icon_emoji: "🕰️", color_scheme: "from-purple-200 to-pink-500",
    route: "/clock-reading", created_at: new Date().toISOString(),
  },
  {
    id: "3", name: "Even & Odd Numbers", category: "Education", subcategory: "Math",
    description: "Learn even and odd numbers with fun sorting games!",
    icon_emoji: "⚖️", color_scheme: "from-green-200 to-teal-500",
    route: "/even-odd", created_at: new Date().toISOString(),
  },
  {
    id: "4", name: "Skip Counting Game", category: "Education", subcategory: "Math",
    description: "Learn skip counting by 2, 3, 5, and 10 with fun pictures!",
    icon_emoji: "⏩", color_scheme: "from-yellow-200 to-amber-400",
    route: "/skip-counting", created_at: new Date().toISOString(),
  },
  // ── Telugu ────────────────────────────────────────────────────────────────
  {
    id: "5", name: "Telugu Letters", category: "Education", subcategory: "Telugu",
    description: "Learn Telugu alphabet with flashcards and games",
    icon_emoji: "అ", color_scheme: "from-yellow-200 to-amber-400",
    route: "/telugu-letters", created_at: new Date().toISOString(),
  },
  {
    id: "7", name: "Telugu Gunintaalu", category: "Education", subcategory: "Telugu",
    description: "Learn Telugu consonant combinations with matras",
    icon_emoji: "క", color_scheme: "from-blue-200 to-indigo-400",
    route: "/telugu-gunintaalu", created_at: new Date().toISOString(),
  },
  {
    id: "8", name: "Telugu Words", category: "Education", subcategory: "Telugu",
    description: "Learn Telugu words through interactive games",
    icon_emoji: "📖", color_scheme: "from-purple-200 to-pink-500",
    route: "/telugu-words", created_at: new Date().toISOString(),
  },
  {
    id: "13", name: "Telugu Vocabulary", category: "Education", subcategory: "Telugu",
    description: "Learn Telugu vocabulary - Days, Colours, Animals & more!",
    icon_emoji: "📚", color_scheme: "from-green-200 to-teal-500",
    route: "/telugu-vocabulary", created_at: new Date().toISOString(),
  },
  {
    id: "14", name: "Telugu Vottulu", category: "Education", subcategory: "Telugu",
    description: "Learn Telugu subscripts (Vottulu) with flashcards and games",
    icon_emoji: "వ", color_scheme: "from-pink-200 to-pink-500",
    route: "/telugu-vottulu", created_at: new Date().toISOString(),
  },
  {
    id: "17", name: "Telugu Comprehension", category: "Education", subcategory: "Telugu",
    description: "Read Telugu stories and test your understanding!",
    icon_emoji: "📖", color_scheme: "from-cyan-200 to-blue-400",
    route: "/telugu-comprehension", created_at: new Date().toISOString(),
  },
  {
    id: "15", name: "Telugu Satakamalu", category: "Education", subcategory: "Telugu",
    description: "Read classic Telugu Satakamalu with meanings",
    icon_emoji: "📜", color_scheme: "from-amber-200 to-orange-400",
    route: "/telugu-satakamalu", created_at: new Date().toISOString(),
  },
  {
    id: "16", name: "Telugu Podupu Kathalu", category: "Education", subcategory: "Telugu",
    description: "Test your brain with fun Telugu riddles!",
    icon_emoji: "🧩", color_scheme: "from-orange-200 to-red-400",
    route: "/telugu-riddles", created_at: new Date().toISOString(),
  },
  // ── NEW: Hindi ────────────────────────────────────────────────────────────
  {
    id: "hi-1", name: "Hindi Letters", category: "Education", subcategory: "Hindi",
    description: "Learn Hindi alphabet (वर्णमाला) with flashcards and games",
    icon_emoji: "अ", color_scheme: "from-orange-200 to-red-400",
    route: "/hindi-letters", created_at: new Date().toISOString(),
  },
  // ── NEW: Kannada ──────────────────────────────────────────────────────────
  {
    id: "kn-1", name: "Kannada Letters", category: "Education", subcategory: "Kannada",
    description: "Learn Kannada alphabet (ವರ್ಣಮಾಲೆ) with flashcards and games",
    icon_emoji: "ಅ", color_scheme: "from-yellow-200 to-amber-500",
    route: "/kannada-letters", created_at: new Date().toISOString(),
  },
  // ── English ───────────────────────────────────────────────────────────────
  {
    id: "9e", name: "English Phonics", category: "Education", subcategory: "English",
    description: "Master English sounds and pronunciation",
    icon_emoji: "🔤", color_scheme: "from-purple-200 to-pink-500",
    route: "/english-phonics", created_at: new Date().toISOString(),
  },
  {
    id: "12", name: "Spelling Game Suite", category: "Education", subcategory: "English",
    description: "Master spelling with 10 fun interactive games!",
    icon_emoji: "✨", color_scheme: "from-blue-200 to-indigo-400",
    route: "/spelling-game-suite", created_at: new Date().toISOString(),
  },
  // ── Life Skills ───────────────────────────────────────────────────────────
  {
    id: "11", name: "Cooking Recipes", category: "Education", subcategory: "Life Skills",
    description: "Learn cooking skills with fun recipes!",
    icon_emoji: "🥗", color_scheme: "from-yellow-200 to-amber-400",
    route: "/cooking-recipes", created_at: new Date().toISOString(),
  },
  // ── Puzzles ───────────────────────────────────────────────────────────────
  {
    id: "9p", name: "Shape Puzzle", category: "Puzzles", subcategory: "Geometry",
    description: "Identify and match different shapes",
    icon_emoji: "🔺", color_scheme: "from-green-200 to-teal-500",
    route: "/shape-puzzle", created_at: new Date().toISOString(),
  },
  // ── Games ─────────────────────────────────────────────────────────────────
  {
    id: "10m", name: "Memory Game", category: "Games", subcategory: "",
    description: "Test your memory with colorful cards",
    icon_emoji: "🧠", color_scheme: "from-blue-200 to-indigo-500",
    route: "/memory-game", created_at: new Date().toISOString(),
  },
  {
    id: "10c", name: "Catch Me", category: "Games", subcategory: "",
    description: "Click the animals to score points!",
    icon_emoji: "🐰", color_scheme: "from-purple-200 to-pink-500",
    route: "/counting-game", created_at: new Date().toISOString(),
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { t } = useLanguage()

  const [applications, setApplications] = useState<Application[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({})
  const [userStats, setUserStats] = useState<UserStats>({
    totalGamesPlayed: 0, totalScore: 0, averageScore: 0, timeSpent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => { loadApplications(); restoreUser() }, [])
  useEffect(() => { if (user) loadUserData(user.id) }, [user])

  // ── All logic below is IDENTICAL to original ──────────────────────────────
  const restoreUser = () => {
    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("mywayapps_current_user")
        if (savedUser) setUser(JSON.parse(savedUser))
      }
    } catch (error) { console.error("❌ Error restoring user:", error) }
  }

  const loadApplications = () => {
    try {
      setError(null)
      setApplications(fallbackApplications)
    } catch (error) {
      console.error("❌ Error loading applications:", error)
      setError("Failed to load applications. Using offline mode.")
      setApplications(fallbackApplications)
    } finally { setLoading(false) }
  }

  const loadUserData = (userId: string) => {
    try {
      const savedProgress = localStorage.getItem(`mywayapps_progress_${userId}`)
      const progress = savedProgress ? JSON.parse(savedProgress) : {}
      const savedScores = localStorage.getItem("mywayapps_offline_scores")
      const allScores: Array<{ user_id: string; score: number; completion_time?: number }> =
        savedScores ? JSON.parse(savedScores) : []
      const userScores = allScores.filter(s => s.user_id === userId)
      setUserProgress(progress)
      setUserStats({
        totalGamesPlayed: userScores.length,
        totalScore: userScores.reduce((s, x) => s + x.score, 0),
        averageScore: userScores.length > 0
          ? userScores.reduce((s, x) => s + x.score, 0) / userScores.length : 0,
        timeSpent: userScores.reduce((s, x) => s + (x.completion_time || 0), 0),
      })
    } catch (error) { console.error("❌ Error loading user data:", error) }
  }

  const handleUserLogin = (loggedInUser: User) => {
    try {
      setUser(loggedInUser)
      if (typeof window !== "undefined")
        localStorage.setItem("mywayapps_current_user", JSON.stringify(loggedInUser))
    } catch (error) { console.error("❌ Error during login:", error); setError("Login failed.") }
  }

  const handleLogout = () => {
    try {
      setUser(null); setUserProgress({})
      setUserStats({ totalGamesPlayed: 0, totalScore: 0, averageScore: 0, timeSpent: 0 })
      if (typeof window !== "undefined") localStorage.removeItem("mywayapps_current_user")
    } catch (error) { console.error("❌ Error during logout:", error) }
  }

  const handlePlayApp = (app: Application) => {
    try {
      if (user && typeof window !== "undefined") {
        localStorage.setItem("mywayapps_current_user", JSON.stringify(user))
        localStorage.setItem("mywayapps_current_app", JSON.stringify(app))
      }
      router.push(app.route)
    } catch (error) { console.error("❌ Error launching app:", error); setError("Failed to launch app.") }
  }

  const handleUpdateUser = (userData: Partial<User> | User) => {
    try {
      if ("id" in userData && userData.id) {
        const newUser = userData as User
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const idx = offlineUsers.findIndex((u: User) => u.email === newUser.email)
        if (idx >= 0) offlineUsers[idx] = newUser; else offlineUsers.push(newUser)
        localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers))
        localStorage.setItem("mywayapps_current_user", JSON.stringify(newUser))
        setUser(newUser)
      } else if (user) {
        const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() }
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const userIndex = offlineUsers.findIndex((u: User) => u.id === user.id)
        if (userIndex >= 0) { offlineUsers[userIndex] = updatedUser; localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers)) }
        setUser(updatedUser)
        localStorage.setItem("mywayapps_current_user", JSON.stringify(updatedUser))
      }
    } catch (error) { console.error("❌ Error updating user:", error); setError("Failed to update profile.") }
  }

  const categories = ["Education", "Games", "Puzzles"]

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
        <AnimatedMascots />
        <div className="text-center z-10">
          <div className="text-7xl mb-6 animate-bounce">🌈</div>
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <div className="text-4xl font-black text-white drop-shadow-lg">{t("app.loading")}</div>
          <div className="text-lg text-white/80 mt-2 font-semibold">{t("app.portal")}</div>
        </div>
      </div>
    )
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatedMascots />
        {/* Language switcher on login screen */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-md z-10">
          {/* Friendly hero above the login card */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3" style={{ animation: "bounce 1s infinite" }}>🎓</div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">{t("app.welcome")}</h1>
            <p className="text-white/90 font-semibold mt-1">{t("app.subtitle")}</p>
          </div>
          {error && (
            <Card className="mb-4 bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
          <UserAuth onUserLogin={handleUserLogin} />
        </div>
      </div>
    )
  }

  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 relative">
      <AnimatedMascots />

      {/* ── Header ── */}
      <header className="relative z-20 bg-white/15 backdrop-blur-md border-b-2 border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Logo + greeting */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/mywayapps-logo.png"
                  alt="MyWayApps Logo"
                  className="h-12 w-12 object-contain drop-shadow-md"
                  onError={e => { e.currentTarget.src = "/mywayapps-logo.svg" }}
                />
              </div>
              <div>
                <div className="text-xs text-white/70 font-semibold uppercase tracking-wider">MyWayApps</div>
                <div className="text-lg font-black text-white leading-tight drop-shadow">
                  {t("app.welcomeBack")}, {user.name}!
                </div>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                onClick={() => setShowContact(!showContact)}
                className="bg-white/20 hover:bg-white/35 text-white border-2 border-white/40 rounded-2xl font-bold backdrop-blur-sm transition-all hover:scale-105"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("app.contact")}
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/35 text-white border-2 border-white/40 rounded-2xl font-bold backdrop-blur-sm transition-all hover:scale-105"
                variant="outline"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("app.logout")}
              </Button>
            </div>
          </div>

          {/* Welcome banner */}
          <div className="text-center mt-1">
            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
              {t("app.welcome")}
            </h1>
            <p className="text-white/90 font-bold">{t("app.subtitle")}</p>
          </div>
        </div>
      </header>

      {/* ── Sidebar + Body ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex items-start gap-6">
        <MainNavigationMenu />
        <div className="flex-1 min-w-0">
        {error && (
          <Card className="mb-4 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-yellow-800 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact card */}
        {showContact && (
          <Card className="mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-white shadow-2xl max-w-md mx-auto rounded-3xl">
            <CardContent className="p-6 text-white">
              <h3 className="text-xl font-black mb-4 text-center">{t("app.contactUs")}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><Mail className="h-5 w-5" /><span>mywayapps10@gmail.com</span></div>
                <div className="flex items-center gap-3"><Phone className="h-5 w-5" /><span>(+91) XXXXX XXXXX</span></div>
                <div className="flex items-center gap-3"><MapPin className="h-5 w-5" /><span>Educational Apps Division</span></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category sections (unchanged component — all existing functionality preserved) */}
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category} id={`${category.toLowerCase()}-section`}>
              <CategorySection
                category={category}
                apps={applications}
                userProgress={userProgress}
                onPlayApp={handlePlayApp}
              />
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}
