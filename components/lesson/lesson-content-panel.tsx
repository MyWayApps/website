"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export interface LessonSection {
  heading: string
  points: string[]
}

interface LessonContentPanelProps {
  title: string
  gradientClass: string
  sections: LessonSection[]
  onBackToModes: () => void
}

/**
 * Generic "read the lesson" panel — headed sections of bullet points.
 * Reusable by any future text-based lesson, not just Food & Nutrients.
 */
export function LessonContentPanel({ title, gradientClass, sections, onBackToModes }: LessonContentPanelProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClass} p-4 relative overflow-hidden`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white drop-shadow">{title}</h1>
        </div>

        <div className="space-y-6 pb-10">
          {sections.map((section) => (
            <Card key={section.heading} className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.heading}</h2>
                <ul className="space-y-2">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-lg text-gray-700 leading-relaxed">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
