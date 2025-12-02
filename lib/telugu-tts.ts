/**
 * Utility function to generate Telugu TTS audio
 * @param text - Telugu text to convert to speech
 * @returns Promise that resolves to audio blob URL
 */
export async function generateTeluguTTS(text: string): Promise<string> {
  try {
    const response = await fetch('/api/tts/telugu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`)
    }

    // Convert response to blob
    const audioBlob = await response.blob()
    
    // Create object URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob)
    
    return audioUrl
  } catch (error) {
    console.error('Error generating Telugu TTS:', error)
    throw error
  }
}

/**
 * Play Telugu TTS audio
 * @param text - Telugu text to speak
 * @returns Promise that resolves when audio starts playing
 */
export async function playTeluguTTS(text: string): Promise<void> {
  try {
    const audioUrl = await generateTeluguTTS(text)
    const audio = new Audio(audioUrl)
    
    return new Promise((resolve, reject) => {
      audio.onloadeddata = () => {
        audio.play().then(() => {
          resolve()
        }).catch(reject)
      }
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl)
        reject(error)
      }
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
    })
  } catch (error) {
    console.error('Error playing Telugu TTS:', error)
    throw error
  }
}

