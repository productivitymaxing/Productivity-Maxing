import { z } from "zod"

export const competitionLevels = ["Low", "Med", "High"] as const

const numericString = (label: string, opts?: { min?: number; max?: number; int?: boolean }) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine(value => !Number.isNaN(Number(value)), `${label} must be a number`)
    .refine(value => {
      const n = Number(value)
      if (opts?.int && !Number.isInteger(n)) return false
      if (opts?.min !== undefined && n < opts.min) return false
      if (opts?.max !== undefined && n > opts.max) return false
      return true
    }, opts?.max !== undefined ? `${label} must be between ${opts.min ?? 0} and ${opts.max}` : `${label} is invalid`)

export const financialsSchema = z
  .object({
    currentMonthlyRevenue: numericString("Current monthly revenue", { min: 0 }),
    targetScaleRevenue: numericString("Target scale revenue", { min: 0 }),
    avgProfitMargin: numericString("Average profit margin", { min: 0, max: 100 }),
  })
  .refine(
    data => Number(data.targetScaleRevenue) >= Number(data.currentMonthlyRevenue),
    {
      message: "Target revenue must be greater than or equal to current revenue",
      path: ["targetScaleRevenue"],
    },
  )

export const growthSchema = z.object({
  currentLeadVolume: numericString("Current lead volume", { min: 0, int: true }),
  primaryLeadSource: z.string().min(2, "Primary lead source is required"),
  estimatedConversionRate: numericString("Estimated conversion rate", { min: 0, max: 100 }),
})

export const operationsSchema = z.object({
  teamSize: z.string().min(1, "Team size is required"),
  primarySoftwareStack: z.string().min(2, "Describe your primary software stack"),
  weeklyFounderAdminHours: numericString("Weekly founder admin hours", { min: 0, max: 168, int: true }),
})

export const defensibilitySchema = z.object({
  marketCompetitionLevel: z
    .string()
    .refine((value): value is (typeof competitionLevels)[number] => competitionLevels.includes(value as (typeof competitionLevels)[number]), {
      message: "Select competition level",
    }),
  uniqueValueProposition: z
    .string()
    .min(10, "Unique value proposition must be at least 10 characters"),
})

export const proDiagnoseSchema = z.object({
  financials: financialsSchema,
  growth: growthSchema,
  operations: operationsSchema,
  defensibility: defensibilitySchema,
})

export type ProDiagnoseFormValues = {
  financials: z.input<typeof financialsSchema>
  growth: z.input<typeof growthSchema>
  operations: z.input<typeof operationsSchema>
  defensibility: {
    marketCompetitionLevel: string
    uniqueValueProposition: string
  }
}
export type FinancialsValues = z.infer<typeof financialsSchema>
export type GrowthValues = z.infer<typeof growthSchema>
export type OperationsValues = z.infer<typeof operationsSchema>
export type DefensibilityValues = z.infer<typeof defensibilitySchema>

export const proDiagnoseStepSchemas = [
  financialsSchema,
  growthSchema,
  operationsSchema,
  defensibilitySchema,
] as const

export const proDiagnoseStepKeys = ["financials", "growth", "operations", "defensibility"] as const
export type ProDiagnoseStepKey = (typeof proDiagnoseStepKeys)[number]

export const emptyProDiagnoseForm: ProDiagnoseFormValues = {
  financials: {
    currentMonthlyRevenue: "",
    targetScaleRevenue: "",
    avgProfitMargin: "",
  },
  growth: {
    currentLeadVolume: "",
    primaryLeadSource: "",
    estimatedConversionRate: "",
  },
  operations: {
    teamSize: "",
    primarySoftwareStack: "",
    weeklyFounderAdminHours: "",
  },
  defensibility: {
    marketCompetitionLevel: "",
    uniqueValueProposition: "",
  },
}
