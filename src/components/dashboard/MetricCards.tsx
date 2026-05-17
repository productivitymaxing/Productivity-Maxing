"use client"

import { motion } from "framer-motion"
import { TrendingUp, Zap, BarChart3, ShieldCheck } from "lucide-react"
import type { DashboardMetrics } from "@/lib/dashboard-utils"

interface MetricCardsProps {
  metrics: DashboardMetrics
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      label: "Current Run-Rate",
      value: metrics.currentRunRate.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }),
      description: "Annualized velocity",
      icon: TrendingUp,
      color: "blue",
      bgClass: "bg-blue-500/10",
      iconBgClass: "bg-blue-50 dark:bg-blue-900/20",
      iconTextClass: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Friction Coefficient",
      value: metrics.frictionCoefficient.toFixed(2),
      description: "Operational drag score",
      icon: Zap,
      color: "orange",
      bgClass: "bg-orange-500/10",
      iconBgClass: "bg-orange-50 dark:bg-orange-900/20",
      iconTextClass: "text-orange-600 dark:text-orange-400"
    },
    {
      label: "Pipeline Volume",
      value: Math.round(metrics.pipelineVolume).toLocaleString(),
      description: "Projected lead capacity",
      icon: BarChart3,
      color: "emerald",
      bgClass: "bg-emerald-500/10",
      iconBgClass: "bg-emerald-50 dark:bg-emerald-900/20",
      iconTextClass: "text-emerald-600 dark:text-emerald-400"
    },
    {
      label: "Moat Factor",
      value: `${Math.round(metrics.moatFactor)}%`,
      description: "Defensibility strength",
      icon: ShieldCheck,
      color: "indigo",
      bgClass: "bg-indigo-500/10",
      iconBgClass: "bg-indigo-50 dark:bg-indigo-900/20",
      iconTextClass: "text-indigo-600 dark:text-indigo-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all"
        >
          {/* Accent Glow */}
          <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.bgClass} blur-3xl rounded-full transition-all group-hover:scale-150`} />
          
          <div className="relative flex flex-col gap-4">
            <div className={`w-10 h-10 rounded-xl ${card.iconBgClass} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.iconTextClass}`} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {card.label}
              </p>
              <h3 className="text-3xl font-bold tracking-tight">
                {card.value}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
