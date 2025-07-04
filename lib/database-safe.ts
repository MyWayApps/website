import { supabase } from "./supabase-client"
import type { User, Application, UserProgress, UserScore } from "./supabase-client"

interface GameData {
  mode?: string
  pictureSet?: string
  completionTime?: number
  [key: string]: unknown
}

// Fallback data for offline mode
const fallbackApplications: Application[] = [
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
export async function getAllUsers(): Promise<User[]> {
  return safeDbOperation(async (): Promise<User[]> => {
    if (!supabase) return []

    console.log("🔍 Fetching all users...")
    const { data, error } = await supabase.from("mywayapps-user").select("*").order("name", { ascending: true })

    if (error) {
      console.error("❌ Error fetching users:", error)
      throw error
    }

    console.log("✅ Users fetched successfully:", data?.length || 0)
    return (data as User[]) || []
  }, [])
}

export async function findUserByName(name: string): Promise<User | null> {
  return safeDbOperation(async (): Promise<User | null> => {
    if (!supabase) return null

    console.log("🔍 Finding user by name:", name)
    const { data, error } = await supabase.from("mywayapps-user").select("*").ilike("name", name).single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error finding user:", error)
      throw error
    }

    console.log("✅ User search result:", data ? "Found" : "Not found")
    return (data as User) || null
  }, null)
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return safeDbOperation(async (): Promise<User | null> => {
    if (!supabase) return null

    console.log("🔍 Finding user by email:", email)
    const { data, error } = await supabase.from("mywayapps-user").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") {
      console.error("❌ Error finding user by email:", error)
      throw error
    }

    console.log("✅ User email search result:", data ? "Found" : "Not found")
    return (data as User) || null
  }, null)
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User | null> {
  return safeDbOperation(async (): Promise<User | null> => {
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
    return data as User
  }, null)
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  return safeDbOperation(async (): Promise<User | null> => {
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
    return data as User
  }, null)
}

export async function getUsersByNamePattern(pattern: string): Promise<User[]> {
  return safeDbOperation(async (): Promise<User[]> => {
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
    return (data as User[]) || []
  }, [])
}

// Application Management Functions
export async function getApplications(): Promise<Application[]> {
  console.log("🔍 Getting applications...")

  if (!supabase) {
    console.warn("⚠️ Supabase client not initialized, using fallback applications")
    return fallbackApplications
  }

  try {
    console.log("🔍 Attempting to fetch from mywayapps-applications table...")

    // First, let's test if the table exists
    const { data, error } = await supabase
      .from("mywayapps-applications")
      .select("*")
      .order("category", { ascending: true })

    if (error) {
      console.error("❌ Supabase query error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      console.warn("⚠️ Using fallback applications due to database error")
      return fallbackApplications
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No applications found in database, using fallback data")
      return fallbackApplications
    }

    console.log("✅ Successfully fetched applications from database:", data.length, "records")
    return data as Application[]
  } catch (error) {
    console.error("❌ Exception in getApplications:", error)
    console.warn("⚠️ Using fallback applications due to exception")
    return fallbackApplications
  }
}

// User Progress Functions
export async function getUserProgress(userId: string): Promise<Record<string, UserProgress>> {
  return safeDbOperation(async (): Promise<Record<string, UserProgress>> => {
    if (!supabase) return {}

    console.log("🔍 Fetching user progress for:", userId)
    const { data, error } = await supabase.from("mywayapps-user_progress").select("*").eq("user_id", userId)

    if (error) {
      console.error("❌ Error fetching user progress:", error)
      throw error
    }

    const progressMap: Record<string, UserProgress> = {}
    if (data && Array.isArray(data)) {
      ;(data as unknown as UserProgress[]).forEach((progress) => {
        progressMap[progress.application_id] = progress
      })
    }

    console.log("✅ User progress fetched:", Object.keys(progressMap).length, "records")
    return progressMap
  }, {})
}

export async function saveUserScore(scoreData: Omit<UserScore, "id" | "created_at">): Promise<UserScore | null> {
  return safeDbOperation(async (): Promise<UserScore | null> => {
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
    return scoreResult as UserScore
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
): Promise<UserProgress | null> {
  return safeDbOperation(async (): Promise<UserProgress | null> => {
    if (!supabase) return null

    console.log("🔍 Updating user progress...")
    const { data: currentProgress } = await supabase
      .from("mywayapps-user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("application_id", applicationId)
      .single()

    const currentProgressTyped = currentProgress as UserProgress | null

    const updateData = {
      user_id: userId,
      application_id: applicationId,
      best_score: Math.max(currentProgressTyped?.best_score || 0, progressData.best_score),
      total_attempts: (currentProgressTyped?.total_attempts || 0) + progressData.total_attempts,
      total_time_spent: (currentProgressTyped?.total_time_spent || 0) + (progressData.completion_time || 0),
      last_played_at: new Date().toISOString(),
      streak_count:
        progressData.best_score > (currentProgressTyped?.best_score || 0)
          ? (currentProgressTyped?.streak_count || 0) + 1
          : currentProgressTyped?.streak_count || 0,
      achievements: currentProgressTyped?.achievements || [],
      game_data: { ...currentProgressTyped?.game_data, ...progressData.game_data },
    }

    const { data, error } = await supabase.from("mywayapps-user_progress").upsert([updateData]).select().single()

    if (error) {
      console.error("❌ Error updating progress:", error)
      throw error
    }

    console.log("✅ User progress updated successfully")
    return data as UserProgress
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

      const progressData = progress as UserProgress[]
      const stats = {
        totalGamesPlayed: progressData?.reduce((sum, p) => sum + p.total_attempts, 0) || 0,
        totalScore: progressData?.reduce((sum, p) => sum + p.best_score, 0) || 0,
        averageScore: progressData?.length
          ? progressData.reduce((sum, p) => sum + p.best_score, 0) / progressData.length
          : 0,
        timeSpent: progressData?.reduce((sum, p) => sum + p.total_time_spent, 0) || 0,
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
