"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
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
import { recognizeOneSentence, ensureMicrophoneAccess } from "@/lib/reading-coach/web-speech-single-utterance"
import { isSafari } from "@/lib/reading-coach/browser-detect"
import {
  ReadingSessionAggregator,
  type SentenceProgress,
  type SessionSummary,
} from "@/lib/reading-coach/session-aggregator"
import { useCurrentUser } from "@/hooks/use-current-user"
import { getApplicationByName } from "@/lib/database-supabase"
import type { Application } from "@/lib/database-supabase"
import { saveGameScore } from "@/lib/scoring"
import { getActivityMasteryTier } from "@/lib/mastery-evidence"
import type { MasteryTier } from "@/lib/mastery"
import { MasteryBadge } from "@/components/mastery-badge"

type Status = "idle" | "listening" | "finished"
type WordStatus = "pending" | "correct" | "incorrect" | "tentative" | "pointer"

function speakWord(word: string) {
  playStaticTTS(word, "english", "en", "en-IN").catch((err) =>
    console.warn("[ReadingCoach] TTS playback failed:", err)
  )
}

// Flattens the whole passage into one status-per-word timeline: committed
// correct/incorrect words from the aggregator, then a run of "tentative"
// words matched by the current in-progress (not yet final) utterance, then
// a single "pointer" word marking where the reader is expected to be next.
function buildFlatStatuses(
  wordCountsPerSentence: number[],
  sentenceProgress: SentenceProgress[],
  tentativeCount: number
): WordStatus[] {
  const committed: WordStatus[] = []
  for (const sp of sentenceProgress) {
    for (const w of sp.timeline) {
      if (w.errorType === "Insertion") continue
      committed.push(w.errorType === "None" ? "correct" : "incorrect")
    }
  }

  const total = wordCountsPerSentence.reduce((a, b) => a + b, 0)
  const statuses: WordStatus[] = []
  for (let i = 0; i < total; i++) {
    if (i < committed.length) statuses.push(committed[i])
    else if (i < committed.length + tentativeCount) statuses.push("tentative")
    else if (i === committed.length + tentativeCount) statuses.push("pointer")
    else statuses.push("pending")
  }
  return statuses
}

