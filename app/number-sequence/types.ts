export type TopicId =
  | "forward-backward"
  | "counting-shapes"
  | "number-neighbors"
  | "number-compare"
  | "place-value"
  | "neighbor-grid"
  | "number-words"

export interface RoundResult {
  topicId: TopicId
  score: number // correct answers, 0..5
  maxScore: number // always 5
  completionTimeMs: number
  difficultyLabel: string
}

export interface TopicProps {
  onRoundComplete: (result: RoundResult) => void
  onBackToTopics: () => void
}
