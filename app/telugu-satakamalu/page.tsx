"use client"

import Link from "next/link"
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { satakamList } from "@/lib/telugu-satakamalu-data"

export default function TeluguSatakamaluPage() {
  const handleBackHome = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 p-6 flex flex-col items-center relative overflow-hidden">
      <img
        src="/characters/peacock.png"
        alt="Peacock"
        className="absolute bottom-4 right-6 w-32 h-32 md:w-44 md:h-44 opacity-90 pointer-events-none"
      />

      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <Button
          onClick={handleBackHome}
          variant="outline"
          className="bg-white/30 hover:bg-white/50 text-amber-900 border-2 border-white font-bold text-lg px-6 py-3"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Button>
        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full text-amber-900 font-semibold">
          <Sparkles className="h-5 w-5" />
          Telugu Satakamalu (Poems)
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-3">Explore Telugu Satakamalu</h1>
        <p className="text-lg md:text-xl text-amber-800">
          Classic 100-verse collections. Choose a Satakam to read and learn meanings.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {satakamList.map((satakam) => {
          const isAvailable = satakam.status === "available"
          return (
            <Card
              key={satakam.id}
              className={`shadow-xl border-0 bg-gradient-to-br from-white/90 to-amber-50 ${
                isAvailable ? "hover:scale-[1.02] cursor-pointer" : "opacity-80"
              } transition-transform`}
            >
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-200 text-amber-900 rounded-full p-3">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-amber-900">{satakam.title}</div>
                    <div className="text-sm text-amber-700">{satakam.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                    {satakam.status === "available" ? "Ready to read" : "Coming soon"}
                  </div>
                  {isAvailable ? (
                    <Link
                      href={`/telugu-satakamalu/${satakam.id}`}
                      className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full"
                    >
                      Open
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 bg-amber-200 text-amber-800 font-semibold rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


