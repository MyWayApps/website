// Social Studies video lessons (MyWayApps YouTube channel)

export interface VideoLesson {
  id: string
  title: string
  youtubeId: string
  description: string
}

export const socialStudiesLessons: VideoLesson[] = [
  {
    id: "national-symbols-of-india",
    title: "National Symbols Of India",
    youtubeId: "RdgQtDY53mY",
    description: "India's national symbols, including the national emblem, flag, animal and more.",
  },
  {
    id: "festivals-of-india",
    title: "Festivals Of India",
    youtubeId: "HHbCz6qg9V4",
    description: "Major festivals celebrated in India — Diwali, Dussehra, Christmas, Eid, Baisakhi, Navroz.",
  },
  {
    id: "famous-indians",
    title: "Famous Indians",
    youtubeId: "BUryYz5l93Y",
    description: "Famous Indian personalities, including freedom fighters, politicians, sports stars and actors.",
  },
]
