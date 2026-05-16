"use client"

import { Crosshair } from "lucide-react"
import PillarModulePage from "@/components/console/PillarModulePage"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"

export default function ProDiagnosePage() {
  const { audit } = useBusinessConsole()

  return (
    <PillarModulePage
      eyebrow="Pro-Diagnose"
      title="Audit Tracker & Baseline"
      description="Your institutional intake baseline, operational score, and friction map from the Pro-Diagnose audit engine."
      icon={Crosshair}
      metrics={[
        { label: "Operational score", value: audit ? String(audit.score) : "—", hint: "Current institutional baseline" },
        { label: "Bottleneck signals", value: audit ? String(audit.bottlenecks.length) : "0", hint: "Mapped execution constraints" },
        { label: "Audit status", value: audit ? "Baseline locked" : "Intake required", hint: "Pro-Diagnose completion state" },
      ]}
      focusAreas={audit?.bottlenecks ?? [
        "Map founder-dependent workflows",
        "Quantify delivery friction points",
        "Establish baseline KPI visibility",
        "Document intake operating context",
      ]}
    />
  )
}
