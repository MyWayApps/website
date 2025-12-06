"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RotateCcw, Volume2, CheckCircle, XCircle } from "lucide-react"
import { playTeluguTTS } from "@/lib/telugu-tts"

// All Telugu words data organized by groups
const teluguWordsData = {
  "అ-ఆ": [
    { word: "తల", audio: "padalu-tala.mp3" },
    { word: "జడ", audio: "padalu-jada.mp3" },
    { word: "అల", audio: "padalu-ala.mp3" },
    { word: "వల", audio: "padalu-vala.mp3" },
    { word: "అమ్మ", audio: "padalu-amma.mp3" },
    { word: "గంప", audio: "padalu-gampa.mp3" },
    { word: "దండ", audio: "padalu-danda.mp3" },
    { word: "బండ", audio: "padalu-banda.mp3" },
    { word: "పంట", audio: "padalu-panta.mp3" },
    { word: "మంట", audio: "padalu-manta.mp3" },
    { word: "హంస", audio: "padalu-hamsa.mp3" },
    { word: "పనస", audio: "padalu-panasa.mp3" },
    { word: "గడప", audio: "padalu-gadapa.mp3" },
    { word: "నడక", audio: "padalu-nadaka.mp3" },
    { word: "అలక", audio: "padalu-alaka.mp3" },
    { word: "అటక", audio: "padalu-ataka.mp3" },
    { word: "పలక", audio: "padalu-palaka.mp3" },
    { word: "తలగడ", audio: "padalu-talagada.mp3" },
    { word: "గంట", audio: "padalu-ganta.mp3" },
    { word: "చాప", audio: "padalu-chaapa.mp3" },
    { word: "కాయ", audio: "padalu-kaya.mp3" },
    { word: "మామ", audio: "padalu-mama.mp3" },
    { word: "తాత", audio: "padalu-tata.mp3" },
    { word: "మాట", audio: "padalu-maata.mp3" },
    { word: "పాట", audio: "padalu-pata.mp3" },
    { word: "నావ", audio: "padalu-nava.mp3" },
    { word: "వాన", audio: "padalu-vana.mp3" },
    { word: "పాక", audio: "padalu-paka.mp3" },
    { word: "పాప", audio: "padalu-paapa.mp3" },
    { word: "బావ", audio: "padalu-baava.mp3" },
    { word: "జావ", audio: "padalu-jaava.mp3" },
    { word: "నార", audio: "padalu-naara.mp3" },
    { word: "పార", audio: "padalu-paara.mp3" },
    { word: "కాకర", audio: "padalu-kaakara.mp3" },
    { word: "వాసన", audio: "padalu-vasana.mp3" },
    { word: "చందమామ", audio: "padalu-chandamaama.mp3" },
    { word: "తామర", audio: "padalu-taamara.mp3" },
    { word: "పాల కడవ", audio: "padalu-paalakadava.mp3" },
    { word: "పాప ఆట", audio: "padalu-paapaaata.mp3" },
    { word: "కాకర కాయ", audio: "padalu-kaakarakaaya.mp3" },
    { word: "వంకాయలు", audio: "padalu-vankaayalu.mp3" },
    { word: "మన", audio: "padalu-mana.mp3" }
  ],
  "ఇ": [
    { word: "కాకి", audio: "padalu-kaaki.mp3" },
    { word: "బడి", audio: "padalu-badi.mp3" },
    { word: "చలి", audio: "padalu-chali.mp3" },
    { word: "గది", audio: "padalu-gadi.mp3" },
    { word: "నది", audio: "padalu-nadi.mp3" },
    { word: "బండి", audio: "pandalu-bandi.mp3" },
    { word: "తిండి", audio: "padalu-tindi.mp3" },
    { word: "పంది", audio: "padalu-pandi.mp3" },
    { word: "నంది", audio: "padalu-nandi.mp3" },
    { word: "పని", audio: "padalu-pani.mp3" },
    { word: "గాలి", audio: "padalu-gaali.mp3" },
    { word: "దారి", audio: "padalu-daari.mp3" },
    { word: "బావి", audio: "padalu-baavi.mp3" },
    { word: "ఆకలి", audio: "padalu-aakali.mp3" },
    { word: "వాకిలి", audio: "padalu-vaakili.mp3" },
    { word: "నాగలి", audio: "padalu-naagali.mp3" },
    { word: "చావిడి", audio: "padalu-chaavidi.mp3" },
    { word: "చలి గాలి", audio: "padalu-chaligaali.mp3" },
    { word: "జడి వాన", audio: "padalu-jadivaana.mp3" },
    { word: "బడి దారి", audio: "padalu-badidaari.mp3" },
    { word: "చింత గింజ", audio: "padalu-chintaginja.mp3" },
    { word: "పిండి సంచి", audio: "padalu-pindisanchi.mp3" },
    { word: "బంతి ఆట", audio: "padalu-bantiaata.mp3" },
    { word: "అరటి పిలక", audio: "padalu-aratipilaka.mp3" },
    { word: "బావి గిలక", audio: "padalu-baavigilaka.mp3" }
  ],
  "ఈ": [
    { word: "చీమ", audio: "padalu-cheema.mp3" },
    { word: "చీర", audio: "padalu-cheera.mp3" },
    { word: "బీర", audio: "padalu-beera.mp3" },
    { word: "నీడ", audio: "padalu-needa.mp3" },
    { word: "చీడ", audio: "padalu-ceeda.mp3" },
    { word: "ఈగ", audio: "padalu-eega.mp3" },
    { word: "ఈల", audio: "padalu-eela.mp3" },
    { word: "గీత", audio: "padalu-geeta.mp3" },
    { word: "తీగ", audio: "padalu-teega.mp3" },
    { word: "సీత", audio: "padalu-seeta.mp3" },
    { word: "పీత", audio: "padalu-peeta.mp3" },
    { word: "జీడి", audio: "padalu-jeedi.mp3" },
    { word: "వీణ", audio: "padalu-veena.mp3" },
    { word: "తీపి", audio: "padalu-teepi.mp3" },
    { word: "సీసా", audio: "padalu-seesa.mp3" },
    { word: "చీకటి", audio: "padalu-cheekati.mp3" },
    { word: "మీగడ", audio: "padalu-meegada.mp3" },
    { word: "చలి చీమ", audio: "padalu-chalicheema.mp3" },
    { word: "బీర తీగ", audio: "padalu-beerateega.mp3" },
    { word: "లీల ఈల", audio: "padalu-leelaeela.mp3" },
    { word: "పాల సీసా", audio: "padalu-paalaseesa.mp3" },
    { word: "దీపం నీడ", audio: "padalu-deepamneeda.mp3" },
    { word: "చీర పీలిక", audio: "padalu-cheerapeelika.mp3" },
    { word: "మీగడ తీపి", audio: "padalu-meegadateepi.mp3" },
    { word: "వీణ మీద", audio: "padalu-veenameeda.mp3" }
  ],
  "ఉ": [
    { word: "పులి", audio: "padalu-puli.mp3" },
    { word: "తలుపు", audio: "padalu-talupu.mp3" },
    { word: "ఆకు", audio: "padalu-aaku.mp3" },
    { word: "ఆవు", audio: "padalu-aavu.mp3" },
    { word: "పాలు", audio: "padalu-paalu.mp3" },
    { word: "కాలు", audio: "padalu-kaalu.mp3" },
    { word: "వీపు", audio: "padalu-veepu.mp3" },
    { word: "కడుపు", audio: "padalu-kadupu.mp3" },
    { word: "కుండ", audio: "padalu-kunda.mp3" },
    { word: "గుంట", audio: "padalu-gunta.mp3" },
    { word: "పండు", audio: "padalu-pandu.mp3" },
    { word: "చదువు", audio: "padalu-chaduvu.mp3" },
    { word: "గురువు", audio: "padalu-guruvu.mp3" },
    { word: "ఉడుత", audio: "padalu-oduta.mp3" },
    { word: "పరుగు", audio: "padalu-parugu.mp3" },
    { word: "పసుపు", audio: "padalu-pasupu.mp3" },
    { word: "పశువు", audio: "padalu-pasuvu.mp3" },
    { word: "బరువు", audio: "padalu-baruvu.mp3" },
    { word: "శిశువు", audio: "padalu-sisuvu.mp3" },
    { word: "చీపురు", audio: "padalu-cheepuru.mp3" },
    { word: "ఆవు పాలు", audio: "padalu-aavupaalu.mp3" },
    { word: "పండుటాకు", audio: "padalu-pandutaaku.mp3" },
    { word: "బురద నీరు", audio: "padalu-buradaneeru.mp3" },
    { word: "నీటి బుడగ", audio: "padalu-neetibudaga.mp3" },
    { word: "ఉడుత పరుగు", audio: "padalu-odutaparugu.mp3" },
    { word: "చీడ పురుగు", audio: "padalu-cheedapurugu.mp3" },
    { word: "చీర అంచు", audio: "padalu-cheeraanchu.mp3" },
    { word: "ఆకు మందు", audio: "padalu-aakumandu.mp3" },
    { word: "నలుపు రంగు", audio: "padalu-nalupurangu.mp3" },
    { word: "ఉరుము", audio: "padalu-urumu.mp3" },
    { word: "ఉరి మింది", audio: "padalu-urimindi.mp3" },
    { word: "అరుగు", audio: "padalu-arugu.mp3" },
    { word: "నిండా", audio: "padalu-ninda.mp3" },
    { word: "మంచు", audio: "padalu-manchu.mp3" },
    { word: "చినుకులు", audio: "padalu-chinukulu.mp3" }
  ],
  "ఊ": [
    { word: "దూడ", audio: "padalu-dooda.mp3" },
    { word: "గూడు", audio: "padalu-goodu.mp3" },
    { word: "కూర", audio: "padalu-koora.mp3" },
    { word: "బూర", audio: "padalu-boora.mp3" },
    { word: "కూడు", audio: "padalu-koodu.mp3" },
    { word: "ఊరు", audio: "padalu-ooru.mp3" },
    { word: "చూరు", audio: "padalu-chooru.mp3" },
    { word: "దూది", audio: "padalu-doodi.mp3" },
    { word: "సూది", audio: "padalu-soodi.mp3" },
    { word: "కూత", audio: "padalu-koota.mp3" },
    { word: "పూత", audio: "padalu-pootha.mp3" },
    { word: "మూత", audio: "padalu-moota.mp3" },
    { word: "మూట", audio: "padalu-mootha.mp3" },
    { word: "పూట", audio: "padalu-poota.mp3" },
    { word: "నూక", audio: "padalu-nooka.mp3" },
    { word: "పూస", audio: "padalu-poosa.mp3" },
    { word: "పూవు", audio: "padalu-poovu.mp3" },
    { word: "ఊయల", audio: "padalu-udata.mp3" },
    { word: "బూడిద", audio: "padalu-boodida.mp3" },
    { word: "కూతురు", audio: "padalu-kooturu.mp3" },
    { word: "దూరము", audio: "padalu-dooramu.mp3" },
    { word: "దూలము", audio: "padalu-doolamu.mp3" },
    { word: "మూకుడు", audio: "padalu-mookudu.mp3" },
    { word: "చూడి ఆవు", audio: "padalu-choodiaavu.mp3" },
    { word: "బంతి పూవు", audio: "padalu-bantipuvvu.mp3" },
    { word: "మామిడి పూత", audio: "padalu-maamidipoota.mp3" },
    { word: "కాకి గూడు", audio: "padalu-kaakigudu.mp3" },
    { word: "గూడు బండి", audio: "padalu-goodubandi.mp3" },
    { word: "నూతి నీరు", audio: "padalu-nootineeru.mp3" },
    { word: "పూల మాల", audio: "padalu-poolamaala.mp3" },
    { word: "కూరగాయలు", audio: "padalu-kooragayalu.mp3" },
    { word: "పూసల దండ", audio: "padalu-poosaladanda.mp3" },
    { word: "నూకల మూట", audio: "padalu-nookalamaata.mp3" },
    { word: "ఆకు కూరలు", audio: "padalu-aakukooralu.mp3" },
    { word: "కూరల మూకుడు", audio: "padalu-kooralamookudu.mp3" },
    { word: "కాకి కూసింది", audio: "padalu-kaakikoosindi.mp3" },
    { word: "పూవు పూసింది", audio: "padalu-puvvupoosindi.mp3" },
    { word: "మూట ఊడింది", audio: "padalu-mootaoodindi.mp3" },
    { word: "మా ఊరు గూడూరు", audio: "padalu-maavuruguduru.mp3" }
  ],
  "ఎ": [
    { word: "గెల", audio: "padalu-gela.mp3" },
    { word: "చెవి", audio: "padalu-chevi.mp3" },
    { word: "మెడ", audio: "padalu-meda.mp3" },
    { word: "గారె", audio: "padalu-gare.mp3" },
    { word: "బూరె", audio: "padalu-boore.mp3" },
    { word: "నూనె", audio: "padalu-nune.mp3" },
    { word: "నెమలి", audio: "padalu-nemali.mp3" },
    { word: "ఎండ", audio: "padalu-enda.mp3" },
    { word: "బెండ", audio: "padalu-benda.mp3" },
    { word: "పిందె", audio: "padalu-pinde.mp3" },
    { word: "పెంకు", audio: "padalu-penku.mp3" },
    { word: "చెంబు", audio: "padalu-chembu.mp3" },
    { word: "ఎలక", audio: "padalu-elaka.mp3" },
    { word: "తెలివి", audio: "padalu-telivi.mp3" },
    { word: "తెలుగు", audio: "padalu-telugu.mp3" },
    { word: "వెలుగు", audio: "padalu-velugu.mp3" },
    { word: "పెరుగు", audio: "padalu-perugu.mp3" },
    { word: "మెతుకు", audio: "padalu-metuku.mp3" },
    { word: "తెలుపు", audio: "padalu-telupu.mp3" },
    { word: "అరటి గెల", audio: "padalu-aratigela.mp3" },
    { word: "బెండ పిందె", audio: "padalu-bendapinde.mp3" },
    { word: "నూనె చెంబు", audio: "padalu-nunechembu.mp3" },
    { word: "చెరువు నీరు", audio: "padalu-chruvuneru.mp3" },
    { word: "ఎండవెలుగు", audio: "padalu-endavelugu.mp3" },
    { word: "సెనగ నూనె", audio: "padalu-senaganune.mp3" },
    { word: "గుడిసె తడక", audio: "padalu-gudisetadaka.mp3" },
    { word: "చందమామ తెలుపు", audio: "padalu-chandamamatelupu.mp3" },
    { word: "అరటి గెల పండింది", audio: "padalu-aratigelapandindi.mp3" },
    { word: "ఇది తెలుగు వాచకము", audio: "padalu-iditeluguvaachakamu.mp3" },
    { word: "ఈ నెల ఎండలు మెండుగా కాశాయి", audio: "padalu-enelaendalumendugakasayi.mp3" }
  ],
  "ఏ": [
    { word: "మేక", audio: "padalu-meka.mp3" },
    { word: "చేప", audio: "padalu-chepa.mp3" },
    { word: "కేక", audio: "padalu-keka.mp3" },
    { word: "చేట", audio: "padalu-cheta.mp3" },
    { word: "పేడ", audio: "padalu-peda.mp3" },
    { word: "మేడ", audio: "padalu-meeda.mp3" },
    { word: "మేకు", audio: "padalu-meku.mp3" },
    { word: "జేబు", audio: "padalu-jebu.mp3" },
    { word: "చేను", audio: "padalu-chenu.mp3" },
    { word: "పేను", audio: "padalu-penu.mp3" },
    { word: "తేలు", audio: "padalu-telu.mp3" },
    { word: "గేద", audio: "padalu-geda.mp3" },
    { word: "తేనె", audio: "padalu-tene.mp3" },
    { word: "పేరు", audio: "padalu-peru.mp3" },
    { word: "వేరు", audio: "padalu-veru.mp3" },
    { word: "చేదు", audio: "padalu-chedu.mp3" },
    { word: "మేత", audio: "padalu-meta.mp3" },
    { word: "రేపు", audio: "padalu-repu.mp3" },
    { word: "రేవు", audio: "padalu-revu.mp3" },
    { word: "ఏనుగు", audio: "padalu-enugu.mp3" },
    { word: "తేమ నేల", audio: "padalu-temanela.mp3" },
    { word: "వేడి పాలు", audio: "padalu-vedipalu.mp3" },
    { word: "రేగు పండు", audio: "padalu-regupandu.mp3" },
    { word: "వేరు సెనగ", audio: "padalu-verusenaga.mp3" },
    { word: "చేదు మందు", audio: "padalu-chedumandu.mp3" },
    { word: "గేదె పెరుగు", audio: "padalu-gedeperugu.mp3" },
    { word: "తేలిక మూట", audio: "padalu-telikamoota.mp3" },
    { word: "పసువులమేత", audio: "padalu-pasavulameta.mp3" },
    { word: "పులి వేషము", audio: "padalu-puliveshamu.mp3" },
    { word: "పురుగు", audio: "padalu-purugu.mp3" },
    { word: "వేలు", audio: "padalu-velu.mp3" },
    { word: "మీద", audio: "padalu-mida.mp3" },
    { word: "తేలు", audio: "padalu-teloo.mp3" }
  ]
}

