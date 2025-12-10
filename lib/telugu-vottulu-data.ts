/**
 * Telugu Vottulu (Subscripts) Data
 */

export type VottuluCategory = "different-shapes" | "remove-talakattu" | "same-shape"

export interface VottuluItem {
  letter: string
  vottu: string
  description: string
}

export interface VottuluCategoryData {
  id: VottuluCategory
  telugu: string
  english: string
  items: VottuluItem[]
}

// Category 1: రూప భేదములతో వచ్చే వత్తులు
const differentShapes: VottuluItem[] = [
  { letter: "క", vottu: "్క", description: "'క' వత్తు" },
  { letter: "త", vottu: "్త", description: "'త' వత్తు" },
  { letter: "న", vottu: "్న", description: "'న' వత్తు" },
  { letter: "మ", vottu: "్మ", description: "'మ' వత్తు" },
  { letter: "య", vottu: "్య", description: "'య' వత్తు" },
  { letter: "ర", vottu: "్ర", description: "'ర' వత్తు (క్రావడి)" },
  { letter: "ల", vottu: "్ల", description: "'ల' వత్తు" },
  { letter: "వ", vottu: "్వ", description: "'వ' వత్తు" },
  { letter: "న", vottu: "న్", description: "నకార పొల్లు" },
]

// Category 2: తలకట్టు తొలగిస్తే వచ్చే వత్తులు
const removeTalakattu: VottuluItem[] = [
  { letter: "గ", vottu: "్గ", description: "'గ' వత్తు" },
  { letter: "ఘ", vottu: "్ఘ", description: "'ఘ' వత్తు" },
  { letter: "చ", vottu: "్చ", description: "'చ' వత్తు" },
  { letter: "ఝ", vottu: "్ఝ", description: "'ఝ' వత్తు" },
  { letter: "ట", vottu: "్ట", description: "'ట' వత్తు" },
  { letter: "ఠ", vottu: "్ఠ", description: "'ఠ' వత్తు" },
  { letter: "డ", vottu: "్డ", description: "'డ' వత్తు" },
  { letter: "ఢ", vottu: "్ఢ", description: "'ఢ' వత్తు" },
  { letter: "ప", vottu: "్ప", description: "'ప' వత్తు" },
  { letter: "ఫ", vottu: "్ఫ", description: "'ఫ' వత్తు" },
  { letter: "బ", vottu: "్బ", description: "'బ' వత్తు" },
  { letter: "భ", vottu: "్భ", description: "'భ' వత్తు" },
  { letter: "శ", vottu: "్శ", description: "'శ' వత్తు" },
  { letter: "స", vottu: "్స", description: "'స' వత్తు" },
  { letter: "ళ", vottu: "్ళ", description: "'ళ' వత్తు" },
  { letter: "హ", vottu: "్హ", description: "'హ' వత్తు" },
]

// Category 3: అక్షరములు మార్పులు లేకుండా వచ్చే వత్తులు
const sameShape: VottuluItem[] = [
  { letter: "ఖ", vottu: "ఖ", description: "ఖ వత్తు" },
  { letter: "ఙ", vottu: "ఙ", description: "ఙ వత్తు" },
  { letter: "జ", vottu: "జ", description: "జ వత్తు" },
  { letter: "ఞ", vottu: "ఞ", description: "ఞ వత్తు" },
  { letter: "ణ", vottu: "ణ", description: "ణ వత్తు" },
  { letter: "ఱ", vottu: "ఱ", description: "ఱ వత్తు" },
]

export const vottuluCategories: VottuluCategoryData[] = [
  {
    id: "different-shapes",
    telugu: "రూప భేదములతో వచ్చే వత్తులు",
    english: "Consonants whose subscripts have completely different shapes",
    items: differentShapes,
  },
  {
    id: "remove-talakattu",
    telugu: "తలకట్టు తొలగిస్తే వచ్చే వత్తులు",
    english: "Consonants whose subscripts form by removing the top checkmark/talakattu",
    items: removeTalakattu,
  },
  {
    id: "same-shape",
    telugu: "అక్షరములు మార్పులు లేకుండా వచ్చే వత్తులు",
    english: "Consonants whose subscripts look exactly like the letter",
    items: sameShape,
  },
]

export function getVottuluByCategory(category: VottuluCategory): VottuluItem[] {
  const categoryData = vottuluCategories.find(cat => cat.id === category)
  return categoryData ? categoryData.items : []
}

