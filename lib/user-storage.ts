export interface User {
  id: string
  email: string
  name: string
  age?: number
  grade?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProgress {
  [appId: string]: {
    best_score: number
    total_attempts: number
    total_time_spent: number
    last_played_at: string
    streak_count: number
    achievements: string[]
  }
}

// Local Storage Keys
const USERS_KEY = "mywayapps_users"
const CURRENT_USER_KEY = "mywayapps_current_user"
const USER_PROGRESS_KEY = "mywayapps_user_progress"

// Get all users from localStorage
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Error loading users:", error)
    return []
  }
}

// Save user to localStorage
export function saveUser(user: Omit<User, "id" | "created_at" | "updated_at">): User {
  const users = getAllUsers()

  // Check if user already exists by email or name
  const existingUser = users.find((u) => u.email === user.email || u.name === user.name)

  if (existingUser) {
    // Update existing user
    const updatedUser = {
      ...existingUser,
      ...user,
      updated_at: new Date().toISOString(),
    }

    const updatedUsers = users.map((u) => (u.id === existingUser.id ? updatedUser : u))
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

    return updatedUser
  } else {
    // Create new user
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

    return newUser
  }
}

// Find user by name or email
export function findUser(nameOrEmail: string): User | null {
  const users = getAllUsers()
  return (
    users.find(
      (u) => u.name.toLowerCase() === nameOrEmail.toLowerCase() || u.email.toLowerCase() === nameOrEmail.toLowerCase(),
    ) || null
  )
}

// Set current user
export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error loading current user:", error)
    return null
  }
}

// Clear current user (logout)
export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

// Save user progress
export function saveUserProgress(userId: string, appId: string, progressData: Partial<UserProgress[string]>): void {
  try {
    const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}")

    if (!allProgress[userId]) {
      allProgress[userId] = {}
    }

    if (!allProgress[userId][appId]) {
      allProgress[userId][appId] = {
        best_score: 0,
        total_attempts: 0,
        total_time_spent: 0,
        last_played_at: new Date().toISOString(),
        streak_count: 0,
        achievements: [],
      }
    }

    // Update progress
    allProgress[userId][appId] = {
      ...allProgress[userId][appId],
      ...progressData,
      last_played_at: new Date().toISOString(),
    }

    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error("Error saving user progress:", error)
  }
}

// Get user progress
export function getUserProgress(userId: string): UserProgress {
  try {
    const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}")
    return allProgress[userId] || {}
  } catch (error) {
    console.error("Error loading user progress:", error)
    return {}
  }
}

// Get all user names for autocomplete
export function getAllUserNames(): string[] {
  const users = getAllUsers()
  return users.map((u) => u.name)
}
