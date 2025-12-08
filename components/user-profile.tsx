"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Trophy, Clock } from "lucide-react"
import { createUserInSupabase, updateUser } from "@/lib/database-supabase"

interface UserType {
  id: string
  email?: string
  name: string
  age?: number
  grade?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface UserProfileProps {
  user: UserType | null
  onUpdateUser: (userData: Partial<UserType>) => void
  userStats?: {
    totalGamesPlayed: number
    totalScore: number
    averageScore: number
    timeSpent: number
  }
}

export function UserProfile({ user, onUpdateUser, userStats }: UserProfileProps) {
  console.log("UserProfile rendered. user:", user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    grade: user?.grade || "",
  })

  const handleSave = async () => {
    console.log("🔍 handleSave: Creating new user from profile:" )
    if (!user) {
      // This is creating a new user
      console.log("🔍 handleSave: Creating new user from profile:" )
      if (!formData.name.trim()) {
        alert("Please enter your name")
        return
      }

      try {
        console.log("🔍 Creating new user from profile:", formData.name)

        const userData = {
          name: formData.name,
          email: formData.name.toLowerCase().includes("demo")
            ? "demo@mywayapps.com"
            : `${formData.name.toLowerCase().replace(/\s+/g, "")}@mywayapps.com`,
          age: formData.age ? Number.parseInt(formData.age) : undefined,
          grade: formData.grade || undefined,
        }

        // Create user in Supabase
        const newUser = await createUserInSupabase(userData)

        if (newUser) {
          console.log("✅ User created successfully from profile:", newUser.name)
          onUpdateUser(newUser) // This will set the user in the parent component
          setIsEditing(false)
        } else {
          alert("Failed to create user. Please try again.")
        }
      } catch (error) {
        console.error("❌ Error creating user from profile:", error)
        alert("Error creating user. Please try again.")
      }
    } else {
      // This is updating an existing user
      try {
        const updatedData = {
          name: formData.name,
          age: formData.age ? Number.parseInt(formData.age) : undefined,
          grade: formData.grade,
        }

        // Update in Supabase first, then fallback to local
        const updatedUser = await updateUser(user.id, updatedData)

        if (updatedUser) {
          onUpdateUser(updatedData)
          setIsEditing(false)
          console.log("✅ User updated successfully")
        } else {
          // Fallback to local update
          onUpdateUser(updatedData)
          setIsEditing(false)
          console.log("📱 User updated locally")
        }
      } catch (error) {
        console.error("❌ Error updating user:", error)
        // Still allow local update
        onUpdateUser({
          name: formData.name,
          age: formData.age ? Number.parseInt(formData.age) : undefined,
          grade: formData.grade,
        })
        setIsEditing(false)
      }
    }
  }

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-amber-200 to-orange-300 border-4 border-white shadow-lg">
        <CardHeader className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-white" />
          <CardTitle className="text-2xl font-bold text-white">Create Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white font-medium">
              Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder-white/60"
              placeholder="Enter your name"
            />
          </div>
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
              placeholder="Enter your age"
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
              placeholder="Enter your grade"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-white text-purple-600 hover:bg-gray-100"
            disabled={!formData.name.trim()}
          >
            Create Profile
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-200 to-teal-300 border-4 border-white shadow-lg">
      <CardHeader className="text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-12 w-12 text-indigo-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">{user.name}</CardTitle>
        <div className="flex justify-center gap-2 mt-2">
          {user.age && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              Age {user.age}
            </Badge>
          )}
          {user.grade && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              Grade {user.grade}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder-white/60"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-white font-medium">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder-white/60"
                placeholder="Enter your age"
              />
            </div>
            <div>
              <Label htmlFor="grade" className="text-white font-medium">
                Grade
              </Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder-white/60"
                placeholder="Enter your grade"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1 bg-white text-indigo-600 hover:bg-gray-100">
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1 border-white text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {userStats && (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <Trophy className="h-6 w-6 mx-auto mb-1 text-yellow-300" />
                  <div className="text-lg font-bold text-white">{userStats.totalScore}</div>
                  <div className="text-xs text-white/80">Total Score</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-blue-300" />
                  <div className="text-lg font-bold text-white">{userStats.totalGamesPlayed}</div>
                  <div className="text-xs text-white/80">Games Played</div>
                </div>
              </div>
            )}

            <Button
              onClick={() => setIsEditing(true)}
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
