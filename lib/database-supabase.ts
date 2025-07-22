import { User,supabase } from "./supabase-client"

// Re-export types from supabase-client
export type { User, Application, UserProgress, UserScore } from "./supabase-client"

interface GameData {
  mode?: string
  pictureSet?: string
  completionTime?: number
  [key: string]: unknown
}

// Fallback data for offline mode
const fallbackApplications = [
  {
    id: "1",
    name: "Skip Counting Game",
    category: "Education",
    subcategory: "Math",
    description: "Learn skip counting by 2, 3, 5, and 10 with fun pictures!",
    icon_emoji: "🔢",
    color_scheme: "from-yellow-300 to-amber-500",
    route: "/skip-counting",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Number Sequence",
    category: "Education",
    subcategory: "Math",
    description: "Practice ascending and descending number patterns",
    icon_emoji: "📈",
    color_scheme: "from-blue-300 to-indigo-500",
    route: "/number-sequence",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Telugu Letters",
    category: "Education",
    subcategory: "Telugu",
    description: "Learn Telugu alphabet with interactive games",
    icon_emoji: "అ",
    color_scheme: "from-green-300 to-teal-500",
    route: "/telugu-letters",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "English Phonics",
    category: "Education",
    subcategory: "English",
    description: "Master English sounds and pronunciation",
    icon_emoji: "🔤",
    color_scheme: "from-purple-300 to-pink-500",
    route: "/english-phonics",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Shape Puzzle",
    category: "Puzzles",
    subcategory: "Geometry",
    description: "Identify and match different shapes",
    icon_emoji: "🔺",
    color_scheme: "from-red-300 to-orange-500",
    route: "/shape-puzzle",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Memory Game",
    category: "Games",
    subcategory: "Memory",
    description: "Test your memory with colorful cards",
    icon_emoji: "🧠",
    color_scheme: "from-cyan-300 to-blue-500",
    route: "/memory-game",
    created_at: new Date().toISOString(),
  },
]

// Safe wrapper for database operations
async function safeDbOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!supabase) {
    console.warn("Supabase not available, using fallback")
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error("Database operation failed:", error)
    console.warn("Falling back to default data")
    return fallback
  }
}

// Test Supabase connection with detailed logging
export async function testConnection(): Promise<boolean> {
  if (!supabase) {
    console.log("❌ Supabase client not initialized")
    return false
  }

  try {
    console.log("🔍 Testing connection to mywayapps-applications table...")
    const { error } = await supabase.from("mywayapps-applications").select("*", { count: "exact", head: true })

    if (error) {
      console.error("❌ Connection test failed:", error)
      return false
    }

    console.log("✅ Connection successful!")
    return true
  } catch (error) {
    console.error("❌ Connection test exception:", error)
    return false
  }
}

// User Management Functions
export async function getAllUsers() {
  return safeDbOperation(async () => {
    if (!supabase) return []

    console.log("🔍 Fetching all users...")
    const { data, error } = await supabase.from("mywayapps-user").select("*").order("name", { ascending: true })

    if (error) {
      console.error("❌ Error fetching users:", error)
      throw error
    }

    console.log("✅ Users fetched successfully:", data?.length || 0)
    return data || []
  }, [])
}

export async function findUserByName(name: string) {
  return safeDbOperation(async () => {
    if (!supabase) return null

    console.log("🔍 Finding user by name:", name)
    const { data, error } = await supabase.from("mywayapps-user").select("*").ilike("name", name).single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error finding user:", error)
      throw error
    }

    console.log("✅ User search result:", data ? "Found" : "Not found")
    return data || null
  }, null)
}

export async function findUserByEmail(email: string) {
  return safeDbOperation(async () => {
    if (!supabase) return null

    console.log("🔍 Finding user by email:", email)
    const { data, error } = await supabase.from("mywayapps-user").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error finding user by email:", error)
      throw error
    }

    console.log("✅ User email search result:", data ? "Found" : "Not found")
    return data || null
  }, null)
}

