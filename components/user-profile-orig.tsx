"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Trophy, Clock } from "lucide-react"

interface UserType {
  id: string
  email: string
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
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    grade: user?.grade || "",
  })

  const handleSave = () => {
    onUpdateUser({
      name: formData.name,
      age: formData.age ? Number.parseInt(formData.age) : undefined,
      grade: formData.grade,
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-purple-300 to-pink-400 border-4 border-white shadow-lg">
        <CardContent className="p-6 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-white" />
          <h3 className="text-xl font-bold text-white mb-2">Welcome to MyWayApps! 🌈</h3>
          <p className="text-white/80 mb-4">Create your profile to track your progress</p>
          <Button onClick={() => setIsEditing(true)} className="bg-white text-purple-600 hover:bg-gray-100">
            Create Profile
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-300 to-purple-400 border-4 border-white shadow-lg">
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
