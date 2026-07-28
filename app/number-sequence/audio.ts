// Shared correct/wrong feedback sounds for all Number Sequence topics — rotates
// between several clips/tones each call instead of always playing the same one.

const CORRECT_CLIPS = ["/audio/happy_tune.mp3", "/audio/good_job.mp3", "/audio/bhesh.mp3", "/audio/pandalu-bandi.mp3"]

const WRONG_TONES: number[][] = [
  [220, 196, 174.61],
  [246.94, 196],
  [261.63, 220, 185],
]

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

function playClip(src: string) {
  try {
    new Audio(src).play().catch(() => {})
  } catch {
    // ignore
  }
}

export function playCorrectSound() {
  if (Math.random() < 0.7) {
    playClip(pick(CORRECT_CLIPS))
  } else {
    playTone([523.25, 659.25, 783.99], "sine")
  }
}

export function playWrongSound() {
  if (Math.random() < 0.4) {
    playClip("/audio/buzz_audio.mp3")
  } else {
    playTone(pick(WRONG_TONES), "sawtooth", 0.2)
  }
}

export function playSuccessMelody() {
  playTone(pick(SUCCESS_MELODIES), "sine", 0.3)
}
