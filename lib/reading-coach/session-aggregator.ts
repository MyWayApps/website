import type { UtteranceResult, WordResult } from "./types"

export interface SentenceProgress {
  sentenceIndex: number
  /** Words in the order the recognizer reported them — consumed reference words and inserted extra words interleaved. */
  timeline: WordResult[]
}

export type MistakeKind = "skipped" | "added" | "mispronounced" | "substituted"

export interface Mistake {
  kind: MistakeKind
  expectedWord?: string
  saidWord?: string
  accuracyScore?: number
}

export interface SessionSummary {
  /** % of attempted words (read or skipped, excluding words never reached) that were read correctly. */
  accuracyScore: number
  /** % of the whole passage the child got through before stopping. */
  completenessScore: number
  mistakes: Mistake[]
}

/** A single displayable unit after pairing adjacent Omission+Insertion into one substitution. */
export type TimelineItem =
  | { kind: "correct"; word: string }
  | { kind: "substituted"; expectedWord: string; saidWord: string }
  | { kind: "skipped"; expectedWord: string }
  | { kind: "added"; saidWord: string }
  | { kind: "mispronounced"; word: string; accuracyScore: number }

/**
 * Collapses a raw word-result timeline into displayable items, merging an
 * Omission immediately followed by an Insertion into one "substituted" item
 * (e.g. "ran" -> "walked") instead of showing them as two separate mistakes.
 * Shared by per-sentence rendering and the session summary so both agree on
 * what counts as one mistake.
 */
export function pairTimeline(timeline: WordResult[]): TimelineItem[] {
  const items: TimelineItem[] = []
  for (let i = 0; i < timeline.length; i++) {
    const word = timeline[i]
    if (word.errorType === "None") {
      items.push({ kind: "correct", word: word.word })
    } else if (word.errorType === "Omission") {
      const next = timeline[i + 1]
      if (next && next.errorType === "Insertion") {
        items.push({ kind: "substituted", expectedWord: word.word, saidWord: next.word })
        i++
      } else {
        items.push({ kind: "skipped", expectedWord: word.word })
      }
    } else if (word.errorType === "Insertion") {
      items.push({ kind: "added", saidWord: word.word })
    } else if (word.errorType === "Mispronunciation") {
      items.push({ kind: "mispronounced", word: word.word, accuracyScore: word.accuracyScore })
    }
  }
  return items
}

/**
 * Maps a stream of continuous-recognition utterance results back onto the
 * original passage sentences, so the UI can highlight per-sentence progress
 * even though Azure's miscue detection reports results as one running
 * word-timeline against the whole passage, not pre-split by sentence.
 *
 * Walks expected words in order: each non-Insertion result (None,
 * Mispronunciation, or Omission) consumes the next expected word; Insertion
 * results are extra words the child said and don't consume one.
 */
export class ReadingSessionAggregator {
  private sentenceWordCounts: number[]
  private sentenceProgress: SentenceProgress[]
  private expectedPointer = 0
  private utterances: UtteranceResult[] = []

  constructor(passage: string[]) {
    this.sentenceWordCounts = passage.map((s) => s.trim().split(/\s+/).length)
    this.sentenceProgress = passage.map((_, i) => ({
      sentenceIndex: i,
      timeline: [],
    }))
  }

  private sentenceIndexForExpectedPosition(pos: number): number {
    let cursor = 0
    for (let i = 0; i < this.sentenceWordCounts.length; i++) {
      cursor += this.sentenceWordCounts[i]
      if (pos < cursor) return i
    }
    return this.sentenceWordCounts.length - 1
  }

  addUtterance(utterance: UtteranceResult): void {
    this.utterances.push(utterance)

    for (const word of utterance.words) {
      const totalExpected = this.sentenceWordCounts.reduce((a, b) => a + b, 0)
      const clampedPointer = Math.min(this.expectedPointer, totalExpected - 1)
      const sentenceIdx = this.sentenceIndexForExpectedPosition(clampedPointer)

      this.sentenceProgress[sentenceIdx].timeline.push(word)
      if (word.errorType !== "Insertion") {
        this.expectedPointer++
      }
    }
  }

  getSentenceProgress(): SentenceProgress[] {
    return this.sentenceProgress
  }

  getSummary(): SessionSummary {
    const fullTimeline = this.sentenceProgress.flatMap((s) => s.timeline)
    const attempted = fullTimeline.filter((w) => w.errorType !== "Insertion")
    const correct = attempted.filter((w) => w.errorType === "None")
    const totalExpected = this.sentenceWordCounts.reduce((a, b) => a + b, 0) || 1

    const accuracyScore = attempted.length > 0 ? Math.round((correct.length / attempted.length) * 100) : 0
    const completenessScore = Math.round((attempted.length / totalExpected) * 100)

    const mistakes: Mistake[] = pairTimeline(fullTimeline)
      .filter((item) => item.kind !== "correct")
      .map((item) => {
        switch (item.kind) {
          case "substituted":
            return { kind: "substituted", expectedWord: item.expectedWord, saidWord: item.saidWord }
          case "skipped":
            return { kind: "skipped", expectedWord: item.expectedWord }
          case "added":
            return { kind: "added", saidWord: item.saidWord }
          case "mispronounced":
            return { kind: "mispronounced", expectedWord: item.word, accuracyScore: item.accuracyScore }
          default:
            throw new Error("unreachable")
        }
      })

    return {
      accuracyScore,
      completenessScore,
      mistakes,
    }
  }
}
