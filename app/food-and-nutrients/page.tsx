"use client"

import TopicHub, { type TopicMode } from "@/components/math-topics/topic-hub"
import { VisualMCQGame } from "@/components/math-topics/visual-mcq-game"
import { GenericMatchingMode } from "@/components/math-topics/generic-matching-mode"
import { LessonContentPanel } from "@/components/lesson/lesson-content-panel"
import { LessonFlashcardDeck } from "@/components/lesson/lesson-flashcard-deck"
import {
  FOOD_NUTRIENTS_SECTIONS,
  FOOD_NUTRIENTS_FLASHCARDS,
  generateFillBlankQuestion,
  generateFoodMCQQuestion,
  generateFoodNutrientsMatchPairs,
} from "@/lib/food-nutrients-data"

const GRADIENT = "from-orange-300 via-amber-400 to-red-500"

const MODES: TopicMode[] = [
  {
    id: "learn",
    label: "Learn",
    emoji: "📖",
    description: "Read about food, nutrition and nutrients",
    render: ({ onBackToModes }) => (
      <LessonContentPanel
        title="Food & Its Nutrients"
        gradientClass={GRADIENT}
        sections={FOOD_NUTRIENTS_SECTIONS}
        onBackToModes={onBackToModes}
      />
    ),
  },
  {
    id: "flashcards",
    label: "Flashcards",
    emoji: "🗂️",
    description: "Flip through cards on nutrients and their functions",
    render: ({ onBackToModes }) => (
      <LessonFlashcardDeck
        title="Food & Nutrients Flashcards"
        gradientClass={GRADIENT}
        cards={FOOD_NUTRIENTS_FLASHCARDS}
        onBackToModes={onBackToModes}
      />
    ),
  },
  {
    id: "fill-blanks",
    label: "Fill in the Blanks",
    emoji: "✏️",
    description: "Complete the sentence with the right word",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Fill in the Blanks"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateFillBlankQuestion()
          return {
            ...q,
            prompt: (
              <p className="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed">
                {q.sentence}
              </p>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "mcq",
    label: "Multiple Choice",
    emoji: "❓",
    description: "Pick the correct answer",
    render: ({ onBackToModes, onComplete }) => (
      <VisualMCQGame
        title="Multiple Choice Questions"
        gradientClass={GRADIENT}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
        generateQuestion={() => {
          const q = generateFoodMCQQuestion()
          return {
            ...q,
            prompt: (
              <p className="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed">
                {q.question}
              </p>
            ),
          }
        }}
      />
    ),
  },
  {
    id: "match",
    label: "Match the Following",
    emoji: "🔗",
    description: "Match each nutrient to what it does",
    render: ({ onBackToModes, onComplete }) => (
      <GenericMatchingMode
        title="Match the Following"
        gradientClass={GRADIENT}
        generatePairs={generateFoodNutrientsMatchPairs}
        onBackToModes={onBackToModes}
        onComplete={onComplete}
      />
    ),
  },
]

export default function FoodAndNutrientsPage() {
  return (
    <TopicHub
      title="Food & Its Nutrients"
      emoji="🍎"
      gradient={GRADIENT}
      applicationName="Food & Nutrients"
      modes={MODES}
      subject="Science"
    />
  )
}
