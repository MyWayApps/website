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
  email?: string
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
        emoji: "🥗",
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
  {
    id: "aloo-fry",
    name: "Aloo Fry (Simple Potato Fry)",
    category: "indian",
    emoji: "🥔",
    difficulty: "Easy",
    time: "15 mins",
    servings: "2-3 people",
    description: "Crispy and delicious potato fry that's perfect as a side dish!",
    ingredients: [
      "Potatoes – 2 medium (approx. 300g)",
      "Oil – 2 tbsp",
      "Salt – 1 tsp",
      "Turmeric – ½ tsp",
      "Red chilli powder – ½ tsp",
      "Mustard seeds – ½ tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare potatoes",
        description: "Peel and dice the potatoes into small cubes.",
        emoji: "🥔",
        tip: "Make sure all pieces are the same size for even cooking!",
      },
      {
        id: 2,
        title: "Heat the oil",
        description: "Heat oil in a pan. Add mustard seeds and let them splutter.",
        emoji: "🔥",
        tip: "Ask an adult to help with the hot oil!",
      },
      {
        id: 3,
        title: "Add potatoes and spices",
        description: "Add potatoes, salt, turmeric, and chilli powder.",
        emoji: "✨",
        tip: "Mix everything well so spices coat all potatoes!",
      },
      {
        id: 4,
        title: "Cook covered",
        description: "Cover and cook for 10–12 mins, stirring occasionally.",
        emoji: "⏰",
        tip: "Stir every 2-3 minutes to prevent sticking!",
      },
    ],
  },
  {
    id: "dal-fry",
    name: "Dal Fry",
    category: "indian",
    emoji: "🫘",
    difficulty: "Easy",
    time: "25 mins",
    servings: "3-4 people",
    description: "Comforting and nutritious lentil curry that's perfect with rice!",
    ingredients: [
      "Toor dal – ½ cup (100g)",
      "Water – 2 cups (400ml)",
      "Oil or ghee – 1 tbsp",
      "Mustard seeds – ½ tsp",
      "Cumin seeds – ½ tsp",
      "Garlic – 2 cloves, chopped",
      "Onion – 1 small, chopped (50g)",
      "Tomato – 1 small, chopped (50g)",
      "Turmeric – ½ tsp",
      "Salt – 1 tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Cook the dal",
        description: "Wash dal and pressure cook with turmeric and water (3 whistles).",
        emoji: "🫘",
        tip: "Make sure dal is soft and mushy!",
      },
      {
        id: 2,
        title: "Prepare tempering",
        description: "In a pan, heat oil. Add mustard, cumin, garlic, onion, and tomato.",
        emoji: "🧄",
        tip: "Let onions turn golden brown for best flavor!",
      },
      {
        id: 3,
        title: "Combine and cook",
        description: "Add salt and cooked dal. Boil together for 3–5 minutes.",
        emoji: "🍲",
        tip: "Stir well to mix all flavors together!",
      },
    ],
  },
  {
    id: "paneer-curry",
    name: "Paneer Curry",
    category: "indian",
    emoji: "🧀",
    difficulty: "Easy",
    time: "20 mins",
    servings: "3-4 people",
    description: "Rich and creamy cottage cheese curry that everyone loves!",
    ingredients: [
      "Paneer – 200g, cubed",
      "Onion – 1, finely chopped (50g)",
      "Tomato – 1, pureed (100g)",
      "Oil – 1 tbsp",
      "Ginger-garlic paste – 1 tsp",
      "Turmeric – ¼ tsp",
      "Garam masala – ½ tsp",
      "Salt – 1 tsp",
      "Water – 100 ml"
    ],
    steps: [
      {
        id: 1,
        title: "Sauté onions",
        description: "Heat oil. Sauté onion and ginger-garlic paste till light brown.",
        emoji: "🧅",
        tip: "Cook onions slowly for the best flavor!",
      },
      {
        id: 2,
        title: "Add tomato and spices",
        description: "Add tomato puree, turmeric, salt, garam masala.",
        emoji: "🍅",
        tip: "Let tomatoes cook until oil separates!",
      },
      {
        id: 3,
        title: "Add paneer and simmer",
        description: "Cook for 5 mins. Add water and paneer. Simmer for 5 mins.",
        emoji: "🧀",
        tip: "Don't overcook paneer or it will become rubbery!",
      },
    ],
  },
  {
    id: "mixed-veg-curry",
    name: "Mixed Veg Curry",
    category: "indian",
    emoji: "🥕",
    difficulty: "Easy",
    time: "20 mins",
    servings: "3-4 people",
    description: "Colorful and healthy vegetable curry with aromatic spices!",
    ingredients: [
      "Mixed vegetables (carrot, beans, peas, potato) – 1 cup (150g)",
      "Onion – 1 small (50g)",
      "Tomato – 1 (50g)",
      "Oil – 1 tbsp",
      "Ginger-garlic paste – 1 tsp",
      "Turmeric – ½ tsp",
      "Salt – 1 tsp",
      "Garam masala – ½ tsp",
      "Water – 150 ml"
    ],
    steps: [
      {
        id: 1,
        title: "Fry onions and spices",
        description: "Heat oil and fry onion, ginger-garlic paste.",
        emoji: "🧅",
        tip: "Cook until onions are golden brown!",
      },
      {
        id: 2,
        title: "Add tomatoes and spices",
        description: "Add tomato, turmeric, salt, and masala. Cook until soft.",
        emoji: "🍅",
        tip: "Let tomatoes break down completely!",
      },
      {
        id: 3,
        title: "Add vegetables and cook",
        description: "Add veggies and water. Cover and cook for 10–12 minutes.",
        emoji: "🥕",
        tip: "Check if vegetables are tender before serving!",
      },
    ],
  },
  {
    id: "jeera-rice",
    name: "Jeera Rice",
    category: "indian",
    emoji: "🍚",
    difficulty: "Easy",
    time: "20 mins",
    servings: "3-4 people",
    description: "Fragrant basmati rice with cumin seeds - perfect with any curry!",
    ingredients: [
      "Basmati rice – 1 cup (200g)",
      "Water – 2 cups (400 ml)",
      "Ghee – 1 tbsp",
      "Cumin seeds – 1 tsp",
      "Salt – 1 tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare rice",
        description: "Wash and soak rice for 15 mins. Drain.",
        emoji: "🍚",
        tip: "Soaking makes rice fluffier!",
      },
      {
        id: 2,
        title: "Temper with cumin",
        description: "Heat ghee, add cumin. Add rice and sauté 1 min.",
        emoji: "🔥",
        tip: "Don't let cumin burn - it should just sizzle!",
      },
      {
        id: 3,
        title: "Cook rice",
        description: "Add water, salt. Cook covered until water is absorbed.",
        emoji: "⏰",
        tip: "Don't peek while cooking - let it steam!",
      },
    ],
  },
  {
    id: "vegetable-khichdi",
    name: "Vegetable Khichdi",
    category: "indian",
    emoji: "🥘",
    difficulty: "Easy",
    time: "25 mins",
    servings: "3-4 people",
    description: "Comforting one-pot meal with rice, lentils, and vegetables!",
    ingredients: [
      "Rice – ½ cup (100g)",
      "Moong dal – ¼ cup (50g)",
      "Mixed veggies – ½ cup (100g)",
      "Ghee – 1 tbsp",
      "Cumin seeds – 1 tsp",
      "Turmeric – ½ tsp",
      "Salt – 1 tsp",
      "Water – 2.5 cups (500 ml)"
    ],
    steps: [
      {
        id: 1,
        title: "Wash rice and dal",
        description: "Wash rice and dal together.",
        emoji: "🫘",
        tip: "Rinse until water runs clear!",
      },
      {
        id: 2,
        title: "Prepare tempering",
        description: "Heat ghee, add cumin, then vegetables, rice-dal, turmeric, salt.",
        emoji: "🔥",
        tip: "Mix everything well before adding water!",
      },
      {
        id: 3,
        title: "Pressure cook",
        description: "Add water and pressure cook for 3–4 whistles.",
        emoji: "⏰",
        tip: "Let pressure release naturally for best results!",
      },
    ],
  },
  {
    id: "tomato-rasam",
    name: "Simple Tomato Rasam",
    category: "indian",
    emoji: "🍅",
    difficulty: "Easy",
    time: "15 mins",
    servings: "3-4 people",
    description: "Tangy and spicy South Indian soup that's perfect for cold days!",
    ingredients: [
      "Tomato – 2 medium, chopped (100g)",
      "Tamarind – small lemon-sized (soaked in ½ cup water)",
      "Garlic – 2 cloves",
      "Mustard seeds – ½ tsp",
      "Cumin – ½ tsp",
      "Curry leaves – few",
      "Salt – 1 tsp",
      "Water – 2 cups (400 ml)"
    ],
    steps: [
      {
        id: 1,
        title: "Boil tomatoes",
        description: "Boil tomatoes in water, mash lightly.",
        emoji: "🍅",
        tip: "Let tomatoes become soft and mushy!",
      },
      {
        id: 2,
        title: "Add tamarind and spices",
        description: "Add tamarind water, garlic, salt.",
        emoji: "🧄",
        tip: "Strain tamarind water to remove seeds!",
      },
      {
        id: 3,
        title: "Prepare tempering",
        description: "In another pan, prepare tempering with mustard, cumin, curry leaves. Add to rasam.",
        emoji: "🔥",
        tip: "Add tempering at the end for best aroma!",
      },
    ],
  },
  {
    id: "bhindi-fry",
    name: "Bhindi Fry (Okra Stir Fry)",
    category: "indian",
    emoji: "🥒",
    difficulty: "Easy",
    time: "15 mins",
    servings: "2-3 people",
    description: "Crispy and delicious okra stir-fry that's perfect as a side dish!",
    ingredients: [
      "Bhindi (okra) – 200g, chopped",
      "Oil – 1.5 tbsp",
      "Turmeric – ½ tsp",
      "Salt – 1 tsp",
      "Chilli powder – ½ tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare okra",
        description: "Wash and dry bhindi before chopping.",
        emoji: "🫒",
        tip: "Dry okra completely to prevent stickiness!",
      },
      {
        id: 2,
        title: "Heat oil and add okra",
        description: "Heat oil, add bhindi, turmeric, salt, and chilli powder.",
        emoji: "🔥",
        tip: "Don't cover while cooking to keep it crispy!",
      },
      {
        id: 3,
        title: "Stir-fry until done",
        description: "Stir-fry for 10–12 minutes till soft and cooked.",
        emoji: "⏰",
        tip: "Stir occasionally to cook evenly!",
      },
    ],
  },
  {
    id: "vegetable-pulao",
    name: "Vegetable Pulao",
    category: "indian",
    emoji: "🍛",
    difficulty: "Easy",
    time: "25 mins",
    servings: "3-4 people",
    description: "Fragrant rice with mixed vegetables and aromatic spices!",
    ingredients: [
      "Rice – 1 cup (200g)",
      "Mixed veggies – 1 cup (150g)",
      "Oil/ghee – 1 tbsp",
      "Cumin – 1 tsp",
      "Bay leaf – 1",
      "Garam masala – ½ tsp",
      "Salt – 1 tsp",
      "Water – 2 cups (400 ml)"
    ],
    steps: [
      {
        id: 1,
        title: "Heat oil and add spices",
        description: "Heat oil, add cumin, bay leaf, then veggies.",
        emoji: "🔥",
        tip: "Let vegetables cook for 2-3 minutes!",
      },
      {
        id: 2,
        title: "Add rice and spices",
        description: "Add washed rice, garam masala, salt. Stir.",
        emoji: "🍚",
        tip: "Mix everything well before adding water!",
      },
      {
        id: 3,
        title: "Cook covered",
        description: "Add water and cook covered for 12–15 mins.",
        emoji: "⏰",
        tip: "Don't peek while cooking - let it steam!",
      },
    ],
  },
  {
    id: "boondi-raita",
    name: "Boondi Raita",
    category: "indian",
    emoji: "🥣",
    difficulty: "Easy",
    time: "15 mins",
    servings: "3-4 people",
    description: "Refreshing yogurt side dish with crispy boondi and aromatic spices!",
    ingredients: [
      "Curd (plain yogurt) – 1 cup, chilled",
      "Salt – ¼ tsp (adjust to taste)",
      "Roasted cumin powder – ½ tsp",
      "Red chilli powder – ¼ tsp",
      "Black pepper – 2 pinches (optional)",
      "Chaat masala – ¼ to ½ tsp (optional)",
      "Coriander leaves – 2 tbsp, finely chopped",
      "Boondi – ⅓ cup"
    ],
    steps: [
      {
        id: 1,
        title: "Whisk the curd",
        description: "In a mixing bowl, whisk the curd until smooth. If thick, add a few tablespoons of water.",
        emoji: "🥛",
        tip: "Whisk well to make it smooth and creamy!",
      },
      {
        id: 2,
        title: "Add spices",
        description: "Add salt, roasted cumin powder, red chilli powder, black pepper, chaat masala, and chopped coriander.",
        emoji: "✨",
        tip: "Mix all spices well for even flavor!",
      },
      {
        id: 3,
        title: "Prepare boondi",
        description: "For soft boondi: soak in warm water for 5 minutes, then drain. Or add directly for crunch.",
        emoji: "🥒",
        tip: "Choose based on your preference - soft or crunchy!",
      },
      {
        id: 4,
        title: "Mix gently",
        description: "Add boondi to yogurt and mix gently. Adjust salt or spices as needed.",
        emoji: "🥄",
        tip: "Mix gently so boondi doesn't break!",
      },
      {
        id: 5,
        title: "Garnish and serve",
        description: "Garnish with extra boondi, cumin powder, and coriander leaves. Serve chilled.",
        emoji: "🌿",
        tip: "Serve cold for the best taste!",
      },
    ],
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka (Stovetop / Grill)",
    category: "indian",
    emoji: "🧀",
    difficulty: "Easy",
    time: "45 mins",
    servings: "3-4 people",
    description: "Spicy and flavorful paneer and vegetable tikka that's perfect as an appetizer!",
    ingredients: [
      "Paneer – 200-250g, cut into cubes",
      "Onion – 1 large",
      "Bell pepper – 1",
      "Thick curd / hung yogurt – 6 tbsp",
      "Red chilli powder – 1 to 1½ tsp",
      "Turmeric – 1/8 tsp",
      "Coriander powder – 1 to 1½ tsp",
      "Salt – ½ tsp",
      "Garam masala – 1 tsp",
      "Chaat masala – 1 tsp",
      "Ginger-garlic paste – 1¼ tsp",
      "Kasuri methi – 1 tsp",
      "Ajwain – ¼ to ½ tsp (optional)",
      "Oil – 1 tbsp",
      "Roasted besan – 1 tbsp (optional)"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare vegetables",
        description: "Cube paneer, onion, and bell pepper into roughly the same size pieces.",
        emoji: "🧅",
        tip: "Make sure all pieces are similar size for even cooking!",
      },
      {
        id: 2,
        title: "Make marinade",
        description: "Mix curd with all spices: chilli powder, turmeric, coriander powder, salt, garam masala, chaat masala, ginger-garlic paste, kasuri methi, and oil.",
        emoji: "🥣",
        tip: "Mix well to make a smooth paste!",
      },
      {
        id: 3,
        title: "Marinate",
        description: "Marinate paneer and veggies with the paste for 30 minutes or more.",
        emoji: "⏰",
        tip: "Longer marination = more flavor!",
      },
      {
        id: 4,
        title: "Cook on stovetop",
        description: "On stovetop, tawa, or grill, cook/skewer paneer and veggies until slightly charred.",
        emoji: "🔥",
        tip: "Ask an adult to help with the cooking!",
      },
      {
        id: 5,
        title: "Serve hot",
        description: "Optionally brush with butter, serve with green chutney, chaat masala, and lemon.",
        emoji: "🍽️",
        tip: "Serve immediately while hot for best taste!",
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
        emoji: "🥗",
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
  {
    id: "fruit-yogurt-parfait",
    name: "Fruit Yogurt Parfait",
    category: "english",
    emoji: "🥣",
    difficulty: "Easy",
    time: "10 mins",
    servings: "1-2 people",
    description: "Beautiful layered dessert with yogurt, fruits, and granola!",
    ingredients: [
      "Yogurt – 1 cup",
      "Honey – 2 tbsp",
      "Granola or cornflakes – 1/2 cup",
      "Chopped fruits (banana, apple, berries) – 1 cup"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare the glass",
        description: "Take a tall glass or bowl for layering.",
        emoji: "🥣",
        tip: "Use a clear glass to see the beautiful layers!",
      },
      {
        id: 2,
        title: "First layer - yogurt",
        description: "Add a layer of yogurt at the bottom.",
        emoji: "🥛",
        tip: "Use plain or flavored yogurt as you like!",
      },
      {
        id: 3,
        title: "Add fruits",
        description: "Add a layer of chopped fruits on top of yogurt.",
        emoji: "🍓",
        tip: "Use colorful fruits for a beautiful look!",
      },
      {
        id: 4,
        title: "Add granola",
        description: "Sprinkle granola or cornflakes over the fruits.",
        emoji: "🌾",
        tip: "This adds a nice crunchy texture!",
      },
      {
        id: 5,
        title: "Repeat layers",
        description: "Repeat the layers: yogurt → fruits → granola.",
        emoji: "🔄",
        tip: "Make 2-3 layers for a perfect parfait!",
      },
      {
        id: 6,
        title: "Drizzle honey",
        description: "Drizzle honey on top and serve immediately!",
        emoji: "🍯",
        tip: "Honey adds natural sweetness!",
      },
    ],
  },
  {
    id: "cheese-veggie-sandwich",
    name: "Cheese & Veggie Sandwich",
    category: "english",
    emoji: "🥪",
    difficulty: "Easy",
    time: "10 mins",
    servings: "1 sandwich",
    description: "Fresh and healthy sandwich with cheese and vegetables!",
    ingredients: [
      "Bread slices – 2",
      "Cheese slices – 2",
      "Cucumber – 4-5 slices",
      "Tomato – 2-3 slices",
      "Butter – 1 tbsp"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare vegetables",
        description: "Wash and slice cucumber and tomato into thin slices.",
        emoji: "🥒",
        tip: "Make sure slices are not too thick!",
      },
      {
        id: 2,
        title: "Spread butter",
        description: "Spread butter on both bread slices.",
        emoji: "🧈",
        tip: "Butter helps keep the sandwich moist!",
      },
      {
        id: 3,
        title: "Layer cheese",
        description: "Place cheese slices on one bread slice.",
        emoji: "🧀",
        tip: "Use your favorite type of cheese!",
      },
      {
        id: 4,
        title: "Add vegetables",
        description: "Layer cucumber and tomato slices on top of cheese.",
        emoji: "🍅",
        tip: "Arrange them nicely for a beautiful look!",
      },
      {
        id: 5,
        title: "Close sandwich",
        description: "Place the other bread slice on top and press gently.",
        emoji: "🥪",
        tip: "Press lightly so the sandwich holds together!",
      },
      {
        id: 6,
        title: "Cut into triangles",
        description: "Cut the sandwich diagonally into triangles.",
        emoji: "✂️",
        tip: "Use a sharp knife and ask an adult to help!",
      },
    ],
  },
  {
    id: "herbed-potato-wedges",
    name: "Herbed Potato Wedges (Baked)",
    category: "english",
    emoji: "🥔",
    difficulty: "Easy",
    time: "30 mins",
    servings: "2-3 people",
    description: "Crispy and flavorful baked potato wedges with herbs!",
    ingredients: [
      "Potatoes – 3 medium",
      "Olive oil – 2 tbsp",
      "Salt – 1 tsp",
      "Oregano – 1 tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Preheat oven",
        description: "Preheat oven to 200°C (400°F).",
        emoji: "🔥",
        tip: "Ask an adult to help with the oven!",
      },
      {
        id: 2,
        title: "Cut potatoes",
        description: "Wash potatoes and cut them into wedge shapes.",
        emoji: "🥔",
        tip: "Keep the skin on for extra nutrition!",
      },
      {
        id: 3,
        title: "Toss with seasonings",
        description: "Toss wedges with olive oil, salt, and oregano.",
        emoji: "✨",
        tip: "Mix well so all wedges are coated!",
      },
      {
        id: 4,
        title: "Arrange on baking sheet",
        description: "Place wedges on a baking sheet in a single layer.",
        emoji: "🍽️",
        tip: "Don't overcrowd - give them space to crisp up!",
      },
      {
        id: 5,
        title: "Bake until golden",
        description: "Bake for 25-30 minutes until golden and crispy.",
        emoji: "⏰",
        tip: "Check after 20 minutes and flip if needed!",
      },
    ],
  },
  {
    id: "mini-bread-pizzas",
    name: "Mini Bread Pizzas",
    category: "english",
    emoji: "🍕",
    difficulty: "Easy",
    time: "15 mins",
    servings: "2-3 people",
    description: "Quick and easy mini pizzas using bread slices!",
    ingredients: [
      "Bread slices – 4",
      "Tomato ketchup – 4 tbsp",
      "Cheese – 1/2 cup grated",
      "Chopped veggies (onion, bell pepper, corn) – 1/2 cup"
    ],
    steps: [
      {
        id: 1,
        title: "Preheat oven",
        description: "Preheat oven to 180°C (350°F).",
        emoji: "🔥",
        tip: "Ask an adult to help with the oven!",
      },
      {
        id: 2,
        title: "Prepare bread",
        description: "Place bread slices on a baking sheet.",
        emoji: "🍞",
        tip: "Use any type of bread you like!",
      },
      {
        id: 3,
        title: "Spread ketchup",
        description: "Spread tomato ketchup on each bread slice.",
        emoji: "🍅",
        tip: "This acts as the pizza sauce!",
      },
      {
        id: 4,
        title: "Add vegetables",
        description: "Sprinkle chopped vegetables on top of ketchup.",
        emoji: "🥬",
        tip: "Use your favorite vegetables!",
      },
      {
        id: 5,
        title: "Top with cheese",
        description: "Sprinkle grated cheese on top of vegetables.",
        emoji: "🧀",
        tip: "Don't be shy with the cheese!",
      },
      {
        id: 6,
        title: "Bake until cheese melts",
        description: "Bake for 8-10 minutes until cheese melts and bread is crispy.",
        emoji: "⏰",
        tip: "Watch carefully so they don't burn!",
      },
    ],
  },
  {
    id: "scrambled-eggs-toast",
    name: "Scrambled Eggs on Toast",
    category: "english",
    emoji: "🥚",
    difficulty: "Easy",
    time: "10 mins",
    servings: "1-2 people",
    description: "Classic scrambled eggs served on crispy toast!",
    ingredients: [
      "Eggs – 2",
      "Butter – 1 tbsp",
      "Milk – 2 tbsp",
      "Bread – 2 slices",
      "Salt – 1/4 tsp",
      "Pepper – 1/4 tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Whisk eggs",
        description: "Crack eggs in a bowl and whisk with milk, salt, and pepper.",
        emoji: "🥚",
        tip: "Whisk until well combined!",
      },
      {
        id: 2,
        title: "Toast bread",
        description: "Toast bread slices until golden brown.",
        emoji: "🍞",
        tip: "Use a toaster or pan to toast!",
      },
      {
        id: 3,
        title: "Heat butter",
        description: "Heat butter in a pan on medium heat.",
        emoji: "🧈",
        tip: "Ask an adult to help with the stove!",
      },
      {
        id: 4,
        title: "Cook eggs",
        description: "Pour egg mixture and cook, stirring constantly.",
        emoji: "🥄",
        tip: "Keep stirring for creamy scrambled eggs!",
      },
      {
        id: 5,
        title: "Serve on toast",
        description: "Place scrambled eggs on toasted bread and serve hot!",
        emoji: "🍽️",
        tip: "Serve immediately while hot!",
      },
    ],
  },
  {
    id: "veggie-pasta-salad",
    name: "Veggie Pasta Salad",
    category: "english",
    emoji: "🥗",
    difficulty: "Easy",
    time: "20 mins",
    servings: "3-4 people",
    description: "Fresh and colorful pasta salad with vegetables!",
    ingredients: [
      "Cooked pasta – 2 cups",
      "Mayo or yogurt – 3 tbsp",
      "Corn – 1/2 cup",
      "Cucumber – 1/2 cup diced",
      "Carrot – 1/2 cup grated",
      "Salt – 1/2 tsp"
    ],
    steps: [
      {
        id: 1,
        title: "Cook pasta",
        description: "Boil pasta according to package instructions and drain.",
        emoji: "🍝",
        tip: "Don't overcook - pasta should be al dente!",
      },
      {
        id: 2,
        title: "Prepare vegetables",
        description: "Dice cucumber and grate carrot into small pieces.",
        emoji: "🥕",
        tip: "Make sure all pieces are bite-sized!",
      },
      {
        id: 3,
        title: "Mix everything",
        description: "Mix cooked pasta with vegetables and corn.",
        emoji: "🥗",
        tip: "Mix gently so pasta doesn't break!",
      },
      {
        id: 4,
        title: "Add dressing",
        description: "Add mayo or yogurt and salt. Mix well.",
        emoji: "🥄",
        tip: "Start with less dressing - you can always add more!",
      },
      {
        id: 5,
        title: "Chill in fridge",
        description: "Cover and chill in fridge for 30 minutes before serving.",
        emoji: "❄️",
        tip: "Chilling makes the flavors blend better!",
      },
    ],
  },
  {
    id: "cucumber-finger-rolls",
    name: "Cucumber Finger Rolls",
    category: "english",
    emoji: "🥒",
    difficulty: "Easy",
    time: "15 mins",
    servings: "4-6 rolls",
    description: "Cute finger food with cucumber and cream cheese!",
    ingredients: [
      "Bread slices – 4",
      "Cream cheese or butter – 4 tbsp",
      "Cucumber – 1 medium, sliced"
    ],
    steps: [
      {
        id: 1,
        title: "Flatten bread",
        description: "Remove crusts and flatten bread slices with a rolling pin.",
        emoji: "🍞",
        tip: "Flatten gently so bread doesn't tear!",
      },
      {
        id: 2,
        title: "Prepare cucumber",
        description: "Wash and slice cucumber into thin rounds.",
        emoji: "🥒",
        tip: "Make sure slices are thin and even!",
      },
      {
        id: 3,
        title: "Spread cream cheese",
        description: "Spread cream cheese or butter on flattened bread.",
        emoji: "🧀",
        tip: "Spread evenly to the edges!",
      },
      {
        id: 4,
        title: "Add cucumber",
        description: "Place cucumber slices in a row on the bread.",
        emoji: "🥒",
        tip: "Leave a little space at the edges!",
      },
      {
        id: 5,
        title: "Roll like swiss roll",
        description: "Roll the bread tightly like a swiss roll.",
        emoji: "🌯",
        tip: "Roll tightly so it holds together!",
      },
      {
        id: 6,
        title: "Cut into small pieces",
        description: "Cut the roll into small finger-sized pieces.",
        emoji: "✂️",
        tip: "Use a sharp knife and ask an adult to help!",
      },
    ],
  },
  {
    id: "banana-pancakes",
    name: "Banana Pancakes",
    category: "english",
    emoji: "🥞",
    difficulty: "Easy",
    time: "15 mins",
    servings: "8-10 mini pancakes",
    description: "Simple and healthy pancakes made with just 3 ingredients!",
    ingredients: [
      "Banana – 1 ripe",
      "Egg – 1",
      "Flour – 2 tbsp"
    ],
    steps: [
      {
        id: 1,
        title: "Mash banana",
        description: "Peel and mash the banana in a bowl until smooth.",
        emoji: "🍌",
        tip: "Use a fork to mash - no lumps!",
      },
      {
        id: 2,
        title: "Add egg",
        description: "Crack egg into the mashed banana and mix well.",
        emoji: "🥚",
        tip: "Mix until well combined!",
      },
      {
        id: 3,
        title: "Add flour",
        description: "Add flour and mix until you get a smooth batter.",
        emoji: "🌾",
        tip: "Don't overmix - just until combined!",
      },
      {
        id: 4,
        title: "Heat pan",
        description: "Heat a non-stick pan on medium heat.",
        emoji: "🔥",
        tip: "Ask an adult to help with the stove!",
      },
      {
        id: 5,
        title: "Pour small rounds",
        description: "Pour small rounds of batter on the pan.",
        emoji: "🥞",
        tip: "Make them small so they're easier to flip!",
      },
      {
        id: 6,
        title: "Cook both sides",
        description: "Cook for 2-3 minutes on each side until golden.",
        emoji: "⏰",
        tip: "Flip when you see bubbles on top!",
      },
    ],
  },
  {
    id: "quesadilla-cheese-wrap",
    name: "Quesadilla (Cheese Wrap)",
    category: "english",
    emoji: "🌮",
    difficulty: "Easy",
    time: "10 mins",
    servings: "1 quesadilla",
    description: "Cheesy and delicious wrap that's perfect for any meal!",
    ingredients: [
      "Tortilla or chapati – 1",
      "Grated cheese – 1/2 cup",
      "Corn – 2 tbsp",
      "Bell pepper – 2 tbsp chopped"
    ],
    steps: [
      {
        id: 1,
        title: "Prepare filling",
        description: "Mix grated cheese, corn, and chopped bell pepper.",
        emoji: "🧀",
        tip: "Use your favorite type of cheese!",
      },
      {
        id: 2,
        title: "Heat tortilla",
        description: "Heat tortilla or chapati on a pan for 30 seconds.",
        emoji: "🔥",
        tip: "Just warm it up - don't let it get crispy!",
      },
      {
        id: 3,
        title: "Add filling",
        description: "Place filling on one half of the tortilla.",
        emoji: "🌮",
        tip: "Don't overfill - leave space at the edges!",
      },
      {
        id: 4,
        title: "Fold tortilla",
        description: "Fold the tortilla in half to cover the filling.",
        emoji: "📁",
        tip: "Press gently to seal the edges!",
      },
      {
        id: 5,
        title: "Cook until cheese melts",
        description: "Cook on pan for 2-3 minutes on each side until cheese melts.",
        emoji: "⏰",
        tip: "Flip carefully so filling doesn't fall out!",
      },
    ],
  },
  {
    id: "no-bake-chocolate-balls",
    name: "No-Bake Chocolate Balls",
    category: "english",
    emoji: "🍫",
    difficulty: "Easy",
    time: "20 mins",
    servings: "12-15 balls",
    description: "Delicious chocolate treats that don't need an oven!",
    ingredients: [
      "Crushed biscuits – 1 cup",
      "Cocoa powder – 2 tbsp",
      "Condensed milk – 1/4 cup",
      "Coconut powder – 2 tbsp"
    ],
    steps: [
      {
        id: 1,
        title: "Crush biscuits",
        description: "Crush biscuits into fine crumbs using a rolling pin.",
        emoji: "🍪",
        tip: "Put biscuits in a bag before crushing!",
      },
      {
        id: 2,
        title: "Mix dry ingredients",
        description: "Mix crushed biscuits and cocoa powder in a bowl.",
        emoji: "🥣",
        tip: "Mix well so cocoa is evenly distributed!",
      },
      {
        id: 3,
        title: "Add condensed milk",
        description: "Add condensed milk gradually and mix to form a dough.",
        emoji: "🥛",
        tip: "Add little by little - you might not need all of it!",
      },
      {
        id: 4,
        title: "Roll into balls",
        description: "Take small portions and roll into small balls.",
        emoji: "🤏",
        tip: "Make them bite-sized!",
      },
      {
        id: 5,
        title: "Coat with coconut",
        description: "Roll each ball in coconut powder to coat.",
        emoji: "🥥",
        tip: "Press gently so coconut sticks!",
      },
      {
        id: 6,
        title: "Chill and serve",
        description: "Chill in fridge for 30 minutes before serving.",
        emoji: "❄️",
        tip: "Chilling makes them firm and easier to eat!",
      },
    ],
  },
  {
    id: "eggless-chocolate-chip-cookies",
    name: "Eggless Chocolate Chip Cookies",
    category: "english",
    emoji: "🍪",
    difficulty: "Easy",
    time: "30 mins",
    servings: "12-15 cookies",
    description: "Delicious chocolate chip cookies made without eggs - perfect for everyone!",
    ingredients: [
      "All-purpose flour – 1½ cups",
      "Salt – 1 pinch",
      "Baking soda – ½ tsp",
      "Butter (softened) – ½ cup",
      "Sugar – ½ cup",
      "Brown sugar – ¼ cup",
      "Vanilla extract – 1 tsp",
      "Chocolate chips – ¾ cup",
      "Milk – 2-3 tbsp (if needed)"
    ],
    steps: [
      {
        id: 1,
        title: "Preheat oven",
        description: "Preheat oven to 180°C (350°F) and line a baking tray.",
        emoji: "🔥",
        tip: "Ask an adult to help with the oven!",
      },
      {
        id: 2,
        title: "Mix dry ingredients",
        description: "Whisk flour, salt, and baking soda in a bowl.",
        emoji: "🥣",
        tip: "Sift the flour for lighter cookies!",
      },
      {
        id: 3,
        title: "Cream butter and sugar",
        description: "Mix softened butter with sugar and brown sugar until creamy.",
        emoji: "🧈",
        tip: "Butter should be soft but not melted!",
      },
      {
        id: 4,
        title: "Add vanilla",
        description: "Add vanilla extract to the butter mixture and mix well.",
        emoji: "✨",
        tip: "This adds wonderful flavor!",
      },
      {
        id: 5,
        title: "Combine mixtures",
        description: "Gradually add flour mixture to butter mixture and mix to form dough.",
        emoji: "🥄",
        tip: "Add milk if dough is too dry!",
      },
      {
        id: 6,
        title: "Add chocolate chips",
        description: "Fold in chocolate chips gently into the dough.",
        emoji: "🍫",
        tip: "Don't overmix - just fold them in!",
      },
      {
        id: 7,
        title: "Shape and bake",
        description: "Scoop dough, place on baking tray, and bake for 10-12 minutes until edges are golden.",
        emoji: "⏰",
        tip: "Don't overbake - they'll continue cooking on the tray!",
      },
      {
        id: 8,
        title: "Cool and store",
        description: "Let cookies cool on tray for 5 minutes, then transfer to wire rack. Store in airtight container.",
        emoji: "🍪",
        tip: "Store in airtight container to keep them fresh!",
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-amber-300 to-amber-400 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back to Home Button - Aligned with card */}
          <div className="flex items-center justify-between mb-6">
            {onBackToHome && (
              <Button
                onClick={onBackToHome}
                className="bg-white/20 hover:bg-white/30 text-amber-800 border-2 border-white font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            )}
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <Star className="h-5 w-5" />
              <span>Score: 0</span>
            </div>
          </div>
          
          <Card className="w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0">
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
                className="h-32 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 hover:scale-105 transform transition-all duration-300 text-white border-4 border-white shadow-lg hover:shadow-xl px-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl">🥗</span>
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
      </div>
    )
  }

  const indianRecipes = recipes.filter((r) => r.category === "indian")
  const englishRecipes = recipes.filter((r) => r.category === "english")

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-amber-300 to-amber-400 p-4">
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

          <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
            <span className="text-lg font-bold text-purple-900">
              {completedRecipes.length} / {recipes.length} Recipes Completed
            </span>
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
