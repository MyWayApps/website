export type LetterCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// Static word lists by letter count. Within each bucket, the Dolch/Fry-style
// top-100 sight words come first (in frequency-rank order) followed by the
// original non-sight-word entries, with any word that appears in both kept
// only once (e.g. "water" was already in the 5-letter list).
export const WORD_LISTS: Record<LetterCount, string[]> = {
  2: ["of", "to", "in", "is", "it", "he", "on", "as", "at", "be", "or", "by", "we", "an", "do", "if", "up", "so", "go", "no", "my", "am", "hi", "me"],
  3: ["the", "and", "you", "was", "for", "are", "his", "one", "had", "but", "not", "all", "can", "use", "she", "how", "out", "her", "him", "has", "two", "see", "way", "who", "its", "now", "day", "did", "get", "may", "cat", "dog", "sun", "hat", "car", "cup", "pen", "box", "key", "toy", "run", "fun", "big", "red", "hot"],
  4: ["that", "with", "they", "this", "have", "from", "what", "were", "when", "your", "said", "each", "will", "many", "then", "them", "some", "make", "like", "into", "time", "look", "more", "than", "been", "find", "long", "down", "come", "made", "part", "book", "tree", "bird", "fish", "hand", "foot", "moon", "star", "blue", "pink", "play", "jump", "walk", "talk", "sing"],
  5: ["words", "there", "which", "their", "other", "about", "these", "would", "write", "could", "first", "water", "house", "happy", "green", "black", "white", "small", "large", "light", "heavy", "quick", "young", "clean", "brave", "smile"],
  6: ["number", "people", "called", "purple", "orange", "yellow", "friend", "family", "school", "garden", "forest", "castle", "dragon", "flower", "monkey", "rabbit", "basket", "cookie"],
  7: ["rainbow", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "morning", "evening", "weekend", "holiday", "teacher", "student", "picture", "chicken"],
  8: ["mountain", "elephant", "umbrella", "backpack", "sandwich", "dinosaur", "computer", "raincoat", "daylight", "sunshine", "notebook", "building", "sailboat", "airplane", "starfish"],
  9: ["butterfly", "adventure", "chocolate", "vegetable", "dandelion", "newspaper", "telephone", "sunflower", "waterfall", "crocodile", "aeroplane", "orchestra", "gymnastic", "classroom", "spaceship"],
  10: ["strawberry", "watermelon", "helicopter", "basketball", "volleyball", "playground", "dictionary", "television", "motorcycle", "restaurant", "instrument", "friendship", "photograph", "chimpanzee", "skateboard"]
}

export const ALL_SPELLING_WORDS: string[] = Object.values(WORD_LISTS).flat()

// The Dolch/Fry-style top-100 sight words prepended to each bucket above —
// tracked separately so the UI can flag them (📌) as high-priority words.
export const SIGHT_WORDS = new Set<string>([
  "of", "to", "in", "is", "it", "he", "on", "as", "at", "be", "or", "by", "we", "an", "do", "if", "up", "so", "go", "no", "my", "am",
  "the", "and", "you", "was", "for", "are", "his", "one", "had", "but", "not", "all", "can", "use", "she", "how", "out", "her", "him", "has", "two", "see", "way", "who", "its", "now", "day", "did", "get", "may",
  "that", "with", "they", "this", "have", "from", "what", "were", "when", "your", "said", "each", "will", "many", "then", "them", "some", "make", "like", "into", "time", "look", "more", "than", "been", "find", "long", "down", "come", "made", "part",
  "words", "there", "which", "their", "other", "about", "these", "would", "write", "could", "first", "water",
  "number", "people", "called",
])

export function isSightWord(word: string): boolean {
  return SIGHT_WORDS.has(word.trim().toLowerCase())
}
