// Shared correct/wrong feedback sounds, reusable by any game — rotates between
// several clips each call instead of always playing the same one. Mirrors
// app/number-sequence/audio.ts's clip set (the actual files that exist under
// public/audio/feedback/), not the /audio/happy_tune.mp3 / buzz_audio.mp3
// paths some pages reference, which don't exist anywhere in public/.

const CORRECT_CLIPS = Array.from({ length: 10 }, (_, i) => `/audio/feedback/success${i + 1}.mp3`)
const WRONG_CLIPS = Array.from({ length: 10 }, (_, i) => `/audio/feedback/failure${i + 1}.mp3`)

const MAX_CLIP_MS = 3000

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function playClip(src: string) {
  try {
    const audio = new Audio(src)
    audio.play().catch(() => {})
    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, MAX_CLIP_MS)
  } catch {
    // ignore
  }
}

export function playCorrectSound() {
  playClip(pick(CORRECT_CLIPS))
}

export function playWrongSound() {
  playClip(pick(WRONG_CLIPS))
}
