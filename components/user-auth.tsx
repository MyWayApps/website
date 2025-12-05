"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Loader2 } from "lucide-react"
import { createUserInSupabase, findUserInSupabase, testSupabaseConnection } from "@/lib/database-supabase"
import type { User as UserType } from "@/lib/database-supabase"

interface UserAuthProps {
  onUserLogin: (user: UserType) => void
  user?: UserType
  onUpdateUser?: (updated: Partial<UserType>) => void
}

// Local storage key for offline users
const OFFLINE_USERS_KEY = "mywayapps_offline_users"

// Helper functions for local storage
const getOfflineUsers = (): UserType[] => {
  try {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(OFFLINE_USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("❌ Error loading offline users:", error)
    return []
  }
}

const saveOfflineUser = (user: UserType): void => {
  try {
    if (typeof window === "undefined") return
    const users = getOfflineUsers()
    
    // Check if user already exists
    const existingIndex = users.findIndex(
      (u) => u.email === user.email || u.name.toLowerCase() === user.name.toLowerCase()
    )
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user, updated_at: new Date().toISOString() }
    } else {
      users.push(user)
    }
    
    localStorage.setItem(OFFLINE_USERS_KEY, JSON.stringify(users))
    console.log("📱 User saved to local storage:", user.name)
  } catch (error) {
    console.error("❌ Error saving offline user:", error)
  }
}

const findOfflineUser = (name: string): UserType | null => {
  const users = getOfflineUsers()
  return users.find((u) => u.name.toLowerCase() === name.toLowerCase()) || null
}

export function UserAuth({ onUserLogin }: UserAuthProps) {
  const [mode, setMode] = useState<"login" | "signup" | "select">("select")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    grade: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!formData.name.trim()) {
      setError("Please enter your name")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("🔍 Attempting login for:", formData.name)
      
      testSupabaseConnection()

      // Try Supabase first
      let user = await findUserInSupabase(formData.name)

      // Fallback to local storage
      if (!user) {
        console.log("📱 Checking local storage...")
        user = findOfflineUser(formData.name)
      }

      if (user) {
        console.log("✅ User found, logging in:", user.name)
        onUserLogin(user)
      } else {
        console.log("❌ User not found:", formData.name)
        setError("User not found. Would you like to register?")
      }
    } catch (error) {
      console.error("❌ Login error:", error)
      // Try local storage as fallback on error
      const localUser = findOfflineUser(formData.name)
      if (localUser) {
        console.log("✅ User found in local storage:", localUser.name)
        onUserLogin(localUser)
      } else {
        setError("User not found. Would you like to register?")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    // Validate mandatory fields
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
      console.log("🔍 Creating new user:", formData.name)

      // Create user object
      const newUser: UserType = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        grade: formData.grade || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Try Supabase first
      let createdUser: UserType | null = null
      try {
        createdUser = await createUserInSupabase({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          grade: formData.grade || undefined,
        })
      } catch (supabaseError) {
        console.log("📱 Supabase unavailable, using local storage")
      }

      // If Supabase failed, save to local storage
      if (!createdUser) {
        saveOfflineUser(newUser)
        createdUser = newUser
        console.log("✅ User created in local storage:", newUser.name)
      } else {
        // Also save to local storage as backup
        saveOfflineUser(createdUser)
        console.log("✅ User created in Supabase:", createdUser.name)
      }

      onUserLogin(createdUser)
    } catch (error) {
      console.error("❌ Signup error:", error)
      setError("Error creating account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setMode("select")
    setError("")
    setFormData({ name: "", phone: "", email: "", age: "", grade: "" })
  }

  // Welcome screen with Sign In / Register options
  if (mode === "select") {
    return (
      <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg">
        <CardHeader className="text-center pb-2">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-500" />
          <CardTitle className="text-2xl font-bold text-gray-500">Welcome to MyWayApps! 🌈</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setMode("login")}
              className="w-full bg-white text-gray-500 hover:bg-gray-100 font-bold text-lg py-6"
            >
              Sign In
            </Button>

            <Button
              onClick={() => setMode("signup")}
              className="w-full bg-white/30 hover:bg-white/40 text-gray-500 border-2 border-gray-500 font-bold text-lg py-6"
              variant="outline"
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sign In form
  if (mode === "login") {
    return (
      <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-500">Sign In</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
          )}

          <div>
            <Label htmlFor="name" className="text-gray-500 font-medium">
              Name:
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                setError("")
              }}
              className="bg-white/50 border-gray-400 text-gray-500 placeholder-gray-500"
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleLogin}
              className="flex-1 bg-white text-gray-500 hover:bg-gray-100 font-bold"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>

            <Button
              onClick={handleBack}
              className="flex-1 bg-white/30 hover:bg-white/40 text-gray-500 border-gray-500 font-bold"
              variant="outline"
              disabled={loading}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Register form
  return (
    <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-500">Register</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
        )}

        <div>
          <Label htmlFor="name" className="text-gray-500 font-medium">
            Name:
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              setError("")
            }}
            className="bg-white/50 border-gray-400 text-gray-500 placeholder-gray-500"
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-500 font-medium">
            Phone number (optional):
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-white/50 border-gray-400 text-gray-500 placeholder-gray-500"
            placeholder="Enter your phone number"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-500 font-medium">
            Email id:
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-white/50 border-gray-400 text-gray-500 placeholder-gray-500"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="age" className="text-gray-500 font-medium">
            Age (optional):
          </Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="bg-white/50 border-gray-400 text-gray-500 placeholder-gray-500"
            placeholder="Enter your age"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="grade" className="text-gray-500 font-medium">
            Grade (optional):
          </Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="bg-white/50 border-gray-400 text-gray-500 placeholder-gray-500"
            placeholder="Enter your grade"
            disabled={loading}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSignup}
            className="flex-1 bg-white text-gray-500 hover:bg-gray-100 font-bold"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>

          <Button
            onClick={handleBack}
            className="flex-1 bg-white/30 hover:bg-white/40 text-gray-500 border-gray-500 font-bold"
            variant="outline"
            disabled={loading}
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
