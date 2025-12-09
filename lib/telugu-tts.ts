/**
 * Robust Telugu TTS using Pre-Generated Static Audio Files
 * Uses hashed filenames for instant, reliable playback across all browsers
 * Falls back to server-side TTS for dynamic text
 */

// Track current audio element to prevent overlapping playback
let _currentAudio: HTMLAudioElement | null = null

/**
 * Calculate SHA-256 hash of text (matches server-side hash)
 */
async function hashText(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text.trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Fetch audio blob from server
 */
async function fetchAudioBlob(url: string): Promise<Blob> {
  console.log('[TTS] Fetching audio blob from:', url)
  
  const resp = await fetch(url, { 
    method: 'GET', 
    credentials: 'same-origin',
    headers: {
      'Accept': 'audio/mpeg,audio/*'
    }
  })
  
  if (!resp.ok) {
    console.error('[TTS] ✗ Server returned error:', resp.status, resp.statusText)
    throw new Error(`TTS fetch failed: ${resp.status} ${resp.statusText}`)
  }
  
  const blob = await resp.blob()
  console.log('[TTS] ✓ Audio blob received, size:', blob.size, 'bytes, type:', blob.type)
  
  return blob
}

/**
 * Play audio from blob URL with proper cleanup
 * Handles autoplay restrictions gracefully
 */
async function playAudioFromBlobUrl(url: string): Promise<void> {
  console.log('[TTS] Starting playback from URL:', url)
  
  // Fetch blob from server
  const blob = await fetchAudioBlob(url)
  
  // Create object URL from blob
  const objectUrl = URL.createObjectURL(blob)
  console.log('[TTS] Created object URL:', objectUrl)
  
  // Cleanup previous audio if exists
  if (_currentAudio) {
    console.log('[TTS] Cleaning up previous audio...')
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
  
  // Create new audio element and append to DOM (prevents GC issues)
  const audio = document.createElement('audio')
  audio.src = objectUrl
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'
  audio.style.display = 'none'
  document.body.appendChild(audio)
  _currentAudio = audio
  console.log('[TTS] Audio element created and added to DOM')
  
  // Cleanup helper function
  const cleanup = () => {
    console.log('[TTS] Running cleanup...')
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
      console.log('[TTS] Object URL revoked')
    } catch {}
  }
  
  // Return promise that resolves when playback ends
  return new Promise<void>(async (resolve, reject) => {
    audio.onloadstart = () => console.log('[TTS] Audio loading started...')
    audio.oncanplay = () => console.log('[TTS] Audio can play (enough data loaded)')
    audio.onplaying = () => console.log('[TTS] ✓ Audio is now playing!')
    
    audio.onended = () => {
      console.log('[TTS] ✓ Audio playback completed')
      cleanup()
      resolve()
    }
    
    audio.onerror = (e) => {
      console.error('[TTS] ✗ Audio element error:', e)
      cleanup()
      reject(new Error('Audio element error'))
    }
    
    // Try to play; if blocked by autoplay policy, create user gesture button
    try {
      console.log('[TTS] Attempting audio.play()...')
      await audio.play()
      console.log('[TTS] ✓ audio.play() succeeded (autoplay allowed)')
    } catch (err) {
      console.warn('[TTS] ✗ audio.play() blocked by autoplay policy!', err)
      console.log('[TTS] Creating user gesture button...')
      
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
      console.log('[TTS] Play button added to DOM')
      
      const onClick = async () => {
        console.log('[TTS] 🎯 Play button clicked by user!')
        btn.removeEventListener('click', onClick)
        if (btn.parentElement) {
          btn.parentElement.removeChild(btn)
        }
        console.log('[TTS] Play button removed from DOM')
        
        try {
          await audio.play()
          console.log('[TTS] ✓ Audio playing after user gesture')
          resolve()
        } catch (e2) {
          console.error('[TTS] ✗ Audio still failed after user gesture:', e2)
          cleanup()
          reject(e2)
        }
      }
      
      btn.addEventListener('click', onClick)
    }
  })
}

/**
 * Main Telugu TTS function using Pre-Generated Static Files
 * @param text - Telugu text to speak
 * @returns Promise that resolves when audio playback ends
 */
export async function playTeluguTTS(text: string): Promise<void> {
  console.log('[TTS] ========================================')
  console.log('[TTS] playTeluguTTS called with text:', text)
  console.log('[TTS] ========================================')
  
  if (typeof window === 'undefined') {
    console.log('[TTS] ✗ Server-side rendering, skipping TTS')
    return
  }
  
  if (!text || text.trim().length === 0) {
    console.log('[TTS] ✗ Empty text, skipping TTS')
    return
  }

  try {
    // Calculate hash of text
    const hash = await hashText(text)
    console.log('[TTS] Text hash:', hash)
    
    // Try pre-generated static file first
    const staticUrl = `/audio/telugu/${hash}.mp3`
    console.log('[TTS] Checking for pre-generated audio:', staticUrl)
    
    // Check if static file exists
    const checkResponse = await fetch(staticUrl, { method: 'HEAD' })
    
    if (checkResponse.ok) {
      console.log('[TTS] ✓ Using pre-generated static audio (fast!)')
      await playAudioFromBlobUrl(staticUrl)
      console.log('[TTS] ========================================')
      console.log('[TTS] ✓ TTS completed successfully (static)')
      console.log('[TTS] ========================================')
      return
    }
    
    // Fallback to server-side TTS for dynamic text
    console.log('[TTS] ⚠ Pre-generated audio not found, using server fallback')
    const serverUrl = `/api/tts?lang=te&text=${encodeURIComponent(text)}`
    console.log('[TTS] Server endpoint:', serverUrl)
    
    await playAudioFromBlobUrl(serverUrl)
    
    console.log('[TTS] ========================================')
    console.log('[TTS] ✓ TTS completed successfully (server)')
    console.log('[TTS] ========================================')
  } catch (err) {
    console.error('[TTS] ========================================')
    console.error('[TTS] ✗ TTS failed:', err)
    console.error('[TTS] ========================================')
    throw err // Re-throw so caller knows TTS failed
  }
}

/**
 * Legacy function for compatibility
 */
export async function generateTeluguTTS(text: string): Promise<string> {
  await playTeluguTTS(text)
  return ''
}
