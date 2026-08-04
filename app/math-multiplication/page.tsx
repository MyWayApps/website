"use client"

import MathOperationHub from "@/components/math-operations/math-operation-hub"

export default function MathMultiplicationPage() {
  return (
    <MathOperationHub
      operation="multiply"
      title="Multiplication"
      emoji="✖️"
      gradient="from-violet-300 via-purple-400 to-fuchsia-500"
      applicationName="Multiplication"
    />
  )
}
