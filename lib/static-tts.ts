/**
 * Azure-first TTS, generalized across all content languages: pre-generated
 * Azure static file first, live /api/tts (Azure, falling back to espeak)
 * for anything not yet pre-generated, and the browser's own voice only as
 * a last resort if both Azure paths are unreachable. Extracted from the
 * Telugu-only implementation this app started with — lib/telugu-tts.ts is
 * now a thin wrapper around this.
 */

// Track current audio element to prevent overlapping playback
let _currentAudio: HTMLAudioElement | null = null

// ─── Browser neural voice (preferred) ──────────────────────────────────────

const QUALITY_KEYWORDS = [
  "compact", "standard",
  "enhanced", "premium", "natural", "neural", "wavenet", "google",
]

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase()
  let score = 0
  QUALITY_KEYWORDS.forEach((kw, i) => {
    if (name.includes(kw)) score = i
  })
  if (!voice.localService) score -= 1
  return score
}

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices()
    if (existing.length) {
      resolve(existing)
      return
    }
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      resolve(window.speechSynthesis.getVoices())
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
    // Some browsers never fire voiceschanged when there are simply no voices
    setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
      resolve(window.speechSynthesis.getVoices())
    }, 500)
  })
}

async function getBestVoice(localePrefix: string): Promise<SpeechSynthesisVoice | null> {
  const voices = await getVoices()
  const candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(localePrefix.toLowerCase()))
  if (!candidates.length) return null
  return candidates.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
}

function speakWithBrowserVoice(text: string, voice: SpeechSynthesisVoice): Promise<void> {
  return new Promise((resolve, reject) => {
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.voice = voice
    utt.lang = voice.lang
    utt.rate = 0.88
    utt.pitch = 1.05
    utt.volume = 1
    utt.onend = () => resolve()
    utt.onerror = (e) => reject(new Error(e.error || 'speechSynthesis error'))
    window.speechSynthesis.speak(utt)
  })
}

/**
 * Calculate SHA-256 hash of text (matches scripts/generate-audio.js)
 */
async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text.trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

async function fetchAudioBlob(url: string): Promise<Blob> {
  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: { 'Accept': 'audio/mpeg,audio/*' }
  })

  if (!resp.ok) {
    throw new Error(`TTS fetch failed: ${resp.status} ${resp.statusText}`)
  }

  return resp.blob()
}

/**
 * Play audio from blob URL with proper cleanup. Handles autoplay
 * restrictions by showing a one-tap "Play audio" button if needed, unless
 * `silent` is set — callers that already offer their own replay control
 * (e.g. the Spelling Game Suite's speaker icon) can opt out of the floating
 * button and just let playback fail quietly.
 */
async function playAudioFromBlobUrl(url: string, silent = false): Promise<void> {
  const blob = await fetchAudioBlob(url)
  const objectUrl = URL.createObjectURL(blob)

  if (_currentAudio) {
    try {
      _currentAudio.pause()
      _currentAudio.currentTime = 0
    } catch {}
    try {
      if (_currentAudio.parentElement) {
        _currentAudio.parentElement.removeChild(_currentAudio)
      }
    } catch {}
    _currentAudio = null
  }

  const audio = document.createElement('audio')
  audio.src = objectUrl
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'
  audio.style.display = 'none'
  document.body.appendChild(audio)
  _currentAudio = audio

  const cleanup = () => {
    // Detach handlers first — clearing audio.src below fires another
    // 'error' event, which would otherwise re-enter this function forever.
    audio.onended = null
    audio.onerror = null
    audio.onloadstart = null
    audio.oncanplay = null
    audio.onplaying = null
    try { audio.pause() } catch {}
    audio.src = ''
    if (audio.parentElement) {
      audio.parentElement.removeChild(audio)
    }
    if (_currentAudio === audio) {
      _currentAudio = null
    }
    try {
      URL.revokeObjectURL(objectUrl)
    } catch {}
  }

  return new Promise<void>(async (resolve, reject) => {
    audio.onended = () => {
      cleanup()
      resolve()
    }

    audio.onerror = () => {
      cleanup()
      reject(new Error('Audio element error'))
    }

    try {
      await audio.play()
    } catch (err) {
      if (silent) {
        cleanup()
        reject(err instanceof Error ? err : new Error(String(err)))
        return
      }

      const btn = document.createElement('button')
      btn.textContent = '🔊 Play audio'
      btn.style.position = 'fixed'
      btn.style.right = '20px'
      btn.style.bottom = '20px'
      btn.style.zIndex = '99999'
      btn.style.padding = '12px 24px'
      btn.style.backgroundColor = '#3b82f6'
      btn.style.color = 'white'
      btn.style.border = 'none'
      btn.style.borderRadius = '8px'
      btn.style.fontSize = '16px'
      btn.style.fontWeight = 'bold'
      btn.style.cursor = 'pointer'
      btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
      btn.style.transition = 'all 0.2s'
      btn.onmouseenter = () => {
        btn.style.backgroundColor = '#2563eb'
        btn.style.transform = 'scale(1.05)'
      }
      btn.onmouseleave = () => {
        btn.style.backgroundColor = '#3b82f6'
        btn.style.transform = 'scale(1)'
      }
      document.body.appendChild(btn)

      const onClick = async () => {
        btn.removeEventListener('click', onClick)
        if (btn.parentElement) {
          btn.parentElement.removeChild(btn)
        }

        try {
          await audio.play()
          resolve()
        } catch (e2) {
          cleanup()
          reject(e2)
        }
      }

      btn.addEventListener('click', onClick)
    }
  })
}

