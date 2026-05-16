"use client"

import { TrendingUp } from "lucide-react"
import PillarModulePage from "@/components/console/PillarModulePage"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"
import { getRevenueSnapshot, getTargetRevenue } from "@/lib/auditInsights"

export default function ProScalePage() {
  const { audit } = useBusinessConsole()
  const revenue = getRevenueSnapshot(audit)
  const target = getTargetRevenue(revenue, audit?.score ?? 0)

  return (
    <PillarModulePage
      eyebrow="Pro-Scale"
      title="CRM & Growth Pipeline"
      description="Revenue expansion intelligence—pipeline velocity, growth targets, and scale readiness derived from your audit baseline."
      icon={TrendingUp}
      metrics={[
        { label: "Current band", value: revenue.label, hint: "Revenue range from intake" },
        { label: "Target band", value: target.label, hint: "Modeled growth trajectory" },
        { label: "Uplift model", value: target.upliftPct > 0 ? `+${target.upliftPct}%` : "Pending", hint: "Institutional expansion target" },
      ]}
      focusAreas={[
        "Pipeline velocity & follow-up SLA",
        "Lead-to-close conversion systems",
        "Revenue operations cadence",
        "Capacity planning for scale events",
      ]}
    />
  )
}
