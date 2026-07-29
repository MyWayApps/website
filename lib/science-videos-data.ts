// Science video lessons (MyWayApps YouTube channel)

export interface VideoLesson {
  id: string
  title: string
  youtubeId: string
  description: string
}

export const scienceLessons: VideoLesson[] = [
  {
    id: "living-non-living-things",
    title: "Living & Non-Living Things",
    youtubeId: "MRpVAj78k80",
    description: "How to tell living things apart from non-living things, with examples.",
  },
  {
    id: "types-of-plants",
    title: "Types Of Plants",
    youtubeId: "DGe9_ZKH28I",
    description: "The different types of plants around us, from trees to herbs.",
  },
  {
    id: "parts-of-a-plant",
    title: "Parts Of A Plant",
    youtubeId: "Mzh2rSotIuI",
    description: "The root, stem, leaves, flower and fruit — and what each part does.",
  },
  {
    id: "food-from-plants",
    title: "Food From Plants",
    youtubeId: "wP-k6O3h6FI",
    description: "The food we get from plants — fruits, vegetables, grains and pulses.",
  },
  {
    id: "types-of-animals",
    title: "Types Of Animals",
    youtubeId: "yt4F4-8kRgw",
    description: "Wild animals, domestic animals, birds and more.",
  },
  {
    id: "animals-food-shelter",
    title: "Animals - Food & Shelter",
    youtubeId: "mjPLUFQb6bo",
    description: "What different animals eat and where they live.",
  },
]

export function getScienceLessonById(id: string): VideoLesson | undefined {
  return scienceLessons.find((lesson) => lesson.id === id)
}
