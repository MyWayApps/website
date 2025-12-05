"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createUserInSupabase, findUserInSupabase, testSupabaseConnection } from "@/lib/database-supabase"
import type { User as UserType } from "@/lib/database-supabase"

interface UserAuthProps {
  onUserLogin: (user: UserType) => void
  user?: UserType
  onUpdateUser?: (updated: Partial<UserType>) => void
}

// Character images for random display
const characterImages = [
  "/characters/boy.png",
  "/characters/bunny.png", 
  "/characters/girl.png",
]

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
  const [randomCharacter, setRandomCharacter] = useState("")

  // Select random character on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * characterImages.length)
    setRandomCharacter(characterImages[randomIndex])
  }, [])

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
      let supabaseError: any = null
      
      try {
        console.log("📤 Attempting to save user to Supabase...")
        createdUser = await createUserInSupabase({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          grade: formData.grade || undefined,
        })
        
        if (createdUser) {
          console.log("✅ User created in Supabase:", createdUser.name, "ID:", createdUser.id)
        } else {
          console.log("⚠️ createUserInSupabase returned null (Supabase may not be configured)")
        }
      } catch (err: any) {
        supabaseError = err
        console.error("❌ Supabase error:", err?.message || err)
      }

      // If Supabase failed, save to local storage
      if (!createdUser) {
        console.log("📱 Saving user to local storage as fallback...")
        if (supabaseError) {
          console.log("   Reason: Supabase error -", supabaseError?.message || "Unknown error")
        }
        saveOfflineUser(newUser)
        createdUser = newUser
        console.log("✅ User created in local storage:", newUser.name)
      } else {
        // Also save to local storage as backup
        saveOfflineUser(createdUser)
        console.log("✅ User also saved to local storage as backup")
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

  // Welcome screen with Name field, Login and Register options
  if (mode === "select") {
    return (
      <div className="relative">
        {/* Character Image - overlapping the card */}
        {randomCharacter && (
          <div className="flex justify-center mb-[-80px] relative z-10">
            <img 
              src={randomCharacter} 
              alt="Welcome Character" 
              className="h-64 w-64 object-contain drop-shadow-lg animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        )}
        
        <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg relative">
          <CardHeader className="text-center pb-2 pt-12">
            <CardTitle className="text-2xl font-bold text-gray-600">Welcome to MyWayApps! 🌈</CardTitle>
            <p className="text-lg text-gray-500 font-medium mt-1">A Colorful World of Learning!</p>
            <p 
              className="text-lg text-gray-800 mt-5 italic"
              style={{
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              Let&apos;s get started...
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
            )}

            <div>
              <Label htmlFor="name" className="text-gray-600 font-medium">
                Name:
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setError("")
                }}
                className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleLogin}
                className="w-full bg-white text-gray-600 hover:bg-gray-100 font-bold text-lg py-6"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>

              <Button
                onClick={() => setMode("signup")}
                className="w-full bg-white/30 hover:bg-white/40 text-gray-600 border-2 border-gray-500 font-bold text-lg py-6"
                variant="outline"
              >
                Register
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* CSS for animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    )
  }

  // Sign In form
  if (mode === "login") {
    return (
      <div className="relative">
        {/* Character Image - overlapping the card */}
        {randomCharacter && (
          <div className="flex justify-center mb-[-40px] relative z-10">
            <img 
              src={randomCharacter} 
              alt="Welcome Character" 
              className="h-32 w-32 object-contain drop-shadow-lg"
            />
          </div>
        )}
        
        <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg">
          <CardHeader className="text-center pt-12">
            <CardTitle className="text-2xl font-bold text-gray-600">Sign In</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
            )}

            <div>
              <Label htmlFor="name" className="text-gray-600 font-medium">
                Name:
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setError("")
                }}
                className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
                placeholder="Enter your name"
                disabled={loading}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleLogin}
                className="flex-1 bg-white text-gray-600 hover:bg-gray-100 font-bold"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>

              <Button
                onClick={handleBack}
                className="flex-1 bg-white/30 hover:bg-white/40 text-gray-600 border-gray-500 font-bold"
                variant="outline"
                disabled={loading}
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Register form
  return (
    <div className="relative">
      {/* Character Image - overlapping the card */}
      {randomCharacter && (
        <div className="flex justify-center mb-[-40px] relative z-10">
          <img 
            src={randomCharacter} 
            alt="Welcome Character" 
            className="h-32 w-32 object-contain drop-shadow-lg"
          />
        </div>
      )}
      
      <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg">
        <CardHeader className="text-center pt-12">
          <CardTitle className="text-2xl font-bold text-gray-600">Register</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
          )}

          <div>
            <Label htmlFor="name" className="text-gray-600 font-medium">
              Name:
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                setError("")
              }}
              className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-600 font-medium">
              Phone number (optional):
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-600 font-medium">
              Email id:
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-gray-600 font-medium">
              Age (optional):
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
              placeholder="Enter your age"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="grade" className="text-gray-600 font-medium">
              Grade (optional):
            </Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="bg-white/50 border-gray-400 text-gray-600 placeholder-gray-400"
              placeholder="Enter your grade"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSignup}
              className="flex-1 bg-white text-gray-600 hover:bg-gray-100 font-bold"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>

            <Button
              onClick={handleBack}
              className="flex-1 bg-white/30 hover:bg-white/40 text-gray-600 border-gray-500 font-bold"
              variant="outline"
              disabled={loading}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
