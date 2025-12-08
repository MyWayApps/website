import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Utility to validate the URL string before calling createClient
function isValidUrl(value?: string): boolean {
  if (!value) return false
  try {
    // Supabase URLs always start with http or https
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

// Check if we're in the browser and have the required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

// Initialize Supabase client with better error handling
function initializeSupabase(): SupabaseClient | null {
  // Early-exit if the URL or key are missing or clearly invalid
  if (!isValidUrl(supabaseUrl)) {
    console.warn("Supabase client NOT initialised – NEXT_PUBLIC_SUPABASE_URL is missing or invalid.")
    return null
  }
  if (!supabaseAnonKey) {
    console.warn("Supabase client NOT initialised – NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.")
    return null
  }

  try {
    // TypeScript now knows these are strings because of the checks above
    const client = createClient(supabaseUrl!, supabaseAnonKey!)
    console.log("Supabase client initialised ✔")
    return client
  } catch (err) {
    console.error("Failed to initialise Supabase client:", err)
    return null
  }
}

supabase = initializeSupabase()

export { supabase }

export type User = {
  id: string
  email?: string
  name: string
  phone?: string
  age?: number
  grade?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type Application = {
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

interface GameData {
  mode?: string
  pictureSet?: string
  completionTime?: number
  [key: string]: unknown
}

export type UserProgress = {
  id: string
  user_id: string
  application_id: string
  best_score: number
  total_attempts: number
  total_time_spent: number
  last_played_at: string
  streak_count: number
  achievements: string[]
  game_data: GameData
}

export type UserScore = {
  id: string
  user_id: string
  application_id: string
  score: number
  max_score: number
  completion_time?: number
  difficulty_level?: string
  game_data?: GameData
  created_at: string
}
