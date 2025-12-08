// Telugu Letters Data - Vowels (అచ్చులు) and Consonants (హల్లులు)

export type LetterType = "vowels" | "consonants" | "all"

export interface TeluguLetter {
  letter: string
  transliteration: string
  audio: string
}

export interface TeluguLetterWithWord extends TeluguLetter {
  word: string
}

// అచ్చులు (Vowels)
// Note: ఉభయాక్షరమలు (ఁ ం ః)
export const teluguVowels: TeluguLetterWithWord[] = [
  { letter: "అ", transliteration: "a", audio: "telugu-a.mp3", word: "అమ్మ" },
  { letter: "ఆ", transliteration: "aa", audio: "telugu-aa.mp3", word: "ఆవు" },
  { letter: "ఇ", transliteration: "i", audio: "telugu-e.mp3", word: "ఇల్లు" },
  { letter: "ఈ", transliteration: "ee", audio: "telugu-ee.mp3", word: "ఈగ" },
  { letter: "ఉ", transliteration: "u", audio: "telugu-u.mp3", word: "ఉడుత" },
  { letter: "ఊ", transliteration: "uu", audio: "telugu-uu.mp3", word: "ఊరు" },
  { letter: "ఋ", transliteration: "ru", audio: "telugu-ru.mp3", word: "ఋషి" },
  { letter: "ౠ", transliteration: "ruu", audio: "telugu-ru.mp3", word: "ఋషి" },
  { letter: "ఌ", transliteration: "lu", audio: "telugu-lu.mp3", word: "ఌ" },
  { letter: "ౡ", transliteration: "luu", audio: "telugu-lu.mp3", word: "ౡ" },
  { letter: "ఎ", transliteration: "e", audio: "telugu-ae.mp3", word: "ఎలుక" },
  { letter: "ఏ", transliteration: "ae", audio: "telugu-aee.mp3", word: "ఏనుగు" },
  { letter: "ఐ", transliteration: "ai", audio: "telugu-aeee.mp3", word: "ఐదు" },
  { letter: "ఒ", transliteration: "o", audio: "telugu-o.mp3", word: "ఒంటె" },
  { letter: "ఓ", transliteration: "oo", audio: "telugu-oo.mp3", word: "ఓడ" },
  { letter: "ఔ", transliteration: "au", audio: "telugu-au.mp3", word: "ఔషధం" },
  { letter: "అం", transliteration: "am", audio: "telugu-am.mp3", word: "అంగడి" },
  { letter: "అః", transliteration: "aha", audio: "telugu-aha.mp3", word: "దుఃఖం" },
]

