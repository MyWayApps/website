"use client"

import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mic, Square, Volume2 } from "lucide-react"
import { getPassageById } from "@/lib/english-reading-data"
import { playStaticTTS } from "@/lib/static-tts"
import {
  startContinuousReadingAssessment,
  type ReadingSession,
} from "@/lib/reading-coach/web-speech-recognition"
import {
  ReadingSessionAggregator,
  type SentenceProgress,
  type SessionSummary,
} from "@/lib/reading-coach/session-aggregator"

type Status = "idle" | "listening" | "finished"
type WordStatus = "pending" | "correct" | "incorrect"

function speakWord(word: string) {
  playStaticTTS(word, "english", "en", "en-IN").catch((err) =>
    console.warn("[ReadingCoach] TTS playback failed:", err)
  )
}

// Colors each word of the original passage text green/red based on whether
// it was read correctly — the word itself never changes, only its color,
// so the sentence stays visually stable while the child reads.
function sentenceWordStatuses(
  sentenceText: string,
  progress: SentenceProgress | undefined
): { word: string; status: WordStatus }[] {
  const expectedWords = sentenceText.trim().split(/\s+/)
  const consumed = (progress?.timeline ?? []).filter((w) => w.errorType !== "Insertion")
  return expectedWords.map((word, i) => {
    const result = consumed[i]
    if (!result) return { word, status: "pending" as WordStatus }
    const status: WordStatus = result.errorType === "None" ? "correct" : "incorrect"
    return { word, status }
  })
}

function SentenceView({
  sentenceText,
  progress,
}: {
  sentenceText: string
  progress: SentenceProgress | undefined
}) {
  const words = sentenceWordStatuses(sentenceText, progress)

  return (
    <p className="text-2xl leading-relaxed mb-4">
      {words.map((w, i) => (
        <span
          key={i}
          onClick={w.status === "incorrect" ? () => speakWord(w.word) : undefined}
          title={w.status === "incorrect" ? "Tap to hear the correct pronunciation" : undefined}
          className={
            w.status === "correct"
              ? "text-green-600 font-semibold"
              : w.status === "incorrect"
              ? "text-red-600 font-semibold underline decoration-2 cursor-pointer"
              : "text-blue-900/50"
          }
        >
          {w.word}{" "}
        </span>
      ))}
    </p>
  )
}

function scoreLabel(scores: SessionSummary): { emoji: string; message: string } {
  const mistakeCount = scores.mistakes.length
  if (mistakeCount === 0) return { emoji: "🎉", message: "Perfect reading!" }
  if (mistakeCount <= 2) return { emoji: "🌟", message: `Great job! Only ${mistakeCount} mistake${mistakeCount > 1 ? "s" : ""}.` }
  return { emoji: "⭐", message: "Good try! Let's practice a bit more." }
}

