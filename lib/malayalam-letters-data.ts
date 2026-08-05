// Malayalam Letters Data - Vowels (സ്വരാക്ഷരങ്ങൾ) and Consonants (വ്യഞ്ജനാക്ഷരങ്ങൾ)

export type LetterType = "vowels" | "consonants" | "all"

export interface MalayalamLetter {
  letter: string
  word: string
}

export const malayalamVowels: MalayalamLetter[] = [
  { letter: "അ", word: "അമ്മ (Mother)" },
  { letter: "ആ", word: "ആന (Elephant)" },
  { letter: "ഇ", word: "ഇല (Leaf)" },
  { letter: "ഈ", word: "ഈച്ച (Fly)" },
  { letter: "ഉ", word: "ഉറുമ്പ് (Ant)" },
  { letter: "ഊ", word: "ഊഞ്ഞാൽ (Swing)" },
  { letter: "എ", word: "എലി (Rat)" },
  { letter: "ഏ", word: "ഏണി (Ladder)" },
  { letter: "ഐ", word: "ഐസ് (Ice)" },
  { letter: "ഒ", word: "ഒട്ടകം (Camel)" },
  { letter: "ഓ", word: "ഓണം (Onam)" },
  { letter: "ഔ", word: "ഔഷധം (Medicine)" },
]

export const malayalamConsonants: MalayalamLetter[] = [
  { letter: "ക", word: "കമലം (Lotus)" },
  { letter: "ഖ", word: "ഖഡ്ഗം (Sword)" },
  { letter: "ഗ", word: "ഗോതമ്പ് (Wheat)" },
  { letter: "ഘ", word: "ഘടികാരം (Clock)" },
  { letter: "ങ", word: "മാങ്ങ (Raw Mango)" },
  { letter: "ച", word: "ചന്ദ്രൻ (Moon)" },
  { letter: "ഛ", word: "ഛായ (Shadow)" },
  { letter: "ജ", word: "ജനാല (Window)" },
  { letter: "ഝ", word: "ഝരി (Stream)" },
  { letter: "ഞ", word: "ഞായർ (Sunday)" },
  { letter: "ട", word: "ടമാട്ടോ (Tomato)" },
  { letter: "ഠ", word: "മഠം (Monastery)" },
  { letter: "ഡ", word: "ഡ്രം (Drum)" },
  { letter: "ഢ", word: "ഗൂഢം (Secret)" },
  { letter: "ണ", word: "കണ്ണ് (Eye)" },
  { letter: "ത", word: "തല (Head)" },
  { letter: "ഥ", word: "ഗ്രന്ഥം (Book)" },
  { letter: "ദ", word: "ദൈവം (God)" },
  { letter: "ധ", word: "ധനം (Wealth)" },
  { letter: "ന", word: "നായ (Dog)" },
  { letter: "പ", word: "പൂവ് (Flower)" },
  { letter: "ഫ", word: "ഫലം (Fruit)" },
  { letter: "ബ", word: "ബസ് (Bus)" },
  { letter: "ഭ", word: "ഭൂമി (Earth)" },
  { letter: "മ", word: "മീൻ (Fish)" },
  { letter: "യ", word: "യന്ത്രം (Machine)" },
  { letter: "ര", word: "രഥം (Chariot)" },
  { letter: "ല", word: "ലഡ്ഡു (Laddu)" },
  { letter: "വ", word: "വാനം (Sky)" },
  { letter: "ശ", word: "ശലഭം (Butterfly)" },
  { letter: "ഷ", word: "ഷർട്ട് (Shirt)" },
  { letter: "സ", word: "സൂര്യൻ (Sun)" },
  { letter: "ഹ", word: "ഹംസം (Swan)" },
  { letter: "ള", word: "കിളി (Bird)" },
  { letter: "ഴ", word: "വാഴ (Banana Plant)" },
  { letter: "റ", word: "റോഡ് (Road)" },
]

export const allMalayalamLetters: MalayalamLetter[] = [...malayalamVowels, ...malayalamConsonants]

export function getLettersByType(type: LetterType): MalayalamLetter[] {
  switch (type) {
    case "vowels":
      return malayalamVowels
    case "consonants":
      return malayalamConsonants
    case "all":
    default:
      return allMalayalamLetters
  }
}

export function getLetterTypeLabel(type: LetterType): { native: string; english: string } {
  switch (type) {
    case "vowels":
      return { native: "സ്വരാക്ഷരങ്ങൾ", english: "Vowels" }
    case "consonants":
      return { native: "വ്യഞ്ജനാക്ഷരങ്ങൾ", english: "Consonants" }
    case "all":
    default:
      return { native: "എല്ലാ അക്ഷരങ്ങളും", english: "All Letters" }
  }
}
