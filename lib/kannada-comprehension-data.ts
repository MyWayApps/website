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
  kannadaTitle: string
  passage: string[]
  image: string
  game1Questions: ComprehensionQuestion[]
  game2Questions: FillInBlankQuestion[]
}

export const comprehensionLessons: ComprehensionLesson[] = [
  {
    id: 1,
    title: "The Cat",
    kannadaTitle: "ಬೆಕ್ಕು",
    passage: [
      "ಇದು ಒಂದು ಬೆಕ್ಕು.",
      "ಈ ಬೆಕ್ಕು ಕಂದು ಬಣ್ಣದಲ್ಲಿದೆ.",
      "ಇದು ಕೆಂಪು ಕಾರ್ಪೆಟ್ ಮೇಲೆ ಇದೆ.",
      "ಇದು ಆರಾಮವಾಗಿ ನಿದ್ದೆ ಮಾಡುತ್ತಿದೆ.",
      "ಇದನ್ನು ಎಬ್ಬಿಸಿ ಒಟ್ಟಿಗೆ ಆಡೋಣ."
    ],
    image: "/characters/cat.png",
    game1Questions: [
      {
        question: "ಬೆಕ್ಕಿನ ಬಣ್ಣ ಏನು?",
        options: ["ಕಂದು", "ಕಪ್ಪು", "ಬಿಳಿ"],
        correctAnswer: "ಕಂದು"
      },
      {
        question: "ಬೆಕ್ಕು ಏನು ಮಾಡುತ್ತಿದೆ?",
        options: ["ನಿದ್ದೆ ಮಾಡುತ್ತಿದೆ", "ತಿನ್ನುತ್ತಿದೆ", "ಆಡುತ್ತಿದೆ"],
        correctAnswer: "ನಿದ್ದೆ ಮಾಡುತ್ತಿದೆ"
      },
      {
        question: "ಬೆಕ್ಕು ಎಲ್ಲಿ ನಿದ್ದೆ ಮಾಡುತ್ತಿದೆ?",
        options: ["ಕೆಂಪು ಕಾರ್ಪೆಟ್ ಮೇಲೆ", "ಹಾಸಿಗೆ ಮೇಲೆ", "ನೆಲದ ಮೇಲೆ"],
        correctAnswer: "ಕೆಂಪು ಕಾರ್ಪೆಟ್ ಮೇಲೆ"
      }
    ],
    game2Questions: [
      {
        sentence: "ಬೆಕ್ಕು _____ ಬಣ್ಣದಲ್ಲಿದೆ.",
        blank: "_____",
        options: ["ಕಂದು", "ಕೆಂಪು"],
        correctAnswer: "ಕಂದು"
      },
      {
        sentence: "ಕಾರ್ಪೆಟ್ _____ ಬಣ್ಣದಲ್ಲಿದೆ.",
        blank: "_____",
        options: ["ಕಂದು", "ಕೆಂಪು"],
        correctAnswer: "ಕೆಂಪು"
      }
    ]
  },
  {
    id: 2,
    title: "Seetha",
    kannadaTitle: "ಸೀತಾ",
    passage: [
      "ಈ ಹುಡುಗಿಯ ಹೆಸರು ಸೀತಾ.",
      "ಸೀತಾಳ ವಯಸ್ಸು ಐದು ವರ್ಷ.",
      "ಸೀತಾ ಶಾಲೆಗೆ ಹೋಗುತ್ತಾಳೆ.",
      "ಸೀತಾ ತನ್ನ ಜಡೆಯಲ್ಲಿ ಹೂವುಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳುತ್ತಾಳೆ.",
      "ಸೀತಾಗೆ ಹಾಡುವುದೆಂದರೆ ತುಂಬಾ ಇಷ್ಟ."
    ],
    image: "/characters/girl1.png",
    game1Questions: [
      {
        question: "ಸೀತಾಳ ವಯಸ್ಸು ಎಷ್ಟು?",
        options: ["ಐದು ವರ್ಷ", "ಆರು ವರ್ಷ", "ಏಳು ವರ್ಷ"],
        correctAnswer: "ಐದು ವರ್ಷ"
      },
      {
        question: "ಸೀತಾಗೆ ಹಾಡುವುದು ಇಷ್ಟವೇ ಅಥವಾ ಇಲ್ಲವೇ?",
        options: ["ಇಷ್ಟ", "ಇಷ್ಟ ಇಲ್ಲ", "ಕೆಲವೊಮ್ಮೆ"],
        correctAnswer: "ಇಷ್ಟ"
      },
      {
        question: "ಸೀತಾ ಒಬ್ಬ ಹುಡುಗಿಯೇ ಅಥವಾ ಹುಡುಗನೇ?",
        options: ["ಹುಡುಗಿ", "ಹುಡುಗ", "ಎರಡೂ ಅಲ್ಲ"],
        correctAnswer: "ಹುಡುಗಿ"
      }
    ],
    game2Questions: [
      {
        sentence: "ಸೀತಾಗೆ _____ ಇಷ್ಟ.",
        blank: "_____",
        options: ["ಸ್ಕೇಟಿಂಗ್", "ಹಾಡುವುದು"],
        correctAnswer: "ಹಾಡುವುದು"
      },
      {
        sentence: "ಸೀತಾಳ ವಯಸ್ಸು _____ ವರ್ಷ.",
        blank: "_____",
        options: ["7", "5"],
        correctAnswer: "5"
      },
      {
        sentence: "ಸೀತಾ ತನ್ನ ಜಡೆಯಲ್ಲಿ _____ ಇಟ್ಟುಕೊಂಡಿದ್ದಾಳೆ.",
        blank: "_____",
        options: ["ಕಾಗದ", "ಹೂವುಗಳು"],
        correctAnswer: "ಹೂವುಗಳು"
      },
      {
        sentence: "ಸೀತಾ _____ ಹೋಗುತ್ತಾಳೆ.",
        blank: "_____",
        options: ["ಶಾಲೆಗೆ", "ಕಚೇರಿಗೆ"],
        correctAnswer: "ಶಾಲೆಗೆ"
      }
    ]
  },
  {
    id: 3,
    title: "Budugu's Parrot",
    kannadaTitle: "ಬುಡುಗುವಿನ ಗಿಳಿ",
    passage: [
      "ಬುಡುಗುವಿನ ಬಳಿ ಒಂದು ಗಿಳಿ ಇದೆ.",
      "ಗಿಳಿ ಬುಡುಗುವಿನ ಸಾಕುಪಕ್ಷಿ.",
      "ಗಿಳಿಯ ಬಣ್ಣ ಹಸಿರು.",
      "ಇದರ ಕೊಕ್ಕಿನ ಬಣ್ಣ ಕೆಂಪು.",
      "ಬುಡುಗು ಪ್ರತಿದಿನ ತನ್ನ ಗಿಳಿಯೊಂದಿಗೆ ಆಡುತ್ತಾನೆ.",
      "ಬುಡುಗು ಗಿಳಿಗೆ ಮಾವಿನ ಹಣ್ಣುಗಳನ್ನು ಕೊಡುತ್ತಾನೆ."
    ],
    image: "/characters/parrot.png",
    game1Questions: [
      {
        question: "ಬುಡುಗುವಿನ ಬಳಿ ಯಾವ ಪಕ್ಷಿ ಇದೆ?",
        options: ["ಗಿಳಿ", "ಕಾಗೆ", "ಗುಬ್ಬಚ್ಚಿ"],
        correctAnswer: "ಗಿಳಿ"
      },
      {
        question: "ಬುಡುಗುವಿನ ಗಿಳಿ ಯಾವ ಬಣ್ಣದಲ್ಲಿದೆ?",
        options: ["ಹಸಿರು", "ನೀಲಿ", "ಕೆಂಪು"],
        correctAnswer: "ಹಸಿರು"
      },
      {
        question: "ಗಿಳಿಯ ಕೊಕ್ಕು ಯಾವ ಬಣ್ಣ?",
        options: ["ಕೆಂಪು", "ಹಸಿರು", "ಹಳದಿ"],
        correctAnswer: "ಕೆಂಪು"
      }
    ],
    game2Questions: [
      {
        sentence: "ಬುಡುಗು ಪ್ರತಿದಿನ ತನ್ನ ಗಿಳಿಯೊಂದಿಗೆ _____.",
        blank: "_____",
        options: ["ಆಡುತ್ತಾನೆ", "ಹಾಡುತ್ತಾನೆ", "ತಿನ್ನುತ್ತಾನೆ"],
        correctAnswer: "ಆಡುತ್ತಾನೆ"
      },
      {
        sentence: "ಗಿಳಿ ಬುಡುಗುವಿಗೆ _____.",
        blank: "_____",
        options: ["ಸಾಕುಪಕ್ಷಿ", "ಕಾಡು ಪಕ್ಷಿ"],
        correctAnswer: "ಸಾಕುಪಕ್ಷಿ"
      },
      {
        sentence: "ಬುಡುಗು ಗಿಳಿಗೆ _____ ಕೊಡುತ್ತಾನೆ.",
        blank: "_____",
        options: ["ಮಾವು", "ಬಾಳೆಹಣ್ಣು"],
        correctAnswer: "ಮಾವು"
      },
      {
        sentence: "ಗಿಳಿಯ ಬಣ್ಣ _____.",
        blank: "_____",
        options: ["ಹಸಿರು", "ನೀಲಿ"],
        correctAnswer: "ಹಸಿರು"
      },
      {
        sentence: "ಗಿಳಿಯ ಕೊಕ್ಕು _____.",
        blank: "_____",
        options: ["ಕೆಂಪು", "ಹಸಿರು"],
        correctAnswer: "ಕೆಂಪು"
      }
    ]
  },
  {
    id: 4,
    title: "The Cow",
    kannadaTitle: "ಹಸು",
    passage: [
      "ಇದು ಒಂದು ಹಸು.",
      "ಇದಕ್ಕೆ ನಾಲ್ಕು ಕಾಲುಗಳು, ಒಂದು ಬಾಲ ಇವೆ.",
      "ಈ ಹಸುವಿನ ಮೇಲೆ ಕಪ್ಪು ಚುಕ್ಕೆಗಳಿವೆ.",
      "ಹಸು ಹುಲ್ಲು ತಿನ್ನುತ್ತದೆ.",
      "ಹಸು ಹಾಲು ಕೊಡುತ್ತದೆ."
    ],
    image: "/characters/cow.png",
    game1Questions: [
      {
        question: "ಹಸುವಿಗೆ ಎಷ್ಟು ಕಾಲುಗಳಿವೆ?",
        options: ["4", "3", "2"],
        correctAnswer: "4"
      },
      {
        question: "ಹಸು ಏನು ತಿನ್ನುತ್ತದೆ?",
        options: ["ಹುಲ್ಲು", "ನೂಡಲ್ಸ್", "ಅಕ್ಕಿ"],
        correctAnswer: "ಹುಲ್ಲು"
      },
      {
        question: "ಹಸುವಿನ ಮೇಲಿನ ಚುಕ್ಕೆಗಳು ಯಾವ ಬಣ್ಣ?",
        options: ["ಕಪ್ಪು", "ಹಸಿರು", "ಕೆಂಪು"],
        correctAnswer: "ಕಪ್ಪು"
      }
    ],
    game2Questions: [
      {
        sentence: "ಹಸು _____ ತಿಂದು _____ ಕೊಡುತ್ತದೆ.",
        blank: "_____ ತಿಂದು _____",
        options: ["ಹುಲ್ಲು", "ಹಾಲು"],
        correctAnswer: "ಹುಲ್ಲು ಹಾಲು"
      },
      {
        sentence: "ಹಸುವಿಗೆ _____ ಕಾಲುಗಳು.",
        blank: "_____",
        options: ["ನಾಲ್ಕು", "ಮೂರು"],
        correctAnswer: "ನಾಲ್ಕು"
      },
      {
        sentence: "ಹಸುವಿಗೆ _____ ಬಾಲ.",
        blank: "_____",
        options: ["ಒಂದು", "ಎರಡು"],
        correctAnswer: "ಒಂದು"
      }
    ]
  },
  {
    id: 5,
    title: "Ramu in the Park",
    kannadaTitle: "ಪಾರ್ಕಿನಲ್ಲಿ ರಾಮು - ನಾಯಿ",
    passage: [
      "ರಾಮು ಪಾರ್ಕಿನಲ್ಲಿ ಓಡುತ್ತಿದ್ದಾನೆ.",
      "ರಾಮು ಪಾರ್ಕಿನಲ್ಲಿ ಒಂದು ನಾಯಿಯನ್ನು ನೋಡಿದನು.",
      "ನಾಯಿ ಬೊಗಳಿತು, ಆದರೂ ರಾಮು ಹೆದರಲಿಲ್ಲ.",
      "ನಾಯಿಯನ್ನು ನೋಡಿ ಅವನು ಸಂತೋಷಪಟ್ಟನು.",
      "ನಾಯಿ ಕೂಡ ರಾಮುವನ್ನು ನೋಡಿ ಸಂತೋಷಪಟ್ಟಿತು.",
      "ರಾಮು ನಾಯಿಯೊಂದಿಗೆ ಆಡಿದನು."
    ],
    image: "/characters/boy1.png",
    game1Questions: [
      {
        question: "ರಾಮು ಪಾರ್ಕಿನಲ್ಲಿ _____.",
        options: ["ಓಡುತ್ತಿದ್ದಾನೆ", "ಕುಣಿಯುತ್ತಿದ್ದಾನೆ", "ಹಾಡುತ್ತಿದ್ದಾನೆ"],
        correctAnswer: "ಓಡುತ್ತಿದ್ದಾನೆ"
      },
      {
        question: "ರಾಮು ಏನನ್ನು ನೋಡಿದನು?",
        options: ["ನಾಯಿ", "ಎಮ್ಮೆ", "ಗುಬ್ಬಚ್ಚಿ"],
        correctAnswer: "ನಾಯಿ"
      },
      {
        question: "ನಾಯಿಯನ್ನು ನೋಡಿ ರಾಮು ಏನು ಮಾಡಿದನು?",
        options: ["ಸಂತೋಷಪಟ್ಟನು", "ಹೆದರಿದನು", "ಓಡಿಹೋದನು"],
        correctAnswer: "ಸಂತೋಷಪಟ್ಟನು"
      }
    ],
    game2Questions: [
      {
        sentence: "ರಾಮು ಪಾರ್ಕಿನಲ್ಲಿ _____.",
        blank: "_____",
        options: ["ಓಡುತ್ತಿದ್ದಾನೆ", "ಕುಣಿಯುತ್ತಿದ್ದಾನೆ", "ಹಾಡುತ್ತಿದ್ದಾನೆ"],
        correctAnswer: "ಓಡುತ್ತಿದ್ದಾನೆ"
      },
      {
        sentence: "ರಾಮು _____ ನೋಡಿದನು.",
        blank: "_____",
        options: ["ಎಮ್ಮೆ", "ನಾಯಿ", "ಗುಬ್ಬಚ್ಚಿ"],
        correctAnswer: "ನಾಯಿ"
      },
      {
        sentence: "_____ ಬೊಗಳಿತು.",
        blank: "_____",
        options: ["ನಾಯಿ", "ಗುಬ್ಬಚ್ಚಿ", "ಬೆಕ್ಕು"],
        correctAnswer: "ನಾಯಿ"
      }
    ]
  }
]

export function getLessonById(id: number): ComprehensionLesson | undefined {
  return comprehensionLessons.find(lesson => lesson.id === id)
}
