"use client"

import MathOperationHub from "@/components/math-operations/math-operation-hub"

export default function MathDivisionPage() {
  return (
    <MathOperationHub
      operation="divide"
      title="Division"
      emoji="➗"
      gradient="from-sky-300 via-blue-400 to-cyan-500"
      applicationName="Division"
    />
  )
}