export default function EnglishReadingLessonPage() {
  const params = useParams()
  const passageId = parseInt(params.id as string)
  const passage = getPassageById(passageId)

  const [status, setStatus] = useState<Status>("idle")
  const [sentenceProgress, setSentenceProgress] = useState<SentenceProgress[]>([])
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [micStatus, setMicStatus] = useState<string>("")
  const [interimTranscript, setInterimTranscript] = useState<string>("")

  const aggregatorRef = useRef<ReadingSessionAggregator | null>(null)
  const sessionRef = useRef<ReadingSession | null>(null)

  if (!passage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-200 to-orange-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Story not found</div>
      </div>
    )
  }

  const handleStartReading = async () => {
    setError(null)
    setSummary(null)
    setMicStatus("starting…")
    setInterimTranscript("")
    aggregatorRef.current = new ReadingSessionAggregator(passage.passage)
    setSentenceProgress(aggregatorRef.current.getSentenceProgress())
    setStatus("listening")

    try {
      sessionRef.current = await startContinuousReadingAssessment(
        passage.passage.join(" "),
        "en-US",
        {
          onUtterance: (result) => {
            aggregatorRef.current?.addUtterance(result)
            setSentenceProgress([...(aggregatorRef.current?.getSentenceProgress() ?? [])])
            setInterimTranscript("")
          },
          onError: (err) => {
            setError(err.message)
          },
          onInterim: (transcript) => {
            setInterimTranscript(transcript)
          },
          onStatus: (s) => {
            setMicStatus(s)
          },
        }
      )
    } catch (err) {
      setStatus("idle")
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleStopReading = async () => {
    await sessionRef.current?.stop()
    sessionRef.current = null
    setMicStatus("")
    setInterimTranscript("")
    setSummary(aggregatorRef.current?.getSummary() ?? null)
    setStatus("finished")
  }

  const handlePlayPassage = async () => {
    for (const line of passage.passage) {
      await speakLine(line)
    }
  }

  const speakLine = (line: string) =>
    playStaticTTS(line, "english", "en", "en-IN").catch((err) =>
      console.warn("[ReadingCoach] TTS playback failed:", err)
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 to-orange-400 p-4 relative overflow-hidden">
      <img
        src={passage.image}
        alt={passage.title}
        className="absolute bottom-10 right-10 w-40 h-40 md:w-56 md:h-56 object-contain opacity-90 pointer-events-none z-10"
        onError={(e) => {
          e.currentTarget.src = "/characters/bunny.png"
        }}
      />

      <div className="max-w-4xl mx-auto mb-4">
        <Link href="/english-reading">
          <Button
            className="bg-white/20 hover:bg-white/30 text-orange-900 border-2 border-white font-bold"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Stories
          </Button>
        </Link>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-orange-900">{passage.title}</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-white mb-6">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">📖 Read the Story</h2>
              <Button
                onClick={handlePlayPassage}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3"
              >
                <Volume2 className="h-6 w-6" />
              </Button>
            </div>

            {passage.passage.map((sentence, i) => (
              <SentenceView key={i} sentenceText={sentence} progress={sentenceProgress[i]} />
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-center mb-6">
          {status !== "listening" ? (
            <Button
              onClick={handleStartReading}
              className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-6 rounded-full font-bold"
            >
              <Mic className="mr-2 h-6 w-6" />
              Start Reading
            </Button>
          ) : (
            <Button
              onClick={handleStopReading}
              className="bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-6 rounded-full font-bold animate-pulse"
            >
              <Square className="mr-2 h-6 w-6" />
              Stop Reading
            </Button>
          )}
        </div>

        {status === "listening" && (
          <div className="text-center mb-6">
            <div className="inline-block bg-white/70 rounded-full px-4 py-1 text-orange-800 font-semibold text-sm mb-2">
              {micStatus === "speech-detected" && "🗣️ Speech detected"}
              {micStatus === "processing" && "⏳ Processing…"}
              {micStatus === "listening" && "🎤 Listening…"}
              {!micStatus && "🎤 Starting…"}
            </div>
            {interimTranscript && (
              <p className="text-orange-900/70 italic">Hearing: "{interimTranscript}"</p>
            )}
          </div>
        )}

        {error && (
          <Card className="bg-red-50 border-4 border-red-300 mb-6">
            <CardContent className="p-4 text-red-700 font-semibold">
              {error}
            </CardContent>
          </Card>
        )}

        {summary && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-4 border-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Result</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <ScoreTile label="Accuracy" value={summary.accuracyScore} />
                <ScoreTile label="Completeness" value={summary.completenessScore} />
              </div>

              {summary.mistakes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Mistakes</h3>
                  <ul className="space-y-1">
                    {summary.mistakes.map((m, i) => (
                      <li key={i} className="text-lg text-red-700">
                        {m.kind === "substituted" && `❌ ${m.saidWord} → Should be: ${m.expectedWord}`}
                        {m.kind === "skipped" && `❌ You missed the word "${m.expectedWord}"`}
                        {m.kind === "added" && `❌ You added the word "${m.saidWord}"`}
                        {m.kind === "mispronounced" && `❌ Try saying "${m.expectedWord}" again`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center text-2xl font-bold text-orange-700">
                {scoreLabel(summary).emoji} {scoreLabel(summary).message}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ScoreTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-orange-50 rounded-xl p-4 text-center border-2 border-orange-200">
      <div className="text-3xl font-bold text-orange-700">{value}%</div>
      <div className="text-sm text-orange-600 font-semibold">{label}</div>
    </div>
  )
}
