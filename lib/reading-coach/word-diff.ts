/**
 * Pure text-diffing utilities shared by every Reading Coach speech engine
 * (continuous multi-sentence, and single-utterance) — no browser API
 * dependency, so it's trivially testable and reusable across engines.
 */
import type { WordResult } from "./types"

export function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "")
}

/**
 * LCS-based word diff: aligns `said` against `expected`, marking matches
 * None, expected words the child didn't say Omission, and extra said words
 * Insertion — emitted in expected-word order with insertions interleaved
 * where they occurred, matching the shape Azure's miscue detection used to
 * produce so the rest of the pipeline (session-aggregator, UI) needs no
 * changes.
 *
 * `fillTrailingOmissions` (default true) controls what happens when `said`
 * runs out before `expected` does. For a one-shot diff against the *whole*
 * remaining text (e.g. a single self-contained utterance, or a final flush
 * when a session ends) leftover expected words really were never said, so
 * marking them Omission is correct. But for a diff against a bounded
 * lookahead *window* taken from a longer passage mid-session, running out
 * of `said` usually just means this recognized chunk ended early — not
 * that the reader skipped the rest of the window — so the caller should
 * pass `false` and leave those words uncommitted for a later chunk to
 * pick up, rather than permanently marking them wrong.
 */
export function diffWords(
  expected: string[],
  said: string[],
  options?: { fillTrailingOmissions?: boolean }
): WordResult[] {
  const fillTrailingOmissions = options?.fillTrailingOmissions ?? true
  const n = expected.length
  const m = said.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        normalize(expected[i]) === normalize(said[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const result: WordResult[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (normalize(expected[i]) === normalize(said[j])) {
      result.push({ word: expected[i], errorType: "None", accuracyScore: 100 })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ word: expected[i], errorType: "Omission", accuracyScore: 0 })
      i++
    } else {
      result.push({ word: said[j], errorType: "Insertion", accuracyScore: 0 })
      j++
    }
  }
  if (fillTrailingOmissions) {
    while (i < n) {
      result.push({ word: expected[i], errorType: "Omission", accuracyScore: 0 })
      i++
    }
  }
  while (j < m) {
    result.push({ word: said[j], errorType: "Insertion", accuracyScore: 0 })
    j++
  }
  return result
}
