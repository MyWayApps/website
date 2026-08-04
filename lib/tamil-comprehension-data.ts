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
  tamilTitle: string
  passage: string[]
  image: string
  game1Questions: ComprehensionQuestion[]
  game2Questions: FillInBlankQuestion[]
}

export const comprehensionLessons: ComprehensionLesson[] = [
  {
    id: 1,
    title: "The Cat",
    tamilTitle: "பூனை",
    passage: [
      "இது ஒரு பூனை.",
      "இந்தப் பூனை பழுப்பு நிறத்தில் உள்ளது.",
      "இது சிவப்புத் தரைவிரிப்பின் மேல் உள்ளது.",
      "இது சுகமாகத் தூங்குகிறது.",
      "இதை எழுப்பி ஒன்றாக மகிழ்ச்சியாக விளையாடுவோம்."
    ],
    image: "/characters/cat.png",
    game1Questions: [
      {
        question: "பூனையின் நிறம் என்ன?",
        options: ["பழுப்பு", "கருப்பு", "வெள்ளை"],
        correctAnswer: "பழுப்பு"
      },
      {
        question: "பூனை என்ன செய்கிறது?",
        options: ["தூங்குகிறது", "சாப்பிடுகிறது", "விளையாடுகிறது"],
        correctAnswer: "தூங்குகிறது"
      },
      {
        question: "பூனை எங்கே தூங்குகிறது?",
        options: ["சிவப்புத் தரைவிரிப்பின் மேல்", "படுக்கையின் மேல்", "தரையில்"],
        correctAnswer: "சிவப்புத் தரைவிரிப்பின் மேல்"
      }
    ],
    game2Questions: [
      {
        sentence: "பூனை _____ நிறத்தில் உள்ளது.",
        blank: "_____",
        options: ["பழுப்பு", "சிவப்பு"],
        correctAnswer: "பழுப்பு"
      },
      {
        sentence: "தரைவிரிப்பு _____ நிறத்தில் உள்ளது.",
        blank: "_____",
        options: ["பழுப்பு", "சிவப்பு"],
        correctAnswer: "சிவப்பு"
      }
    ]
  },
  {
    id: 2,
    title: "Seetha",
    tamilTitle: "சீதா",
    passage: [
      "இந்தப் பெண்ணின் பெயர் சீதா.",
      "சீதாவின் வயது ஐந்து ஆண்டுகள்.",
      "சீதா பள்ளிக்குச் செல்கிறாள்.",
      "சீதா தன் சடையில் பூக்களை வைத்துக்கொள்கிறாள்.",
      "சீதாவுக்குப் பாடுவது மிகவும் பிடிக்கும்."
    ],
    image: "/characters/girl1.png",
    game1Questions: [
      {
        question: "சீதாவின் வயது எவ்வளவு?",
        options: ["ஐந்து ஆண்டுகள்", "ஆறு ஆண்டுகள்", "ஏழு ஆண்டுகள்"],
        correctAnswer: "ஐந்து ஆண்டுகள்"
      },
      {
        question: "சீதாவுக்குப் பாடுவது பிடிக்குமா இல்லையா?",
        options: ["பிடிக்கும்", "பிடிக்காது", "சில நேரங்களில்"],
        correctAnswer: "பிடிக்கும்"
      },
      {
        question: "சீதா ஒரு பெண்ணா அல்லது ஒரு ஆணா?",
        options: ["பெண்", "ஆண்", "இரண்டும் இல்லை"],
        correctAnswer: "பெண்"
      }
    ],
    game2Questions: [
      {
        sentence: "சீதாவுக்கு _____ பிடிக்கும்.",
        blank: "_____",
        options: ["பனிச்சறுக்கு", "பாடுவது"],
        correctAnswer: "பாடுவது"
      },
      {
        sentence: "சீதாவின் வயது _____ ஆண்டுகள்.",
        blank: "_____",
        options: ["7", "5"],
        correctAnswer: "5"
      },
      {
        sentence: "சீதா தன் சடையில் _____ வைத்துக்கொண்டாள்.",
        blank: "_____",
        options: ["காகிதம்", "பூக்கள்"],
        correctAnswer: "பூக்கள்"
      },
      {
        sentence: "சீதா _____ செல்கிறாள்.",
        blank: "_____",
        options: ["பள்ளிக்கு", "அலுவலகத்திற்கு"],
        correctAnswer: "பள்ளிக்கு"
      }
    ]
  },
  {
    id: 3,
    title: "Budugu's Parrot",
    tamilTitle: "புடுகுவின் கிளி",
    passage: [
      "புடுகுவிடம் ஒரு கிளி உள்ளது.",
      "கிளி புடுகுவின் செல்லப் பறவை.",
      "கிளியின் நிறம் பச்சை.",
      "அதன் அலகின் நிறம் சிவப்பு.",
      "புடுகு தினமும் தன் கிளியுடன் விளையாடுவான்.",
      "புடுகு கிளிக்கு மாம்பழம் கொடுப்பான்."
    ],
    image: "/characters/parrot.png",
    game1Questions: [
      {
        question: "புடுகுவிடம் என்ன பறவை உள்ளது?",
        options: ["கிளி", "காகம்", "சிட்டுக்குருவி"],
        correctAnswer: "கிளி"
      },
      {
        question: "புடுகுவின் கிளி என்ன நிறத்தில் உள்ளது?",
        options: ["பச்சை", "நீலம்", "சிவப்பு"],
        correctAnswer: "பச்சை"
      },
      {
        question: "கிளியின் அலகு என்ன நிறம்?",
        options: ["சிவப்பு", "பச்சை", "மஞ்சள்"],
        correctAnswer: "சிவப்பு"
      }
    ],
    game2Questions: [
      {
        sentence: "புடுகு தினமும் தன் கிளியுடன் _____.",
        blank: "_____",
        options: ["விளையாடுவான்", "பாடுவான்", "சாப்பிடுவான்"],
        correctAnswer: "விளையாடுவான்"
      },
      {
        sentence: "கிளி புடுகுவுக்கு _____.",
        blank: "_____",
        options: ["செல்லப் பறவை", "காட்டுப் பறவை"],
        correctAnswer: "செல்லப் பறவை"
      },
      {
        sentence: "புடுகு கிளிக்கு _____ கொடுப்பான்.",
        blank: "_____",
        options: ["மாம்பழம்", "வாழைப்பழம்"],
        correctAnswer: "மாம்பழம்"
      },
      {
        sentence: "கிளியின் நிறம் _____.",
        blank: "_____",
        options: ["பச்சை", "நீலம்"],
        correctAnswer: "பச்சை"
      },
      {
        sentence: "கிளியின் அலகு _____.",
        blank: "_____",
        options: ["சிவப்பு", "பச்சை"],
        correctAnswer: "சிவப்பு"
      }
    ]
  },
  {
    id: 4,
    title: "The Cow",
    tamilTitle: "பசு",
    passage: [
      "இது ஒரு பசு.",
      "இதற்கு நான்கு கால்களும் ஒரு வாலும் உள்ளன.",
      "இந்தப் பசுவின் மேல் கருப்புப் புள்ளிகள் உள்ளன.",
      "பசு புல் தின்கிறது.",
      "பசு பால் தருகிறது."
    ],
    image: "/characters/cow.png",
    game1Questions: [
      {
        question: "பசுவுக்கு எத்தனை கால்கள் உள்ளன?",
        options: ["4", "3", "2"],
        correctAnswer: "4"
      },
      {
        question: "பசு என்ன தின்கிறது?",
        options: ["புல்", "நூடுல்ஸ்", "அரிசி"],
        correctAnswer: "புல்"
      },
      {
        question: "பசுவின் மேல் உள்ள புள்ளிகள் என்ன நிறம்?",
        options: ["கருப்பு", "பச்சை", "சிவப்பு"],
        correctAnswer: "கருப்பு"
      }
    ],
    game2Questions: [
      {
        sentence: "பசு _____ தின்று _____ தருகிறது.",
        blank: "_____ தின்று _____",
        options: ["புல்", "பால்"],
        correctAnswer: "புல் பால்"
      },
      {
        sentence: "பசுவுக்கு _____ கால்கள்.",
        blank: "_____",
        options: ["நான்கு", "மூன்று"],
        correctAnswer: "நான்கு"
      },
      {
        sentence: "பசுவுக்கு _____ வால்.",
        blank: "_____",
        options: ["ஒரு", "இரண்டு"],
        correctAnswer: "ஒரு"
      }
    ]
  },
  {
    id: 5,
    title: "Ramu in the Park",
    tamilTitle: "பூங்காவில் ராமு - நாய்",
    passage: [
      "ராமு பூங்காவில் ஓடுகிறான்.",
      "ராமு பூங்காவில் ஒரு நாயைப் பார்த்தான்.",
      "நாய் குரைத்தது, ஆனாலும் ராமு பயப்படவில்லை.",
      "நாயைப் பார்த்து அவன் மகிழ்ச்சியடைந்தான்.",
      "நாயும் ராமுவைப் பார்த்து மகிழ்ச்சியடைந்தது.",
      "ராமு நாயுடன் விளையாடினான்."
    ],
    image: "/characters/boy1.png",
    game1Questions: [
      {
        question: "ராமு பூங்காவில் _____.",
        options: ["ஓடுகிறான்", "நடனமாடுகிறான்", "பாடுகிறான்"],
        correctAnswer: "ஓடுகிறான்"
      },
      {
        question: "ராமு என்ன பார்த்தான்?",
        options: ["நாய்", "எருமை", "சிட்டுக்குருவி"],
        correctAnswer: "நாய்"
      },
      {
        question: "நாயைப் பார்த்து ராமு என்ன செய்தான்?",
        options: ["மகிழ்ச்சியடைந்தான்", "பயந்தான்", "ஓடிப்போனான்"],
        correctAnswer: "மகிழ்ச்சியடைந்தான்"
      }
    ],
    game2Questions: [
      {
        sentence: "ராமு பூங்காவில் _____.",
        blank: "_____",
        options: ["ஓடுகிறான்", "நடனமாடுகிறான்", "பாடுகிறான்"],
        correctAnswer: "ஓடுகிறான்"
      },
      {
        sentence: "ராமு _____ பார்த்தான்.",
        blank: "_____",
        options: ["எருமை", "நாய்", "சிட்டுக்குருவி"],
        correctAnswer: "நாய்"
      },
      {
        sentence: "_____ குரைத்தது.",
        blank: "_____",
        options: ["நாய்", "சிட்டுக்குருவி", "பூனை"],
        correctAnswer: "நாய்"
      }
    ]
  }
]

export function getLessonById(id: number): ComprehensionLesson | undefined {
  return comprehensionLessons.find(lesson => lesson.id === id)
}