// హల్లులు (Consonants)
export const teluguConsonants: TeluguLetterWithWord[] = [
  // క వర్గం
  { letter: "క", transliteration: "ka", audio: "telugu-ka.mp3", word: "కప్ప" },
  { letter: "ఖ", transliteration: "kha", audio: "telugu-kha.mp3", word: "ఖడ్గం" },
  { letter: "గ", transliteration: "ga", audio: "telugu-ga.mp3", word: "గుర్రం" },
  { letter: "ఘ", transliteration: "gha", audio: "telugu-gha.mp3", word: "ఘంట" },
  { letter: "ఙ", transliteration: "nga", audio: "telugu-nga.mp3", word: "వాఙ్మయం" },
  // చ వర్గం
  { letter: "చ", transliteration: "cha", audio: "telugu-cha.mp3", word: "చిలుక" },
  { letter: "ఛ", transliteration: "chha", audio: "telugu-chcha.mp3", word: "ఛత్రం" },
  { letter: "జ", transliteration: "ja", audio: "telugu-ja.mp3", word: "జింక" },
  { letter: "ఝ", transliteration: "jha", audio: "telugu-jha.mp3", word: "ఝంకారం" },
  { letter: "ఞ", transliteration: "nya", audio: "telugu-nya.mp3", word: "జ్ఞానం" },
  // ట వర్గం
  { letter: "ట", transliteration: "tta", audio: "telugu-tta.mp3", word: "టమాట" },
  { letter: "ఠ", transliteration: "ttha", audio: "telugu-ttha.mp3", word: "కంఠం" },
  { letter: "డ", transliteration: "dda", audio: "telugu-dda.mp3", word: "డేగ" },
  { letter: "ఢ", transliteration: "ddha", audio: "telugu-ddha.mp3", word: "ఢంకా" },
  { letter: "ణ", transliteration: "nna", audio: "telugu-nna.mp3", word: "వీణ" },
  // త వర్గం
  { letter: "త", transliteration: "ta", audio: "telugu-ta.mp3", word: "తాబేలు" },
  { letter: "థ", transliteration: "tha", audio: "telugu-thha.mp3", word: "రథం" },
  { letter: "ద", transliteration: "da", audio: "telugu-da.mp3", word: "దీపం" },
  { letter: "ధ", transliteration: "dha", audio: "telugu-dhha.mp3", word: "ధనుస్సు" },
  { letter: "న", transliteration: "na", audio: "telugu-na.mp3", word: "నక్క" },
  // ప వర్గం
  { letter: "ప", transliteration: "pa", audio: "telugu-pa.mp3", word: "పిల్లి" },
  { letter: "ఫ", transliteration: "pha", audio: "telugu-pha.mp3", word: "ఫలం" },
  { letter: "బ", transliteration: "ba", audio: "telugu-ba.mp3", word: "బావి" },
  { letter: "భ", transliteration: "bha", audio: "telugu-bha.mp3", word: "భవనం" },
  { letter: "మ", transliteration: "ma", audio: "telugu-ma.mp3", word: "మేక" },
  // అంతస్థాలు
  { letter: "య", transliteration: "ya", audio: "telugu-ya.mp3", word: "యంత్రం" },
  { letter: "ర", transliteration: "ra", audio: "telugu-ra.mp3", word: "రాజు" },
  { letter: "ల", transliteration: "la", audio: "telugu-la.mp3", word: "లేడి" },
  { letter: "వ", transliteration: "va", audio: "telugu-va.mp3", word: "వర్షం" },
  // ఊష్మాలు
  { letter: "శ", transliteration: "sha", audio: "telugu-sha.mp3", word: "శక్తి" },
  { letter: "ష", transliteration: "sha", audio: "telugu-sha.mp3", word: "షట్కం" },
  { letter: "స", transliteration: "sa", audio: "telugu-sa.mp3", word: "సింహం" },
  { letter: "హ", transliteration: "ha", audio: "telugu-ha.mp3", word: "హంస" },
  // ఇతర హల్లులు
  { letter: "ళ", transliteration: "lla", audio: "telugu-llaa.mp3", word: "తాళం" },
  { letter: "ఱ", transliteration: "rra", audio: "telugu-rra.mp3", word: "ఱ" },
  { letter: "క్ష", transliteration: "ksha", audio: "telugu-ksha.mp3", word: "రక్ష" },
]

// All letters combined
export const allTeluguLetters: TeluguLetterWithWord[] = [...teluguVowels, ...teluguConsonants]

// Helper function to get letters by type
export function getLettersByType(type: LetterType): TeluguLetterWithWord[] {
  switch (type) {
    case "vowels":
      return teluguVowels
    case "consonants":
      return teluguConsonants
    case "all":
    default:
      return allTeluguLetters
  }
}

// Helper function to get letter type label in Telugu
export function getLetterTypeLabel(type: LetterType): { telugu: string; english: string } {
  switch (type) {
    case "vowels":
      return { telugu: "అచ్చులు", english: "Vowels" }
    case "consonants":
      return { telugu: "హల్లులు", english: "Consonants" }
    case "all":
    default:
      return { telugu: "అన్ని అక్షరాలు", english: "All Letters" }
  }
}