export default function ListenPointGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [masteredWords, setMasteredWords] = useState<string[]>([])
  const [showMasteredTab, setShowMasteredTab] = useState(false)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  
  const goodJobRef = useRef<HTMLAudioElement | null>(null)
  const buzzerRef = useRef<HTMLAudioElement | null>(null)

  // localStorage functions for mastered words
  const loadMasteredWords = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('telugu-mastered-words')
      return saved ? JSON.parse(saved) : []
    }
    return []
  }

  const saveMasteredWords = (words: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('telugu-mastered-words', JSON.stringify(words))
    }
  }

  // Delete functions
  const deleteWord = (wordToDelete: string) => {
    const newMasteredWords = masteredWords.filter(word => word !== wordToDelete)
    setMasteredWords(newMasteredWords)
    saveMasteredWords(newMasteredWords)
    setSelectedWords(prev => prev.filter(word => word !== wordToDelete))
  }

  const deleteSelectedWords = () => {
    const newMasteredWords = masteredWords.filter(word => !selectedWords.includes(word))
    setMasteredWords(newMasteredWords)
    saveMasteredWords(newMasteredWords)
    setSelectedWords([])
  }

  const toggleWordSelection = (word: string) => {
    setSelectedWords(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    )
  }

  const selectAllWords = () => {
    setSelectedWords(masteredWords)
  }

  const clearSelection = () => {
    setSelectedWords([])
  }

  // Generate 5 questions with random words (avoiding mastered words)
  const generateQuestions = () => {
    const questions = []
    const allWords = Object.values(teluguWordsData).flat()
    
    // Filter out mastered words from available words
    const availableWords = allWords.filter(word => !masteredWords.includes(word.word))
    
    // If we don't have enough words, use all words
    const wordsToUse = availableWords.length >= 5 ? availableWords : allWords
    
    for (let i = 0; i < 5; i++) {
      // Select a random correct word from available words
      const correctWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)]
      
      // Select 2 random wrong words (excluding the correct word)
      const remainingWords = wordsToUse.filter(word => word.word !== correctWord.word)
      const wrongWords = remainingWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
      
      // Combine and shuffle options
      const allOptions = [correctWord, ...wrongWords].sort(() => Math.random() - 0.5)
      
      questions.push({
        correctWord,
        options: allOptions
      })
    }
    
    return questions
  }

  // Initialize questions and load mastered words
  useEffect(() => {
    const loadedMasteredWords = loadMasteredWords()
    setMasteredWords(loadedMasteredWords)
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
    setIsLoading(false)
  }, [])

  // Reset state when question changes and auto-play audio
  useEffect(() => {
    if (questions[currentQuestion]) {
      setShowResult(null)
      setShowConfetti(false)
      // Auto-play audio when question loads
      setTimeout(() => {
        playWordAudio(questions[currentQuestion].correctWord.word)
      }, 500)
    }
  }, [currentQuestion, questions])

  const currentQ = questions[currentQuestion]

  // Play word audio using TTS
  const playWordAudio = async (word: string) => {
    if (isPlayingTTS) return
    
    try {
      setIsPlayingTTS(true)
      await playTeluguTTS(word)
    } catch (error) {
      console.error("TTS play failed:", error)
    } finally {
      setIsPlayingTTS(false)
    }
  }

  const playGoodJob = () => {
    if (goodJobRef.current) {
      goodJobRef.current.play().catch(e => console.error("Good job audio failed:", e))
    }
  }

  const playBuzzer = () => {
    if (buzzerRef.current) {
      buzzerRef.current.play().catch(e => console.error("Buzzer audio failed:", e))
    }
  }

  // Handle word selection
  const handleWordClick = (selectedWord: any) => {
    if (showResult) return // Already answered
    
    if (selectedWord.word === currentQ.correctWord.word) {
      // Correct answer
      setShowResult("correct")
      setScore(score + 1)
      setShowConfetti(true)
      playGoodJob()
      
      // Add to mastered words if not already there
      if (!masteredWords.includes(selectedWord.word)) {
        const newMasteredWords = [...masteredWords, selectedWord.word]
        setMasteredWords(newMasteredWords)
        saveMasteredWords(newMasteredWords)
      }
      
      setTimeout(() => {
        setShowConfetti(false)
        if (currentQuestion < 4) {
          setCurrentQuestion(currentQuestion + 1)
        } else {
          setGameOver(true)
        }
      }, 3000)
    } else {
      // Wrong answer
      setShowResult("wrong")
      playBuzzer()
      setTimeout(() => {
        setShowResult(null)
      }, 1500)
    }
  }

  // Handle back to main
  const handleBackToMain = () => {
    window.location.href = "/telugu-words"
  }

  // Handle restart
  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
    setShowResult(null)
    setShowConfetti(false)
    setSelectedWords([]) // Clear selection
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)
  }

  if (isLoading || !currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 p-4 flex flex-col items-center justify-center">
        <div className="text-2xl text-purple-800 font-bold">Loading...</div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 p-4 flex flex-col items-center justify-center">
        <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">Game Over!</h1>
            <p className="text-2xl text-purple-600 mb-4">Your Score: {score} / 5</p>
            {masteredWords.length > 0 && (
              <div className="mb-6">
                <p className="text-lg text-green-700 mb-3">Words you mastered in this game:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {masteredWords.map((word, index) => (
                    <span
                      key={index}
                      className="bg-green-100 border border-green-300 rounded px-3 py-1 text-green-800 font-bold"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRestart}
                className="bg-purple-200 hover:bg-purple-300 text-purple-800 border-2 border-purple-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
              <Button
                onClick={handleBackToMain}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-400 font-bold text-lg px-6 py-3"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-500 p-4 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-1/2 min-w-[600px] max-w-[800px] mb-8">
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackToMain}
            className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>
          
          <Button
            onClick={() => setShowMasteredTab(!showMasteredTab)}
            className="bg-white/20 hover:bg-white/30 text-purple-800 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            🏆 Mastered Words ({masteredWords.length})
          </Button>
        </div>
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">
          వినండి – గుర్తించండి
        </h1>
        <p className="text-xl text-purple-700">
          Question {currentQuestion + 1} of 5 | Score: {score}
        </p>
      </div>

      {/* Mastered Words Tab */}
      {showMasteredTab && (
        <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0 mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-800">
                🏆 Words You've Mastered ({masteredWords.length})
              </h2>
              {masteredWords.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={selectAllWords}
                    className="bg-blue-200 hover:bg-blue-300 text-blue-800 border border-blue-400 text-sm px-3 py-1"
                    variant="outline"
                  >
                    Select All
                  </Button>
                  <Button
                    onClick={clearSelection}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-400 text-sm px-3 py-1"
                    variant="outline"
                  >
                    Clear
                  </Button>
                  {selectedWords.length > 0 && (
                    <Button
                      onClick={deleteSelectedWords}
                      className="bg-red-200 hover:bg-red-300 text-red-800 border border-red-400 text-sm px-3 py-1"
                      variant="outline"
                    >
                      Delete Selected ({selectedWords.length})
                    </Button>
                  )}
                </div>
              )}
            </div>
            {masteredWords.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {masteredWords.map((word, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg p-3 text-center font-bold transition-all duration-200 ${
                      selectedWords.includes(word)
                        ? 'bg-blue-100 border-2 border-blue-400 text-blue-800'
                        : 'bg-green-100 border-2 border-green-300 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="flex-1">{word}</span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => toggleWordSelection(word)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs ${
                            selectedWords.includes(word)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-400 hover:border-blue-400'
                          }`}
                        >
                          {selectedWords.includes(word) && '✓'}
                        </button>
                        <button
                          onClick={() => deleteWord(word)}
                          className="w-4 h-4 rounded bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 text-lg">
                No words mastered yet. Keep playing to build your vocabulary! 🌟
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Game Card */}
      <Card className="w-1/2 min-w-[600px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="text-center">
            {/* Instructions */}
            <p className="text-lg text-purple-700 mb-6">
              Listen to the audio and click on the correct word
            </p>

            {/* Play Audio Button */}
            <div className="mb-8">
              <Button
                onClick={() => playWordAudio(currentQ.correctWord.word)}
                disabled={isPlayingTTS}
                className="bg-purple-200 hover:bg-purple-300 text-purple-800 border-2 border-purple-400 font-bold text-xl px-8 py-4 disabled:opacity-50"
                variant="outline"
              >
                <Volume2 className="mr-2 h-6 w-6" />
                {isPlayingTTS ? "Playing..." : "Play Audio"}
              </Button>
            </div>

            {/* Word Options */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentQ.options.map((word: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word)}
                  disabled={showResult !== null}
                  className={`p-6 border-2 rounded-lg text-2xl font-bold transition-all duration-200 ${
                    showResult === "correct" && word.word === currentQ.correctWord.word
                      ? 'bg-green-200 border-green-500 text-green-800'
                      : showResult === "wrong" && word.word === currentQ.correctWord.word
                      ? 'bg-yellow-200 border-yellow-500 text-yellow-800'
                      : showResult === "wrong" && word.word !== currentQ.correctWord.word
                      ? 'bg-red-200 border-red-500 text-red-800'
                      : showResult
                      ? 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200 hover:border-purple-500 cursor-pointer'
                  }`}
                >
                  {word.word}
                </button>
              ))}
            </div>

            {/* Result Display */}
            {showResult && (
              <div className="mb-6">
                {showResult === "correct" ? (
                  <div className="flex items-center justify-center text-green-600 text-3xl font-bold">
                    <CheckCircle className="mr-2 h-10 w-10" />
                    Excellent! Great Job! 🎉
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-red-600 text-2xl font-bold">
                    <XCircle className="mr-2 h-8 w-8" />
                    Wrong! Try Again!
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'][Math.floor(Math.random() * 10)]
                }}
              ></div>
            </div>
          ))}
          {[...Array(30)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-4 h-4 text-pink-400"
                style={{
                  transform: 'rotate(45deg)',
                  backgroundColor: '#ff6b6b',
                  clipPath: 'polygon(50% 0%, 80% 20%, 100% 60%, 80% 100%, 20% 100%, 0% 60%, 20% 20%)'
                }}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={goodJobRef} src="/audio/happy_tune.mp3" preload="auto" />
      <audio ref={buzzerRef} src="/audio/buzz_audio.mp3" preload="auto" />
    </div>
  )
}
