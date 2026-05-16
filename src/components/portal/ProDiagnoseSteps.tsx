"use client"

import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { competitionLevels, type ProDiagnoseFormValues } from "@/lib/proDiagnose/schema"
import { ProDiagnoseField, fieldClassName } from "./ProDiagnoseField"

const teamSizeOptions = ["Solo", "2-5", "6-15", "16-50", "51+"]

type StepProps = {
  register: UseFormRegister<ProDiagnoseFormValues>
  errors: FieldErrors<ProDiagnoseFormValues>
}

export function FinancialsStep({ register, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <ProDiagnoseField label="Current monthly revenue ($)" hint="Gross monthly revenue before expenses." error={errors.financials?.currentMonthlyRevenue}>
        <input type="number" min={0} step="100" {...register("financials.currentMonthlyRevenue")} className={fieldClassName} placeholder="e.g. 25000" />
      </ProDiagnoseField>
      <ProDiagnoseField label="Target scale revenue ($)" hint="Revenue target for the next growth phase." error={errors.financials?.targetScaleRevenue}>
        <input type="number" min={0} step="100" {...register("financials.targetScaleRevenue")} className={fieldClassName} placeholder="e.g. 75000" />
      </ProDiagnoseField>
      <ProDiagnoseField label="Average profit margin (%)" hint="Typical net margin across core offers." error={errors.financials?.avgProfitMargin}>
        <input type="number" min={0} max={100} step="0.1" {...register("financials.avgProfitMargin")} className={fieldClassName} placeholder="e.g. 32" />
      </ProDiagnoseField>
    </div>
  )
}

export function GrowthStep({ register, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <ProDiagnoseField label="Current lead volume (per month)" error={errors.growth?.currentLeadVolume}>
        <input type="number" min={0} step="1" {...register("growth.currentLeadVolume")} className={fieldClassName} placeholder="e.g. 45" />
      </ProDiagnoseField>
      <ProDiagnoseField label="Primary lead source" error={errors.growth?.primaryLeadSource}>
        <input type="text" {...register("growth.primaryLeadSource")} className={fieldClassName} placeholder="e.g. Referrals, LinkedIn, Paid search" />
      </ProDiagnoseField>
      <ProDiagnoseField label="Estimated conversion rate (%)" hint="Lead → closed deal or paying client." error={errors.growth?.estimatedConversionRate}>
        <input type="number" min={0} max={100} step="0.1" {...register("growth.estimatedConversionRate")} className={fieldClassName} placeholder="e.g. 12" />
      </ProDiagnoseField>
    </div>
  )
}

export function OperationsStep({ register, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <ProDiagnoseField label="Team size" error={errors.operations?.teamSize}>
        <select {...register("operations.teamSize")} className={fieldClassName}>
          <option value="">Select team size...</option>
          {teamSizeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </ProDiagnoseField>
      <ProDiagnoseField label="Primary software stack" hint="CRM, project management, finance, communication." error={errors.operations?.primarySoftwareStack}>
        <textarea rows={3} {...register("operations.primarySoftwareStack")} className={fieldClassName} placeholder="e.g. HubSpot, Notion, QuickBooks, Slack" />
      </ProDiagnoseField>
      <ProDiagnoseField label="Weekly founder hours on admin tasks" error={errors.operations?.weeklyFounderAdminHours}>
        <input type="number" min={0} max={168} step="1" {...register("operations.weeklyFounderAdminHours")} className={fieldClassName} placeholder="e.g. 18" />
      </ProDiagnoseField>
    </div>
  )
}

export function DefensibilityStep({ register, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <ProDiagnoseField label="Market competition level" error={errors.defensibility?.marketCompetitionLevel}>
        <select {...register("defensibility.marketCompetitionLevel")} className={fieldClassName}>
          <option value="">Select level...</option>
          {competitionLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </ProDiagnoseField>
      <ProDiagnoseField label="Unique value proposition" hint="What makes your offer defensible and hard to replicate?" error={errors.defensibility?.uniqueValueProposition}>
        <textarea rows={4} {...register("defensibility.uniqueValueProposition")} className={fieldClassName} placeholder="Describe your moat, specialization, or proprietary method..." />
      </ProDiagnoseField>
    </div>
  )
}
