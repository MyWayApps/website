/** Shared helpers between the continuous and single-utterance browser speech engines. */

export function getSpeechRecognitionCtor(): (new () => any) | null {
  const w = window as any
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

/**
 * Requests mic access up front and immediately releases the tracks, purely
 * to turn an opaque recognizer failure into a clear, actionable error
 * message before we ever try to start recognition.
 */
export async function ensureMicrophoneAccess(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone access isn't available in this browser (requires HTTPS or localhost).")
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((t) => t.stop())
  } catch (err) {
    const name = err instanceof Error ? err.name : ""
    if (name === "NotAllowedError" || name === "SecurityError") {
      throw new Error("Microphone access was blocked — allow the microphone for this site and try again.")
    }
    if (name === "NotFoundError") {
      throw new Error("No microphone was found on this device.")
    }
    throw new Error(`Couldn't access the microphone: ${err instanceof Error ? err.message : String(err)}`)
  }
}
