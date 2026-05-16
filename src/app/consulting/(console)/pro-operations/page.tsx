"use client"

import { Workflow } from "lucide-react"
import PillarModulePage from "@/components/console/PillarModulePage"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"

export default function ProOperationsPage() {
  const { audit } = useBusinessConsole()

  return (
    <PillarModulePage
      eyebrow="Pro-Operations"
      title="Operational Advisory & Systems Health"
      description="Systems health monitoring—bottleneck resolution, workflow automation maturity, and operating cadence intelligence."
      icon={Workflow}
      metrics={[
        { label: "Constraint load", value: audit ? String(audit.constraints.length) : "—", hint: "Active growth constraints" },
        { label: "Roadmap items", value: audit ? String(audit.roadmap.length) : "0", hint: "30-day priority sequence" },
        { label: "Systems posture", value: audit ? "Under review" : "Awaiting audit", hint: "Automation vs manual workflows" },
      ]}
      focusAreas={audit?.recommendations ?? [
        "Workflow owner mapping",
        "Manual vs automated handoffs",
        "Executive operating cadence",
        "SOP deployment sequence",
      ]}
    />
  )
}