export async function createUser(userData: { name: string; email: string; age?: number; grade?: string }) {
  return safeDbOperation(async () => {
    if (!supabase) return null

    console.log("🔍 Creating new user:", userData.name)
    const { data, error } = await supabase
      .from("mywayapps-user")
      .insert([
        {
          ...userData,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("❌ Error creating user:", error)
      throw error
    }

    console.log("✅ User created successfully:", data.id)
    return data
  }, null)
}

export async function updateUser(
  userId: string,
  userData: Partial<{ name: string; email: string; age?: number; grade?: string }>,
) {
  return safeDbOperation(async () => {
    if (!supabase) return null

    console.log("🔍 Updating user:", userId)
    const { data, error } = await supabase
      .from("mywayapps-user")
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("❌ Error updating user:", error)
      throw error
    }

    console.log("✅ User updated successfully")
    return data
  }, null)
}

// Find or create user (combines find and create)
export async function findOrCreateUser(userData: { name: string; email: string; age?: number; grade?: string }) {
  try {
    console.log("🔍 Finding or creating user:", userData.name)

    // First try to find by email
    let user = await findUserByEmail(userData.email)

    if (user) {
      console.log("✅ User found by email:", user.name)
      return user
    }

    // Then try to find by name
    user = await findUserByName(userData.name)

    if (user) {
      console.log("✅ User found by name:", user.name)
      return user
    }

    // If not found, create new user
    console.log("🔍 User not found, creating new user...")
    user = await createUser(userData)

    if (user) {
      console.log("✅ New user created:", user.name)
      return user
    }

    console.log("❌ Failed to create user")
    return null
  } catch (error) {
    console.error("❌ Error in findOrCreateUser:", error)
    return null
  }
}

export async function getUsersByNamePattern(pattern: string) {
  return safeDbOperation(async () => {
    if (!supabase) return []

    console.log("🔍 Searching users by pattern:", pattern)
    const { data, error } = await supabase
      .from("mywayapps-user")
      .select("*")
      .ilike("name", `%${pattern}%`)
      .order("name", { ascending: true })
      .limit(10)

    if (error) {
      console.error("❌ Error searching users:", error)
      throw error
    }

    console.log("✅ User search completed:", data?.length || 0, "results")
    return data || []
  }, [])
}

// Application Management Functions
// ─────────────────────────────────────────────────────────────────────────
// Application helpers
// ─────────────────────────────────────────────────────────────────────────

export async function getApplications() {
  return safeDbOperation(async () => {
    console.log("🔍 Trying to fetch applications from Supabase…")

    if (!supabase) {
      console.warn("Supabase client not initialized, using fallback")
      return fallbackApplications
    }

    // HEAD-only query first – if this fails we skip the big select call
    const { error: headErr } = await supabase.from("mywayapps-applications").select("*", { head: true, count: "exact" })

    if (headErr) {
      console.warn("⚠️  Head-check failed, falling back →", headErr.message || headErr)
      throw headErr
    }

    // Full fetch
    const { data, error } = await supabase
      .from("mywayapps-applications")
      .select("*")
      .order("category", { ascending: true })

    if (error) throw error
    if (!data || data.length === 0) {
      console.warn("⚠️  Empty table, using fallback list")
      return fallbackApplications
    }

    console.log(`✅  Received ${data.length} application rows`)
    return data
  }, fallbackApplications)
}

// Get application by name
export async function getApplicationByName(name: string) {
  try {
    console.log("🔍 Finding application by name:", name)

    const applications = await getApplications()
    const app = applications.find((app) => app.name.toLowerCase() === name.toLowerCase())

    if (app) {
      console.log("✅ Application found:", app.name)
      return app
    }

    console.log("❌ Application not found:", name)
    return null
  } catch (error) {
    console.error("❌ Error finding application by name:", error)
    return null
  }
}

// User Progress Functions
export async function getUserProgress(userId: string) {
  return safeDbOperation(async () => {
    if (!supabase) return {}

    console.log("🔍 Fetching user progress for:", userId)
    const { data, error } = await supabase.from("mywayapps-user_progress").select("*").eq("user_id", userId)

    if (error) {
      console.error("❌ Error fetching user progress:", error)
      throw error
    }

    const progressMap: Record<string, any> = {}
    if (data && Array.isArray(data)) {
      data.forEach((progress) => {
        progressMap[progress.application_id] = progress
      })
    }

    console.log("✅ User progress fetched:", Object.keys(progressMap).length, "records")
    return progressMap
  }, {})
}

export async function saveUserScore(scoreData: {
  user_id: string
  application_id: string
  score: number
  max_score: number
  completion_time?: number
  difficulty_level?: string
  game_data?: GameData
}) {
  return safeDbOperation(async () => {
    if (!supabase) return null

    console.log("🔍 Saving user score...")
    const { data: scoreResult, error: scoreError } = await supabase
      .from("mywayapps-user_scores")
      .insert([scoreData])
      .select()
      .single()

    if (scoreError) {
      console.error("❌ Error saving score:", scoreError)
      throw scoreError
    }

    await updateUserProgress(scoreData.user_id, scoreData.application_id, {
      best_score: scoreData.score,
      total_attempts: 1,
      completion_time: scoreData.completion_time || 0,
      game_data: scoreData.game_data || {},
    })

    console.log("✅ User score saved successfully")
    return scoreResult
  }, null)
}

export async function updateUserProgress(
  userId: string,
  applicationId: string,
  progressData: {
    best_score: number
    total_attempts: number
    completion_time?: number
    game_data?: GameData
  },
) {
  return safeDbOperation(async () => {
    if (!supabase) return null

    console.log("🔍 Updating user progress...")
    const { data: currentProgress } = await supabase
      .from("mywayapps-user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("application_id", applicationId)
      .single()

    const updateData = {
      user_id: userId,
      application_id: applicationId,
      best_score: Math.max(currentProgress?.best_score || 0, progressData.best_score),
      total_attempts: (currentProgress?.total_attempts || 0) + progressData.total_attempts,
      total_time_spent: (currentProgress?.total_time_spent || 0) + (progressData.completion_time || 0),
      last_played_at: new Date().toISOString(),
      streak_count:
        progressData.best_score > (currentProgress?.best_score || 0)
          ? (currentProgress?.streak_count || 0) + 1
          : currentProgress?.streak_count || 0,
      achievements: currentProgress?.achievements || [],
      game_data: { ...currentProgress?.game_data, ...progressData.game_data },
    }

    const { data, error } = await supabase.from("mywayapps-user_progress").upsert([updateData]).select().single()

    if (error) {
      console.error("❌ Error updating progress:", error)
      throw error
    }

    console.log("✅ User progress updated successfully")
    return data
  }, null)
}

export async function getUserStats(userId: string) {
  return safeDbOperation(
    async () => {
      if (!supabase) {
        return {
          totalGamesPlayed: 0,
          totalScore: 0,
          averageScore: 0,
          timeSpent: 0,
        }
      }

      console.log("🔍 Fetching user stats for:", userId)
      const { data: progress, error } = await supabase.from("mywayapps-user_progress").select("*").eq("user_id", userId)

      if (error) {
        console.error("❌ Error fetching user stats:", error)
        throw error
      }

      const stats = {
        totalGamesPlayed: progress?.reduce((sum, p) => sum + p.total_attempts, 0) || 0,
        totalScore: progress?.reduce((sum, p) => sum + p.best_score, 0) || 0,
        averageScore: progress?.length ? progress.reduce((sum, p) => sum + p.best_score, 0) / progress.length : 0,
        timeSpent: progress?.reduce((sum, p) => sum + p.total_time_spent, 0) || 0,
      }

      console.log("✅ User stats calculated:", stats)
      return stats
    },
    {
      totalGamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      timeSpent: 0,
    },
  )
}

// Helper function for offline fallback (used by components)
export function saveOfflineUser(user: any): void {
  try {
    if (typeof window === "undefined") return

    const existingUsers = getOfflineUsers()
    const updatedUsers = existingUsers.filter((u) => u.id !== user.id)
    updatedUsers.push(user)

    localStorage.setItem("mywayapps_offline_users", JSON.stringify(updatedUsers))
    console.log("📱 Demo user saved:", user.name)
  } catch (error) {
    console.error("❌ Error saving offline user:", error)
  }
}

export function getOfflineUsers(): any[] {
  try {
    if (typeof window === "undefined") return []

    const users = localStorage.getItem("mywayapps_offline_users")
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("❌ Error loading offline users:", error)
    return []
  }
}

export function findOfflineUser(name: string): any | null {
  try {
    const users = getOfflineUsers()
    return users.find((u) => u.name.toLowerCase() === name.toLowerCase()) || null
  } catch (error) {
    console.error("❌ Error finding offline user:", error)
    return null
  }
}

// Enhanced user login with Supabase
export async function findUserInSupabase(name: string): Promise<User | null> {
  return safeDbOperation(async (): Promise<User | null> => {
    if (!supabase) {
      console.warn("⚠️ Supabase not available, searching locally")
      return findOfflineUser(name)
    }

    console.log("🔍 Searching user in Supabase:", name)
    
    // Handle Demo User special case
    const searchName = name.toLowerCase().includes("demo") ? "Demo User" : name

    const { data, error } = await supabase
      .from("mywayapps-user")
      .select("*")
      .ilike("name", searchName)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error finding user in Supabase:", error)
      // Fallback to offline search
      return findOfflineUser(name)
    }

    if (data) {
      console.log("✅ User found in Supabase:", data.name)
      return data as User
    } else {
      console.log("❌ User not found in Supabase:", searchName)
      // Also check offline storage
      return findOfflineUser(name)
    }
  }, findOfflineUser(name))
}

export async function testSupabaseConnection(): Promise<void> {
  console.log("🧪 Testing Supabase connection...")
  
  try {
    // Test connection
    const isConnected = await testConnection()
    console.log("Connection status:", isConnected ? "✅ Connected" : "❌ Failed")
    
    // Test user creation
    if (isConnected) {
      const testUser = await createUserInSupabase({
        name: "Test User",
        email: "test@example.com",
        age: 25,
        grade: "Adult"
      })
      console.log("Test user creation:", testUser ? "✅ Success" : "❌ Failed")
      
      // Test user search
      const foundUser = await findUserInSupabase("Test User")
      console.log("Test user search:", foundUser ? "✅ Found" : "❌ Not found")
    }
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

// Alias for backward compatibility
export const createUserInSupabase = createUser
