import type { Audit, DiagnosticForm } from "@/lib/businessIntelligenceApi"

const REVENUE_BANDS: Record<string, { label: string; low: number; high: number }> = {
  "Pre-revenue": { label: "Pre-revenue", low: 0, high: 0 },
  "$1k-$10k": { label: "$1k–$10k / mo", low: 1000, high: 10000 },
  "$10k-$50k": { label: "$10k–$50k / mo", low: 10000, high: 50000 },
  "$50k-$250k": { label: "$50k–$250k / mo", low: 50000, high: 250000 },
  "$250k+": { label: "$250k+ / mo", low: 250000, high: 500000 },
}

export type RevenueSnapshot = {
  label: string
  low: number
  high: number
  midpoint: number
}

export function parseAuditForm(audit: Audit): DiagnosticForm | null {
  const raw = audit.form_json
  if (!raw) return null
  try {
    return JSON.parse(raw) as DiagnosticForm
  } catch {
    return null
  }
}

function getProDiagnoseRevenueLabel(form: Record<string, unknown> | null): RevenueSnapshot | null {
  if (!form || typeof form !== "object") return null
  const financials = form.financials as Record<string, string> | undefined
  if (!financials?.currentMonthlyRevenue) return null
  const current = Number(financials.currentMonthlyRevenue)
  const target = Number(financials.targetScaleRevenue)
  if (Number.isNaN(current)) return null
  const midpoint = current
  const high = Number.isNaN(target) ? current * 1.25 : target
  return {
    label: `$${current.toLocaleString()} → $${high.toLocaleString()} / mo`,
    low: current,
    high,
    midpoint,
  }
}

export function getRevenueSnapshot(audit: Audit | null): RevenueSnapshot {
  const form = audit ? parseAuditForm(audit) : null
  const proDiagnoseRevenue = getProDiagnoseRevenueLabel(form as Record<string, unknown> | null)
  if (proDiagnoseRevenue) return proDiagnoseRevenue

  const monthlyRevenue = (form as DiagnosticForm | null)?.foundation?.monthlyRevenue
  const band = monthlyRevenue ? REVENUE_BANDS[monthlyRevenue] : undefined

  if (!band) {
    return { label: "Baseline pending", low: 0, high: 0, midpoint: 0 }
  }

  const midpoint = band.high > 0 ? Math.round((band.low + band.high) / 2) : band.low
  return { label: band.label, low: band.low, high: band.high, midpoint }
}

export function getTargetRevenue(current: RevenueSnapshot, operationalScore: number) {
  if (current.midpoint <= 0) {
    return { label: "Target: $10k–$25k / mo", low: 10000, high: 25000, upliftPct: 0 }
  }

  const uplift = operationalScore >= 75 ? 0.35 : operationalScore >= 55 ? 0.28 : 0.22
  const targetMid = Math.round(current.midpoint * (1 + uplift))
  const targetLow = Math.round(targetMid * 0.85)
  const targetHigh = Math.round(targetMid * 1.15)

  return {
    label: formatCurrencyRange(targetLow, targetHigh),
    low: targetLow,
    high: targetHigh,
    upliftPct: Math.round(uplift * 100),
  }
}

export function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}k`
  return `$${value}`
}

function formatCurrencyRange(low: number, high: number) {
  return `${formatCurrency(low)} – ${formatCurrency(high)} / mo`
}

export function getScaleReadiness(score: number) {
  if (score >= 80) return { label: "Scale-ready", tone: "emerald" as const }
  if (score >= 65) return { label: "Growth phase", tone: "sky" as const }
  if (score >= 45) return { label: "Stabilize ops", tone: "amber" as const }
  return { label: "Foundation rebuild", tone: "rose" as const }
}
