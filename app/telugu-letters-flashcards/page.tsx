"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react"

const teluguLetters = [
  { letter: "అ", transliteration: "a", audio: "telugu-a.mp3" },
  { letter: "ఆ", transliteration: "aa", audio: "telugu-aa.mp3" },
  { letter: "ఇ", transliteration: "e", audio: "telugu-e.mp3" },
  { letter: "ఈ", transliteration: "ee", audio: "telugu-ee.mp3" },
  { letter: "ఉ", transliteration: "u", audio: "telugu-u.mp3" },
  { letter: "ఊ", transliteration: "uu", audio: "telugu-uu.mp3" },
  { letter: "ఋ", transliteration: "ru", audio: "telugu-ru.mp3" },
  { letter: "ౠ", transliteration: "ru", audio: "telugu-ru.mp3" },
  { letter: "ఎ", transliteration: "ae", audio: "telugu-ae.mp3" },
  { letter: "ఏ", transliteration: "aee", audio: "telugu-aee.mp3" },
  { letter: "ఐ", transliteration: "ai", audio: "telugu-aeee.mp3" },
  { letter: "ఒ", transliteration: "o", audio: "telugu-o.mp3" },
  { letter: "ఓ", transliteration: "oo", audio: "telugu-oo.mp3" },
  { letter: "ఔ", transliteration: "au", audio: "telugu-au.mp3" },
  { letter: "అం", transliteration: "am", audio: "telugu-am.mp3" },
  { letter: "అః", transliteration: "aha", audio: "telugu-aha.mp3" },
  { letter: "క", transliteration: "ka", audio: "telugu-ka.mp3" },
  { letter: "ఖ", transliteration: "kha", audio: "telugu-kha.mp3" },
  { letter: "గ", transliteration: "ga", audio: "telugu-ga.mp3" },
  { letter: "ఘ", transliteration: "gha", audio: "telugu-gha.mp3" },
  { letter: "ఙ", transliteration: "nga", audio: "telugu-nga.mp3" },
  { letter: "చ", transliteration: "cha", audio: "telugu-cha.mp3" },
  { letter: "ఛ", transliteration: "chha", audio: "telugu-chcha.mp3" },
  { letter: "జ", transliteration: "ja", audio: "telugu-ja.mp3" },
  { letter: "ఝ", transliteration: "jha", audio: "telugu-jha.mp3" },
  { letter: "ఞ", transliteration: "nya", audio: "telugu-nya.mp3" },
  { letter: "ట", transliteration: "tta", audio: "telugu-tta.mp3" },
  { letter: "ఠ", transliteration: "ttha", audio: "telugu-ttha.mp3" },
  { letter: "డ", transliteration: "dda", audio: "telugu-dda.mp3" },
  { letter: "ఢ", transliteration: "ddha", audio: "telugu-ddha.mp3" },
  { letter: "ణ", transliteration: "nna", audio: "telugu-nna.mp3" },
  { letter: "త", transliteration: "ta", audio: "telugu-ta.mp3" },
  { letter: "థ", transliteration: "tha", audio: "telugu-thha.mp3" },
  { letter: "ద", transliteration: "da", audio: "telugu-da.mp3" },
  { letter: "ధ", transliteration: "dha", audio: "telugu-dhha.mp3" },
  { letter: "న", transliteration: "na", audio: "telugu-na.mp3" },
  { letter: "ప", transliteration: "pa", audio: "telugu-pa.mp3" },
  { letter: "ఫ", transliteration: "pha", audio: "telugu-pha.mp3" },
  { letter: "బ", transliteration: "ba", audio: "telugu-ba.mp3" },
  { letter: "భ", transliteration: "bha", audio: "telugu-bha.mp3" },
  { letter: "మ", transliteration: "ma", audio: "telugu-ma.mp3" },
  { letter: "య", transliteration: "ya", audio: "telugu-ya.mp3" },
  { letter: "ర", transliteration: "ra", audio: "telugu-ra.mp3" },
  { letter: "ల", transliteration: "la", audio: "telugu-la.mp3" },
  { letter: "వ", transliteration: "va", audio: "telugu-va.mp3" },
  { letter: "శ", transliteration: "sha", audio: "telugu-sha.mp3" },
  { letter: "ష", transliteration: "sha", audio: "telugu-sha.mp3" },
  { letter: "స", transliteration: "sa", audio: "telugu-sa.mp3" },
  { letter: "హ", transliteration: "ha", audio: "telugu-ha.mp3" },
  { letter: "ళ", transliteration: "lla", audio: "telugu-llaa.mp3" },
  { letter: "క్ష", transliteration: "ksha", audio: "telugu-ksha.mp3" },
  { letter: "ఱ", transliteration: "rra", audio: "telugu-rra.mp3" }
]

