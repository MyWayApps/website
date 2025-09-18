"use client"

import { ComingSoon } from "@/components/coming-soon"

export default function EnglishPhonicsPage() {
  return (
    <ComingSoon
      appName="English Phonics"
      appDescription="Master English sounds and pronunciation"
      iconEmoji="🔤"
      colorScheme="from-purple-200 to-pink-500"
      onBackToHome={() => window.history.back()}
    />
  )
}
