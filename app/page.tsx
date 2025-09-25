"use client"

import { useState, useEffect } from "react"
import { CategorySection } from "@/components/category-section"
import { UserProfile } from "@/components/user-profile"
import { UserAuth } from "@/components/user-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Mail, Phone, MapPin, LogOut, Loader2 } from "lucide-react"

// Offline user type
interface User {
  id: string
  email: string
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

// Fallback applications for offline mode
const fallbackApplications = [
  {
    id: "1",
    name: "Number Sequence",
    category: "Education",
    subcategory: "Math",
    description: "Practice forward and backward counting",
    icon_emoji: "📈",
    color_scheme: "from-blue-200 to-indigo-400",
    route: "/number-sequence",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Clock Reading",
    category: "Education",
    subcategory: "Math",
    description: "Learn to read clocks with interactive games",
    icon_emoji: "🕰️",
    color_scheme: "from-purple-200 to-pink-500",
    route: "/clock-reading",
    created_at: new Date().toISOString(),
  },
  {
    id: "3", // Use the next available ID
    name: "Even & Odd Numbers",
    category: "Education",
    subcategory: "Math",
    description: "Learn even and odd numbers with fun sorting games!",
    icon_emoji: "⚖️",
    color_scheme: "from-green-200 to-teal-500",
    route: "/even-odd",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Skip Counting Game",
    category: "Education",
    subcategory: "Math",
    description: "Learn skip counting by 2, 3, 5, and 10 with fun pictures!",
    icon_emoji: "⏩",
    color_scheme: "from-yellow-200 to-amber-400",
    route: "/skip-counting",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Telugu Letters Flashcards",
    category: "Education",
    subcategory: "Telugu",
    description: "Learn Telugu alphabet with flash cards",
    icon_emoji: "అ",
    color_scheme: "from-green-200 to-teal-500",
    route: "/telugu-letters-flashcards",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Telugu Letters Game",
    category: "Education",
    subcategory: "Telugu",
    description: "Learn Telugu letters with a fun game",
    icon_emoji: "అ",
    color_scheme: "from-yellow-200 to-amber-400",
    route: "/telugu-letters-game",
    created_at: new Date().toISOString(),
  },
    {
      id: "7",
      name: "Telugu Gunintaalu",
      category: "Education",
      subcategory: "Telugu",
      description: "Learn Telugu consonant combinations with matras",
      icon_emoji: "క",
      color_scheme: "from-blue-200 to-indigo-400",
      route: "/telugu-gunintaalu",
      created_at: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Telugu Words",
      category: "Education",
      subcategory: "Telugu",
      description: "Learn Telugu words through interactive games",
      icon_emoji: "📖",
      color_scheme: "from-purple-200 to-pink-500",
      route: "/telugu-words",
      created_at: new Date().toISOString(),
    },
  {
    id: "9",
    name: "English Phonics",
    category: "Education",
    subcategory: "English",
    description: "Master English sounds and pronunciation",
    icon_emoji: "🔤",
    color_scheme: "from-purple-200 to-pink-500",
    route: "/english-phonics",
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Shape Puzzle",
    category: "Puzzles",
    subcategory: "Geometry",
    description: "Identify and match different shapes",
    icon_emoji: "🔺",
    color_scheme: "from-green-200 to-teal-500",
    route: "/shape-puzzle",
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Memory Game",
    category: "Games",
    subcategory: "",
    description: "Test your memory with colorful cards",
    icon_emoji: "🧠",
    color_scheme: "from-blue-200 to-indigo-500",
    route: "/memory-game",
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Catch Me",
    category: "Games",
    subcategory: "",
    description: "Click the animals to score points!",
    icon_emoji: "🐰",
    color_scheme: "from-purple-200 to-pink-500",
    route: "/counting-game",
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    name: "Cooking Recipes",
    category: "Education",
    subcategory: "Life Skills",
    description: "Learn cooking skills with fun recipes!",
    icon_emoji: "🥗",
    color_scheme: "from-yellow-200 to-amber-400",
    route: "/cooking-recipes",
    created_at: new Date().toISOString(),
  },
  {
    id: "12",
    name: "Spelling Game Suite",
    category: "Education",
    subcategory: "English",
    description: "Master spelling with 10 fun interactive games!",
    icon_emoji: "✨",
    color_scheme: "from-blue-200 to-indigo-400",
    route: "/spelling-game-suite",
    created_at: new Date().toISOString(),
  }
]

export default function HomePage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({})
  const [userStats, setUserStats] = useState<UserStats>({
    totalGamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    timeSpent: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadApplications()
    // Try to restore user from localStorage
    restoreUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadUserData(user.id)
    }
  }, [user])

  const restoreUser = () => {
    try {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("mywayapps_current_user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          console.log("📱 Restored user from localStorage:", user.name)
          setUser(user)
        }
      }
    } catch (error) {
      console.error("❌ Error restoring user:", error)
    }
  }

  const loadApplications = () => {
    try {
      setError(null)
      console.log("📱 Loading applications (offline mode)...")

      setApplications(fallbackApplications)
      console.log("📱 Applications loaded:", fallbackApplications.length)
    } catch (error) {
      console.error("❌ Error loading applications:", error)
      setError("Failed to load applications. Using offline mode.")
      setApplications(fallbackApplications)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = (userId: string) => {
    try {
      console.log("📱 Loading user data for:", userId)

      // Load user progress from localStorage
      const savedProgress = localStorage.getItem(`mywayapps_progress_${userId}`)
      const progress = savedProgress ? JSON.parse(savedProgress) : {}

      // Load user scores from localStorage
      const savedScores = localStorage.getItem("mywayapps_offline_scores")
      const allScores: Array<{
        user_id: string
        score: number
        completion_time?: number
      }> = savedScores ? JSON.parse(savedScores) : []
      const userScores = allScores.filter((score) => score.user_id === userId)

      // Calculate stats
      const stats = {
        totalGamesPlayed: userScores.length,
        totalScore: userScores.reduce((sum: number, score) => sum + score.score, 0),
        averageScore:
          userScores.length > 0
            ? userScores.reduce((sum: number, score) => sum + score.score, 0) / userScores.length
            : 0,
        timeSpent: userScores.reduce((sum: number, score) => sum + (score.completion_time || 0), 0),
      }

      setUserProgress(progress)
      setUserStats(stats)
      console.log("📱 User data loaded - Games played:", stats.totalGamesPlayed, "Total score:", stats.totalScore)
    } catch (error) {
      console.error("❌ Error loading user data:", error)
    }
  }

  const handleUserLogin = (loggedInUser: User) => {
    try {
      console.log("📱 User logged in:", loggedInUser.name)
      setUser(loggedInUser)

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("mywayapps_current_user", JSON.stringify(loggedInUser))
      }
    } catch (error) {
      console.error("❌ Error during login:", error)
      setError("Login failed. Please try again.")
    }
  }

  const handleLogout = () => {
    try {
      console.log("📱 User logged out")
      setUser(null)
      setUserProgress({})
      setUserStats({
        totalGamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        timeSpent: 0,
      })
      if (typeof window !== "undefined") {
        localStorage.removeItem("mywayapps_current_user")
      }
    } catch (error) {
      console.error("❌ Error during logout:", error)
    }
  }

  const handlePlayApp = (app: Application) => {
    try {
      console.log("📱 Launching app:", app.name)
      // Store current user and app in localStorage for the game
      if (user && typeof window !== "undefined") {
        localStorage.setItem("mywayapps_current_user", JSON.stringify(user))
        localStorage.setItem("mywayapps_current_app", JSON.stringify(app))
      }
      router.push(app.route)
    } catch (error) {
      console.error("❌ Error launching app:", error)
      setError("Failed to launch app. Please try again.")
    }
  }

   const handleUpdateUser = (userData: Partial<User> | User) => {
    try {
      console.log("📱 Updating/Creating user:", userData)

      if ("id" in userData && userData.id) {
        // This is a complete user object (new user created)
        const newUser = userData as User

        // Update in offline users list
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const existingIndex = offlineUsers.findIndex((u: User) => u.email === newUser.email)

        if (existingIndex >= 0) {
          offlineUsers[existingIndex] = newUser
        } else {
          offlineUsers.push(newUser)
        }

        localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers))
        localStorage.setItem("mywayapps_current_user", JSON.stringify(newUser))

        setUser(newUser)
        console.log("✅ New user created and set:", newUser.name)
      } else if (user) {
        // This is a partial update to existing user
        const updatedUser = {
          ...user,
          ...userData,
          updated_at: new Date().toISOString(),
        }

        // Update in offline users list
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const userIndex = offlineUsers.findIndex((u: User) => u.id === user.id)
        if (userIndex >= 0) {
          offlineUsers[userIndex] = updatedUser
          localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers))
        }

        setUser(updatedUser)
        localStorage.setItem("mywayapps_current_user", JSON.stringify(updatedUser))
        console.log("✅ User updated successfully")
      }
    } catch (error) {
      console.error("❌ Error updating user:", error)
      setError("Failed to update profile. Please try again.")
    }
  }
  /*
  const handleUpdateUser = (userData: Partial<User> | User) => {
    try {
      console.log("📱 Updating/Creating user:", userData)

      if ("id" in userData && userData.id) {
        // This is a complete user object (new user created)
        const newUser = userData as User

        // Update in offline users list
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const existingIndex = offlineUsers.findIndex((u: User) => u.email === newUser.email)

        if (existingIndex >= 0) {
          offlineUsers[existingIndex] = newUser
        } else {
          offlineUsers.push(newUser)
        }

        localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers))
        localStorage.setItem("mywayapps_current_user", JSON.stringify(newUser))

        setUser(newUser)
        console.log("✅ New user created and set:", newUser.name)
      } else if (user) {
        // This is a partial update to existing user
        const updatedUser = {
          ...user,
          ...userData,
          updated_at: new Date().toISOString(),
        }

        // Update in offline users list
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const userIndex = offlineUsers.findIndex((u: User) => u.id === user.id)
        if (userIndex >= 0) {
          offlineUsers[userIndex] = updatedUser
          localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers))
        }

        setUser(updatedUser)
        localStorage.setItem("mywayapps_current_user", JSON.stringify(updatedUser))
        console.log("✅ User updated successfully")
      }
    } catch (error) {
      console.error("❌ Error updating user:", error)
      setError("Failed to update profile. Please try again.")
    }
  }
    */
  /*
  const handleUpdateUser = (userData: Partial<User>) => {
    if (user) {
      try {
        console.log("📱 Updating user:", userData)

        const updatedUser = {
          ...user,
          ...userData,
          updated_at: new Date().toISOString(),
        }

        // Update in offline users list
        const offlineUsers = JSON.parse(localStorage.getItem("mywayapps_offline_users") || "[]")
        const userIndex = offlineUsers.findIndex((u: User) => u.id === user.id)
        if (userIndex >= 0) {
          offlineUsers[userIndex] = updatedUser
          localStorage.setItem("mywayapps_offline_users", JSON.stringify(offlineUsers))
        }

        setUser(updatedUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("mywayapps_current_user", JSON.stringify(updatedUser))
        }
        console.log("📱 User updated successfully")
      } catch (error) {
        console.error("❌ Error updating user:", error)
        setError("Failed to update profile. Please try again.")
      }
    }
  }*/

  const categories = ["Education", "Games", "Puzzles"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <div className="text-4xl font-bold text-white">Loading MyWayApps...</div>
          <div className="text-lg text-white/80 mt-2">Educational Games Portal</div>
        </div>
      </div>
    )
  }

  // Show login screen if no user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-400 to-purple-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-white">Welcome back, {user.name}!</div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowContact(!showContact)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Card className="mb-4 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-yellow-800 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* User Profile Sidebar */}
          <div className="lg:col-span-1">
            <UserProfile user={null} onUpdateUser={handleUpdateUser} userStats={userStats} />

            {/* Contact Info */}
            {showContact && (
              <Card className="mt-6 bg-gradient-to-br from-green-300 to-teal-500 border-4 border-white shadow-lg">
                <CardContent className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-4 text-center">Contact Us</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5" />
                      <span>mywayapps10@gmail.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5" />
                      <span>(+91) XXXXX XXXXX</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5" />
                      <span>Educational Apps Division</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <img 
                  src="/mywayapps-logo.png" 
                  alt="MyWayApps Logo" 
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/mywayapps-logo.svg';
                  }}
                />
                <h1 className="text-5xl font-bold text-white">Welcome to MyWayApps! 🌟</h1>
              </div>
              <p className="text-xl text-white/90 mb-8">Fun and Educational Games for Kids</p>
            </div>

            {/* Categories */}
            {categories.map((category) => (
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
