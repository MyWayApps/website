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
  hindiTitle: string
  passage: string[]
  image: string
  game1Questions: ComprehensionQuestion[]
  game2Questions: FillInBlankQuestion[]
}

export const comprehensionLessons: ComprehensionLesson[] = [
  {
    id: 1,
    title: "The Cat",
    hindiTitle: "बिल्ली",
    passage: [
      "यह एक बिल्ली है।",
      "यह बिल्ली भूरे रंग की है।",
      "यह लाल कालीन पर है।",
      "यह आराम से सो रही है।",
      "चलो इसे जगाकर साथ में खेलते हैं।"
    ],
    image: "/characters/cat.png",
    game1Questions: [
      {
        question: "बिल्ली का रंग क्या है?",
        options: ["भूरा", "काला", "सफ़ेद"],
        correctAnswer: "भूरा"
      },
      {
        question: "बिल्ली क्या कर रही है?",
        options: ["सो रही है", "खा रही है", "खेल रही है"],
        correctAnswer: "सो रही है"
      },
      {
        question: "बिल्ली कहाँ सो रही है?",
        options: ["लाल कालीन पर", "बिस्तर पर", "फ़र्श पर"],
        correctAnswer: "लाल कालीन पर"
      }
    ],
    game2Questions: [
      {
        sentence: "बिल्ली _____ रंग की है।",
        blank: "_____",
        options: ["भूरे", "लाल"],
        correctAnswer: "भूरे"
      },
      {
        sentence: "कालीन _____ रंग की है।",
        blank: "_____",
        options: ["भूरे", "लाल"],
        correctAnswer: "लाल"
      }
    ]
  },
  {
    id: 2,
    title: "Seetha",
    hindiTitle: "सीता",
    passage: [
      "इस लड़की का नाम सीता है।",
      "सीता की उम्र पाँच साल है।",
      "सीता स्कूल जाती है।",
      "सीता अपनी चोटी में फूल लगाती है।",
      "सीता को गाना गाना बहुत पसंद है।"
    ],
    image: "/characters/girl1.png",
    game1Questions: [
      {
        question: "सीता की उम्र कितनी है?",
        options: ["पाँच साल", "छह साल", "सात साल"],
        correctAnswer: "पाँच साल"
      },
      {
        question: "क्या सीता को गाना पसंद है या नहीं?",
        options: ["पसंद है", "पसंद नहीं", "कभी-कभी"],
        correctAnswer: "पसंद है"
      },
      {
        question: "सीता एक लड़की है या एक लड़का?",
        options: ["लड़की", "लड़का", "दोनों नहीं"],
        correctAnswer: "लड़की"
      }
    ],
    game2Questions: [
      {
        sentence: "सीता को _____ पसंद है।",
        blank: "_____",
        options: ["स्केटिंग", "गाना गाना"],
        correctAnswer: "गाना गाना"
      },
      {
        sentence: "सीता की उम्र _____ साल है।",
        blank: "_____",
        options: ["7", "5"],
        correctAnswer: "5"
      },
      {
        sentence: "सीता ने अपनी चोटी में _____ लगाए।",
        blank: "_____",
        options: ["कागज़", "फूल"],
        correctAnswer: "फूल"
      },
      {
        sentence: "सीता _____ जाती है।",
        blank: "_____",
        options: ["स्कूल", "ऑफिस"],
        correctAnswer: "स्कूल"
      }
    ]
  },
  {
    id: 3,
    title: "Budugu's Parrot",
    hindiTitle: "बुडुगु का तोता",
    passage: [
      "बुडुगु के पास एक तोता है।",
      "तोता बुडुगु का पालतू पक्षी है।",
      "तोते का रंग हरा है।",
      "इसकी चोंच का रंग लाल है।",
      "बुडुगु रोज़ अपने तोते के साथ खेलता है।",
      "बुडुगु तोते को आम खिलाता है।"
    ],
    image: "/characters/parrot.png",
    game1Questions: [
      {
        question: "बुडुगु के पास कौन सा पक्षी है?",
        options: ["तोता", "कौआ", "गौरैया"],
        correctAnswer: "तोता"
      },
      {
        question: "बुडुगु का तोता किस रंग का है?",
        options: ["हरा", "नीला", "लाल"],
        correctAnswer: "हरा"
      },
      {
        question: "तोते की चोंच किस रंग की है?",
        options: ["लाल", "हरा", "पीला"],
        correctAnswer: "लाल"
      }
    ],
    game2Questions: [
      {
        sentence: "बुडुगु रोज़ अपने तोते के साथ _____।",
        blank: "_____",
        options: ["खेलता है", "गाता है", "खाता है"],
        correctAnswer: "खेलता है"
      },
      {
        sentence: "तोता बुडुगु के लिए _____ है।",
        blank: "_____",
        options: ["पालतू पक्षी", "जंगली पक्षी"],
        correctAnswer: "पालतू पक्षी"
      },
      {
        sentence: "बुडुगु तोते को _____ खिलाता है।",
        blank: "_____",
        options: ["आम", "केला"],
        correctAnswer: "आम"
      },
      {
        sentence: "तोते का रंग _____ है।",
        blank: "_____",
        options: ["हरा", "नीला"],
        correctAnswer: "हरा"
      },
      {
        sentence: "तोते की चोंच _____ है।",
        blank: "_____",
        options: ["लाल", "हरा"],
        correctAnswer: "लाल"
      }
    ]
  },
  {
    id: 4,
    title: "The Cow",
    hindiTitle: "गाय",
    passage: [
      "यह एक गाय है।",
      "इसके चार पैर और एक पूँछ है।",
      "इस गाय पर काले धब्बे हैं।",
      "गाय घास खाती है।",
      "गाय दूध देती है।"
    ],
    image: "/characters/cow.png",
    game1Questions: [
      {
        question: "गाय के कितने पैर होते हैं?",
        options: ["4", "3", "2"],
        correctAnswer: "4"
      },
      {
        question: "गाय क्या खाती है?",
        options: ["घास", "नूडल्स", "चावल"],
        correctAnswer: "घास"
      },
      {
        question: "गाय पर धब्बे किस रंग के हैं?",
        options: ["काले", "हरे", "लाल"],
        correctAnswer: "काले"
      }
    ],
    game2Questions: [
      {
        sentence: "गाय _____ खाकर _____ देती है।",
        blank: "_____ खाकर _____",
        options: ["घास", "दूध"],
        correctAnswer: "घास दूध"
      },
      {
        sentence: "गाय के _____ पैर होते हैं।",
        blank: "_____",
        options: ["चार", "तीन"],
        correctAnswer: "चार"
      },
      {
        sentence: "गाय की _____ पूँछ होती है।",
        blank: "_____",
        options: ["एक", "दो"],
        correctAnswer: "एक"
      }
    ]
  },
  {
    id: 5,
    title: "Ramu in the Park",
    hindiTitle: "पार्क में रामू - कुत्ता",
    passage: [
      "रामू पार्क में दौड़ रहा है।",
      "रामू ने पार्क में एक कुत्ता देखा।",
      "कुत्ता भौंका, फिर भी रामू नहीं डरा।",
      "कुत्ते को देखकर वह खुश हुआ।",
      "कुत्ता भी रामू को देखकर खुश हुआ।",
      "रामू ने कुत्ते के साथ खेला।"
    ],
    image: "/characters/boy1.png",
    game1Questions: [
      {
        question: "रामू पार्क में _____।",
        options: ["दौड़ रहा है", "नाच रहा है", "गा रहा है"],
        correctAnswer: "दौड़ रहा है"
      },
      {
        question: "रामू ने क्या देखा?",
        options: ["कुत्ता", "भैंस", "गौरैया"],
        correctAnswer: "कुत्ता"
      },
      {
        question: "कुत्ते को देखकर रामू ने क्या किया?",
        options: ["खुश हुआ", "डर गया", "भाग गया"],
        correctAnswer: "खुश हुआ"
      }
    ],
    game2Questions: [
      {
        sentence: "रामू पार्क में _____।",
        blank: "_____",
        options: ["दौड़ रहा है", "नाच रहा है", "गा रहा है"],
        correctAnswer: "दौड़ रहा है"
      },
      {
        sentence: "रामू ने _____ देखा।",
        blank: "_____",
        options: ["भैंस", "कुत्ता", "गौरैया"],
        correctAnswer: "कुत्ता"
      },
      {
        sentence: "_____ भौंका।",
        blank: "_____",
        options: ["कुत्ता", "गौरैया", "बिल्ली"],
        correctAnswer: "कुत्ता"
      }
    ]
  }
]

export function getLessonById(id: number): ComprehensionLesson | undefined {
  return comprehensionLessons.find(lesson => lesson.id === id)
}
