export interface ReadingPassage {
  id: number
  title: string
  passage: string[]
  image: string
}

export const readingPassages: ReadingPassage[] = [
  {
    id: 1,
    title: "The Little Rabbit",
    passage: [
      "The little rabbit ran into the garden.",
      "It wanted to eat some fresh carrots.",
      "The sun was warm and the grass was green.",
      "The rabbit hopped home when it was full.",
    ],
    image: "/characters/bunny.png",
  },
  {
    id: 2,
    title: "Seetha Goes to School",
    passage: [
      "This girl's name is Seetha.",
      "Seetha is five years old.",
      "She puts flowers in her hair.",
      "Seetha loves to sing on her way to school.",
    ],
    image: "/characters/girl1.png",
  },
  {
    id: 3,
    title: "Ramu and the Dog",
    passage: [
      "Ramu was running in the park.",
      "He saw a dog near the big tree.",
      "The dog barked, but Ramu was not afraid.",
      "Ramu and the dog played together all afternoon.",
    ],
    image: "/characters/boy1.png",
  },
]

export function getPassageById(id: number): ReadingPassage | undefined {
  return readingPassages.find((p) => p.id === id)
}