function SentenceView({ sentenceText, statuses }: { sentenceText: string; statuses: WordStatus[] }) {
  const words = sentenceText.trim().split(/\s+/)

  return (
    <p className="text-2xl leading-relaxed mb-4">
      {words.map((word, i) => {
        const status = statuses[i] ?? "pending"
        return (
          <span
            key={i}
            onClick={status === "incorrect" ? () => speakWord(word) : undefined}
            title={status === "incorrect" ? "Tap to hear the correct pronunciation" : undefined}
            className={
              status === "correct"
                ? "text-green-600 font-semibold"
                : status === "tentative"
                ? "text-green-400 font-semibold"
                : status === "incorrect"
                ? "text-red-600 font-semibold underline decoration-2 cursor-pointer"
                : status === "pointer"
                ? "text-blue-900 font-semibold bg-yellow-200 rounded px-1 ring-2 ring-yellow-400 animate-pulse"
                : "text-blue-900/50"
            }
          >
            {word}{" "}
          </span>
        )
      })}
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
  const [tentativeCount, setTentativeCount] = useState(0)
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [micStatus, setMicStatus] = useState<string>("")

  const { user, isConnected } = useCurrentUser()
  const [app, setApp] = useState<Application | null>(null)
  const [masteryTier, setMasteryTier] = useState<MasteryTier | null>(null)

  useEffect(() => {
    if (isConnected) {
      getApplicationByName("English Reading Coach")
        .then(setApp)
        .catch((err) => console.error("Error loading English Reading Coach application:", err))
    } else {
      const appData = localStorage.getItem("mywayapps_current_app")
      if (appData) setApp(JSON.parse(appData))
    }
  }, [isConnected])

  // Per-lesson mastery badge on the results screen — one Applications row is
  // shared across every passage, so the tier is scoped to this lesson's id.
  useEffect(() => {
    if (!summary || !user || !app) return
    let cancelled = false
    getActivityMasteryTier(user.id, app.id, `english-reading:${passageId}`, {
      modeFilter: (gameData) => gameData?.lessonId === passageId,
    }).then((tier) => {
      if (!cancelled) setMasteryTier(tier)
    })
    return () => {
      cancelled = true
    }
  }, [summary, user, app, passageId])

  // Safari doesn't reliably support the continuous, auto-restarting session
  // used everywhere else (background restarts have no user gesture, which
  // Safari's stricter activation rules reject) — it gets a per-sentence
  // tap-to-record flow instead. Computed once; the browser doesn't change mid-session.
  const [isSafariBrowser] = useState(() => isSafari())
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [micReady, setMicReady] = useState(false)
  // Guards a Safari recognition result that resolves after the reader
  // already hit "Finish" — without this, a late result could still mutate
  // state after the summary screen is already showing.
  const sessionActiveRef = useRef(false)

  const aggregatorRef = useRef<ReadingSessionAggregator | null>(null)
  const sessionRef = useRef<ReadingSession | null>(null)

  if (!passage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-200 to-orange-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Story not found</div>
      </div>
    )
  }

  // Shared by all three ways a session can end (auto-stop, manual stop,
  // Safari's per-sentence "Finish Now") — records the accuracy score so
  // this lesson's mastery badge (and any future dashboard) has evidence to
  // work from, which this page never wrote to Supabase before.
  const completeSession = (finalSummary: SessionSummary | null) => {
    setSummary(finalSummary)
    setStatus("finished")
    if (!finalSummary || !user || !app) return
    saveGameScore({
      userId: user.id,
      applicationId: app.id,
      score: Math.round(finalSummary.accuracyScore),
      maxScore: 100,
      gameData: {
        mode: "english-reading",
        lessonId: passageId,
        accuracyScore: finalSummary.accuracyScore,
        completenessScore: finalSummary.completenessScore,
        mistakeCount: finalSummary.mistakes.length,
      },
      isConnected,
      subject: "English",
    }).catch((err) => console.error("Error saving English Reading Coach score:", err))
  }

  const handleStartReading = async () => {
    setError(null)
    setSummary(null)
    setMasteryTier(null)
    setMicStatus("starting…")
    setTentativeCount(0)
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
            setTentativeCount(0)
          },
          onError: (err) => {
            setError(err.message)
          },
          onProgress: (matchedCount) => {
            setTentativeCount(matchedCount)
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

  // Safari flow, part 1: request mic permission up front (this `await` is
  // fine here since no recognition `.start()` call happens in this
  // handler) and get ready to read the first sentence. The actual
  // recognition calls happen later, directly inside each "Read this line"
  // tap — see handleReadCurrentSentence.
  const handleSafariStart = async () => {
    setError(null)
    setSummary(null)
    setMasteryTier(null)
    setMicStatus("starting…")
    setTentativeCount(0)
    setCurrentSentenceIndex(0)
    aggregatorRef.current = new ReadingSessionAggregator(passage.passage)
    setSentenceProgress(aggregatorRef.current.getSentenceProgress())

    try {
      await ensureMicrophoneAccess()
      sessionActiveRef.current = true
      setMicReady(true)
      setMicStatus("")
      setStatus("listening")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  // Safari flow, part 2: called directly from the "Read this line" button's
  // onClick — recognizeOneSentence() starts listening synchronously, with
  // no `await` in front of this call, which is what Safari requires.
  const handleReadCurrentSentence = () => {
    const sentence = passage.passage[currentSentenceIndex]
    if (!sentence) return

    recognizeOneSentence(sentence, "en-US", {
      onProgress: (matchedCount) => setTentativeCount(matchedCount),
      onStatus: (s) => setMicStatus(s),
    })
      .then((result) => {
        if (!sessionActiveRef.current) return
        aggregatorRef.current?.addUtterance(result)
        setSentenceProgress([...(aggregatorRef.current?.getSentenceProgress() ?? [])])
        setTentativeCount(0)
        setMicStatus("")

        const nextIndex = currentSentenceIndex + 1
        if (nextIndex >= passage.passage.length) {
          sessionActiveRef.current = false
          completeSession(aggregatorRef.current?.getSummary() ?? null)
        } else {
          setCurrentSentenceIndex(nextIndex)
        }
      })
      .catch((err) => {
        if (!sessionActiveRef.current) return
        setMicStatus("")
        setError(err instanceof Error ? err.message : String(err))
      })
  }

  // Safari flow, part 3: stop early and score whatever's been read so far.
  const handleSafariFinish = () => {
    sessionActiveRef.current = false
    setMicStatus("")
    completeSession(aggregatorRef.current?.getSummary() ?? null)
  }

  const handleStopReading = async () => {
    await sessionRef.current?.stop()
    sessionRef.current = null
    setMicStatus("")
    setTentativeCount(0)
    completeSession(aggregatorRef.current?.getSummary() ?? null)
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

            {(() => {
              const wordCounts = passage.passage.map((s) => s.trim().split(/\s+/).length)
              const flatStatuses = buildFlatStatuses(wordCounts, sentenceProgress, tentativeCount)
              let offset = 0
              return passage.passage.map((sentence, i) => {
                const count = wordCounts[i]
                const slice = flatStatuses.slice(offset, offset + count)
                offset += count
                return <SentenceView key={i} sentenceText={sentence} statuses={slice} />
              })
            })()}
          </CardContent>
        </Card>

        {isSafariBrowser ? (
          <>
            <div className="flex flex-col items-center gap-3 mb-6">
              {status !== "listening" ? (
                <Button
                  onClick={handleSafariStart}
                  className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-6 rounded-full font-bold"
                >
                  <Mic className="mr-2 h-6 w-6" />
                  Start Reading
                </Button>
              ) : micReady ? (
                <>
                  <Button
                    onClick={handleReadCurrentSentence}
                    className="bg-green-500 hover:bg-green-600 text-white text-xl px-8 py-6 rounded-full font-bold"
                  >
                    <Mic className="mr-2 h-6 w-6" />
                    Read Line {currentSentenceIndex + 1} of {passage.passage.length}
                  </Button>
                  <Button
                    onClick={handleSafariFinish}
                    className="bg-white/60 hover:bg-white/80 text-orange-900 text-sm px-4 py-2 rounded-full font-semibold"
                    variant="outline"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Finish Now
                  </Button>
                </>
              ) : (
                <div className="text-orange-800 font-semibold">🎤 Starting…</div>
              )}
            </div>

            {status === "listening" && micReady && (
              <div className="text-center mb-6">
                <div className="inline-block bg-white/70 rounded-full px-4 py-1 text-orange-800 font-semibold text-sm">
                  {micStatus === "speech-detected" && "🗣️ Speech detected"}
                  {micStatus === "processing" && "⏳ Processing…"}
                  {micStatus === "listening" && "🎤 Listening…"}
                  {!micStatus && "Tap the button above, then read the highlighted line aloud"}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
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
                <div className="inline-block bg-white/70 rounded-full px-4 py-1 text-orange-800 font-semibold text-sm">
                  {micStatus === "speech-detected" && "🗣️ Speech detected"}
                  {micStatus === "processing" && "⏳ Processing…"}
                  {micStatus === "listening" && "🎤 Listening…"}
                  {!micStatus && "🎤 Starting…"}
                </div>
              </div>
            )}
          </>
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
              {masteryTier && (
                <div className="flex justify-center mb-4">
                  <MasteryBadge tier={masteryTier} showLabel />
                </div>
              )}
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
