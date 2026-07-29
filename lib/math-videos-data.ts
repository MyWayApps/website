// Math video lessons (MyWayApps YouTube channel)

export interface VideoLesson {
  id: string
  title: string
  youtubeId: string
  description: string
}

export const mathVideoLessons: VideoLesson[] = [
  {
    id: "double-digit-addition",
    title: "Double Digit Addition",
    youtubeId: "bz7eQ8jYGLA",
    description: "How to add two double-digit numbers, including carrying over for larger sums.",
  },
  {
    id: "addition-word-problems",
    title: "Addition Word Problems",
    youtubeId: "14GlGSO6H7Y",
    description: "Understanding and solving simple word problems using addition.",
  },
  {
    id: "double-digit-subtraction",
    title: "Double Digit Subtraction",
    youtubeId: "fA63yDuzt24",
    description: "How to subtract double-digit numbers, including regrouping and carrying.",
  },
  {
    id: "double-digit-subtraction-word-problems",
    title: "Double Digit Subtraction (Word Problems)",
    youtubeId: "3VlPwx_BvQ0",
    description: "Solving word problems that use double-digit subtraction.",
  },
]
