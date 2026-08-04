"use client"

import MathOperationHub from "@/components/math-operations/math-operation-hub"

export default function MathSubtractionPage() {
  return (
    <MathOperationHub
      operation="subtract"
      title="Subtraction"
      emoji="➖"
      gradient="from-orange-300 via-red-400 to-rose-500"
      applicationName="Subtraction"
      videoIds={["double-digit-subtraction", "double-digit-subtraction-word-problems"]}
    />
  )
}
