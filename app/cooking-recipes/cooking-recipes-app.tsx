"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, ChefHat, Clock, Users } from "lucide-react"
import RecipeDetail from "./recipe-detail"

type AppMode = "menu" | "recipe-list" | "recipe-detail"
type RecipeCategory = "indian" | "english"

interface User {
  id: string
  name: string
  email: string
}

interface GameData {
  mode?: string
  recipeCompleted?: string
  completionTime?: number
  [key: string]: unknown // Add this index signature to match database interface
}

interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  emoji: string
  difficulty: "Easy" | "Medium"
  time: string
  servings: string
  description: string
  ingredients: string[]
  steps: RecipeStep[]
}

interface RecipeStep {
  id: number
  title: string
  description: string
  emoji: string
  animation?: string
  tip?: string
}

interface CookingRecipesAppProps {
  user?: User | null
  onRecipeComplete?: (recipeName: string, stepsCompleted: number, gameData: GameData) => void
  onBackToHome?: () => void
}

const recipes: Recipe[] = [
  // Indian Recipes
  {
    id: "chapati",
    name: "Simple Chapati",
    category: "indian",
    emoji: "🫓",
    difficulty: "Easy",
    time: "20 mins",
    servings: "4 pieces",
    description: "Learn to make soft and delicious Indian flatbread!",
    ingredients: ["2 cups wheat flour", "1 cup warm water", "1/2 tsp salt", "1 tsp oil (optional)"],
    steps: [
      {
        id: 1,
        title: "Mix the flour",
        description: "Put flour and salt in a big bowl. Mix them together with your hands!",
        emoji: "🥣",
        tip: "Make sure there are no lumps in the flour!",
      },
      {
        id: 2,
        title: "Add water slowly",
        description: "Pour water little by little and mix with your hands to make dough.",
        emoji: "💧",
        tip: "Don't add all water at once - go slowly!",
      },
      {
        id: 3,
        title: "Knead the dough",
        description: "Press and fold the dough for 5 minutes until it's smooth.",
        emoji: "👐",
        tip: "The dough should feel soft like your earlobe!",
      },
      {
        id: 4,
        title: "Rest the dough",
        description: "Cover the dough with a cloth and let it rest for 10 minutes.",
        emoji: "😴",
        tip: "This makes the chapati softer!",
      },
      {
        id: 5,
        title: "Roll into circles",
        description: "Take small pieces and roll them into thin circles with a rolling pin.",
        emoji: "🎯",
        tip: "Don't worry if they're not perfect circles!",
      },
      {
        id: 6,
        title: "Cook on pan",
        description: "Cook each chapati on a hot pan for 1-2 minutes on each side.",
        emoji: "🍳",
        tip: "Ask an adult to help with the hot pan!",
      },
    ],
  },
  {
    id: "fruit-chaat",
    name: "Colorful Fruit Chaat",
    category: "indian",
    emoji: "🥗",
    difficulty: "Easy",
    time: "15 mins",
    servings: "2-3 people",
    description: "A yummy and healthy Indian fruit salad with spices!",
    ingredients: [
      "1 apple (chopped)",
      "1 banana (sliced)",
      "1 cup grapes",
      "1 orange (peeled)",
      "1/2 tsp chaat masala",
      "1 tsp lemon juice",
      "Mint leaves for decoration",
    ],
    steps: [
      {
        id: 1,
        title: "Wash all fruits",
        description: "Clean all fruits with water and dry them with a clean towel.",
        emoji: "🚿",
        tip: "Always wash fruits before eating!",
      },
      {
        id: 2,
        title: "Chop the fruits",
        description: "Cut apple into small pieces, slice banana, and peel orange.",
        emoji: "🔪",
        tip: "Ask an adult to help with cutting!",
      },
      {
        id: 3,
        title: "Mix in a bowl",
        description: "Put all chopped fruits in a big colorful bowl.",
        emoji: "🥣",
        tip: "Use your favorite bowl to make it more fun!",
      },
      {
        id: 4,
        title: "Add lemon juice",
        description: "Squeeze fresh lemon juice over the fruits.",
        emoji: "🍋",
        tip: "This keeps fruits fresh and adds tangy taste!",
      },
      {
        id: 5,
        title: "Sprinkle chaat masala",
        description: "Add a pinch of chaat masala and mix gently.",
        emoji: "✨",
        tip: "Start with a little - you can always add more!",
      },
      {
        id: 6,
        title: "Decorate and serve",
        description: "Add mint leaves on top and serve immediately!",
        emoji: "🌿",
        tip: "Eat fresh for the best taste!",
      },
    ],
  },
  {
    id: "masala-milk",
    name: "Golden Masala Milk",
    category: "indian",
    emoji: "🥛",
    difficulty: "Easy",
    time: "10 mins",
    servings: "1 glass",
    description: "Warm, spiced milk that's healthy and delicious!",
    ingredients: [
      "1 cup milk",
      "1/4 tsp turmeric powder",
      "1/4 tsp cinnamon powder",
      "1 tsp honey or sugar",
      "2-3 almonds (chopped)",
      "Pinch of cardamom powder",
    ],
    steps: [
      {
        id: 1,
        title: "Heat the milk",
        description: "Pour milk in a pan and heat it on medium flame.",
        emoji: "🔥",
        tip: "Ask an adult to help with the stove!",
      },
      {
        id: 2,
        title: "Add turmeric",
        description: "Add turmeric powder and stir well. Watch it turn golden!",
        emoji: "💛",
        tip: "Turmeric is very healthy for you!",
      },
      {
        id: 3,
        title: "Add other spices",
        description: "Add cinnamon and cardamom powder. Stir gently.",
        emoji: "🌟",
        tip: "These spices smell amazing!",
      },
      {
        id: 4,
        title: "Sweeten it",
        description: "Add honey or sugar according to your taste.",
        emoji: "🍯",
        tip: "Honey is healthier than sugar!",
      },
      {
        id: 5,
        title: "Add almonds",
        description: "Put chopped almonds in the milk for extra nutrition.",
        emoji: "🌰",
        tip: "Almonds make you smart!",
      },
      {
        id: 6,
        title: "Serve warm",
        description: "Pour in your favorite mug and enjoy while warm!",
        emoji: "☕",
        tip: "Perfect for bedtime or when you're feeling cold!",
      },
    ],
  },
  // English Recipes
  {
    id: "peanut-butter-sandwich",
    name: "Peanut Butter Sandwich",
    category: "english",
    emoji: "🥜",
    difficulty: "Easy",
    time: "5 mins",
    servings: "1 sandwich",
    description: "A classic, protein-packed sandwich that's perfect for any time!",
    ingredients: [
      "2 slices of bread",
      "2 tbsp peanut butter",
      "1 tbsp jam or honey",
      "1/2 banana (sliced) - optional",
      "A few strawberry slices - optional",
    ],
    steps: [
      {
        id: 1,
        title: "Get your bread ready",
        description: "Take two slices of your favorite bread and place them on a clean plate.",
        emoji: "🍞",
        tip: "Whole wheat bread is healthier!",
      },
      {
        id: 2,
        title: "Spread peanut butter",
        description: "Use a butter knife to spread peanut butter on one slice evenly.",
        emoji: "🥜",
        tip: "Spread from edge to edge for the best taste!",
      },
      {
        id: 3,
        title: "Add jam or honey",
        description: "Spread jam or drizzle honey on the other slice of bread.",
        emoji: "🍯",
        tip: "Try different flavors of jam!",
      },
      {
        id: 4,
        title: "Add fruits (optional)",
        description: "Place banana slices or strawberries on the peanut butter side.",
        emoji: "🍌",
        tip: "Fruits make it extra yummy and healthy!",
      },
      {
        id: 5,
        title: "Put it together",
        description: "Carefully place the jam side on top of the peanut butter side.",
        emoji: "🥪",
        tip: "Press gently so it sticks together!",
      },
      {
        id: 6,
        title: "Cut and enjoy",
        description: "Cut diagonally in half and enjoy your delicious sandwich!",
        emoji: "✂️",
        tip: "Cutting makes it easier to eat!",
      },
    ],
  },
  {
    id: "rainbow-smoothie",
    name: "Rainbow Fruit Smoothie",
    category: "english",
    emoji: "🌈",
    difficulty: "Easy",
    time: "10 mins",
    servings: "2 glasses",
    description: "A colorful, healthy smoothie packed with vitamins!",
    ingredients: [
      "1 banana",
      "1/2 cup strawberries",
      "1/2 cup blueberries",
      "1/2 cup mango chunks",
      "1 cup milk or yogurt",
      "1 tsp honey",
      "Ice cubes",
    ],
    steps: [
      {
        id: 1,
        title: "Wash all fruits",
        description: "Rinse strawberries and blueberries under cold water.",
        emoji: "🚿",
        tip: "Always wash fruits before using them!",
      },
      {
        id: 2,
        title: "Prepare fruits",
        description: "Peel banana, remove strawberry tops, and get mango chunks ready.",
        emoji: "🔪",
        tip: "Ask an adult to help with cutting!",
      },
      {
        id: 3,
        title: "Add to blender",
        description: "Put all fruits in the blender one by one.",
        emoji: "🥤",
        tip: "Add softer fruits first!",
      },
      {
        id: 4,
        title: "Pour milk",
        description: "Add milk or yogurt to make it creamy and smooth.",
        emoji: "🥛",
        tip: "Yogurt makes it thicker and tangier!",
      },
      {
        id: 5,
        title: "Add sweetener",
        description: "Add honey for natural sweetness and a few ice cubes.",
        emoji: "🍯",
        tip: "Taste and adjust sweetness as needed!",
      },
      {
        id: 6,
        title: "Blend and serve",
        description: "Blend until smooth and pour into colorful glasses!",
        emoji: "🎉",
        tip: "Garnish with a strawberry on top!",
      },
    ],
  },
  {
    id: "mini-pancakes",
    name: "Fluffy Mini Pancakes",
    category: "english",
    emoji: "🥞",
    difficulty: "Medium",
    time: "25 mins",
    servings: "12 mini pancakes",
    description: "Small, fluffy pancakes perfect for little hands!",
    ingredients: [
      "1 cup flour",
      "1 tbsp sugar",
      "1 tsp baking powder",
      "1/2 tsp salt",
      "1 egg",
      "3/4 cup milk",
      "2 tbsp melted butter",
      "Maple syrup for serving",
    ],
    steps: [
      {
        id: 1,
        title: "Mix dry ingredients",
        description: "In a bowl, mix flour, sugar, baking powder, and salt together.",
        emoji: "🥣",
        tip: "Use a whisk to mix evenly!",
      },
      {
        id: 2,
        title: "Beat the egg",
        description: "Crack the egg in another bowl and beat it with a fork.",
        emoji: "🥚",
        tip: "Ask an adult to help crack the egg!",
      },
      {
        id: 3,
        title: "Add wet ingredients",
        description: "Add beaten egg, milk, and melted butter to the flour mixture.",
        emoji: "🥛",
        tip: "Make sure butter is not too hot!",
      },
      {
        id: 4,
        title: "Mix gently",
        description: "Stir everything together until just combined. Don't overmix!",
        emoji: "🥄",
        tip: "A few lumps are okay - this makes fluffy pancakes!",
      },
      {
        id: 5,
        title: "Heat the pan",
        description: "Ask an adult to heat a non-stick pan on medium heat.",
        emoji: "🍳",
        tip: "The pan is ready when a drop of water sizzles!",
      },
      {
        id: 6,
        title: "Cook mini pancakes",
        description: "Pour small amounts of batter to make mini pancakes. Flip when bubbles form!",
        emoji: "🥞",
        tip: "Make them small so they're easier to flip!",
      },
      {
        id: 7,
        title: "Serve with syrup",
        description: "Stack your mini pancakes and drizzle with maple syrup!",
        emoji: "🍯",
        tip: "Add fresh berries for extra color and taste!",
      },
    ],
  },
]

