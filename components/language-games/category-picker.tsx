"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import type { CategoryInfo } from "@/lib/language-games-data"

interface CategoryPickerProps {
  title: string
  subtitle: string
  categories: CategoryInfo[]
  gradientClass: string
  onBack: () => void
  onPick: (categoryId: string) => void
}

const BADGE_COLORS = [
  "from-rose-400 to-pink-500",
  "from-orange-400 to-amber-500",
  "from-yellow-400 to-lime-500",
  "from-green-400 to-emerald-500",
  "from-teal-400 to-cyan-500",
  "from-sky-400 to-blue-500",
  "from-indigo-400 to-violet-500",
  "from-purple-400 to-fuchsia-500",
  "from-pink-400 to-rose-500",
  "from-red-400 to-orange-500",
]

export function CategoryPicker({ title, subtitle, categories, gradientClass, onBack, onPick }: CategoryPickerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg tracking-tight">{title}</h1>
          <p className="text-xl text-white/90 font-medium mt-2">{subtitle}</p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-white/90 text-xl font-medium">No categories available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((c, i) => (
              <Card
                key={c.id}
                onClick={() => onPick(c.id)}
                className="bg-white/95 border-0 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${BADGE_COLORS[i % BADGE_COLORS.length]} py-6 flex items-center justify-center`}>
                    <span className="text-3xl font-black text-white drop-shadow text-center px-2">{c.nameEnglish}</span>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-base font-semibold text-gray-500">{c.wordCount} words</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
