"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Users, Lightbulb, Home } from "lucide-react"

interface RecipeStep {
  id: number
  title: string
  description: string
  emoji: string
  animation?: string
  tip?: string
}

interface Recipe {
  id: string
  name: string
  category: "indian" | "english"
  emoji: string
  difficulty: "Easy" | "Medium"
  time: string
  servings: string
  description: string
  ingredients: string[]
  steps: RecipeStep[]
}

interface RecipeDetailProps {
  recipe: Recipe
  onComplete: (recipeName: string, stepsCompleted: number) => void
  onBack: () => void
  onBackToHome?: () => void
}

export default function RecipeDetail({ recipe, onComplete, onBack, onBackToHome }: RecipeDetailProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [showIngredients, setShowIngredients] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  // Sound effects
  const playSound = (type: "step" | "complete") => {
    try {
      const audioContext = new (
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()

      if (type === "step") {
        // Pleasant ding for step completion
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } else {
        // Success melody for recipe completion
        const frequencies = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.2)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime + index * 0.2)
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.2 + 0.1)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.2 + 0.4)

          oscillator.start(audioContext.currentTime + index * 0.2)
          oscillator.stop(audioContext.currentTime + index * 0.2 + 0.4)
        })
      }
    } catch {
      console.log("Audio not supported")
    }
  }

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
      playSound("step")
    }
  }

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Recipe completed!
      setIsCompleted(true)
      playSound("complete")
      onComplete(recipe.name, recipe.steps.length)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = recipe.steps[currentStep]
  const isCurrentStepCompleted = completedSteps.includes(currentStep)
  const canProceed = isCurrentStepCompleted || currentStep === 0

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-4xl font-bold text-green-800 mb-4">Congratulations!</h1>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              You made {recipe.name}! {recipe.emoji}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You completed all {recipe.steps.length} steps like a real chef!
            </p>

            <div className="bg-yellow-100 border-4 border-yellow-300 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">🏆 Chef Achievement Unlocked!</h3>
              <p className="text-yellow-700">You're becoming an amazing cook! Keep practicing!</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={onBack}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl"
              >
                Cook Another Recipe
              </Button>
              {onBackToHome && (
                <Button
                  onClick={onBackToHome}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showIngredients) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-amber-400 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Recipes
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{recipe.emoji}</div>
                <h1 className="text-4xl font-bold text-purple-800 mb-2">{recipe.name}</h1>
                <p className="text-lg text-purple-700 mb-4">{recipe.description}</p>

                <div className="flex justify-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      recipe.difficulty === "Easy" ? "bg-green-200" : "bg-yellow-200"
                    }`}
                  >
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-4 border-yellow-300">
                <h2 className="text-2xl font-bold text-orange-800 mb-4 text-center">
                  🛒 Shopping List - What You Need
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white/50 rounded-lg p-3 border-2 border-orange-200"
                    >
                      <div className="text-2xl">✅</div>
                      <span className="text-lg font-medium text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <div className="bg-blue-100 border-4 border-blue-300 rounded-2xl p-4 mb-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">👨‍👩‍👧‍👦 Safety First!</h3>
                    <p className="text-blue-700">
                      Always ask an adult to help with cutting, cooking on the stove, or using hot things!
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowIngredients(false)}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👨‍🍳</span>
                      <span>Let's Start Cooking!</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-amber-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setShowIngredients(true)}
            className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Ingredients
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <span className="text-xl font-bold text-purple-800">
              Step {currentStep + 1} of {recipe.steps.length}
            </span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(((currentStep + 1) / recipe.steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / recipe.steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center mb-8">
              <div className="text-8xl mb-6 animate-pulse">{currentStepData.emoji}</div>
              <h2 className="text-3xl font-bold text-purple-800 mb-4">{currentStepData.title}</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6 max-w-2xl mx-auto">
                {currentStepData.description}
              </p>

              {currentStepData.tip && (
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-4 border-yellow-300 rounded-2xl p-4 mb-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    <span className="font-bold text-yellow-800">Chef's Tip!</span>
                  </div>
                  <p className="text-yellow-700">{currentStepData.tip}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              {!isCurrentStepCompleted ? (
                <Button
                  onClick={handleStepComplete}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <CheckCircle className="mr-2 h-6 w-6" />I Did This Step!
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 border-4 border-green-300 rounded-2xl px-6 py-3">
                    <div className="flex items-center gap-2 text-green-800 font-bold">
                      <CheckCircle className="h-6 w-6" />
                      <span>Great Job! ✨</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-6 py-3 rounded-2xl disabled:opacity-50"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Step
              </Button>

              <div className="flex gap-2">
                {recipe.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "bg-purple-600 scale-125"
                        : completedSteps.includes(index)
                          ? "bg-green-500"
                          : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNextStep}
                disabled={!canProceed}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === recipe.steps.length - 1 ? "Finish Recipe! 🎉" : "Next Step"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