const teluguWords = [
  "అమ్మ", "ఆవు", "ఇల్లు", "ఈగ", "ఉడుత", "ఊరు", "ఋషి", "ఋషి", "ఎలుక", "ఏనుగు", "ఐదు", "ఒంటె", "ఓడ", "ఔషధం",
  "అం", "అః",
  "కప్ప", "ఖడ్గం", "గుర్రం", "ఘంట", "ఙ", 
  "చిలుక", "ఛత్రం", "జింక", "ఝ", "ఞ",
  "టమాట", "కంఠము", "డేగ", "ఢంకా", "వీణ",
  "తాబేలు", "రథం", "దీపం", "ధనుస్సు", "నక్క",
  "పిల్లి", "ఫలం", "బావి", "భవనం", "మేక",
  "యంత్రం", "రాజు", "లేడి", "వర్షం", "శక్తి", "ష", "సింహం", "హంస", "తాళం", "రక్ష", "ఱ"
]

export default function TeluguFlashCards() {
  const [index, setIndex] = useState(0)
  const [showWord, setShowWord] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Play audio for current letter
  const playAudio = () => {
    if (audioRef.current) {
      console.log("Attempting to play audio:", teluguLetters[index].audio)
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error)
        // Try to reload the audio element
        if (audioRef.current) {
          audioRef.current.load()
          setTimeout(() => {
            audioRef.current?.play().catch(e => console.error("Retry failed:", e))
          }, 100)
        }
      })
    } else {
      console.log("Audio ref is null")
    }
  }

  // Handle letter click - replace letter with word, then bounce back
  const handleLetterClick = () => {
    setShowWord(true)
    // Don't play audio when showing word (padam)
    
    // Hide word and bounce back to letter after 2.5 seconds
    setTimeout(() => {
      setShowWord(false)
    }, 2500)
  }

  // Auto-play audio when index changes
  useEffect(() => {
    console.log("Index changed to:", index, "Audio file:", teluguLetters[index].audio)
    // Small delay to ensure audio element is ready
    const timer = setTimeout(() => {
      playAudio()
    }, 100)
    return () => clearTimeout(timer)
  }, [index])

  // Handle audio element load
  const handleAudioLoad = () => {
    console.log("Audio loaded for:", teluguLetters[index].letter)
    // Auto-play when audio is loaded
    playAudio()
  }


  // Add keyboard event listeners for arrow keys
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setShowWord(false) // Clear word display immediately
        prev()
      } else if (event.key === 'ArrowRight') {
        setShowWord(false) // Clear word display immediately
        next()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Go back to home page
  const onBackToHome = () => {
    window.location.href = "/"
  }

  // Reset the flashcards game
  const resetGame = () => {
    setIndex(0)
  }

  const prev = () => {
    setShowWord(false) // Clear any word display immediately
    setIndex((i) => {
      const newIndex = i === 0 ? teluguLetters.length - 1 : i - 1
      return newIndex
    })
  }
  
  const next = () => {
    setShowWord(false) // Clear any word display immediately
    setIndex((i) => {
      const newIndex = i === teluguLetters.length - 1 ? 0 : i + 1
      return newIndex
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-300 to-green-500">
      
      {/* Header - Aligned with rectangle */}
      <div className="w-1/2 min-w-[400px] mb-6">
        <Button
          onClick={onBackToHome}
          className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-2 border-yellow-400 font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
      </div>

      <div className="flex items-center justify-center">
        {/* Back Button - Left of Rectangle */}
        <Button 
          onClick={prev} 
          variant="outline" 
          className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-2 border-yellow-400 font-bold text-lg px-6 py-3 mr-8"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <Card className="w-1/2 h-1/2 min-w-[400px] min-h-[400px] flex flex-col items-center justify-center shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center h-full p-8">
            {/* Clickable Telugu Letter/Word Container */}
            <div 
              className="text-9xl font-bold mb-4 text-indigo-800 cursor-pointer hover:scale-110 transition-all duration-300 select-none min-h-[120px] flex items-center justify-center"
              onClick={handleLetterClick}
            >
              {showWord && teluguWords[index] && teluguWords[index] !== teluguLetters[index].letter ? (
                <div className="text-6xl font-bold text-green-600 text-center bg-teal-300 px-8 py-6 rounded-xl shadow-lg">
                  <div className="text-2xl text-indigo-600 mb-2">పదం</div>
                  <div>{teluguWords[index]}</div>
                </div>
              ) : (
                teluguLetters[index].letter
              )}
            </div>
            
            
            {/* Hidden audio element */}
            <audio
              ref={audioRef}
              src={`/audio/${teluguLetters[index].audio}`}
              preload="auto"
              onLoadedData={handleAudioLoad}
              onPlay={() => setIsPlaying(true)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error("Audio error:", e)
                setIsPlaying(false)
              }}
            />
            
            {/* Volume Button - Center */}
            <div className="flex items-center justify-center w-full px-4">
              <Button 
                onClick={playAudio} 
                variant="outline" 
                className="bg-teal-300 hover:bg-teal-400 text-teal-800 border-2 border-teal-400 px-8 py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <Volume2 className="h-8 w-8 animate-pulse" />
                ) : (
                  <Volume2 className="h-8 w-8" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Next Button - Right of Rectangle */}
        <Button 
          onClick={next} 
          variant="outline" 
          className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border-2 border-yellow-400 font-bold text-lg px-6 py-3 ml-8"
        >
          <ArrowRight className="mr-2 h-5 w-5" />
          Next
        </Button>
      </div>
    </div>
  )
}