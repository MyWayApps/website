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
  malayalamTitle: string
  passage: string[]
  image: string
  game1Questions: ComprehensionQuestion[]
  game2Questions: FillInBlankQuestion[]
}

export const comprehensionLessons: ComprehensionLesson[] = [
  {
    id: 1,
    title: "The Cat",
    malayalamTitle: "പൂച്ച",
    passage: [
      "ഇതൊരു പൂച്ചയാണ്.",
      "ഈ പൂച്ച തവിട്ട് നിറത്തിലാണ്.",
      "ഇത് ഒരു ചുവന്ന പരവതാനിയിലാണ്.",
      "ഇത് സുഖമായി ഉറങ്ങുന്നു.",
      "നമുക്ക് ഇതിനെ ഉണർത്തി ഒരുമിച്ച് സന്തോഷത്തോടെ കളിക്കാം."
    ],
    image: "/characters/cat.png",
    game1Questions: [
      {
        question: "പൂച്ചയുടെ നിറം എന്താണ്?",
        options: ["തവിട്ട്", "കറുപ്പ്", "വെള്ള"],
        correctAnswer: "തവിട്ട്"
      },
      {
        question: "പൂച്ച എന്താണ് ചെയ്യുന്നത്?",
        options: ["ഉറങ്ങുന്നു", "കഴിക്കുന്നു", "കളിക്കുന്നു"],
        correctAnswer: "ഉറങ്ങുന്നു"
      },
      {
        question: "പൂച്ച എവിടെ ഉറങ്ങുന്നു?",
        options: ["ചുവന്ന പരവതാനിയിൽ", "കട്ടിലിൽ", "നിലത്ത്"],
        correctAnswer: "ചുവന്ന പരവതാനിയിൽ"
      }
    ],
    game2Questions: [
      {
        sentence: "പൂച്ച _____ നിറത്തിലാണ്.",
        blank: "_____",
        options: ["തവിട്ട്", "ചുവപ്പ്"],
        correctAnswer: "തവിട്ട്"
      },
      {
        sentence: "പരവതാനി _____ നിറത്തിലാണ്.",
        blank: "_____",
        options: ["തവിട്ട്", "ചുവപ്പ്"],
        correctAnswer: "ചുവപ്പ്"
      }
    ]
  },
  {
    id: 2,
    title: "Seetha",
    malayalamTitle: "സീത",
    passage: [
      "ഈ പെൺകുട്ടിയുടെ പേര് സീത.",
      "സീതയുടെ വയസ്സ് അഞ്ച് വർഷമാണ്.",
      "സീത സ്കൂളിൽ പോകുന്നു.",
      "സീത തന്റെ മുടിയിൽ പൂക്കൾ ചൂടുന്നു.",
      "സീതയ്ക്ക് പാട്ടുപാടാൻ വളരെ ഇഷ്ടമാണ്."
    ],
    image: "/characters/girl1.png",
    game1Questions: [
      {
        question: "സീതയുടെ വയസ്സ് എത്ര?",
        options: ["അഞ്ച് വർഷം", "ആറ് വർഷം", "ഏഴ് വർഷം"],
        correctAnswer: "അഞ്ച് വർഷം"
      },
      {
        question: "സീതയ്ക്ക് പാട്ടുപാടാൻ ഇഷ്ടമാണോ അല്ലയോ?",
        options: ["ഇഷ്ടമാണ്", "ഇഷ്ടമല്ല", "ചിലപ്പോൾ"],
        correctAnswer: "ഇഷ്ടമാണ്"
      },
      {
        question: "സീത ഒരു പെൺകുട്ടിയാണോ ആൺകുട്ടിയാണോ?",
        options: ["പെൺകുട്ടി", "ആൺകുട്ടി", "രണ്ടുമല്ല"],
        correctAnswer: "പെൺകുട്ടി"
      }
    ],
    game2Questions: [
      {
        sentence: "സീതയ്ക്ക് _____ ഇഷ്ടമാണ്.",
        blank: "_____",
        options: ["സ്കേറ്റിംഗ്", "പാട്ടുപാടൽ"],
        correctAnswer: "പാട്ടുപാടൽ"
      },
      {
        sentence: "സീതയുടെ വയസ്സ് _____ വർഷം.",
        blank: "_____",
        options: ["7", "5"],
        correctAnswer: "5"
      },
      {
        sentence: "സീത തന്റെ മുടിയിൽ _____ ചൂടി.",
        blank: "_____",
        options: ["കടലാസ്", "പൂക്കൾ"],
        correctAnswer: "പൂക്കൾ"
      },
      {
        sentence: "സീത _____ പോകുന്നു.",
        blank: "_____",
        options: ["സ്കൂളിൽ", "ഓഫീസിൽ"],
        correctAnswer: "സ്കൂളിൽ"
      }
    ]
  },
  {
    id: 3,
    title: "Budugu's Parrot",
    malayalamTitle: "ബുഡുഗുവിന്റെ തത്ത",
    passage: [
      "ബുഡുഗുവിന് ഒരു തത്ത ഉണ്ട്.",
      "തത്ത ബുഡുഗുവിന്റെ വളർത്തുപക്ഷിയാണ്.",
      "തത്തയുടെ നിറം പച്ചയാണ്.",
      "അതിന്റെ കൊക്കിന്റെ നിറം ചുവപ്പാണ്.",
      "ബുഡുഗു എല്ലാ ദിവസവും തന്റെ തത്തയുമായി കളിക്കുന്നു.",
      "ബുഡുഗു തത്തയ്ക്ക് മാമ്പഴം കൊടുക്കുന്നു."
    ],
    image: "/characters/parrot.png",
    game1Questions: [
      {
        question: "ബുഡുഗുവിന് ഏത് പക്ഷിയാണ് ഉള്ളത്?",
        options: ["തത്ത", "കാക്ക", "കുരുവി"],
        correctAnswer: "തത്ത"
      },
      {
        question: "ബുഡുഗുവിന്റെ തത്ത ഏത് നിറത്തിലാണ്?",
        options: ["പച്ച", "നീല", "ചുവപ്പ്"],
        correctAnswer: "പച്ച"
      },
      {
        question: "തത്തയുടെ കൊക്ക് ഏത് നിറമാണ്?",
        options: ["ചുവപ്പ്", "പച്ച", "മഞ്ഞ"],
        correctAnswer: "ചുവപ്പ്"
      }
    ],
    game2Questions: [
      {
        sentence: "ബുഡുഗു എല്ലാ ദിവസവും തന്റെ തത്തയുമായി _____.",
        blank: "_____",
        options: ["കളിക്കുന്നു", "പാടുന്നു", "കഴിക്കുന്നു"],
        correctAnswer: "കളിക്കുന്നു"
      },
      {
        sentence: "തത്ത ബുഡുഗുവിന് _____ ആണ്.",
        blank: "_____",
        options: ["വളർത്തുപക്ഷി", "കാട്ടുപക്ഷി"],
        correctAnswer: "വളർത്തുപക്ഷി"
      },
      {
        sentence: "ബുഡുഗു തത്തയ്ക്ക് _____ കൊടുക്കുന്നു.",
        blank: "_____",
        options: ["മാമ്പഴം", "വാഴപ്പഴം"],
        correctAnswer: "മാമ്പഴം"
      },
      {
        sentence: "തത്തയുടെ നിറം _____.",
        blank: "_____",
        options: ["പച്ച", "നീല"],
        correctAnswer: "പച്ച"
      },
      {
        sentence: "തത്തയുടെ കൊക്ക് _____.",
        blank: "_____",
        options: ["ചുവപ്പ്", "പച്ച"],
        correctAnswer: "ചുവപ്പ്"
      }
    ]
  },
  {
    id: 4,
    title: "The Cow",
    malayalamTitle: "പശു",
    passage: [
      "ഇതൊരു പശുവാണ്.",
      "ഇതിന് നാല് കാലുകളും ഒരു വാലും ഉണ്ട്.",
      "ഈ പശുവിന്റെ ദേഹത്ത് കറുത്ത പുള്ളികളുണ്ട്.",
      "പശു പുല്ല് തിന്നുന്നു.",
      "പശു പാൽ തരുന്നു."
    ],
    image: "/characters/cow.png",
    game1Questions: [
      {
        question: "പശുവിന് എത്ര കാലുകളുണ്ട്?",
        options: ["4", "3", "2"],
        correctAnswer: "4"
      },
      {
        question: "പശു എന്താണ് തിന്നുന്നത്?",
        options: ["പുല്ല്", "നൂഡിൽസ്", "അരി"],
        correctAnswer: "പുല്ല്"
      },
      {
        question: "പശുവിന്റെ ദേഹത്തെ പുള്ളികൾ ഏത് നിറമാണ്?",
        options: ["കറുപ്പ്", "പച്ച", "ചുവപ്പ്"],
        correctAnswer: "കറുപ്പ്"
      }
    ],
    game2Questions: [
      {
        sentence: "പശു _____ തിന്ന് _____ തരുന്നു.",
        blank: "_____ തിന്ന് _____",
        options: ["പുല്ല്", "പാൽ"],
        correctAnswer: "പുല്ല് പാൽ"
      },
      {
        sentence: "പശുവിന് _____ കാലുകൾ.",
        blank: "_____",
        options: ["നാല്", "മൂന്ന്"],
        correctAnswer: "നാല്"
      },
      {
        sentence: "പശുവിന് _____ വാൽ.",
        blank: "_____",
        options: ["ഒരു", "രണ്ട്"],
        correctAnswer: "ഒരു"
      }
    ]
  },
  {
    id: 5,
    title: "Ramu in the Park",
    malayalamTitle: "പാർക്കിൽ രാമു - നായ",
    passage: [
      "രാമു പാർക്കിൽ ഓടുന്നു.",
      "രാമു പാർക്കിൽ ഒരു നായയെ കണ്ടു.",
      "നായ കുരച്ചു, എങ്കിലും രാമു പേടിച്ചില്ല.",
      "നായയെ കണ്ട് അവൻ സന്തോഷിച്ചു.",
      "നായയും രാമുവിനെ കണ്ട് സന്തോഷിച്ചു.",
      "രാമു നായയുമായി കളിച്ചു."
    ],
    image: "/characters/boy1.png",
    game1Questions: [
      {
        question: "രാമു പാർക്കിൽ _____.",
        options: ["ഓടുന്നു", "നൃത്തം ചെയ്യുന്നു", "പാടുന്നു"],
        correctAnswer: "ഓടുന്നു"
      },
      {
        question: "രാമു എന്താണ് കണ്ടത്?",
        options: ["നായ", "എരുമ", "കുരുവി"],
        correctAnswer: "നായ"
      },
      {
        question: "നായയെ കണ്ട് രാമു എന്ത് ചെയ്തു?",
        options: ["സന്തോഷിച്ചു", "പേടിച്ചു", "ഓടിപ്പോയി"],
        correctAnswer: "സന്തോഷിച്ചു"
      }
    ],
    game2Questions: [
      {
        sentence: "രാമു പാർക്കിൽ _____.",
        blank: "_____",
        options: ["ഓടുന്നു", "നൃത്തം ചെയ്യുന്നു", "പാടുന്നു"],
        correctAnswer: "ഓടുന്നു"
      },
      {
        sentence: "രാമു _____ കണ്ടു.",
        blank: "_____",
        options: ["എരുമയെ", "നായയെ", "കുരുവിയെ"],
        correctAnswer: "നായയെ"
      },
      {
        sentence: "_____ കുരച്ചു.",
        blank: "_____",
        options: ["നായ", "കുരുവി", "പൂച്ച"],
        correctAnswer: "നായ"
      }
    ]
  }
]

export function getLessonById(id: number): ComprehensionLesson | undefined {
  return comprehensionLessons.find(lesson => lesson.id === id)
}
