// Word generation service using LLM
export interface WordGenerationRequest {
  letterCount: number
  count: number
  difficulty?: 'easy' | 'medium' | 'hard'
  category?: string
}

export interface WordGenerationResponse {
  words: string[]
  success: boolean
  error?: string
}

// Fallback word lists for when LLM is not available
const FALLBACK_WORDS: Record<number, string[]> = {
  3: ["cat", "dog", "sun", "hat", "car", "cup", "pen", "box", "key", "toy", "run", "fun", "big", "red", "hot"],
  4: ["book", "tree", "bird", "fish", "hand", "foot", "moon", "star", "blue", "pink", "play", "jump", "walk", "talk", "sing"],
  5: ["house", "water", "happy", "green", "black", "white", "small", "large", "light", "heavy", "quick", "slow", "young", "old", "clean"],
  6: ["purple", "orange", "yellow", "brown", "friend", "family", "school", "garden", "forest", "castle", "dragon", "prince", "princess", "magic", "wonder"],
  7: ["rainbow", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "mountain", "ocean", "forest", "village"],
  8: ["adventure", "treasure", "mountain", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "village", "computer"],
  9: ["adventure", "treasure", "mountain", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "village", "computer"],
  10: ["adventure", "treasure", "mountain", "butterfly", "elephant", "giraffe", "penguin", "dolphin", "octopus", "library", "kitchen", "bedroom", "bathroom", "village", "computer"]
}

export async function generateWords(request: WordGenerationRequest): Promise<WordGenerationResponse> {
  try {
    // For now, we'll use a simple API call to a free LLM service
    // You can replace this with OpenAI, Anthropic, or any other LLM API
    const response = await fetch('/api/generate-words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error('Failed to generate words')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.warn('LLM word generation failed, using fallback words:', error)
    
    // Fallback to static word lists
    const fallbackWords = FALLBACK_WORDS[request.letterCount] || []
    const shuffled = [...fallbackWords].sort(() => Math.random() - 0.5)
    const selectedWords = shuffled.slice(0, request.count)
    
    return {
      words: selectedWords,
      success: true,
      error: 'Using fallback words due to LLM unavailability'
    }
  }
}

// Alternative: Use a simple in-browser word generation (no API needed)
export function generateWordsLocal(request: WordGenerationRequest): WordGenerationResponse {
  const fallbackWords = FALLBACK_WORDS[request.letterCount] || []
  
  // Shuffle and select unique words
  const shuffled = [...fallbackWords].sort(() => Math.random() - 0.5)
  const uniqueWords = [...new Set(shuffled)]
  const selectedWords = uniqueWords.slice(0, request.count)
  
  return {
    words: selectedWords,
    success: true
  }
}

// Enhanced word generation with categories
export async function generateWordsByCategory(
  letterCount: number, 
  count: number, 
  category: string = 'general'
): Promise<WordGenerationResponse> {
  const request: WordGenerationRequest = {
    letterCount,
    count,
    category,
    difficulty: 'medium'
  }
  
  return generateWords(request)
}
