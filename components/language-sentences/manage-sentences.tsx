"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { LANGUAGE_SENTENCES } from "@/lib/language-sentences-data"
import { getCustomSentences, addCustomSentence, deleteCustomSentence, type CustomSentence } from "@/lib/language-custom-sentences"
import type { LanguageCode } from "@/lib/language-games-data"

interface ManageSentencesProps {
  lang: LanguageCode
  label: string
  onBackToModes: () => void
}

export default function ManageSentences({ lang, label, onBackToModes }: ManageSentencesProps) {
  const [customSentences, setCustomSentences] = useState<CustomSentence[]>([])
  const [newSentenceInput, setNewSentenceInput] = useState("")

  useEffect(() => {
    setCustomSentences(getCustomSentences(lang))
  }, [lang])

  const handleAddSentence = () => {
    const entry = addCustomSentence(lang, newSentenceInput)
    if (entry) {
      setCustomSentences((prev) => [entry, ...prev])
      setNewSentenceInput("")
    }
  }

  const handleDeleteSentence = (id: string) => {
    deleteCustomSentence(lang, id)
    setCustomSentences((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400 p-4 relative overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBackToModes}
            className="bg-white/20 hover:bg-white/30 text-blue-900 border-2 border-white font-bold text-lg px-6 py-3"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-blue-900 mb-4 font-sans">Add / Manage Sentences</h2>
              <p className="text-lg text-blue-800 font-medium">
                Add your own {label} sentences here — every round automatically mixes in 5 sentences you haven't seen recently.
              </p>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Add Your Own Sentence</h3>
                <div className="flex gap-2 max-w-xl mx-auto">
                  <Input
                    value={newSentenceInput}
                    onChange={(e) => setNewSentenceInput(e.target.value)}
                    placeholder={`Type a full ${label} sentence...`}
                    className="text-lg rounded-2xl"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSentence()}
                  />
                  <Button
                    onClick={handleAddSentence}
                    disabled={!newSentenceInput.trim()}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl"
                  >
                    Add
                  </Button>
                </div>

                {customSentences.length > 0 && (
                  <div className="max-w-xl mx-auto mt-6 space-y-2">
                    {customSentences.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-3 bg-blue-50 border-2 border-blue-200 rounded-2xl px-4 py-2 text-left"
                      >
                        <div>
                          <p className="text-base font-medium text-gray-800">{s.text}</p>
                          <p className="text-xs text-gray-500">
                            Added{" "}
                            {new Date(s.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSentence(s.id)}
                          className="text-red-500 hover:text-red-700 font-bold shrink-0"
                          aria-label="Delete this sentence"
                        >
                          🗑
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4 text-center">Ready-Made Sentences</h3>
                <div className="max-w-xl mx-auto space-y-2">
                  {LANGUAGE_SENTENCES[lang].map((s) => (
                    <div
                      key={s}
                      className="bg-white/70 text-gray-800 px-4 py-2 rounded-2xl border-2 border-gray-200 text-left text-base font-medium"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
