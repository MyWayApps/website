// Shared correct/wrong feedback sounds for all Number Sequence topics — rotates
// between several clips each call instead of always playing the same one.

const CORRECT_CLIPS = Array.from({ length: 10 }, (_, i) => `/audio/feedback/success${i + 1}.mp3`)
const WRONG_CLIPS = Array.from({ length: 10 }, (_, i) => `/audio/feedback/failure${i + 1}.mp3`)

const SUCCESS_MELODIES: number[][] = [
  [523.25, 659.25, 783.99, 1046.5],
  [392, 523.25, 659.25, 783.99],
  [440, 554.37, 659.25, 880],
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getAudioContext(): AudioContext | null {
  try {
    return new (
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )()
  } catch {
    return null
  }
}

function playTone(frequencies: number[], type: OscillatorType, gainPeak = 0.25) {
  const ctx = getAudioContext()
  if (!ctx) return
  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
    osc.type = type
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15)
    gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + i * 0.15 + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3)
    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.3)
  })
}

const MAX_CLIP_MS = 3000

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

export function playSuccessMelody() {
  playTone(pick(SUCCESS_MELODIES), "sine", 0.3)
}