/**
 * Plays `text` for a content language: pre-generated Azure static MP3 first
 * (/audio/<staticFolder>/<hash>.mp3), then a live /api/tts?lang=&text= Azure
 * call for anything not yet pre-generated, and only as a last resort — if
 * both Azure paths are unreachable — the browser's own built-in voice.
 *
 * Azure is deliberately the default, not the browser voice: device/OS voices
 * vary wildly in quality with no floor we control (some platforms' only
 * available voice for a language is a low-quality robotic one), while the
 * pre-generated cache and live Azure calls are consistently good. Browser
 * voice exists purely as an offline/network-outage safety net now.
 *
 * staticFolder and apiLangCode are deliberately separate: the pre-generated
 * cache lives under full language-name folders (public/audio/hindi/,
 * .../telugu/, ...), while /api/tts and the Azure voice map key off short
 * codes ("hi", "te", ...) — passing one value for both silently 404s every
 * static lookup and makes every play fall through unnecessarily.
 *
 * @param text - native-script text to speak
 * @param staticFolder - full language name matching the public/audio/<name>/ folder on disk (e.g. "hindi", "telugu", "sanskrit")
 * @param apiLangCode - short lang code for the /api/tts?lang= fallback and browser-voice scoring (e.g. "hi", "te", "kn")
 * @param browserLocalePrefix - BCP-47 prefix to match against browser voices (e.g. "te", "hi-IN")
 * @param options.silent - skip the floating "Play audio" fallback button if autoplay is blocked; use when the caller already has its own replay control
 */
export async function playStaticTTS(
  text: string,
  staticFolder: string,
  apiLangCode: string,
  browserLocalePrefix: string,
  options?: { silent?: boolean }
): Promise<void> {
  if (typeof window === 'undefined') return
  if (!text || text.trim().length === 0) return

  const silent = options?.silent ?? false

  try {
    const hash = await hashText(text)
    const staticUrl = `/audio/${staticFolder}/${hash}.mp3`

    const checkResponse = await fetch(staticUrl, { method: 'HEAD' })
    if (checkResponse.ok) {
      await playAudioFromBlobUrl(staticUrl, silent)
      return
    }

    // Not yet pre-generated — ask the server for a live Azure synthesis
    // (app/api/tts/route.ts itself falls back to eSpeak only if Azure is
    // unconfigured or fails, so this is still "Azure by default").
    const serverUrl = `/api/tts?lang=${apiLangCode}&text=${encodeURIComponent(text)}`
    await playAudioFromBlobUrl(serverUrl, silent)
    return
  } catch (err) {
    console.warn(`[TTS] Azure cache/live call failed for lang="${apiLangCode}", falling back to browser voice:`, err)
  }

  // Last resort: both Azure paths failed (e.g. offline) — try the device's
  // own voice rather than staying silent.
  if (window.speechSynthesis) {
    const voice = await getBestVoice(browserLocalePrefix)
    if (voice) {
      await speakWithBrowserVoice(text, voice)
      return
    }
  }

  throw new Error(`[TTS] No playback method available for lang="${apiLangCode}"`)
}