export function getCategoryLabel(category: VottuluCategory): { telugu: string; english: string } {
  const categoryData = vottuluCategories.find(cat => cat.id === category)
  return categoryData 
    ? { telugu: categoryData.telugu, english: categoryData.english }
    : { telugu: "", english: "" }
}

// Words with Vottulu data

// Category 1: ద్విత్వములతో మాటలు (Words with double consonants)
export const doubleConsonantWords: string[] = [
  "అక్క", "కన్ను", "చల్ల", "నిమ్మ", "బిడ్డ",
  "అగ్గి", "కిట్టి", "చిల్లు", "నువ్వు", "బస్సు",
  "అత్త", "కుర్ర", "చెక్క", "నెయ్యి", "బెట్టు",
  "అమ్మ", "కొప్పు", "చొప్ప", "నక్కు", "బొగ్గు",
  "అవ్వ", "కొమ్ము", "జున్ను", "నొప్పి", "బొజ్జ",
  "ఇల్లు", "కొయ్య", "జెర్రి", "పడ్డు", "మట్టి",
  "ఉట్టి", "గిల్లి", "డబ్బు", "పచ్చ", "ముక్కు",
  "ఉల్లి", "గుర్ర", "బొర్ర", "పిచ్చి", "లడ్డు",
  "ఎర్ర", "గువ్వ", "డొల్ల", "పిల్లి", "వెట్టి",
  "ఒడ్డు", "గెడ్డ", "దిక్కు", "పువ్వు",
  "కత్తి", "గొప్ప", "నక్క", "పెళ్ళి",
]

// Category 2: ఒక హల్లుతో మరొక హల్లు (One consonant combined with another - Conjuncts)
export const conjunctWords: string[] = [
  "అర్క", "ఖర్చు", "జ్యోతి", "దుర్గ", "మంత్రి", "శుద్ధి",
  "ఇంద్ర", "గార్గీ", "టర్కీ", "ధాత్రి", "యజ్ఞ", "శుద్ధి",
  "ఉర్మి", "చర్చ", "తండ్రి", "నిద్ర", "యుక్తి", "షష్ఠి",
  "ఊర్వ", "చక్ర", "త్యజ", "నిష్ఠ", "రుక్మి", "స్వస్తి",
  "కీర్తి", "ఛత్రి", "దర్గ", "పెండ్లి", "లగ్న", "హ్రస్వ",
  "కృష్ణ", "జడ్జి", "దర్జి", "భర్త", "వర్ష",
  "చక్ర", "జ్వాల", "దృష్టి", "భార్య", "వృక్ష",
]

// Category 3: ఒక హల్లు - రెండు వత్తులు (One consonant with two subscripts)
export const twoSubscriptsWords: string[] = [
  "జ్యోత్స్న", "రాష్ట్రపతి", "ప్రాశస్త్యము", "అర్ఘ్యము",
  "లక్ష్మయ్య", "ధృతరాష్ట్రుడు", "వస్త్రము", "వైశిష్ట్యము",
  "స్త్రీ", "స్వాతంత్ర్యము",
]

export type WordCategory = "double-consonant" | "conjunct" | "two-subscripts"

export interface WordCategoryData {
  id: WordCategory
  telugu: string
  english: string
  words: string[]
}

export const wordCategories: WordCategoryData[] = [
  {
    id: "double-consonant",
    telugu: "ద్విత్వములతో మాటలు",
    english: "Words with double consonants",
    words: doubleConsonantWords,
  },
  {
    id: "conjunct",
    telugu: "ఒక హల్లుతో మరొక హల్లు",
    english: "One consonant combined with another - Conjuncts",
    words: conjunctWords,
  },
  {
    id: "two-subscripts",
    telugu: "ఒక హల్లు - రెండు వత్తులు",
    english: "One consonant with two subscripts",
    words: twoSubscriptsWords,
  },
]

export function getWordsByCategory(category: WordCategory): string[] {
  const categoryData = wordCategories.find(cat => cat.id === category)
  return categoryData ? categoryData.words : []
}

export function getWordCategoryLabel(category: WordCategory): { telugu: string; english: string } {
  const categoryData = wordCategories.find(cat => cat.id === category)
  return categoryData 
    ? { telugu: categoryData.telugu, english: categoryData.english }
    : { telugu: "", english: "" }
}

