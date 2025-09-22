"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"

// Telugu consonants for Gunintaalu
const teluguConsonants = [
  { consonant: "క", name: "క గుణింతము" },
  { consonant: "ఖ", name: "ఖ గుణింతము" },
  { consonant: "గ", name: "గ గుణింతము" },
  { consonant: "ఘ", name: "ఘ గుణింతము" },
  { consonant: "చ", name: "చ గుణింతము" },
  { consonant: "ఛ", name: "ఛ గుణింతము" },
  { consonant: "జ", name: "జ గుణింతము" },
  { consonant: "ఝ", name: "ఝ గుణింతము" },
  { consonant: "ట", name: "ట గుణింతము" },
  { consonant: "ఠ", name: "ఠ గుణింతము" },
  { consonant: "డ", name: "డ గుణింతము" },
  { consonant: "ఢ", name: "ఢ గుణింతము" },
  { consonant: "ణ", name: "ణ గుణింతము" },
  { consonant: "త", name: "త గుణింతము" },
  { consonant: "థ", name: "థ గుణింతము" },
  { consonant: "ద", name: "ద గుణింతము" },
  { consonant: "ధ", name: "ధ గుణింతము" },
  { consonant: "న", name: "న గుణింతము" },
  { consonant: "ప", name: "ప గుణింతము" },
  { consonant: "ఫ", name: "ఫ గుణింతము" },
  { consonant: "బ", name: "బ గుణింతము" },
  { consonant: "భ", name: "భ గుణింతము" },
  { consonant: "మ", name: "మ గుణింతము" },
  { consonant: "య", name: "య గుణింతము" },
  { consonant: "ర", name: "ర గుణింతము" },
  { consonant: "ల", name: "ల గుణింతము" },
  { consonant: "వ", name: "వ గుణింతము" },
  { consonant: "శ", name: "శ గుణింతము" },
  { consonant: "ష", name: "ష గుణింతము" },
  { consonant: "స", name: "స గుణింతము" },
  { consonant: "హ", name: "హ గుణింతము" },
  { consonant: "ళ", name: "ళ గుణింతము" },
  { consonant: "క్ష", name: "క్ష గుణింతము" }
]

export default function LearnGunintaalu() {
  const handleBackToGunintaalu = () => {
    window.location.href = "/telugu-gunintaalu"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 p-4 flex flex-col items-center justify-center">
      {/* Header with Back Button */}
      <div className="w-1/2 min-w-[500px] max-w-[800px] mb-8">
        <Button
          onClick={handleBackToGunintaalu}
          className="bg-white/20 hover:bg-white/30 text-indigo-800 border-2 border-white font-bold text-lg px-6 py-3"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Gunintaalu
        </Button>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-indigo-900 mb-4 flex items-center justify-center">
          <BookOpen className="mr-4 h-12 w-12" />
          గుణింతాలు నేర్చుకుందాం
        </h1>
        <p className="text-xl text-indigo-700 font-semibold">
          Select a consonant to learn its combinations with matras
        </p>
      </div>

      {/* Consonant Grid */}
      <Card className="w-1/2 min-w-[500px] max-w-[800px] bg-white/90 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-4 gap-4">
            {teluguConsonants.map((item, index) => (
              <Link key={index} href={`/telugu-gunintaalu/learn/${item.consonant}`}>
                <Card className="bg-gradient-to-br from-blue-100 to-indigo-200 hover:from-blue-200 hover:to-indigo-300 cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl font-bold text-indigo-800 mb-2">
                      {item.consonant}
                    </div>
                    <div className="text-xs text-indigo-600 font-semibold">
                      గుణింతము
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
