export interface Application {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  icon_emoji: string;
  color_scheme: string;
  route: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  grade?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  [appId: string]: {
    best_score: number;
    total_attempts: number;
    total_time_spent: number;
    last_played_at: string;
    streak_count: number;
    achievements: string[];
  };
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  timeSpent: number;
}

