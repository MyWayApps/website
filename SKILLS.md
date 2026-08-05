# MyWayApps — Game-Building Conventions

Standing rules for every quiz/game built in this app. Read this before adding a new game or topic — it exists so new features don't reinvent (or regress) patterns already settled through direct feedback.

## Pacing

- **5-second gap** between a submitted answer and the next question. This applies to every scored round-based game: play the feedback sound, show the correct/wrong banner, then wait 5 seconds before advancing. Not shorter (feels rushed), not longer (feels stuck). Reference: `setTimeout(..., 5000)` in `components/math-operations/math-quiz-engine.tsx`'s `finishRound`.
- Audio clips themselves are capped at 3 seconds (`MAX_CLIP_MS` in `lib/feedback-audio.ts`) — they play once within the 5-second window, they don't extend it.

## Audio

- Correct/wrong feedback **always** goes through `lib/feedback-audio.ts`'s `playCorrectSound()` / `playWrongSound()`. These rotate randomly across 10 recorded clips each (`/audio/feedback/success{1-10}.mp3`, `/audio/feedback/failure{1-10}.mp3`) and self-cap at 3s.
- Never reference `/audio/happy_tune.mp3` or `/audio/buzz_audio.mp3` — those files don't exist anywhere in `public/`. If you find code still using them, it's a bug (this was a sitewide issue fixed once already; don't reintroduce it).
- Don't roll your own Web Audio oscillator beep tones for correct/wrong feedback — use the recorded clips for a consistent voice across the site.

## Scoring display

- **Never show live numeric "Score: N" text during gameplay.** Show a row of star icons (`Star` from `lucide-react`) sized to the round length, filled (`fill-yellow-300 text-yellow-300 scale-110`) when `i < score`, dim (`text-white/40`) otherwise. Reference implementation: the header badge in `components/math-operations/math-quiz-engine.tsx`.
- A numeric "Score: X/Y" is fine on the **end-of-round results screen** only (`components/quiz-results.tsx`) — that's a different, acceptable context from live in-progress display.
- Persist scores via `lib/scoring.ts`'s `saveGameScore()`, which dual-writes localStorage + Supabase. Pass `subject` (e.g. `"Math"`) so it rolls up into the per-subject progress table, not just the per-app one.

## No-repeat questions

- Every question generator should route through `lib/question-history.ts`'s `pickUnseen()` (for picking an item from a finite pool) or `pickUnseenRandom()` (for picking a random integer in a range) instead of raw `Math.random()`. This tracks what a signed-in user has already seen per `gameKey` and cycles/resets once the pool is exhausted. Guests degrade gracefully to plain random (no user id to key off of).
- Scope `gameKey` specifically enough to avoid cross-contamination, e.g. `"math-add:table-3"`, not just `"math-add"`.

## Input UX

- Typed-answer inputs: add the native `autoFocus` attribute (reliable on first mount) **and** an effect-based `inputRef.current?.focus()` on question change (handles refocus between rounds, since the DOM node persists across re-renders). Neither alone is sufficient — see the fix in `math-quiz-engine.tsx`.
- Enter key submits the typed answer (`onKeyDown` checking `e.key === "Enter"`).
- Number inputs (`type="number"`) get the `no-spinner` class (defined in `app/globals.css`) to hide the native up/down spinner arrows.
- Placeholder text needs its own smaller font size independent of the answer font (`placeholder:text-base md:placeholder:text-lg`) — a placeholder scaled to match a large answer font (`text-4xl`+) will overflow the box.

## Sizing

- Cards: generous padding (`p-10 md:p-12`), not the tighter `p-6`/`p-8` used in older pages.
- MCQ/choice buttons: `h-20 md:h-24 text-3xl md:text-4xl`, not `h-16 text-2xl`.
- Keep icons/emoji as plain, single-codepoint characters or well-supported emoji. Avoid combining sequences like keycap emoji (`1️⃣`) — they don't render reliably on every platform (renders as a "NO GLYPH" box on some). For numbered badges, use a plain styled div with the digit as text instead.
- Prefer CSS-drawn shapes (border-radius, clip-path, conic-gradient) over emoji when precision matters (see `components/math-topics/shape-icon.tsx`, `fraction-circle.tsx`) — emoji shapes vary in appearance across platforms; CSS renders identically everywhere.

## Architecture patterns to reuse, not reinvent

- **Topic picker + scoring scaffold**: `components/math-topics/topic-hub.tsx` — handles user/app init, mode-picker grid, `saveGameScore` wiring. Supply a `modes: TopicMode[]` list; don't hand-roll this per topic.
- **Generic MCQ engine**: `components/math-topics/visual-mcq-game.tsx` — takes a `generateQuestion()` function returning `{ prompt, choices, correctChoice }`; handles the round loop, star scoring, audio, results screen. Reuse this instead of writing a new MCQ loop per game.
- **Generic matching-pairs engine**: `components/math-topics/generic-matching-mode.tsx` — takes a `generatePairs()` function.
- **Number line**: `components/number-line-jump.tsx` — animates a character hopping from `start` to `end`; one big hop (not repeated small bounces), ~0.9s pause at start then a ~2.2s travel. Character options: `"frog" | "kangaroo" | "rabbit"`.
- **Math fact/question generators**: keep pure data logic in `lib/*-data.ts` files (no JSX) — the calling component supplies the visual `prompt`. See `lib/math-shapes-data.ts`, `lib/math-fractions-data.ts` for the pattern (`prompt: null` placeholder filled in by the page component).

## Verification (this sandbox specifically)

- `npx tsc --noEmit -p .` and `rm -rf .next && npm run build` after every meaningful change — no automated test suite exists in this repo.
- Headless Chromium doesn't run in this environment (`Playwright does not support chromium on mac13`) — there is no way to visually test here. Verification is typecheck + build + careful manual code review + standalone Node scripts to sanity-check generator correctness (e.g. simulate thousands of rounds and assert invariants like "answer is never negative" or "choices always include the correct answer").
