// English Grammar video lessons (MyWayApps YouTube channel)

export interface VideoLesson {
  id: string
  title: string
  youtubeId: string
  description: string
}

export const englishGrammarLessons: VideoLesson[] = [
  {
    id: "was-were",
    title: "Was & Were",
    youtubeId: "_P4IW5J9CRw",
    description: "The difference between \"was\" and \"were\", with simple examples and pictures.",
  },
  {
    id: "nouns",
    title: "Nouns",
    youtubeId: "4-gt5bMbqWw",
    description: "What a noun is — naming words for people, places, animals and things.",
  },
  {
    id: "singular-plural-nouns",
    title: "Singular & Plural Nouns",
    youtubeId: "KmqqwBx-7xs",
    description: "How to tell one thing from many things, with examples and pictures.",
  },
  {
    id: "pronouns",
    title: "Pronouns",
    youtubeId: "B4tY6NSDm-U",
    description: "Words that stand in for nouns, like he, she, it and they.",
  },
  {
    id: "verbs",
    title: "Verbs",
    youtubeId: "qmeNEcPHhs8",
    description: "Action words — what verbs are and how they're used in a sentence.",
  },
  {
    id: "helping-verbs-has-have",
    title: "Helping Verbs: Has & Have",
    youtubeId: "ar-BBBHKOQ0",
    description: "When to use \"has\" and when to use \"have\", with easy examples.",
  },
  {
    id: "prepositions",
    title: "Prepositions",
    youtubeId: "qCra-EfMlug",
    description: "Words like in, on and under that describe where things are.",
  },
  {
    id: "adjectives",
    title: "Adjectives",
    youtubeId: "yqFOYO1P5-k",
    description: "Describing words that tell us more about a noun.",
  },
  {
    id: "vowels",
    title: "Vowels",
    youtubeId: "MYbfQ6JMAV4",
    description: "The five vowels of the English alphabet and how they're used.",
  },
  {
    id: "gender",
    title: "Gender",
    youtubeId: "a8_WM-p-l7s",
    description: "Words used to describe gender in English grammar, with examples.",
  },
]

export function getGrammarLessonById(id: string): VideoLesson | undefined {
  return englishGrammarLessons.find((lesson) => lesson.id === id)
}
