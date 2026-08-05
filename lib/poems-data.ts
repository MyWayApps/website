// Very short, well-known traditional/folk children's rhymes for each
// language — browsed as simple flashcards (script + audio), no quiz. Kept
// intentionally short and to material that's anonymous folk tradition or
// long-public-domain classical verse (not modern copyrighted song lyrics),
// since these are reproduced in full rather than just referenced.
import type { LanguageCode } from "@/lib/language-games-data"

export interface Poem {
  id: string
  title: string
  titleEnglish: string
  lines: string[]
  note?: string
}

export const POEMS: Record<LanguageCode, Poem[]> = {
  hindi: [
    {
      id: "chanda-mama-door-ke",
      title: "चंदा मामा दूर के",
      titleEnglish: "Uncle Moon, Far Away",
      lines: [
        "चंदा मामा दूर के,",
        "पुए पकाए बूर के,",
        "आप खाए थाली में,",
        "मुन्ने को दे प्याली में।",
      ],
    },
    {
      id: "machli-jal-ki-rani",
      title: "मछली जल की रानी है",
      titleEnglish: "The Fish is the Queen of Water",
      lines: [
        "मछली जल की रानी है,",
        "जीवन उसका पानी है,",
        "हाथ लगाओ तो डर जाएगी,",
        "बाहर निकालो तो मर जाएगी।",
      ],
    },
  ],
  telugu: [
    {
      id: "chemma-chekka",
      title: "చెమ్మ చెక్క చారడేసి మొగ్గ",
      titleEnglish: "Chemma Chekka (Clapping Game Song)",
      lines: [
        "చెమ్మ చెక్క చారడేసి మొగ్గ",
        "అట్లు పొయ్యంగ ఆరగించంగ",
        "ముత్యాల చెమ్మ చెక్క ముగ్గులెయ్యంగ",
        "రత్నాల చెమ్మచెక్క రంగులెయ్యంగ",
      ],
    },
  ],
  kannada: [
    {
      id: "ondu-eradu-mooru",
      title: "ಒಂದು ಎರಡು ಮೂರು",
      titleEnglish: "One, Two, Three (Counting Rhyme)",
      lines: [
        "ಒಂದು, ಎರಡು, ಮೂರು",
        "ಒಂದಾನೊಂದು ಊರು",
        "ನಾಲ್ಕು, ಐದು, ಆರು",
        "ಕೇಳೋರಿಲ್ಲ ಯಾರೂ!",
      ],
    },
  ],
  tamil: [
    {
      id: "nila-nila-odi-vaa",
      title: "நிலா நிலா ஓடி வா",
      titleEnglish: "Moon, Moon, Come Running",
      lines: [
        "நிலா நிலா ஓடி வா",
        "நில்லாமல் ஓடி வா",
        "மலை மீது ஏறி வா",
        "மல்லிகைப்பூ கொண்டு வா",
      ],
    },
  ],
  malayalam: [
    {
      id: "kakke-kakke-koodevide",
      title: "കാക്കേ കാക്കേ കൂടെവിടെ",
      titleEnglish: "Crow, Crow, Where's Your Nest",
      lines: [
        "കാക്കേ, കാക്കേ, കൂടെവിടെ?",
        "കൂട്ടിനകത്തൊരു കുഞ്ഞുണ്ടോ?",
      ],
      note: "By Ulloor S. Parameswara Iyer — a classic first two lines every Malayalam child learns.",
    },
  ],
  sanskrit: [
    {
      id: "kakah-krishnah",
      title: "काकः कृष्णः पिकः कृष्णः",
      titleEnglish: "The Crow is Black, the Cuckoo is Black",
      lines: [
        "काकः कृष्णः पिकः कृष्णः",
        "को भेदः पिककाकयोः।",
        "वसन्तकाले सम्प्राप्ते",
        "काकः काकः पिकः पिकः॥",
      ],
      note: "A classic subhashita — the crow and cuckoo look the same, but come spring, their true voices tell them apart.",
    },
  ],
}
