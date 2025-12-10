export interface TeluguRiddle {
  id: number
  podupu: string
  vidupu: string
  englishAnswer: string
  reason: string
}

export const teluguRiddles: TeluguRiddle[] = [
  {
    id: 1,
    podupu: "కిట కిట తలుపులు, కిటారి తలుపులు, ఎప్పుడు తీసినా చప్పుడు కావు, ఏమిటవి?",
    vidupu: "కనురెప్పలు",
    englishAnswer: "Eyelids",
    reason: "Eyelids open and close silently like doors."
  },
  {
    id: 2,
    podupu: "అమ్మ అంటే కలుస్తాయి, నాన్న అంటే కలవవు.",
    vidupu: "పెదవులు",
    englishAnswer: "Lips",
    reason: "When you say 'Amma', your lips touch. When you say 'Nanna', they don't."
  },
  {
    id: 3,
    podupu: "తెల్లని పొలంలో నల్లని విత్తనాలు, చేతితో ఏరుకోవాలి గానీ నోటితో తినలేము.",
    vidupu: "అక్షరాలు / పుస్తకం",
    englishAnswer: "Letters / Book",
    reason: "White paper is the field, black letters are the seeds."
  },
  {
    id: 4,
    podupu: "కాళ్ళు లేవు గానీ నడుస్తుంది.",
    vidupu: "గడియారం",
    englishAnswer: "Clock",
    reason: "It has no legs but it 'runs/walks'."
  },
  {
    id: 5,
    podupu: "ఆకాశంలో అరటికాయ, కోసుకోవడానికి వీలులేదు.",
    vidupu: "చందమామ",
    englishAnswer: "Moon",
    reason: "The crescent moon looks like a banana in the sky."
  },
  {
    id: 6,
    podupu: "ఊరు ఉంది జనం లేరు, ఏరు ఉంది నీరు లేదు.",
    vidupu: "మ్యాపు",
    englishAnswer: "Map",
    reason: "Maps show towns and rivers but have no people or water."
  },
  {
    id: 7,
    podupu: "మూడు కళ్ళు ఉంటాయి గానీ శివుడు కాదు, జుట్టు ఉంటుంది గానీ ఆడది కాదు.",
    vidupu: "కొబ్బరికాయ",
    englishAnswer: "Coconut",
    reason: "It has three 'eyes' and fiber 'hair'."
  },
  {
    id: 8,
    podupu: "కిటకిట తలుపులు, కిటారి తలుపులు, ఎప్పుడు తెరిచినా చప్పుడు కావు.",
    vidupu: "కనురెప్పలు",
    englishAnswer: "Eyelids",
    reason: "Eyelids open and close silently like doors."
  },
  {
    id: 9,
    podupu: "అడవిలో పుట్టింది, అడవిలో పెరిగింది, మా ఇంటికి వచ్చింది, తైతక్కలాడింది.",
    vidupu: "కవ్వం",
    englishAnswer: "Churning rod",
    reason: "Made of wood (forest), used in the house to churn curd (dance)."
  },
  {
    id: 10,
    podupu: "ఇంటి వెనుక మర్రి చెట్టు, ఎంత మంది ఎక్కినా విరగదు.",
    vidupu: "నీడ",
    englishAnswer: "Shadow",
    reason: "A shadow lies on the ground and cannot be broken by stepping on it."
  },
  {
    id: 11,
    podupu: "పొట్టలో వేలు, నెత్తి మీద రాయి.",
    vidupu: "ఉంగరం",
    englishAnswer: "Ring",
    reason: "The finger goes inside the ring (belly), and the stone sits on top (head)."
  }
]

// Function to get random riddles
export function getRandomRiddles(count: number = 10): TeluguRiddle[] {
  const shuffled = [...teluguRiddles].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Function to get wrong answers for multiple choice
export function getWrongAnswers(correctRiddle: TeluguRiddle, allRiddles: TeluguRiddle[], count: number = 2): string[] {
  const wrongAnswers = allRiddles
    .filter(r => r.id !== correctRiddle.id)
    .map(r => r.vidupu)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
  
  return wrongAnswers
}

