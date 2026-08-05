// Kannada Letters Data - Vowels (ಸ್ವರಗಳು) and Consonants (ವ್ಯಂಜನಗಳು)

export type LetterType = "vowels" | "consonants" | "all"

export interface KannadaLetter {
  letter: string
  word: string
}

export const kannadaVowels: KannadaLetter[] = [
  { letter: "ಅ", word: "ಅರಳು (Blossom)" },
  { letter: "ಆ", word: "ಆನೆ (Elephant)" },
  { letter: "ಇ", word: "ಇರುವೆ (Ant)" },
  { letter: "ಈ", word: "ಈಚಲು (Palm)" },
  { letter: "ಉ", word: "ಉಪ್ಪು (Salt)" },
  { letter: "ಊ", word: "ಊರು (Village)" },
  { letter: "ಋ", word: "ಋಷಿ (Sage)" },
  { letter: "ಎ", word: "ಎಮ್ಮೆ (Buffalo)" },
  { letter: "ಏ", word: "ಏಣಿ (Ladder)" },
  { letter: "ಐ", word: "ಐದು (Five)" },
  { letter: "ಒ", word: "ಒಂಟೆ (Camel)" },
  { letter: "ಓ", word: "ಓಡು (Run)" },
  { letter: "ಔ", word: "ಔಷಧ (Medicine)" },
  { letter: "ಅಂ", word: "ಅಂಗಡಿ (Shop)" },
  { letter: "ಅಃ", word: "ಅಃಕಾರ" },
]

export const kannadaConsonants: KannadaLetter[] = [
  { letter: "ಕ", word: "ಕಮಲ (Lotus)" },
  { letter: "ಖ", word: "ಖರ್ಜೂರ (Date)" },
  { letter: "ಗ", word: "ಗಿಣಿ (Parrot)" },
  { letter: "ಘ", word: "ಘಂಟೆ (Bell)" },
  { letter: "ಙ", word: "ಙಕಾರ" },
  { letter: "ಚ", word: "ಚಂದ್ರ (Moon)" },
  { letter: "ಛ", word: "ಛತ್ರಿ (Umbrella)" },
  { letter: "ಜ", word: "ಜಲ (Water)" },
  { letter: "ಝ", word: "ಝರಿ (Stream)" },
  { letter: "ಞ", word: "ಞಕಾರ" },
  { letter: "ಟ", word: "ಟೊಮೆಟೊ (Tomato)" },
  { letter: "ಠ", word: "ಠಕಾರ" },
  { letter: "ಡ", word: "ಡಮರು (Drum)" },
  { letter: "ಢ", word: "ಢಕಾರ" },
  { letter: "ಣ", word: "ಣಕಾರ" },
  { letter: "ತ", word: "ತಾಮರೆ (Lotus)" },
  { letter: "ಥ", word: "ಥಟ್ಟನೆ (Suddenly)" },
  { letter: "ದ", word: "ದ್ರಾಕ್ಷಿ (Grape)" },
  { letter: "ಧ", word: "ಧನ (Wealth)" },
  { letter: "ನ", word: "ನದಿ (River)" },
  { letter: "ಪ", word: "ಪತಂಗ (Kite)" },
  { letter: "ಫ", word: "ಫಲ (Fruit)" },
  { letter: "ಬ", word: "ಬಾಳೆ (Banana)" },
  { letter: "ಭ", word: "ಭೂಮಿ (Earth)" },
  { letter: "ಮ", word: "ಮೀನು (Fish)" },
  { letter: "ಯ", word: "ಯಂತ್ರ (Machine)" },
  { letter: "ರ", word: "ರಥ (Chariot)" },
  { letter: "ಲ", word: "ಲಿಂಬೆ (Lemon)" },
  { letter: "ವ", word: "ವಾನರ (Monkey)" },
  { letter: "ಶ", word: "ಶಾಲೆ (School)" },
  { letter: "ಷ", word: "ಷಡ್ಭುಜ (Hexagon)" },
  { letter: "ಸ", word: "ಸೂರ್ಯ (Sun)" },
  { letter: "ಹ", word: "ಹಾವು (Snake)" },
  { letter: "ಳ", word: "ಳಕಾರ" },
]

export const allKannadaLetters: KannadaLetter[] = [...kannadaVowels, ...kannadaConsonants]

export function getLettersByType(type: LetterType): KannadaLetter[] {
  switch (type) {
    case "vowels":
      return kannadaVowels
    case "consonants":
      return kannadaConsonants
    case "all":
    default:
      return allKannadaLetters
  }
}

export function getLetterTypeLabel(type: LetterType): { native: string; english: string } {
  switch (type) {
    case "vowels":
      return { native: "ಸ್ವರಗಳು", english: "Vowels" }
    case "consonants":
      return { native: "ವ್ಯಂಜನಗಳು", english: "Consonants" }
    case "all":
    default:
      return { native: "ಎಲ್ಲಾ ಅಕ್ಷರಗಳು", english: "All Letters" }
  }
}
