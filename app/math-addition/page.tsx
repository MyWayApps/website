"use client"

import MathOperationHub from "@/components/math-operations/math-operation-hub"

export default function MathAdditionPage() {
  return (
    <MathOperationHub
      operation="add"
      title="Addition"
      emoji="➕"
      gradient="from-green-300 via-emerald-400 to-teal-500"
      applicationName="Addition"
      videoIds={["double-digit-addition", "addition-word-problems"]}
    />
  )
}
