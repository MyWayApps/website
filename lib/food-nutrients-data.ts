// Food & Its Nutrients — Science lesson (Class 1-5)

import { pickUnseen } from "@/lib/question-history"
import type { MCQQuestion } from "@/components/math-topics/visual-mcq-game"
import type { MatchPair } from "@/components/math-topics/generic-matching-mode"
import type { LessonSection } from "@/components/lesson/lesson-content-panel"
import type { LessonFlashcard } from "@/components/lesson/lesson-flashcard-deck"

export const FOOD_NUTRIENTS_SECTIONS: LessonSection[] = [
  {
    heading: "Why Do We Eat Food?",
    points: [
      "Food gives us energy to work, play and stay active.",
      "Food helps in the growth of our body and repairs damaged parts, like cuts and wounds.",
      "Food gives us strength to fight diseases and stay healthy.",
      "Food helps our body to function normally — to digest, breathe and think.",
    ],
  },
  {
    heading: "Nutrition and Nutrients",
    points: [
      "Nutrition is the process of eating the right food to stay healthy and help our body grow.",
      "Nutrients are the substances in food that nourish our body — carbohydrates, proteins, fats, minerals, vitamins, water and dietary fibre.",
      "A balanced diet has a little bit of every nutrient, not too much of just one.",
    ],
  },
  {
    heading: "Carbohydrates — Energy-Giving Food",
    points: [
      "Function: Give us energy to work and play.",
      "Sources: Rice, wheat, bread, potato, sugar and maize.",
    ],
  },
  {
    heading: "Proteins — Body-Building Food",
    points: [
      "Function: Help in the growth and repair of body tissues; build strong muscles.",
      "Sources: Milk, eggs, meat, fish, pulses (dal), beans and nuts.",
    ],
  },
  {
    heading: "Fats",
    points: [
      "Function: Give concentrated energy and keep the body warm.",
      "Sources: Ghee, butter, cooking oil, nuts and seeds.",
    ],
  },
  {
    heading: "Minerals — Iron",
    points: [
      "Function: Iron helps make blood (haemoglobin) in our body and keeps us from feeling tired and weak.",
      "Sources: Spinach (palak), jaggery, dates, pomegranate, eggs and meat.",
    ],
  },
  {
    heading: "Vitamins — Protective Food",
    points: [
      "Function: Protect our body from diseases and keep our eyes, skin, teeth and bones healthy.",
      "Sources: Fruits and vegetables — e.g. carrots (Vitamin A) for eyes, citrus fruits and amla (Vitamin C) to fight infections, and sunlight which helps our body make Vitamin D for strong bones.",
    ],
  },
  {
    heading: "Water",
    points: [
      "Function: Helps digest our food, carries nutrients around the body, and keeps our body temperature normal.",
      "We should drink plenty of clean water every day.",
    ],
  },
  {
    heading: "Dietary Fibre",
    points: [
      "Function: Helps digestion and keeps our stomach healthy; prevents constipation.",
      "Sources: Whole grains, fruits, vegetables and salad.",
    ],
  },
  {
    heading: "What Happens If We Don't Get Enough Nutrients?",
    points: [
      "Eating too little of a nutrient for a long time can cause a deficiency and make us weak or sick.",
      "Too little Iron can cause Anaemia, which makes us feel tired and weak.",
      "Too little Vitamin C can make our gums bleed and wounds heal slowly.",
      "Too little Vitamin D and Calcium can make our bones and teeth weak.",
    ],
  },
  {
    heading: "Why We Should Eat a Variety of Food",
    points: [
      "No single food has all the nutrients our body needs.",
      "Eating a variety of foods — grains, pulses, milk, fruits, vegetables and nuts — gives our body all the nutrients it needs to grow and stay healthy.",
      "This is called eating a balanced diet.",
    ],
  },
]

export const FOOD_NUTRIENTS_FLASHCARDS: LessonFlashcard[] = [
  { front: "Why do we eat food?", back: "Food gives us energy, helps us grow, repairs our body, and gives us strength to fight diseases." },
  { front: "Energy", back: "Food gives us energy to work, play and stay active all day." },
  { front: "Growth & Repair", back: "Food helps our body grow bigger and repairs damaged parts, like cuts and wounds." },
  { front: "Fighting Diseases", back: "Food gives us strength to fight diseases and stay healthy." },
  { front: "Nutrition", back: "Nutrition is the process of eating the right food to stay healthy and help our body grow." },
  { front: "Nutrients", back: "Nutrients are the substances in food that nourish our body — carbohydrates, proteins, fats, minerals, vitamins, water and fibre." },
  { front: "Carbohydrates", back: "Give us ENERGY. Found in rice, wheat, bread, potato and sugar." },
  { front: "Proteins", back: "Help in GROWTH and REPAIR of our body. Found in milk, eggs, meat, fish, pulses and nuts." },
  { front: "Fats", back: "Give concentrated ENERGY and keep the body warm. Found in ghee, butter, oil and nuts." },
  { front: "Iron (a mineral)", back: "Helps make BLOOD in our body and keeps us from feeling tired. Found in spinach, jaggery, dates and eggs." },
  { front: "Vitamins", back: "PROTECT our body from diseases and keep eyes, skin and bones healthy. Found in fruits and vegetables." },
  { front: "Water", back: "Helps DIGESTION, carries nutrients and keeps our body temperature normal. Drink plenty every day!" },
  { front: "Dietary Fibre", back: "Helps DIGESTION and prevents constipation. Found in whole grains, fruits and vegetables." },
  { front: "Deficiency", back: "Not eating enough of a nutrient for a long time can make us weak or sick — e.g. too little Iron causes Anaemia." },
  { front: "Balanced Diet", back: "Eating a VARIETY of foods every day gives our body all the nutrients it needs to grow and stay healthy." },
]

