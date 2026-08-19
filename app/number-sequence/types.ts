export type TopicId =
  | "forward-backward"
  | "counting-shapes"
  | "number-neighbors"
  | "number-compare"
  | "who-has-more"
  | "place-value"
  | "neighbor-grid"
  | "number-words"
  | "arrange-order"
  | "greatest-smallest"
  | "tens-ones-count"

export interface RoundResult {
  topicId: TopicId
  score: number // correct answers, 0..5
  maxScore: number // always 5
  completionTimeMs: number
  difficultyLabel: string
  /** Extra evidence a topic wants persisted alongside the round (e.g. boundary-question coverage for mastery). */
  meta?: Record<string, unknown>
}

export interface TopicProps {
  onRoundComplete: (result: RoundResult) => void
  onBackToTopics: () => void
  userId?: string
  applicationId?: string
}
