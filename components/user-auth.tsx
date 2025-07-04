"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, LogIn, UserPlus, Users, Loader2 } from "lucide-react"

// Offline user type
interface OfflineUser {
  id: string
  email: string
  name: string
  age?: number
  grade?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface UserAuthProps {
  onUserLogin: (user: OfflineUser) => void
}

// Local storage functions for offline mode
const OFFLINE_USERS_KEY = "mywayapps_offline_users"

const getOfflineUsers = (): OfflineUser[] => {
  try {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(OFFLINE_USERS_KEY)
    const parsedUsers = users ? JSON.parse(users) : []
    console.log("📱 Loaded offline users:", parsedUsers.length)
    return parsedUsers
  } catch (error) {
    console.error("❌ Error loading offline users:", error)
    return []
  }
}

const saveOfflineUser = (user: OfflineUser): void => {
  try {
    if (typeof window === "undefined") return
    const users = getOfflineUsers()

    // Check if user already exists (by email or name)
    const existingIndex = users.findIndex(
      (u) => u.email === user.email || u.name.toLowerCase() === user.name.toLowerCase(),
    )

    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = { ...users[existingIndex], ...user, updated_at: new Date().toISOString() }
      console.log("📱 Updated existing offline user:", user.name)
    } else {
      // Add new user
      users.push(user)
      console.log("📱 Added new offline user:", user.name)
    }

    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users))
    console.log("📱 Total offline users:", users.length)
  } catch (error) {
    console.error("❌ Error saving offline user:", error)
  }
}

const findOfflineUser = (name: string): OfflineUser | null => {
  const users = getOfflineUsers()
  const found = users.find((u) => u.name.toLowerCase() === name.toLowerCase())
  console.log("📱 Searching for user:", name, "Found:", !!found)
  return found || null
}

const searchOfflineUsers = (pattern: string): OfflineUser[] => {
  const users = getOfflineUsers()
  const results = users.filter((u) => u.name.toLowerCase().includes(pattern.toLowerCase()))
  console.log("📱 Search results for", pattern, ":", results.length)
  return results
}

