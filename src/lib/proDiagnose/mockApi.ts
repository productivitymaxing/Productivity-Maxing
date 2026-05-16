import type { Audit } from "@/lib/businessIntelligenceApi"
import type { ProDiagnoseFormValues } from "./schema"

/** Mock Pro-Diagnose submission — replace with Cloudflare Worker `createAudit` when ready. */
export async function submitProDiagnoseAudit(form: ProDiagnoseFormValues): Promise<Audit> {
  await new Promise(resolve => setTimeout(resolve, 1600))

  const current = Number(form.financials.currentMonthlyRevenue)
  const target = Number(form.financials.targetScaleRevenue)
  const margin = Number(form.financials.avgProfitMargin)
  const conversion = Number(form.growth.estimatedConversionRate)
  const adminHours = Number(form.operations.weeklyFounderAdminHours)

  const revenueGap = target > current ? ((target - current) / Math.max(current, 1)) * 100 : 0
  const opsPenalty = adminHours > 20 ? 12 : adminHours > 10 ? 6 : 0
  const growthBonus = conversion >= 15 ? 8 : conversion >= 8 ? 4 : 0
  const competitionPenalty = form.defensibility.marketCompetitionLevel === "High" ? 8 : form.defensibility.marketCompetitionLevel === "Med" ? 4 : 0

  const score = Math.max(
    34,
    Math.min(
      91,
      Math.round(52 + margin * 0.2 + growthBonus - opsPenalty - competitionPenalty + (revenueGap > 0 ? 6 : 0)),
    ),
  )

  return {
    id: `mock-${Date.now()}`,
    score,
    bottlenecks: [
      adminHours > 15
        ? `Founder admin load (${adminHours}h/week) is compressing strategic capacity.`
        : "Execution visibility needs tighter weekly operating cadence.",
      `Lead engine via ${form.growth.primaryLeadSource} requires measurable conversion discipline.`,
      "Systems documentation should be elevated before scale events.",
    ],
    constraints: [
      `Competition level: ${form.defensibility.marketCompetitionLevel} — positioning must stay defensible.`,
      `Team size (${form.operations.teamSize}) may limit throughput at current lead volume.`,
      margin < 25 ? "Profit margin profile suggests pricing or delivery efficiency risk." : "Margin supports reinvestment if operating rhythm tightens.",
    ],
    recommendations: [
      `Install revenue tracking from $${current.toLocaleString()} → $${target.toLocaleString()} MRR target.`,
      `Build CRM discipline around ${form.growth.currentLeadVolume} leads/mo at ${conversion}% conversion.`,
      `Reduce founder admin hours below ${Math.max(8, adminHours - 5)} through delegation and SOP deployment.`,
      "Deploy weekly executive review across financial, pipeline, and delivery KPIs.",
    ],
    roadmap: [
      "Week 1: Lock baseline KPIs and owner map across four pillars.",
      "Week 2: Implement pipeline + revenue dashboard tied to Pro-Scale.",
      "Week 3: Document top delivery workflows in Pro-Operations.",
      "Week 4: Stress-test moat narrative and competitive positioning in Pro-Optimize.",
    ],
    summary: `Pro-Diagnose baseline captured. You are operating at ~$${current.toLocaleString()}/mo with a ${margin}% margin profile, targeting $${target.toLocaleString()}/mo scale. Institutional priority: protect ${form.defensibility.uniqueValueProposition.slice(0, 80)}${form.defensibility.uniqueValueProposition.length > 80 ? "…" : ""} while systemizing growth and operations.`,
    form_json: JSON.stringify(form),
  }
}
