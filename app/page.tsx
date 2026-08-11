"use client"
import { useState, useEffect } from "react"
import { TopicSection } from "@/components/topic-section"
import { UserAuth } from "@/components/user-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Mail, Phone, MapPin, LogOut, LogIn, X, Loader2 } from "lucide-react"
import MainNavigationMenu from "@/components/main-navigation-menu"
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
    description: "Counting, before/after, place value, comparisons & more",
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
  {
    id: "math-3", name: "Addition", category: "Education", subcategory: "Math",
    description: "1, 2 & 3-digit addition — numbers and word problems",
    icon_emoji: "➕", color_scheme: "from-green-300 to-teal-500",
    route: "/math-addition", created_at: new Date().toISOString(),
  },
  {
    id: "math-4", name: "Subtraction", category: "Education", subcategory: "Math",
    description: "1, 2 & 3-digit subtraction — numbers and word problems",
    icon_emoji: "➖", color_scheme: "from-orange-300 to-rose-500",
    route: "/math-subtraction", created_at: new Date().toISOString(),
  },
  {
    id: "math-5", name: "Multiplication", category: "Education", subcategory: "Math",
    description: "1, 2 & 3-digit multiplication — numbers and word problems",
    icon_emoji: "✖️", color_scheme: "from-violet-300 to-fuchsia-500",
    route: "/math-multiplication", created_at: new Date().toISOString(),
  },
  {
    id: "math-6", name: "Division", category: "Education", subcategory: "Math",
    description: "1, 2 & 3-digit division — numbers and word problems",
    icon_emoji: "➗", color_scheme: "from-sky-300 to-cyan-500",
    route: "/math-division", created_at: new Date().toISOString(),
  },
  {
    id: "math-11", name: "Memorize Tables", category: "Education", subcategory: "Math",
    description: "Addition, subtraction & multiplication facts 1-10, animated and in order",
    icon_emoji: "🔢", color_scheme: "from-indigo-300 to-cyan-500",
    route: "/math-tables", created_at: new Date().toISOString(),
  },
  {
    id: "math-7", name: "Shapes", category: "Education", subcategory: "Math",
    description: "Identify flat & solid shapes, sort them, and match to real life",
    icon_emoji: "🔺", color_scheme: "from-green-300 to-teal-500",
    route: "/math-shapes", created_at: new Date().toISOString(),
  },
  {
    id: "math-8", name: "Fractions", category: "Education", subcategory: "Math",
    description: "Simple & mixed fractions — identify, compare, and shade",
    icon_emoji: "🥧", color_scheme: "from-violet-300 to-fuchsia-500",
    route: "/math-fractions", created_at: new Date().toISOString(),
  },
  {
    id: "math-9", name: "Money", category: "Education", subcategory: "Math",
    description: "Indian Rupees & Paise — identify, count, and compare",
    icon_emoji: "💰", color_scheme: "from-sky-300 to-cyan-500",
    route: "/math-money", created_at: new Date().toISOString(),
  },
  {
    id: "math-10", name: "Measurement", category: "Education", subcategory: "Math",
    description: "Compare length, weight, capacity, and measure with everyday units",
    icon_emoji: "📏", color_scheme: "from-orange-300 to-amber-400",
    route: "/math-measurement", created_at: new Date().toISOString(),
  },
  {
    id: "math-12", name: "Patterns", category: "Education", subcategory: "Math",
    description: "Spot repeating patterns, fill the gap, and count on number patterns",
    icon_emoji: "🧩", color_scheme: "from-pink-300 to-red-500",
    route: "/math-patterns", created_at: new Date().toISOString(),
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
    id: "te-wg", name: "Telugu Word Games", category: "Education", subcategory: "Telugu",
    description: "Picture Vocabulary, Word Search & Crossword",
    icon_emoji: "🧩", color_scheme: "from-teal-300 to-cyan-500",
    route: "/word-games/telugu", created_at: new Date().toISOString(),
  },
  {
    id: "te-poems", name: "Telugu Poems", category: "Education", subcategory: "Telugu",
    description: "Simple traditional rhymes — script and audio",
    icon_emoji: "📜", color_scheme: "from-rose-300 to-fuchsia-500",
    route: "/poems/telugu", created_at: new Date().toISOString(),
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
    icon_emoji: "अ", color_scheme: "from-blue-200 to-indigo-400",
    route: "/hindi-letters", created_at: new Date().toISOString(),
  },
  {
    id: "hi-2", name: "Hindi Vocabulary", category: "Education", subcategory: "Hindi",
    description: "Learn Hindi vocabulary - Days, Colours, Animals & more!",
    icon_emoji: "📚", color_scheme: "from-purple-200 to-pink-500",
    route: "/hindi-vocabulary", created_at: new Date().toISOString(),
  },
  {
    id: "hi-3", name: "Hindi Comprehension", category: "Education", subcategory: "Hindi",
    description: "Read Hindi stories and test your understanding!",
    icon_emoji: "📖", color_scheme: "from-green-200 to-teal-500",
    route: "/hindi-comprehension", created_at: new Date().toISOString(),
  },
  {
    id: "hi-wg", name: "Hindi Word Games", category: "Education", subcategory: "Hindi",
    description: "Picture Vocabulary, Word Search & Crossword",
    icon_emoji: "🧩", color_scheme: "from-teal-300 to-cyan-500",
    route: "/word-games/hindi", created_at: new Date().toISOString(),
  },
  {
    id: "hi-poems", name: "Hindi Poems", category: "Education", subcategory: "Hindi",
    description: "Simple traditional rhymes — script and audio",
    icon_emoji: "📜", color_scheme: "from-rose-300 to-fuchsia-500",
    route: "/poems/hindi", created_at: new Date().toISOString(),
  },
  // ── NEW: Kannada ──────────────────────────────────────────────────────────
  {
    id: "kn-1", name: "Kannada Letters", category: "Education", subcategory: "Kannada",
    description: "Learn Kannada alphabet (ವರ್ಣಮಾಲೆ) with flashcards and games",
    icon_emoji: "ಅ", color_scheme: "from-yellow-200 to-amber-400",
    route: "/kannada-letters", created_at: new Date().toISOString(),
  },
  {
    id: "kn-2", name: "Kannada Vocabulary", category: "Education", subcategory: "Kannada",
    description: "Learn Kannada vocabulary - Days, Colours, Animals & more!",
    icon_emoji: "📚", color_scheme: "from-green-300 to-teal-500",
    route: "/kannada-vocabulary", created_at: new Date().toISOString(),
  },
  {
    id: "kn-3", name: "Kannada Comprehension", category: "Education", subcategory: "Kannada",
    description: "Read Kannada stories and test your understanding!",
    icon_emoji: "📖", color_scheme: "from-orange-300 to-rose-500",
    route: "/kannada-comprehension", created_at: new Date().toISOString(),
  },
  {
    id: "kn-wg", name: "Kannada Word Games", category: "Education", subcategory: "Kannada",
    description: "Picture Vocabulary, Word Search & Crossword",
    icon_emoji: "🧩", color_scheme: "from-teal-300 to-cyan-500",
    route: "/word-games/kannada", created_at: new Date().toISOString(),
  },
  {
    id: "kn-poems", name: "Kannada Poems", category: "Education", subcategory: "Kannada",
    description: "Simple traditional rhymes — script and audio",
    icon_emoji: "📜", color_scheme: "from-rose-300 to-fuchsia-500",
    route: "/poems/kannada", created_at: new Date().toISOString(),
  },
  // ── NEW: Tamil ────────────────────────────────────────────────────────────
  {
    id: "ta-1", name: "Tamil Letters", category: "Education", subcategory: "Tamil",
    description: "Learn Tamil alphabet (தமிழ் எழுத்துக்கள்) with flashcards and games",
    icon_emoji: "அ", color_scheme: "from-violet-300 to-fuchsia-500",
    route: "/tamil-letters", created_at: new Date().toISOString(),
  },
  {
    id: "ta-2", name: "Tamil Vocabulary", category: "Education", subcategory: "Tamil",
    description: "Learn Tamil vocabulary - Days, Colours, Animals & more!",
    icon_emoji: "📚", color_scheme: "from-sky-300 to-cyan-500",
    route: "/tamil-vocabulary", created_at: new Date().toISOString(),
  },
  {
    id: "ta-3", name: "Tamil Comprehension", category: "Education", subcategory: "Tamil",
    description: "Read Tamil stories and test your understanding!",
    icon_emoji: "📖", color_scheme: "from-blue-200 to-indigo-400",
    route: "/tamil-comprehension", created_at: new Date().toISOString(),
  },
  {
    id: "ta-wg", name: "Tamil Word Games", category: "Education", subcategory: "Tamil",
    description: "Picture Vocabulary, Word Search & Crossword",
    icon_emoji: "🧩", color_scheme: "from-teal-300 to-cyan-500",
    route: "/word-games/tamil", created_at: new Date().toISOString(),
  },
  {
    id: "ta-poems", name: "Tamil Poems", category: "Education", subcategory: "Tamil",
    description: "Simple traditional rhymes — script and audio",
    icon_emoji: "📜", color_scheme: "from-rose-300 to-fuchsia-500",
    route: "/poems/tamil", created_at: new Date().toISOString(),
  },
  // ── NEW: Malayalam ────────────────────────────────────────────────────────
  {
    id: "ml-1", name: "Malayalam Letters", category: "Education", subcategory: "Malayalam",
    description: "Learn Malayalam alphabet (മലയാള അക്ഷരമാല) with flashcards and games",
    icon_emoji: "അ", color_scheme: "from-purple-200 to-pink-500",
    route: "/malayalam-letters", created_at: new Date().toISOString(),
  },
  {
    id: "ml-2", name: "Malayalam Vocabulary", category: "Education", subcategory: "Malayalam",
    description: "Learn Malayalam vocabulary - Days, Colours, Animals & more!",
    icon_emoji: "📚", color_scheme: "from-green-200 to-teal-500",
    route: "/malayalam-vocabulary", created_at: new Date().toISOString(),
  },
  {
    id: "ml-3", name: "Malayalam Comprehension", category: "Education", subcategory: "Malayalam",
    description: "Read Malayalam stories and test your understanding!",
    icon_emoji: "📖", color_scheme: "from-yellow-200 to-amber-400",
    route: "/malayalam-comprehension", created_at: new Date().toISOString(),
  },
  {
    id: "ml-wg", name: "Malayalam Word Games", category: "Education", subcategory: "Malayalam",
    description: "Picture Vocabulary, Word Search & Crossword",
    icon_emoji: "🧩", color_scheme: "from-teal-300 to-cyan-500",
    route: "/word-games/malayalam", created_at: new Date().toISOString(),
  },
  {
    id: "ml-poems", name: "Malayalam Poems", category: "Education", subcategory: "Malayalam",
    description: "Simple traditional rhymes — script and audio",
    icon_emoji: "📜", color_scheme: "from-rose-300 to-fuchsia-500",
    route: "/poems/malayalam", created_at: new Date().toISOString(),
  },
  // ── NEW: Sanskrit (same Devanagari script as Hindi; audio routes through a
  // Kannada-transliteration TTS pipeline since no native Sanskrit voice exists) ──
  {
    id: "sa-0", name: "Sanskrit Letters", category: "Education", subcategory: "Sanskrit",
    description: "Learn the Sanskrit alphabet with flashcards and games",
    icon_emoji: "ॐ", color_scheme: "from-yellow-200 to-amber-400",
    route: "/sanskrit-letters", created_at: new Date().toISOString(),
  },
  {
    id: "sa-1", name: "Sanskrit Vocabulary", category: "Education", subcategory: "Sanskrit",
    description: "Learn Sanskrit vocabulary - Days, Colours, Animals & more!",
    icon_emoji: "📚", color_scheme: "from-green-300 to-teal-500",
    route: "/sanskrit-vocabulary", created_at: new Date().toISOString(),
  },
  {
    id: "sa-2", name: "Sanskrit Comprehension", category: "Education", subcategory: "Sanskrit",
    description: "Read Sanskrit stories and test your understanding!",
    icon_emoji: "📖", color_scheme: "from-orange-300 to-rose-500",
    route: "/sanskrit-comprehension", created_at: new Date().toISOString(),
  },
  {
    id: "sa-wg", name: "Sanskrit Word Games", category: "Education", subcategory: "Sanskrit",
    description: "Picture Vocabulary, Word Search & Crossword",
    icon_emoji: "🧩", color_scheme: "from-teal-300 to-cyan-500",
    route: "/word-games/sanskrit", created_at: new Date().toISOString(),
  },
  {
    id: "sa-poems", name: "Sanskrit Poems", category: "Education", subcategory: "Sanskrit",
    description: "A simple classic subhashita — script and audio",
    icon_emoji: "📜", color_scheme: "from-rose-300 to-fuchsia-500",
    route: "/poems/sanskrit", created_at: new Date().toISOString(),
  },
  // ── English ───────────────────────────────────────────────────────────────
  {
    id: "12", name: "English Spelling Game Suite", category: "Education", subcategory: "English",
    description: "Master spelling with 10 fun interactive games!",
    icon_emoji: "✨", color_scheme: "from-blue-200 to-indigo-400",
    route: "/spelling-game-suite", created_at: new Date().toISOString(),
  },
  {
    id: "en-4", name: "English Sentences", category: "Education", subcategory: "English",
    description: "Build, type, and listen to sentences!",
    icon_emoji: "📝", color_scheme: "from-cyan-200 to-blue-500",
    route: "/english-sentences", created_at: new Date().toISOString(),
  },
  {
    id: "en-2", name: "English Grammar", category: "Education", subcategory: "English",
    description: "Watch and learn nouns, verbs, adjectives & more",
    icon_emoji: "🎬", color_scheme: "from-purple-200 to-pink-500",
    route: "/english-grammar", created_at: new Date().toISOString(),
  },
  {
    id: "en-3", name: "Reading Coach", category: "Education", subcategory: "English",
    description: "Read a story out loud and get instant feedback",
    icon_emoji: "🎤", color_scheme: "from-amber-200 to-orange-500",
    route: "/english-reading", created_at: new Date().toISOString(),
  },
  // ── Science ───────────────────────────────────────────────────────────────
  {
    id: "sci-1", name: "Science", category: "Education", subcategory: "Science",
    description: "Watch and learn about plants, animals & living things",
    icon_emoji: "🔬", color_scheme: "from-emerald-300 to-green-600",
    route: "/science", created_at: new Date().toISOString(),
  },
  // ── Social Studies ────────────────────────────────────────────────────────
  {
    id: "ss-1", name: "Social Studies", category: "Education", subcategory: "Social Studies",
    description: "Learn about India's symbols, festivals & famous people",
    icon_emoji: "🏛️", color_scheme: "from-indigo-300 to-violet-600",
    route: "/social-studies", created_at: new Date().toISOString(),
  },
  // ── Life Skills ───────────────────────────────────────────────────────────
  {
    id: "11", name: "Cooking Recipes", category: "Education", subcategory: "Life Skills",
    description: "Learn cooking skills with fun recipes!",
    icon_emoji: "🥗", color_scheme: "from-yellow-200 to-amber-400",
    route: "/cooking-recipes", created_at: new Date().toISOString(),
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
  {
    id: "10s", name: "Sudoku", category: "Games", subcategory: "",
    description: "4x4 and 6x6 puzzles with numbers or pictures",
    icon_emoji: "🧩", color_scheme: "from-cyan-200 to-blue-500",
    route: "/sudoku", created_at: new Date().toISOString(),
  },
  {
    id: "10k", name: "Kolam", category: "Games", subcategory: "",
    description: "Draw traditional Indian kolam designs around the dots",
    icon_emoji: "🌸", color_scheme: "from-rose-200 to-fuchsia-500",
    route: "/kolam", created_at: new Date().toISOString(),
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
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingApp, setPendingApp] = useState<Application | null>(null)
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
      setShowLoginModal(false)
      if (pendingApp) {
        launchApp(loggedInUser, pendingApp)
        setPendingApp(null)
      }
    } catch (error) { console.error("❌ Error during login:", error); setError("Login failed.") }
  }

  const handleLogout = () => {
    try {
      setUser(null); setUserProgress({})
      setUserStats({ totalGamesPlayed: 0, totalScore: 0, averageScore: 0, timeSpent: 0 })
      if (typeof window !== "undefined") localStorage.removeItem("mywayapps_current_user")
    } catch (error) { console.error("❌ Error during logout:", error) }
  }

  const launchApp = (forUser: User, app: Application) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("mywayapps_current_user", JSON.stringify(forUser))
        localStorage.setItem("mywayapps_current_app", JSON.stringify(app))
      }
      router.push(app.route)
    } catch (error) { console.error("❌ Error launching app:", error); setError("Failed to launch app.") }
  }

  const handlePlayApp = (app: Application) => {
    if (!user) {
      setPendingApp(app)
      setShowLoginModal(true)
      return
    }
    launchApp(user, app)
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

  // Flatten "Education" into its subcategories (Math, Telugu, Hindi, ...) so every
  // subject is its own top-level section — same treatment Games/Puzzles already got.
  const topicGroups = (() => {
    const order: string[] = []
    const groups: Record<string, Application[]> = {}
    for (const app of applications) {
      const key = app.category === "Education" ? app.subcategory || "General" : app.category
      if (!groups[key]) {
        groups[key] = []
        order.push(key)
      }
      groups[key].push(app)
    }
    return order.map((topic) => ({ topic, apps: groups[topic] }))
  })()

  const topicSlug = (topic: string) =>
    topic === "Games" || topic === "Puzzles" ? `${topic.toLowerCase()}-section` : topic.toLowerCase().replace(/\s+/g, "-")

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

  // ── Main dashboard (catalogue is visible whether or not a visitor is logged in) ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 relative">
      <AnimatedMascots />

      {/* ── Header ── */}
      <header className="relative z-20 bg-white/15 backdrop-blur-md border-b-2 border-white/30 shadow-lg">
        <div className="px-4 md:px-6 py-4 relative">
          {/* Tagline — centered on the header regardless of how wide the logo/buttons are */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl lg:text-2xl font-bold text-white/90 drop-shadow whitespace-nowrap">
            MyWayApps, {t("app.subtitle")} 🌈
          </div>

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
              <div className="text-lg md:text-xl font-black text-white leading-tight drop-shadow">
                {user ? `${t("app.welcomeBack")}, ${user.name}!` : t("app.welcome")}
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
              {user ? (
                <Button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/35 text-white border-2 border-white/40 rounded-2xl font-bold backdrop-blur-sm transition-all hover:scale-105"
                  variant="outline"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("app.logout")}
                </Button>
              ) : (
                <Button
                  onClick={() => { setPendingApp(null); setShowLoginModal(true) }}
                  className="bg-white/20 hover:bg-white/35 text-white border-2 border-white/40 rounded-2xl font-bold backdrop-blur-sm transition-all hover:scale-105"
                  variant="outline"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Sidebar + Body ── */}
      <div className="relative z-10 px-4 md:px-6 py-8 flex items-start gap-6">
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

        {/* Topic sections — one flat, top-level section per subject */}
        <div className="space-y-8">
          {topicGroups.map(({ topic, apps }) => (
            <div key={topic} id={topicSlug(topic)} className="scroll-mt-24">
              <TopicSection
                topic={topic}
                apps={apps}
                userProgress={userProgress}
                onPlayApp={handlePlayApp}
              />
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Login modal — shown on demand (Login button, or Play on a locked game) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md relative">
            <button
              onClick={() => { setShowLoginModal(false); setPendingApp(null) }}
              aria-label="Close"
              className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2" style={{ animation: "bounce 1s infinite" }}>🎓</div>
              <h1 className="text-2xl font-black text-white drop-shadow-lg">
                {pendingApp ? `Log in to play ${pendingApp.name}` : t("app.welcome")}
              </h1>
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
      )}
    </div>
  )
}