interface FillBlankItem {
  sentence: string
  correctChoice: string
  choices: string[]
}

const FILL_BLANK_POOL: FillBlankItem[] = [
  { sentence: "Food gives us _____ to work and play.", correctChoice: "Energy", choices: ["Energy", "Water", "Sleep", "Air"] },
  { sentence: "_____ help in the growth and repair of our body.", correctChoice: "Proteins", choices: ["Proteins", "Fats", "Water", "Fibre"] },
  { sentence: "_____ give us energy and are found in rice and wheat.", correctChoice: "Carbohydrates", choices: ["Carbohydrates", "Vitamins", "Minerals", "Water"] },
  { sentence: "Iron is a mineral that helps make _____ in our body.", correctChoice: "Blood", choices: ["Blood", "Bones", "Skin", "Hair"] },
  { sentence: "_____ protect our body from diseases.", correctChoice: "Vitamins", choices: ["Vitamins", "Fats", "Sugar", "Salt"] },
  { sentence: "_____ helps digestion and prevents constipation.", correctChoice: "Dietary fibre", choices: ["Dietary fibre", "Protein", "Fat", "Iron"] },
  { sentence: "We should drink plenty of _____ every day to stay healthy.", correctChoice: "Water", choices: ["Water", "Oil", "Sugar", "Salt"] },
  { sentence: "Eating a _____ of foods keeps our body healthy.", correctChoice: "variety", choices: ["variety", "single type", "small amount", "sweet type"] },
  { sentence: "_____ give us concentrated energy and keep our body warm.", correctChoice: "Fats", choices: ["Fats", "Vitamins", "Water", "Fibre"] },
  { sentence: "Not eating enough Iron can cause _____.", correctChoice: "Anaemia", choices: ["Anaemia", "a Cold", "a Toothache", "a Headache"] },
]

interface MCQItem {
  question: string
  correctChoice: string
  choices: string[]
}

const MCQ_POOL: MCQItem[] = [
  { question: "Which nutrient gives us the quickest energy?", correctChoice: "Carbohydrates", choices: ["Carbohydrates", "Vitamins", "Water", "Fibre"] },
  { question: "Which of these foods is rich in protein?", correctChoice: "Egg", choices: ["Egg", "Sugar", "Butter", "Rice"] },
  { question: "What can eating iron-rich food help prevent?", correctChoice: "Anaemia", choices: ["Anaemia", "a Cold", "a Toothache", "a Fever"] },
  { question: "Which of these is NOT a nutrient?", correctChoice: "Plastic", choices: ["Plastic", "Protein", "Vitamin", "Carbohydrate"] },
  { question: "Which nutrient helps heal wounds and cuts?", correctChoice: "Protein", choices: ["Protein", "Sugar", "Salt", "Oil"] },
  { question: "Sunlight helps our body make which vitamin?", correctChoice: "Vitamin D", choices: ["Vitamin D", "Vitamin A", "Vitamin C", "Vitamin B"] },
  { question: "What may happen if we don't eat a variety of foods?", correctChoice: "We may lack some nutrients and fall sick", choices: ["We may lack some nutrients and fall sick", "We grow taller instantly", "We become stronger instantly", "Nothing happens at all"] },
  { question: "Which nutrient helps in digestion and prevents constipation?", correctChoice: "Dietary fibre", choices: ["Dietary fibre", "Fat", "Sugar", "Salt"] },
  { question: "Which food group mainly gives us energy?", correctChoice: "Carbohydrates", choices: ["Carbohydrates", "Vitamins", "Minerals", "Fibre"] },
  { question: "Which of these is a good source of Iron?", correctChoice: "Spinach", choices: ["Spinach", "Butter", "Sugar", "Rice"] },
]

const MATCH_PAIRS_POOL: MatchPair[] = [
  { left: "Carbohydrates", right: "Give us Energy" },
  { left: "Proteins", right: "Growth & Repair" },
  { left: "Fats", right: "Keeps Body Warm" },
  { left: "Iron", right: "Makes Blood" },
  { left: "Vitamins", right: "Fight Diseases" },
  { left: "Water", right: "Helps Digestion" },
  { left: "Dietary Fibre", right: "Prevents Constipation" },
  { left: "Sunlight", right: "Gives Vitamin D" },
]

export function generateFillBlankQuestion(): MCQQuestion & { sentence: string } {
  const item = pickUnseen("food-nutrients:fill-blank", FILL_BLANK_POOL, (i) => i.sentence)
  return { prompt: null, sentence: item.sentence, choices: item.choices, correctChoice: item.correctChoice }
}

export function generateFoodMCQQuestion(): MCQQuestion & { question: string } {
  const item = pickUnseen("food-nutrients:mcq", MCQ_POOL, (i) => i.question)
  return { prompt: null, question: item.question, choices: item.choices, correctChoice: item.correctChoice }
}

export function generateFoodNutrientsMatchPairs(): MatchPair[] {
  return [...MATCH_PAIRS_POOL].sort(() => Math.random() - 0.5).slice(0, 5)
}
