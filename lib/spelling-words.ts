export type LetterCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// Static word lists by letter count
export const WORD_LISTS: Record<LetterCount, string[]> = {
  2: ["an", "at", "be", "by", "do", "go", "hi", "if", "in", "is", "it", "me", "no", "on", "up"],
  3: ["cat", "dog", "sun", "hat", "car", "cup", "pen", "box", "key", "toy", "run", "fun", "big", "red", "hot"],
  4: ["book", "tree", "bird", "fish", "hand", "foot", "moon", "star", "blue", "pink", "play", "jump", "walk", "talk", "sing"],
  5: ["house", "water", "happy", "green", "black", "white", "small", "large", "light", "heavy", "quick", "young", "clean", "brave", "smile"],
  6: ["purple", "orange", "yellow", "friend", "family", "school", "garden", "forest", "castle", "dragon", "flower", "monkey", "rabbit", "basket", "cookie"],
  7: ["rainbow", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "morning", "evening", "weekend", "holiday", "teacher", "student", "picture", "chicken"],
  8: ["mountain", "elephant", "umbrella", "backpack", "sandwich", "dinosaur", "computer", "raincoat", "daylight", "sunshine", "notebook", "building", "sailboat", "airplane", "starfish"],
  9: ["butterfly", "adventure", "chocolate", "vegetable", "dandelion", "newspaper", "telephone", "sunflower", "waterfall", "crocodile", "aeroplane", "orchestra", "gymnastic", "classroom", "spaceship"],
  10: ["strawberry", "watermelon", "helicopter", "basketball", "volleyball", "playground", "dictionary", "television", "motorcycle", "restaurant", "instrument", "friendship", "photograph", "chimpanzee", "skateboard"]
}

export const ALL_SPELLING_WORDS: string[] = Object.values(WORD_LISTS).flat()
