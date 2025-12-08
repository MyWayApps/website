/**
 * Telugu TTS using Browser's Web Speech API
 * This works on all modern browsers without server-side dependencies
 */

// Track if speech is currently in progress
let isSpeaking = false

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
export function playTeluguTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }
    
    if (!('speechSynthesis' in window)) {
      resolve()
      return
    }
    
    // If already speaking, cancel and wait a bit
    if (window.speechSynthesis.speaking || isSpeaking) {
      window.speechSynthesis.cancel()
      isSpeaking = false
    }
    
    // Small delay to ensure cancel is processed
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Try to get a Telugu voice
      const voice = getTeluguVoice()
      if (voice) {
        utterance.voice = voice
      }
      
      // Set speech parameters
      utterance.rate = 0.8
      utterance.pitch = 1.0
      utterance.volume = 1.0
      utterance.lang = 'te-IN'
      
      isSpeaking = true
      
      utterance.onend = () => {
        isSpeaking = false
        resolve()
      }
      
      utterance.onerror = (event) => {
        isSpeaking = false
        // Don't log "interrupted" errors - they're expected when navigating quickly
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event.error)
        }
        resolve() // Resolve anyway so app doesn't hang
      }
      
      // Speak
      if (window.speechSynthesis.getVoices().length === 0) {
        // Voices not loaded yet
        window.speechSynthesis.onvoiceschanged = () => {
          const newVoice = getTeluguVoice()
          if (newVoice) {
            utterance.voice = newVoice
          }
          window.speechSynthesis.speak(utterance)
        }
      } else {
        window.speechSynthesis.speak(utterance)
      }
    }, 50) // 50ms delay after cancel
  })
}

/**
 * Legacy function for compatibility
 */
export async function generateTeluguTTS(text: string): Promise<string> {
  await playTeluguTTS(text)
  return ''
}
