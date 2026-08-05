// Tamil Letters Data - Vowels (உயிர் எழுத்துக்கள்) and Consonants (மெய் எழுத்துக்கள்)

export type LetterType = "vowels" | "consonants" | "all"

export interface TamilLetter {
  letter: string
  word: string
}

export const tamilVowels: TamilLetter[] = [
  { letter: "அ", word: "அம்மா (Mother)" },
  { letter: "ஆ", word: "ஆடு (Goat)" },
  { letter: "இ", word: "இலை (Leaf)" },
  { letter: "ஈ", word: "ஈ (Housefly)" },
  { letter: "உ", word: "உடல் (Body)" },
  { letter: "ஊ", word: "ஊஞ்சல் (Swing)" },
  { letter: "எ", word: "எலி (Rat)" },
  { letter: "ஏ", word: "ஏணி (Ladder)" },
  { letter: "ஐ", word: "ஐந்து (Five)" },
  { letter: "ஒ", word: "ஒட்டகம் (Camel)" },
  { letter: "ஓ", word: "ஓடம் (Boat)" },
  { letter: "ஔ", word: "ஔடதம் (Medicine)" },
]

export const tamilConsonants: TamilLetter[] = [
  { letter: "க", word: "கமலம் (Lotus)" },
  { letter: "ங", word: "மாங்காய் (Raw Mango)" },
  { letter: "ச", word: "சிங்கம் (Lion)" },
  { letter: "ஞ", word: "ஞாயிறு (Sun)" },
  { letter: "ட", word: "டமாரம் (Drum)" },
  { letter: "ண", word: "கண் (Eye)" },
  { letter: "த", word: "தலை (Head)" },
  { letter: "ந", word: "நாய் (Dog)" },
  { letter: "ப", word: "பூ (Flower)" },
  { letter: "ம", word: "மீன் (Fish)" },
  { letter: "ய", word: "யானை (Elephant)" },
  { letter: "ர", word: "ரயில் (Train)" },
  { letter: "ல", word: "லட்டு (Laddu)" },
  { letter: "வ", word: "வானம் (Sky)" },
  { letter: "ழ", word: "பழம் (Fruit)" },
  { letter: "ள", word: "பள்ளி (School)" },
  { letter: "ற", word: "ஆற்றல் (Strength)" },
  { letter: "ன", word: "நன்றி (Thank You)" },
]

export const allTamilLetters: TamilLetter[] = [...tamilVowels, ...tamilConsonants]

export function getLettersByType(type: LetterType): TamilLetter[] {
  switch (type) {
    case "vowels":
      return tamilVowels
    case "consonants":
      return tamilConsonants
    case "all":
    default:
      return allTamilLetters
  }
}

export function getLetterTypeLabel(type: LetterType): { native: string; english: string } {
  switch (type) {
    case "vowels":
      return { native: "உயிர் எழுத்துக்கள்", english: "Vowels" }
    case "consonants":
      return { native: "மெய் எழுத்துக்கள்", english: "Consonants" }
    case "all":
    default:
      return { native: "அனைத்து எழுத்துக்கள்", english: "All Letters" }
  }
}