export function UserAuth({ onUserLogin }: UserAuthProps) {
  const [mode, setMode] = useState<"login" | "signup" | "select">("select")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    grade: "",
  })
  const [existingUsers, setExistingUsers] = useState<OfflineUser[]>([])
  const [suggestions, setSuggestions] = useState<OfflineUser[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    // Show suggestions when typing name
    if (formData.name && mode === "login") {
      const results = searchOfflineUsers(formData.name)
      setSuggestions(results.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [formData.name, mode])

  const loadUsers = () => {
    try {
      setLoadingUsers(true)
      console.log("📱 Loading offline users...")

      const users = getOfflineUsers()
      setExistingUsers(users)
      console.log("📱 Loaded users for display:", users.length)
    } catch (error) {
      console.error("❌ Error loading users:", error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleLogin = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("📱 Attempting login for:", formData.name)
      const user = findOfflineUser(formData.name)

      if (user) {
        console.log("📱 User found, logging in:", user.name)
        onUserLogin(user)
      } else {
        console.log("📱 User not found:", formData.name)
        setError("User not found. Would you like to create a new account?")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      setError("Error logging in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("📱 Creating new user:", formData.name)

      const newUser: OfflineUser = {
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        age: formData.age ? Number.parseInt(formData.age) : undefined,
        grade: formData.grade || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      saveOfflineUser(newUser)
      console.log("📱 User created successfully:", newUser)

      // Refresh the user list
      loadUsers()

      // Log the user in
      onUserLogin(newUser)
    } catch (error) {
      console.error("❌ Signup error:", error)
      setError("Error creating account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (user: OfflineUser) => {
    setFormData({ ...formData, name: user.name })
    setSuggestions([])
  }

  const handleQuickLogin = (user: OfflineUser) => {
    console.log("📱 Quick login for:", user.name)
    onUserLogin(user)
  }

  // Create a demo user and login directly
  const handleOfflineMode = () => {
    console.log("📱 Entering offline mode with demo user...")

    const demoUser: OfflineUser = {
      id: `demo_${Date.now()}`,
      name: "Demo User",
      email: "demo@offline.local",
      age: 8,
      grade: "3rd Grade",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Save the demo user
    saveOfflineUser(demoUser)

    // Login with demo user
    onUserLogin(demoUser)
  }

  if (loadingUsers) {
    return (
      <Card className="bg-gradient-to-br from-purple-300 to-pink-400 border-4 border-white shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white">Loading users (offline mode)...</p>
        </CardContent>
      </Card>
    )
  }

  if (mode === "select") {
    return (
      <Card className="bg-gradient-to-br from-purple-300 to-pink-400 border-4 border-white shadow-lg">
        <CardHeader className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-white" />
          <CardTitle className="text-2xl font-bold text-white">Welcome to MyWayApps!</CardTitle>
          <p className="text-white/80">Choose how you&apos;d like to continue</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Offline Mode Button */}
          <Button
            onClick={handleOfflineMode}
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-bold text-lg py-3"
          >
            Continue in Offline Mode
          </Button>

          {existingUsers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-medium text-center">Quick Login ({existingUsers.length} users)</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {existingUsers.slice(0, 6).map((user) => (
                  <Badge
                    key={user.id}
                    className="bg-white/20 text-white hover:bg-white/30 cursor-pointer px-3 py-1 transition-all"
                    onClick={() => handleQuickLogin(user)}
                  >
                    {user.name}
                  </Badge>
                ))}
              </div>
              {existingUsers.length > 6 && (
                <p className="text-white/60 text-sm text-center">+{existingUsers.length - 6} more users available</p>
              )}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gradient-to-br from-purple-300 to-pink-400 px-2 text-white/70">Or</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => setMode("login")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login with Name
            </Button>

            <Button onClick={() => setMode("signup")} className="bg-white text-purple-600 hover:bg-gray-100">
              <UserPlus className="mr-2 h-4 w-4" />
              Create New Profile
            </Button>

            {existingUsers.length > 0 && (
              <Button
                onClick={() => {
                  console.log("📱 All users:", existingUsers)
                  alert(
                    `Offline Users (${existingUsers.length}):\n${existingUsers.map((u) => `• ${u.name} (${u.email})`).join("\n")}`,
                  )
                }}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                variant="outline"
              >
                <Users className="mr-2 h-4 w-4" />
                View All Users ({existingUsers.length})
              </Button>
            )}
          </div>

          <div className="text-center text-white/60 text-xs">All data is stored locally in your browser</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-300 to-purple-400 border-4 border-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          {mode === "login" ? "Welcome Back!" : "Create Your Profile"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="name" className="text-white font-medium">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                setError("")
              }}
              className="bg-white/20 border-white/30 text-white placeholder-white/60"
              placeholder="Enter your name"
              disabled={loading}
            />

            {/* Name suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-md shadow-lg border mt-1 z-10">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                    onClick={() => handleSuggestionClick(user)}
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="email" className="text-white font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="age" className="text-white font-medium">
                    Age (optional)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder-white/60"
                    placeholder="Age"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="grade" className="text-white font-medium">
                    Grade (optional)
                  </Label>
                  <Input
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder-white/60"
                    placeholder="Grade"
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={mode === "login" ? handleLogin : handleSignup}
            className="flex-1 bg-white text-indigo-600 hover:bg-gray-100"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Login" : "Create Profile"}
          </Button>

          <Button
            onClick={() => {
              setMode("select")
              setError("")
              setFormData({ name: "", email: "", age: "", grade: "" })
            }}
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            disabled={loading}
          >
            Back
          </Button>
        </div>

        {mode === "login" && (
          <div className="text-center">
            <button
              onClick={() => setMode("signup")}
              className="text-white/80 hover:text-white text-sm underline"
              disabled={loading}
            >
              Don&apos;t have an account? Create one
            </button>
          </div>
        )}

        <div className="text-center text-white/60 text-xs">Data stored locally - no internet required</div>
      </CardContent>
    </Card>
  )
}
