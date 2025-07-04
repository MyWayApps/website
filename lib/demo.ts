import type { User } from "./supabase-client"

// Demo user storage for offline mode
const DEMO_USERS_KEY = "mywayapps_demo_users"

export function saveDemoUser(user: User): void {
  try {
    if (typeof window === "undefined") return

    const existingUsers = getDemoUsers()
    const updatedUsers = existingUsers.filter((u) => u.id !== user.id)
    updatedUsers.push(user)

    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(updatedUsers))
    console.log("Demo user saved:", user.name)
  } catch (error) {
    console.error("Error saving demo user:", error)
  }
}

export function getDemoUsers(): User[] {
  try {
    if (typeof window === "undefined") return []

    const users = localStorage.getItem(DEMO_USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Error loading demo users:", error)
    return []
  }
}

export function findDemoUser(name: string): User | null {
  try {
    const users = getDemoUsers()
    return users.find((u) => u.name.toLowerCase() === name.toLowerCase()) || null
  } catch (error) {
    console.error("Error finding demo user:", error)
    return null
  }
}
