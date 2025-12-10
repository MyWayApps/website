"use client"

import { useMemo } from "react"
import { ArrowLeft, BookMarked, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { vemanaPoems } from "@/lib/telugu-satakamalu-data"

export default function VemanaSatakamPage() {
  const poems = useMemo(() => vemanaPoems, [])

  const handleBack = () => {
    window.location.href = "/telugu-satakamalu"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-100 to-orange-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <Button
          onClick={handleBack}
          variant="outline"
          className="bg-white/30 hover:bg-white/50 text-amber-900 border-2 border-white font-bold text-lg px-6 py-3"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Satakamalu
        </Button>
        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full text-amber-900 font-semibold">
          <BookMarked className="h-5 w-5" />
          Vemana Satakam
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">వేమన శతకం</h1>
        <p className="text-lg md:text-xl text-amber-800">5 selected poems with meanings in Telugu and English</p>
      </div>

      <div className="w-full max-w-5xl space-y-6">
        {poems.map((poem, idx) => (
          <Card key={poem.title} className="shadow-xl border-0 bg-white/90">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-200 text-amber-900 rounded-full px-3 py-2 text-sm font-bold">Poem {idx + 1}</div>
                <div className="text-xl font-bold text-amber-900">{poem.title}</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-lg leading-8 text-amber-900 whitespace-pre-line">
                <Quote className="inline-block mr-2 h-4 w-4 text-amber-500" />
                {poem.poem}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-semibold text-amber-700 mb-2">భావము (Telugu Meaning)</div>
                  <div className="text-amber-900 leading-7">{poem.meaningTelugu}</div>
                </div>
                <div className="bg-white border border-amber-200 rounded-lg p-4">
                  <div className="text-sm font-semibold text-amber-700 mb-2">Meaning (English)</div>
                  <div className="text-amber-900 leading-7">{poem.meaningEnglish}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


