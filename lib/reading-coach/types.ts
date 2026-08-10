/** Shared types for the Reading Coach feature, independent of which recognition engine is active (Azure or the browser's Web Speech API). */

export interface WordResult {
  word: string
  errorType: "None" | "Mispronunciation" | "Omission" | "Insertion"
  accuracyScore: number
}

export interface UtteranceResult {
  words: WordResult[]
  accuracyScore: number
  fluencyScore: number
  completenessScore: number
  pronunciationScore: number
}

export interface ReadingSessionCallbacks {
  onUtterance: (result: UtteranceResult) => void
  onError: (error: Error) => void
  onEnded?: () => void
  /** Live, not-yet-final transcript preview — proof the mic is actually being heard, before a full utterance resolves. */
  onInterim?: (transcript: string) => void
  /** Lifecycle status updates ("listening", "speech-detected", "silence", ...) for on-screen debug feedback. */
  onStatus?: (status: string) => void
}

export interface ReadingSession {
  stop: () => Promise<void>
}
