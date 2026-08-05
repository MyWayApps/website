// Hindi Letters Data - Vowels (स्वर) and Consonants (व्यंजन)

export type LetterType = "vowels" | "consonants" | "all"

export interface HindiLetter {
  letter: string
  word: string
}

export const hindiVowels: HindiLetter[] = [
  { letter: "अ", word: "अनार (Pomegranate)" },
  { letter: "आ", word: "आम (Mango)" },
  { letter: "इ", word: "इमली (Tamarind)" },
  { letter: "ई", word: "ईख (Sugarcane)" },
  { letter: "उ", word: "उल्लू (Owl)" },
  { letter: "ऊ", word: "ऊँट (Camel)" },
  { letter: "ए", word: "एड़ी (Heel)" },
  { letter: "ऐ", word: "ऐनक (Spectacles)" },
  { letter: "ओ", word: "ओखली (Mortar)" },
  { letter: "औ", word: "औजार (Tool)" },
  { letter: "अं", word: "अंगूर (Grape)" },
  { letter: "अः", word: "अःकार" },
]

export const hindiConsonants: HindiLetter[] = [
  { letter: "क", word: "कमल (Lotus)" },
  { letter: "ख", word: "खरगोश (Rabbit)" },
  { letter: "ग", word: "गाय (Cow)" },
  { letter: "घ", word: "घर (House)" },
  { letter: "ङ", word: "ङकार" },
  { letter: "च", word: "चाँद (Moon)" },
  { letter: "छ", word: "छाता (Umbrella)" },
  { letter: "ज", word: "जहाज (Ship)" },
  { letter: "झ", word: "झील (Lake)" },
  { letter: "ञ", word: "ञकार" },
  { letter: "ट", word: "टमाटर (Tomato)" },
  { letter: "ठ", word: "ठंड (Cold)" },
  { letter: "ड", word: "डमरू (Drum)" },
  { letter: "ढ", word: "ढोल (Dhol)" },
  { letter: "ण", word: "णकार" },
  { letter: "त", word: "तरबूज (Watermelon)" },
  { letter: "थ", word: "थाली (Plate)" },
  { letter: "द", word: "दरवाजा (Door)" },
  { letter: "ध", word: "धनुष (Bow)" },
  { letter: "न", word: "नल (Tap)" },
  { letter: "प", word: "पतंग (Kite)" },
  { letter: "फ", word: "फूल (Flower)" },
  { letter: "ब", word: "बकरी (Goat)" },
  { letter: "भ", word: "भालू (Bear)" },
  { letter: "म", word: "मछली (Fish)" },
  { letter: "य", word: "यज्ञ (Yajna)" },
  { letter: "र", word: "रथ (Chariot)" },
  { letter: "ल", word: "लड्डू (Laddu)" },
  { letter: "व", word: "वन (Forest)" },
  { letter: "श", word: "शेर (Lion)" },
  { letter: "ष", word: "षट्कोण (Hexagon)" },
  { letter: "स", word: "सूरज (Sun)" },
  { letter: "ह", word: "हाथी (Elephant)" },
]

export const allHindiLetters: HindiLetter[] = [...hindiVowels, ...hindiConsonants]

export function getLettersByType(type: LetterType): HindiLetter[] {
  switch (type) {
    case "vowels":
      return hindiVowels
    case "consonants":
      return hindiConsonants
    case "all":
    default:
      return allHindiLetters
  }
}

export function getLetterTypeLabel(type: LetterType): { native: string; english: string } {
  switch (type) {
    case "vowels":
      return { native: "स्वर", english: "Vowels" }
    case "consonants":
      return { native: "व्यंजन", english: "Consonants" }
    case "all":
    default:
      return { native: "सभी अक्षर", english: "All Letters" }
  }
}
