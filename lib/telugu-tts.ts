/**
 * Telugu TTS using Browser's Web Speech API
 * This works on all modern browsers without server-side dependencies
 */

// Voice options to rotate through for variety
const VOICE_SETTINGS = [
  { rate: 0.8, pitch: 1.0 },
  { rate: 0.75, pitch: 1.1 },
  { rate: 0.85, pitch: 0.95 },
  { rate: 0.7, pitch: 1.05 }
]

let voiceIndex = 0

/**
 * Get a Telugu voice if available, otherwise use default
 */
function getTeluguVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null
  }
  
  const voices = window.speechSynthesis.getVoices()
  
  // Try to find a Telugu voice
  const teluguVoice = voices.find(voice => 
    voice.lang.includes('te') || 
    voice.lang.includes('tel') ||
    voice.name.toLowerCase().includes('telugu')
  )
  
  if (teluguVoice) {
    return teluguVoice
  }
  
  // Fallback to Hindi voice (similar pronunciation)
  const hindiVoice = voices.find(voice => 
    voice.lang.includes('hi') || 
    voice.name.toLowerCase().includes('hindi')
  )
  
  if (hindiVoice) {
    return hindiVoice
  }
  
  // Fallback to any Indian voice
  const indianVoice = voices.find(voice => 
    voice.lang.includes('IN') ||
    voice.name.toLowerCase().includes('india')
  )
  
  return indianVoice || null
}

/**
 * Play Telugu TTS audio using browser's Web Speech API
 * @param text - Telugu text to speak
 * @returns Promise that resolves when speech ends
 */
export async function playTeluguTTS(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'))
      return
    }
    
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'))
      return
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Get voice settings with rotation for variety
    const settings = VOICE_SETTINGS[voiceIndex % VOICE_SETTINGS.length]
    voiceIndex++
    
    // Try to get a Telugu voice
    const voice = getTeluguVoice()
    if (voice) {
      utterance.voice = voice
    }
    
    // Set speech parameters
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch
    utterance.volume = 1.0
    
    // If no Telugu voice, set lang to Telugu anyway (browser will do its best)
    utterance.lang = 'te-IN'
    
    utterance.onend = () => {
      resolve()
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event)
      reject(new Error(`Speech synthesis failed: ${event.error}`))
    }
    
    // Workaround for Chrome bug where voices aren't loaded immediately
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voice = getTeluguVoice()
        if (voice) {
          utterance.voice = voice
        }
        window.speechSynthesis.speak(utterance)
      }
    } else {
      window.speechSynthesis.speak(utterance)
    }
  })
}

/**
 * Legacy function for compatibility - now just calls playTeluguTTS
 * @param text - Telugu text to convert to speech
 * @returns Promise that resolves to empty string (no URL needed with Web Speech API)
 */
export async function generateTeluguTTS(text: string): Promise<string> {
  await playTeluguTTS(text)
  return ''
}
