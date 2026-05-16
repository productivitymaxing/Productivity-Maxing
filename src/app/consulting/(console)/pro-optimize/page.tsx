"use client"

import { Shield } from "lucide-react"
import PillarModulePage from "@/components/console/PillarModulePage"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"
import { getScaleReadiness } from "@/lib/auditInsights"

export default function ProOptimizePage() {
  const { audit } = useBusinessConsole()
  const readiness = getScaleReadiness(audit?.score ?? 0)

  return (
    <PillarModulePage
      eyebrow="Pro-Optimize"
      title="Moat & Future-Proof Matrix"
      description="Defensibility intelligence—market positioning durability, future-proof metrics, and institutional moat development."
      icon={Shield}
      metrics={[
        { label: "Scale readiness", value: readiness.label, hint: "Institutional maturity signal" },
        { label: "Strategic moves", value: audit ? String(audit.recommendations.length) : "0", hint: "Active optimization plays" },
        { label: "Moat index", value: audit ? `${audit.score}/100` : "—", hint: "Composite defensibility proxy" },
      ]}
      focusAreas={[
        "Category positioning clarity",
        "Recurring revenue durability",
        "Operational knowledge moat",
        "Future-proof automation stack",
      ]}
    />
  )
}
