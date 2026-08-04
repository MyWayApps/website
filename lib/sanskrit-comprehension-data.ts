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
  sanskritTitle: string
  passage: string[]
  image: string
  game1Questions: ComprehensionQuestion[]
  game2Questions: FillInBlankQuestion[]
}

export const comprehensionLessons: ComprehensionLesson[] = [
  {
    id: 1,
    title: "The Cat",
    sanskritTitle: "मार्जारः",
    passage: [
      "एषः एकः मार्जारः अस्ति।",
      "अयं मार्जारः कपिशवर्णः अस्ति।",
      "अयं रक्तवर्णे आस्तरणे अस्ति।",
      "अयं सुखेन स्वपिति।",
      "एनं जागरयित्वा सह आनन्देन क्रीडामः।"
    ],
    image: "/characters/cat.png",
    game1Questions: [
      {
        question: "मार्जारस्य वर्णः कः?",
        options: ["कपिशः", "कृष्णः", "श्वेतः"],
        correctAnswer: "कपिशः"
      },
      {
        question: "मार्जारः किं करोति?",
        options: ["स्वपिति", "खादति", "क्रीडति"],
        correctAnswer: "स्वपिति"
      },
      {
        question: "मार्जारः कुत्र स्वपिति?",
        options: ["रक्तवर्णे आस्तरणे", "शय्यायाम्", "भूमौ"],
        correctAnswer: "रक्तवर्णे आस्तरणे"
      }
    ],
    game2Questions: [
      {
        sentence: "मार्जारः _____ वर्णः अस्ति।",
        blank: "_____",
        options: ["कपिशः", "रक्तः"],
        correctAnswer: "कपिशः"
      },
      {
        sentence: "आस्तरणं _____ वर्णम् अस्ति।",
        blank: "_____",
        options: ["कपिशम्", "रक्तम्"],
        correctAnswer: "रक्तम्"
      }
    ]
  },
  {
    id: 2,
    title: "Seetha",
    sanskritTitle: "सीता",
    passage: [
      "एतस्याः बालिकायाः नाम सीता अस्ति।",
      "सीतायाः वयः पञ्च वर्षाणि।",
      "सीता पाठशालां गच्छति।",
      "सीता स्वकेशेषु पुष्पाणि धारयति।",
      "सीतायै गानं अतीव रोचते।"
    ],
    image: "/characters/girl1.png",
    game1Questions: [
      {
        question: "सीतायाः वयः कति?",
        options: ["पञ्च वर्षाणि", "षट् वर्षाणि", "सप्त वर्षाणि"],
        correctAnswer: "पञ्च वर्षाणि"
      },
      {
        question: "सीतायै गानं रोचते वा न वा?",
        options: ["रोचते", "न रोचते", "कदाचित्"],
        correctAnswer: "रोचते"
      },
      {
        question: "सीता बालिका वा बालकः वा?",
        options: ["बालिका", "बालकः", "उभयं न"],
        correctAnswer: "बालिका"
      }
    ],
    game2Questions: [
      {
        sentence: "सीतायै _____ रोचते।",
        blank: "_____",
        options: ["हिमक्रीडा", "गानम्"],
        correctAnswer: "गानम्"
      },
      {
        sentence: "सीतायाः वयः _____ वर्षाणि।",
        blank: "_____",
        options: ["7", "5"],
        correctAnswer: "5"
      },
      {
        sentence: "सीता स्वकेशेषु _____ धारयति।",
        blank: "_____",
        options: ["पत्राणि", "पुष्पाणि"],
        correctAnswer: "पुष्पाणि"
      },
      {
        sentence: "सीता _____ गच्छति।",
        blank: "_____",
        options: ["पाठशालाम्", "कार्यालयम्"],
        correctAnswer: "पाठशालाम्"
      }
    ]
  },
  {
    id: 3,
    title: "Budugu's Parrot",
    sanskritTitle: "बुडुगुशुकः",
    passage: [
      "बुडुगुस्य समीपे एकः शुकः अस्ति।",
      "शुकः बुडुगुस्य पालितपक्षी अस्ति।",
      "शुकस्य वर्णः हरितः अस्ति।",
      "तस्य चञ्चुवर्णः रक्तः अस्ति।",
      "बुडुगुः प्रतिदिनं स्वशुकेन सह क्रीडति।",
      "बुडुगुः शुकाय आम्राणि ददाति।"
    ],
    image: "/characters/parrot.png",
    game1Questions: [
      {
        question: "बुडुगुस्य समीपे कः पक्षी अस्ति?",
        options: ["शुकः", "काकः", "चटकः"],
        correctAnswer: "शुकः"
      },
      {
        question: "बुडुगुस्य शुकः कस्मिन् वर्णे अस्ति?",
        options: ["हरितः", "नीलः", "रक्तः"],
        correctAnswer: "हरितः"
      },
      {
        question: "शुकस्य चञ्चुः कस्मिन् वर्णे अस्ति?",
        options: ["रक्तः", "हरितः", "पीतः"],
        correctAnswer: "रक्तः"
      }
    ],
    game2Questions: [
      {
        sentence: "बुडुगुः प्रतिदिनं स्वशुकेन सह _____।",
        blank: "_____",
        options: ["क्रीडति", "गायति", "खादति"],
        correctAnswer: "क्रीडति"
      },
      {
        sentence: "शुकः बुडुगुस्य _____ अस्ति।",
        blank: "_____",
        options: ["पालितपक्षी", "वनपक्षी"],
        correctAnswer: "पालितपक्षी"
      },
      {
        sentence: "बुडुगुः शुकाय _____ ददाति।",
        blank: "_____",
        options: ["आम्राणि", "कदलीफलानि"],
        correctAnswer: "आम्राणि"
      },
      {
        sentence: "शुकस्य वर्णः _____।",
        blank: "_____",
        options: ["हरितः", "नीलः"],
        correctAnswer: "हरितः"
      },
      {
        sentence: "शुकस्य चञ्चुः _____।",
        blank: "_____",
        options: ["रक्तः", "हरितः"],
        correctAnswer: "रक्तः"
      }
    ]
  },
  {
    id: 4,
    title: "The Cow",
    sanskritTitle: "गौः",
    passage: [
      "एषा एका गौः अस्ति।",
      "अस्याः चत्वारि पादानि एकं पुच्छं च सन्ति।",
      "अस्याः गोः उपरि कृष्णबिन्दवः सन्ति।",
      "गौः तृणं खादति।",
      "गौः दुग्धं ददाति।"
    ],
    image: "/characters/cow.png",
    game1Questions: [
      {
        question: "गोः कति पादाः सन्ति?",
        options: ["4", "3", "2"],
        correctAnswer: "4"
      },
      {
        question: "गौः किं खादति?",
        options: ["तृणम्", "सूत्रिकाः", "तण्डुलान्"],
        correctAnswer: "तृणम्"
      },
      {
        question: "गोः उपरि बिन्दवः कस्मिन् वर्णे सन्ति?",
        options: ["कृष्णे", "हरिते", "रक्ते"],
        correctAnswer: "कृष्णे"
      }
    ],
    game2Questions: [
      {
        sentence: "गौः _____ खादित्वा _____ ददाति।",
        blank: "_____ खादित्वा _____",
        options: ["तृणम्", "दुग्धम्"],
        correctAnswer: "तृणम् दुग्धम्"
      },
      {
        sentence: "गोः _____ पादाः।",
        blank: "_____",
        options: ["चत्वारः", "त्रयः"],
        correctAnswer: "चत्वारः"
      },
      {
        sentence: "गोः _____ पुच्छम्।",
        blank: "_____",
        options: ["एकम्", "द्वे"],
        correctAnswer: "एकम्"
      }
    ]
  },
  {
    id: 5,
    title: "Ramu in the Park",
    sanskritTitle: "उद्याने रामुः - श्वा",
    passage: [
      "रामुः उद्याने धावति।",
      "रामुः उद्याने एकं श्वानं अपश्यत्।",
      "श्वा भषितवान्, तथापि रामुः न अभयत्।",
      "श्वानं दृष्ट्वा सः प्रसन्नः अभवत्।",
      "श्वा अपि रामुं दृष्ट्वा प्रसन्नः अभवत्।",
      "रामुः श्वाना सह अक्रीडत्।"
    ],
    image: "/characters/boy1.png",
    game1Questions: [
      {
        question: "रामुः उद्याने _____।",
        options: ["धावति", "नृत्यति", "गायति"],
        correctAnswer: "धावति"
      },
      {
        question: "रामुः किम् अपश्यत्?",
        options: ["श्वानम्", "महिषम्", "चटकम्"],
        correctAnswer: "श्वानम्"
      },
      {
        question: "श्वानं दृष्ट्वा रामुः किम् अकरोत्?",
        options: ["प्रसन्नः अभवत्", "अभयत्", "अधावत्"],
        correctAnswer: "प्रसन्नः अभवत्"
      }
    ],
    game2Questions: [
      {
        sentence: "रामुः उद्याने _____।",
        blank: "_____",
        options: ["धावति", "नृत्यति", "गायति"],
        correctAnswer: "धावति"
      },
      {
        sentence: "रामुः _____ अपश्यत्।",
        blank: "_____",
        options: ["महिषम्", "श्वानम्", "चटकम्"],
        correctAnswer: "श्वानम्"
      },
      {
        sentence: "_____ अभषत्।",
        blank: "_____",
        options: ["श्वा", "चटकः", "मार्जारः"],
        correctAnswer: "श्वा"
      }
    ]
  }
]

export function getLessonById(id: number): ComprehensionLesson | undefined {
  return comprehensionLessons.find(lesson => lesson.id === id)
}
