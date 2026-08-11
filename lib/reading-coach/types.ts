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
  /**
   * Live progress within the current, not-yet-final utterance: how many of
   * the next expected words have been tentatively recognized so far (a
   * simple left-to-right prefix match, not the full diff) — drives
   * real-time word highlighting and the reading pointer before the
   * utterance resolves into a committed onUtterance call.
   */
  onProgress?: (matchedCount: number) => void
  /** Lifecycle status updates ("listening", "speech-detected", "silence", ...) for on-screen debug feedback. */
  onStatus?: (status: string) => void
}

export interface ReadingSession {
  stop: () => Promise<void>
}
