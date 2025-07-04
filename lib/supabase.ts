import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  name: string
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
