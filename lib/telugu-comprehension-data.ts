export interface ComprehensionQuestion {
  question: string
  options: string[]
  correctAnswer: string
}

export interface FillInBlankQuestion {
  sentence: string
  blank: string
  options: string[]
  correctAnswer: string
}

export interface ComprehensionLesson {
  id: number
  title: string
  teluguTitle: string
  passage: string[]
  image: string
  game1Questions: ComprehensionQuestion[]
  game2Questions: FillInBlankQuestion[]
}

export const comprehensionLessons: ComprehensionLesson[] = [
  {
    id: 1,
    title: "The Cat",
    teluguTitle: "పిల్లి",
    passage: [
      "ఇది ఒక పిల్లి",
      "ఈ పిల్లి గోధుమ రంగులో ఉంది.",
      "ఇది ఎరుపు తివాచి మీద ఉంది.",
      "ఇది హాయిగా నిద్ర పోతోంది.",
      "దీనిని లేపి కలిసి హాయిగా ఆడుకుందాం."
    ],
    image: "/characters/cat.png",
    game1Questions: [
      {
        question: "పిల్లి రంగు ఏమిటి?",
        options: ["గోధుమ", "నలుపు", "తెలుపు"],
        correctAnswer: "గోధుమ"
      },
      {
        question: "పిల్లి ఏం చేస్తోంది?",
        options: ["నిద్ర పోతోంది", "తింటోంది", "ఆడుకుంటోంది"],
        correctAnswer: "నిద్ర పోతోంది"
      },
      {
        question: "పిల్లి ఎక్కడ నిద్ర పోతోంది?",
        options: ["ఎరుపు తివాచి మీద", "మంచం మీద", "నేల మీద"],
        correctAnswer: "ఎరుపు తివాచి మీద"
      }
    ],
    game2Questions: [
      {
        sentence: "పిల్లి _____ రంగు లో ఉంది.",
        blank: "_____",
        options: ["గోధుమ", "ఎరుపు"],
        correctAnswer: "గోధుమ"
      },
      {
        sentence: "తివాచి _____ రంగు లో ఉంది.",
        blank: "_____",
        options: ["గోధుమ", "ఎరుపు"],
        correctAnswer: "ఎరుపు"
      }
    ]
  },
  {
    id: 2,
    title: "Seetha",
    teluguTitle: "సీత",
    passage: [
      "ఈ అమ్మాయి పేరు సీత.",
      "సీత వయసు ఐదు ఏళ్ళు.",
      "సీత బడికి వెళ్తుంది.",
      "సీత జడలో పూలు పెట్టుకుంది.",
      "సీతకు పాడటం అంటే ఎంతో ఇష్టం."
    ],
    image: "/characters/girl1.png",
    game1Questions: [
      {
        question: "సీత వయసు ఎంత?",
        options: ["ఐదు ఏళ్ళు", "ఆరు ఏళ్ళు", "ఏడు ఏళ్ళు"],
        correctAnswer: "ఐదు ఏళ్ళు"
      },
      {
        question: "సీతకు పాడటం ఇష్టమా కాదా?",
        options: ["ఇష్టం", "ఇష్టం కాదు", "కొన్నిసార్లు"],
        correctAnswer: "ఇష్టం"
      },
      {
        question: "సీత ఒక అమ్మాయి లేదా ఒక అబ్బాయి?",
        options: ["అమ్మాయి", "అబ్బాయి", "రెండూ కాదు"],
        correctAnswer: "అమ్మాయి"
      }
    ],
    game2Questions: [
      {
        sentence: "సీతకు _____ ఇష్టం.",
        blank: "_____",
        options: ["స్కేటింగు", "పాడటం"],
        correctAnswer: "పాడటం"
      },
      {
        sentence: "సీత వయసు _____ ఏళ్ళు.",
        blank: "_____",
        options: ["7", "5"],
        correctAnswer: "5"
      },
      {
        sentence: "సీత జడలో _____ పెట్టుకుంది.",
        blank: "_____",
        options: ["కాగితం", "పూలు"],
        correctAnswer: "పూలు"
      },
      {
        sentence: "సీత _____ వెళ్తుంది.",
        blank: "_____",
        options: ["బడికి", "ఆఫీసుకు"],
        correctAnswer: "బడికి"
      }
    ]
  },
  {
    id: 3,
    title: "Budugu's Parrot",
    teluguTitle: "బుడుగు చిలుక",
    passage: [
      "బుడుగు దగ్గర చిలుక ఉంది.",
      "చిలుక బుడుగు పెంపుడు పక్షి.",
      "చిలుక రంగు పచ్చ.",
      "దీని ముక్కు రంగు ఎరుపు.",
      "బుడుగు తన చిలుకతో రోజు ఆడుకుంటాడు.",
      "బుడుగు చిలుక కు మామిడి పళ్ళు పెడతాడు."
    ],
    image: "/characters/parrot.png",
    game1Questions: [
      {
        question: "బుడుగు దగ్గర ఏ పక్షి ఉంది?",
        options: ["చిలుక", "కాకి", "గువ్వ"],
        correctAnswer: "చిలుక"
      },
      {
        question: "బుడుగు చిలుక ఏ రంగు లో ఉంది?",
        options: ["పచ్చ", "నీలం", "ఎరుపు"],
        correctAnswer: "పచ్చ"
      },
      {
        question: "చిలుక ముక్కు ఏ రంగు?",
        options: ["ఎరుపు", "పచ్చ", "పసుపు"],
        correctAnswer: "ఎరుపు"
      }
    ],
    game2Questions: [
      {
        sentence: "బుడుగు రోజు తన చిలుకతో _____.",
        blank: "_____",
        options: ["ఆడతాడు", "పాడతాడు", "తింటాడు"],
        correctAnswer: "ఆడతాడు"
      },
      {
        sentence: "చిలుక బుడుగుకు _____.",
        blank: "_____",
        options: ["పెంపుడు పక్షి", "అడవి పక్షి"],
        correctAnswer: "పెంపుడు పక్షి"
      },
      {
        sentence: "బుడుగు చిలుకకు _____ పెడతాడు.",
        blank: "_____",
        options: ["మామిడి", "అరటి"],
        correctAnswer: "మామిడి"
      },
      {
        sentence: "చిలుక రంగు _____.",
        blank: "_____",
        options: ["పచ్చ", "నీలం"],
        correctAnswer: "పచ్చ"
      },
      {
        sentence: "చిలుక ముక్కు _____.",
        blank: "_____",
        options: ["ఎరుపు", "పచ్చ"],
        correctAnswer: "ఎరుపు"
      }
    ]
  },
  {
    id: 4,
    title: "The Cow",
    teluguTitle: "ఆవు",
    passage: [
      "ఇది ఆవు.",
      "దీనికి నాలుగు కాళ్ళు, ఒక తోక ఉన్నాయి.",
      "ఈ ఆవు మీద నల్ల మచ్చలు ఉన్నాయి.",
      "ఆవు గడ్డి తింటుంది.",
      "ఆవు పాలు ఇస్తుంది."
    ],
    image: "/characters/cow.png",
    game1Questions: [
      {
        question: "ఆవుకు ఎన్ని కాళ్ళు ఉన్నాయి?",
        options: ["4", "3", "2"],
        correctAnswer: "4"
      },
      {
        question: "ఆవు ఏమి తింటుంది?",
        options: ["గడ్డి", "నూడుల్స్", "బియ్యం"],
        correctAnswer: "గడ్డి"
      },
      {
        question: "ఆవు మీద మచ్చలు ఏ రంగు?",
        options: ["నలుపు", "పచ్చ", "ఎరుపు"],
        correctAnswer: "నలుపు"
      }
    ],
    game2Questions: [
      {
        sentence: "ఆవు _____ తిని _____ ఇస్తుంది.",
        blank: "_____ తిని _____",
        options: ["గడ్డి", "పాలు"],
        correctAnswer: "గడ్డి పాలు"
      },
      {
        sentence: "ఆవుకు _____ కాళ్ళు.",
        blank: "_____",
        options: ["నాలుగు", "మూడు"],
        correctAnswer: "నాలుగు"
      },
      {
        sentence: "ఆవుకు _____ తోక.",
        blank: "_____",
        options: ["ఒక", "రెండు"],
        correctAnswer: "ఒక"
      }
    ]
  },
  {
    id: 5,
    title: "Ramu in the Park",
    teluguTitle: "పార్క్ లో రాము - కుక్క",
    passage: [
      "రాము పార్క్ లో పరుగెడుతున్నాడు.",
      "రాము పార్క్ లో ఒక కుక్కను చూశాడు.",
      "కుక్క మొరిగింది, అయినా రాము భయపడలేదు.",
      "కుక్కను చూసి సంతోషించాడు.",
      "కుక్క కూడ రాముని చూసి సంతోషించింది.",
      "రాము కుక్కతో ఆడుకున్నాడు."
    ],
    image: "/characters/boy1.png",
    game1Questions: [
      {
        question: "రాము పార్క్ లో _____ చేస్తున్నాడు.",
        options: ["పరుగెడుతున్నాడు", "నాట్యం చేస్తున్నాడు", "పాడుతున్నాడు"],
        correctAnswer: "పరుగెడుతున్నాడు"
      },
      {
        question: "రాము ఏమి చూశాడు?",
        options: ["కుక్క", "గేదె", "పిచ్చుక"],
        correctAnswer: "కుక్క"
      },
      {
        question: "రాము కుక్కను చూసి ఏం చేశాడు?",
        options: ["సంతోషించాడు", "భయపడ్డాడు", "పారిపోయాడు"],
        correctAnswer: "సంతోషించాడు"
      }
    ],
    game2Questions: [
      {
        sentence: "రాము పార్క్ లో _____.",
        blank: "_____",
        options: ["పరుగెడుతున్నాడు", "నాట్యం చేస్తున్నాడు", "పాడుతున్నాడు"],
        correctAnswer: "పరుగెడుతున్నాడు"
      },
      {
        sentence: "రాము _____ ను చూశాడు.",
        blank: "_____",
        options: ["గేదె", "కుక్క", "పిచ్చుక"],
        correctAnswer: "కుక్క"
      },
      {
        sentence: "_____ మొరిగింది.",
        blank: "_____",
        options: ["కుక్క", "పిచ్చుక", "పిల్లి"],
        correctAnswer: "కుక్క"
      }
    ]
  }
]

export function getLessonById(id: number): ComprehensionLesson | undefined {
  return comprehensionLessons.find(lesson => lesson.id === id)
}