export default function CookingRecipesApp({ onRecipeComplete, onBackToHome }: CookingRecipesAppProps) {
  const [currentMode, setCurrentMode] = useState<AppMode>("menu")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [completedRecipes, setCompletedRecipes] = useState<string[]>([])

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setCurrentMode("recipe-detail")
  }

  const handleRecipeComplete = (recipeName: string, stepsCompleted: number) => {
    setCompletedRecipes([...completedRecipes, recipeName])

    if (onRecipeComplete) {
      onRecipeComplete(recipeName, stepsCompleted, {
        mode: "cooking-recipes",
        recipeCompleted: recipeName,
        completionTime: Date.now(),
      })
    }

    // Return to recipe list after completion
    setTimeout(() => {
      setCurrentMode("recipe-list")
      setSelectedRecipe(null)
    }, 3000)
  }

  const resetApp = () => {
    setCurrentMode("menu")
    setSelectedRecipe(null)
  }

  if (currentMode === "recipe-detail" && selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onComplete={handleRecipeComplete}
        onBack={() => setCurrentMode("recipe-list")}
        onBackToHome={onBackToHome}
      />
    )
  }

  if (currentMode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 p-4 flex items-center justify-center">
        <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-purple-800 mb-4 font-sans tracking-tight">
                👨‍🍳 Kids Cooking Corner
              </h1>
              <p className="text-xl text-purple-700 font-medium">Learn to cook delicious vegetarian recipes!</p>
              <p className="text-sm text-purple-600 mt-2">Safe, simple, and super fun recipes for young chefs</p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setCurrentMode("recipe-list")}
                className="h-32 text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 hover:from-pink-500 hover:to-purple-700 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl px-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">🍳</span>
                  <span className="font-sans">Start Cooking!</span>
                  <span className="text-sm font-normal">Choose a recipe</span>
                </div>
              </Button>
            </div>

            <div className="mt-8 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-purple-700">
                <div className="bg-white/20 rounded-lg p-3">
                  <ChefHat className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">Easy Steps</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">Quick Recipes</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">Family Fun</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Star className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">Kid-Friendly</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const indianRecipes = recipes.filter((r) => r.category === "indian")
  const englishRecipes = recipes.filter((r) => r.category === "english")

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-400 to-indigo-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => (onBackToHome ? onBackToHome() : resetApp())}
            className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {onBackToHome ? "Back to Home" : "Back to Menu"}
          </Button>

          <div className="flex items-center gap-4 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 text-yellow-600" />
            <span className="text-xl font-bold text-purple-800">Recipes Completed: {completedRecipes.length}</span>
          </div>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-purple-800 mb-4 font-sans">Choose Your Recipe! 🍽️</h2>
              <p className="text-lg text-purple-700 font-medium">Pick from Indian or English recipes</p>
            </div>

            {/* Indian Recipes Section */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-center text-orange-600 mb-6">🇮🇳 Indian Recipes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {indianRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className={`group hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-orange-200 shadow-lg hover:shadow-xl ${
                      completedRecipes.includes(recipe.name)
                        ? "bg-gradient-to-br from-green-100 to-emerald-200"
                        : "bg-gradient-to-br from-orange-100 to-yellow-200"
                    }`}
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4 group-hover:animate-bounce">
                          {recipe.emoji}
                          {completedRecipes.includes(recipe.name) && <span className="ml-2 text-3xl">✅</span>}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>

                        <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{recipe.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>

                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            recipe.difficulty === "Easy"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {recipe.difficulty}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* English Recipes Section */}
            <div>
              <h3 className="text-3xl font-bold text-center text-blue-600 mb-6">🇬🇧 English Recipes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {englishRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className={`group hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-blue-200 shadow-lg hover:shadow-xl ${
                      completedRecipes.includes(recipe.name)
                        ? "bg-gradient-to-br from-green-100 to-emerald-200"
                        : "bg-gradient-to-br from-blue-100 to-cyan-200"
                    }`}
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-6xl mb-4 group-hover:animate-bounce">
                          {recipe.emoji}
                          {completedRecipes.includes(recipe.name) && <span className="ml-2 text-3xl">✅</span>}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>

                        <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{recipe.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>

                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            recipe.difficulty === "Easy"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {recipe.difficulty}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
