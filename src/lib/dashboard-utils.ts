import { ProDiagnoseFormValues } from "./proDiagnose/schema"

export interface DashboardMetrics {
  currentRunRate: number
  frictionCoefficient: number
  pipelineVolume: number
  moatFactor: number
  growthTrajectory: Array<{ month: string; current: number; target: number }>
  operationalLevers: Array<{ title: string; impact: "High" | "Medium"; description: string }>
}

export interface ScaleMetrics {
  estimatedLTV: number
  estimatedCAC: number
  conversionRate: number
  pipelineValue: number
}

export interface OperationsMetrics {
  automationRatio: number // 0 to 1
  softwareStack: string[]
  efficiencyScore: number // 0 to 100
}

export function calculateScaleMetrics(data: ProDiagnoseFormValues): ScaleMetrics {
  const currentMonthly = Number(data.financials.currentMonthlyRevenue) || 0
  const convRate = Number(data.growth.estimatedConversionRate) || 5
  
  // Heuristic-based estimates
  const estimatedLTV = currentMonthly * 18 // 18-month retention proxy
  const estimatedCAC = (currentMonthly * 0.2) / (convRate / 100 || 0.05) // Assuming 20% of revenue is marketing spend
  
  return {
    estimatedLTV,
    estimatedCAC,
    conversionRate: convRate,
    pipelineValue: Number(data.financials.targetScaleRevenue) * 3 // 3x target as pipeline ceiling
  }
}

export function calculateOperationsMetrics(data: ProDiagnoseFormValues): OperationsMetrics {
  const adminHours = Number(data.operations.weeklyFounderAdminHours) || 0
  const software = data.operations.primarySoftwareStack.split(',').map(s => s.trim())
  
  // Ratio calculation: more software + less admin = higher automation
  const softwareBonus = Math.min(software.length * 0.1, 0.4)
  const adminPenalty = Math.max(0, (adminHours - 5) / 40) // Penalty for hours > 5
  const automationRatio = Math.max(0.1, Math.min(0.9, 0.5 + softwareBonus - adminPenalty))
  
  return {
    automationRatio,
    softwareStack: software,
    efficiencyScore: Math.round(automationRatio * 100)
  }
}

export function calculateDashboardMetrics(data: ProDiagnoseFormValues): DashboardMetrics {
  const currentMonthly = Number(data.financials.currentMonthlyRevenue) || 0
  const targetMonthly = Number(data.financials.targetScaleRevenue) || 0
  const adminHours = Number(data.operations.weeklyFounderAdminHours) || 0
  const teamSize = data.operations.teamSize === "Solo" ? 1 : parseInt(data.operations.teamSize) || 5
  const leadVolume = Number(data.growth.currentLeadVolume) || 0
  const competition = data.defensibility.marketCompetitionLevel

  // 1. Current Run-Rate
  const currentRunRate = currentMonthly * 12

  // 2. Friction Coefficient (0-1)
  // High admin hours relative to team size increases friction
  const baseFriction = Math.min(adminHours / 40, 1)
  const teamLeverage = 1 / Math.sqrt(teamSize)
  const frictionCoefficient = Math.min((baseFriction * 0.7 + teamLeverage * 0.3), 1)

  // 3. Pipeline Volume (Projected Lead Value or Volume)
  // Let's use lead volume as a proxy for "Pipeline Capacity"
  const pipelineVolume = leadVolume * 1.2 // Assuming 20% growth potential in pipeline

  // 4. Moat Factor (0-100)
  let moatScore = 0
  if (competition === "Low") moatScore = 85
  else if (competition === "Med") moatScore = 60
  else moatScore = 35
  
  // Bonus for UVP length/detail
  const uvpBonus = Math.min(data.defensibility.uniqueValueProposition.length / 2, 15)
  const moatFactor = Math.min(moatScore + uvpBonus, 100)

  // Growth Trajectory (12 months)
  const growthTrajectory = Array.from({ length: 12 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() + i)
    const monthName = month.toLocaleString('default', { month: 'short' })
    
    // Linear interpolation for target, static for current
    const progress = i / 11
    const targetValue = currentMonthly + (targetMonthly - currentMonthly) * progress
    
    return {
      month: monthName,
      current: currentMonthly,
      target: Math.round(targetValue)
    }
  })

  // Operational Levers
  const operationalLevers = [
    {
      title: "Automated Lead Qualification",
      impact: "High" as const,
      description: `Systematize ${data.growth.primaryLeadSource} processing to reduce founder touchpoints.`
    },
    {
      title: "SOP Standardization",
      impact: "High" as const,
      description: `Document core workflows to lower the Friction Coefficient from ${frictionCoefficient.toFixed(2)}.`
    },
    {
      title: "Infrastructure Scaling",
      impact: "Medium" as const,
      description: `Upgrade ${data.operations.primarySoftwareStack} to handle the ${targetMonthly.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} monthly target.`
    }
  ]

  return {
    currentRunRate,
    frictionCoefficient,
    pipelineVolume,
    moatFactor,
    growthTrajectory,
    operationalLevers
  }
}
