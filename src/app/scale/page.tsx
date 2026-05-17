"use client"

import { useEffect, useState } from "react"
import { loadProDiagnoseDraft } from "@/lib/proDiagnose/storage"
import { calculateScaleMetrics, type ScaleMetrics } from "@/lib/dashboard-utils"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  Users, 
  ArrowUpRight, 
  Target, 
  Layers, 
  Plus, 
  MoreVertical,
  Briefcase
} from "lucide-react"
import Link from "next/link"

const pipelineStages = [
  { id: "lead", title: "Lead Captured", color: "blue" },
  { id: "audit", title: "Audit Scheduled", color: "indigo" },
  { id: "proposal", title: "Proposal Sent", color: "purple" },
  { id: "retainer", title: "Retainer Secured", color: "emerald" }
]

const mockDeals = [
  { id: 1, name: "Acme Corp Expansion", value: "$12,000", stage: "lead", company: "Acme Corp" },
  { id: 2, name: "Globex SaaS Migration", value: "$45,000", stage: "audit", company: "Globex" },
  { id: 3, name: "Stark Tech Audit", value: "$8,500", stage: "proposal", company: "Stark Tech" },
  { id: 4, name: "Wayne Ent Retainer", value: "$150,000", stage: "retainer", company: "Wayne Ent" }
]

export default function ScalePage() {
  const [metrics, setMetrics] = useState<ScaleMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = loadProDiagnoseDraft()
    if (data.form.financials.currentMonthlyRevenue) {
      setMetrics(calculateScaleMetrics(data.form))
    }
    setLoading(false)
  }, [])

  if (loading) return null

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
              <Layers className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Pro-Scale Engine</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Revenue <span className="text-slate-400 dark:text-slate-600">/</span> Pipeline
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Est. LTV</p>
              <p className="text-xl font-bold text-blue-600">
                {metrics?.estimatedLTV.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Est. CAC</p>
              <p className="text-xl font-bold text-emerald-600">
                {metrics?.estimatedCAC.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pipelineStages.map((stage, idx) => (
            <div key={stage.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-${stage.color}-500`} />
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {stage.title}
                  </h3>
                  <span className="bg-slate-200 dark:bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    {mockDeals.filter(d => d.stage === stage.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 min-h-[500px] p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                {mockDeals
                  .filter(deal => deal.stage === stage.id)
                  .map((deal) => (
                    <motion.div
                      key={deal.id}
                      layoutId={String(deal.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <MoreVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">{deal.name}</h4>
                      <p className="text-xs text-slate-500 mb-3">{deal.company}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                        <span className="text-xs font-bold text-blue-600">{deal.value}</span>
                        <div className="flex -space-x-2">
                          {[1, 2].map(i => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700" />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
