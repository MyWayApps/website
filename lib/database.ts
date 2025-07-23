import { supabase } from "./supabase"
import type { User, Application, UserProgress, UserScore } from "./supabase"

interface GameData {
  mode?: string
  pictureSet?: string
  completionTime?: number
  [key: string]: unknown
}

// Fallback data in case database is not available
const fallbackApplications: Application[] = [
  {
    id: "0",
    name: "Cooking Recipes",
    category: "Education",
    subcategory: "Life Skills",
    description: "Learn cooking skills with fun recipes!",
    icon_emoji: "🍳",
    color_scheme: "from-yellow-300 to-amber-500",
    route: "/cooking-recipes",
    created_at: new Date().toISOString(),
  },
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
    description: "Practice forward and backward counting",
    icon_emoji: "📈",
    color_scheme: "from-blue-300 to-indigo-500",
    route: "/number-sequence",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Clock Reading",
    category: "Education",
    subcategory: "Math",
    description: "Learn to read clocks with interactive games",
    icon_emoji: "🕰️",
    color_scheme: "from-purple-300 to-pink-500",
    route: "/clock-reading",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
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
    id: "5",
    name: "Telugu Letters Game",
    category: "Education",
    subcategory: "Telugu",
    description: "Learn Telugu letters with a fun game",
    icon_emoji: "అ",
    color_scheme: "from-pink-300 to-purple-500",
    route: "/telugu-letters-game",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
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
    id: "7",
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
    id: "8",
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

// Test Supabase connection
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("applications").select("count", { count: "exact", head: true })
    return !error
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    return false
  }
}

// User Management Functions
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from("mywayapps-user").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Supabase error getting users:", error)
      throw error
    }
    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function findUserByName(name: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("mywayapps-user").select("*").ilike("name", name).single()

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error finding user by name:", error)
      throw error
    }
    return data || null
  } catch (error) {
    console.error("Error finding user by name:", error)
    return null
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("mywayapps-user").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error finding user by email:", error)
      throw error
    }
    return data || null
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User | null> {
  try {
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
      console.error("Supabase error creating user:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
  try {
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
      console.error("Supabase error updating user:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export async function getUsersByNamePattern(pattern: string): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from("mywayapps-user")
      .select("*")
      .ilike("name", `%${pattern}%`)
      .order("name", { ascending: true })
      .limit(10)

    if (error) {
      console.error("Supabase error searching users:", error)
      throw error
    }
    return data || []
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

// Application Management Functions
export async function getApplications(): Promise<Application[]> {
  try {
    // First test if we can connect to Supabase
    const connectionTest = await testConnection()
    if (!connectionTest) {
      console.warn("Supabase connection failed, using fallback data")
      return fallbackApplications
    }

    const { data, error } = await supabase.from("applications").select("*").order("category", { ascending: true })

    if (error) {
      console.error("Supabase error fetching applications:", error)
      console.warn("Using fallback applications data")
      return fallbackApplications
    }

    // If no data returned, use fallback
    if (!data || data.length === 0) {
      console.warn("No applications found in database, using fallback data")
      return fallbackApplications
    }

    return data
  } catch (error) {
    console.error("Error fetching applications:", error)
    console.warn("Using fallback applications data")
    return fallbackApplications
  }
}

// User Progress Functions
export async function getUserProgress(userId: string): Promise<Record<string, UserProgress>> {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select(`
        *,
        applications (
          name,
          icon_emoji,
          color_scheme
        )
      `)
      .eq("user_id", userId)

    if (error) {
      console.error("Supabase error fetching user progress:", error)
      return {}
    }

    // Convert array to object with application_id as key
    const progressMap: Record<string, UserProgress> = {}
    data?.forEach((progress) => {
      progressMap[progress.application_id] = progress
    })

    return progressMap
  } catch (error) {
    console.error("Error fetching user progress:", error)
    return {}
  }
}

export async function saveUserScore(scoreData: Omit<UserScore, "id" | "created_at">): Promise<UserScore | null> {
  try {
    // Save the individual score
    const { data: scoreResult, error: scoreError } = await supabase
      .from("user_scores")
      .insert([scoreData])
      .select()
      .single()

    if (scoreError) {
      console.error("Supabase error saving user score:", scoreError)
      throw scoreError
    }

    // Update user progress
    await updateUserProgress(scoreData.user_id, scoreData.application_id, {
      best_score: scoreData.score,
      total_attempts: 1, // This will be incremented in updateUserProgress
      completion_time: scoreData.completion_time || 0,
      game_data: scoreData.game_data || {},
    })

    return scoreResult
  } catch (error) {
    console.error("Error saving user score:", error)
    return null
  }
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
  try {
    // Get current progress
    const { data: currentProgress } = await supabase
      .from("user_progress")
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

    const { data, error } = await supabase.from("user_progress").upsert([updateData]).select().single()

    if (error) {
      console.error("Supabase error updating user progress:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Error updating user progress:", error)
    return null
  }
}

// Get user statistics
export async function getUserStats(userId: string) {
  try {
    const { data: progress, error } = await supabase.from("user_progress").select("*").eq("user_id", userId)

    if (error) {
      console.error("Supabase error fetching user stats:", error)
      return {
        totalGamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        timeSpent: 0,
      }
    }

    const stats = {
      totalGamesPlayed: progress?.reduce((sum, p) => sum + p.total_attempts, 0) || 0,
      totalScore: progress?.reduce((sum, p) => sum + p.best_score, 0) || 0,
      averageScore: progress?.length ? progress.reduce((sum, p) => sum + p.best_score, 0) / progress.length : 0,
      timeSpent: progress?.reduce((sum, p) => sum + p.total_time_spent, 0) || 0,
    }

    return stats
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      totalGamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      timeSpent: 0,
    }
  }
}
