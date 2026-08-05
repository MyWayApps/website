// Sanskrit Letters Data - Vowels (स्वराः) and Consonants (व्यञ्जनानि)
// Sanskrit shares the Devanagari script with Hindi, so the letterforms here
// mirror lib/hindi-letters-data.ts — only the framing/labels are Sanskrit.
// No native TTS voice exists for Sanskrit; pronunciation is spoken via
// lib/sanskrit-tts.ts's Kannada-transliteration pipeline (see the game page).

export type LetterType = "vowels" | "consonants" | "all"

export interface SanskritLetter {
  letter: string
  word: string
}

export const sanskritVowels: SanskritLetter[] = [
  { letter: "अ", word: "अश्वः (Horse)" },
  { letter: "आ", word: "आम्रः (Mango)" },
  { letter: "इ", word: "इक्षुः (Sugarcane)" },
  { letter: "ई", word: "ईशः (Lord)" },
  { letter: "उ", word: "उलूकः (Owl)" },
  { letter: "ऊ", word: "ऊर्मिः (Wave)" },
  { letter: "ऋ", word: "ऋषिः (Sage)" },
  { letter: "ए", word: "एकः (One)" },
  { letter: "ऐ", word: "ऐरावतः (Airavata)" },
  { letter: "ओ", word: "ओम् (Om)" },
  { letter: "औ", word: "औषधम् (Medicine)" },
  { letter: "अं", word: "अंशुः (Ray)" },
  { letter: "अः", word: "दुःखम् (Sorrow)" },
]

export const sanskritConsonants: SanskritLetter[] = [
  { letter: "क", word: "कमलम् (Lotus)" },
  { letter: "ख", word: "खगः (Bird)" },
  { letter: "ग", word: "गजः (Elephant)" },
  { letter: "घ", word: "घण्टा (Bell)" },
  { letter: "ङ", word: "ङकारः" },
  { letter: "च", word: "चन्द्रः (Moon)" },
  { letter: "छ", word: "छत्रम् (Umbrella)" },
  { letter: "ज", word: "जलम् (Water)" },
  { letter: "झ", word: "झरी (Stream)" },
  { letter: "ञ", word: "ञकारः" },
  { letter: "ट", word: "टिट्टिभः (Plover)" },
  { letter: "ठ", word: "ठकारः" },
  { letter: "ड", word: "डमरुः (Drum)" },
  { letter: "ढ", word: "ढक्का (Drum)" },
  { letter: "ण", word: "णकारः" },
  { letter: "त", word: "तरुः (Tree)" },
  { letter: "थ", word: "स्थाली (Vessel)" },
  { letter: "द", word: "दीपः (Lamp)" },
  { letter: "ध", word: "धनुः (Bow)" },
  { letter: "न", word: "नदी (River)" },
  { letter: "प", word: "पुष्पम् (Flower)" },
  { letter: "फ", word: "फलम् (Fruit)" },
  { letter: "ब", word: "बलम् (Strength)" },
  { letter: "भ", word: "भूमिः (Earth)" },
  { letter: "म", word: "मीनः (Fish)" },
  { letter: "य", word: "यज्ञः (Sacrifice)" },
  { letter: "र", word: "रथः (Chariot)" },
  { letter: "ल", word: "लता (Vine)" },
  { letter: "व", word: "वनम् (Forest)" },
  { letter: "श", word: "शशकः (Rabbit)" },
  { letter: "ष", word: "षट् (Six)" },
  { letter: "स", word: "सूर्यः (Sun)" },
  { letter: "ह", word: "हंसः (Swan)" },
]

export const allSanskritLetters: SanskritLetter[] = [...sanskritVowels, ...sanskritConsonants]

export function getLettersByType(type: LetterType): SanskritLetter[] {
  switch (type) {
    case "vowels":
      return sanskritVowels
    case "consonants":
      return sanskritConsonants
    case "all":
    default:
      return allSanskritLetters
  }
}

export function getLetterTypeLabel(type: LetterType): { native: string; english: string } {
  switch (type) {
    case "vowels":
      return { native: "स्वराः", english: "Vowels" }
    case "consonants":
      return { native: "व्यञ्जनानि", english: "Consonants" }
    case "all":
    default:
      return { native: "सर्वाणि अक्षराणि", english: "All Letters" }
  }
}
