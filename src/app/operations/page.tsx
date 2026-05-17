"use client"

import { useEffect, useState } from "react"
import { loadProDiagnoseDraft } from "@/lib/proDiagnose/storage"
import { calculateOperationsMetrics, type OperationsMetrics } from "@/lib/dashboard-utils"
import { motion } from "framer-motion"
import { 
  Settings2, 
  Activity, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Cloud,
  Lock
} from "lucide-react"

export default function OperationsPage() {
  const [metrics, setMetrics] = useState<OperationsMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = loadProDiagnoseDraft()
    if (data.form.financials.currentMonthlyRevenue) {
      setMetrics(calculateOperationsMetrics(data.form))
    }
    setLoading(false)
  }, [])

  if (loading) return null

  const automationPercentage = metrics ? Math.round(metrics.automationRatio * 100) : 0

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
              <Settings2 className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Pro-Operations Advisor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Systems <span className="text-slate-400 dark:text-slate-600">/</span> Infrastructure
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Automation Health Dial */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
            
            <h3 className="text-xl font-bold mb-8">Automation Health</h3>
            
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={553}
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * metrics!.automationRatio) }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="text-blue-600"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tracking-tighter">{automationPercentage}%</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
              </div>
            </div>

            <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">
              Ratio of automated workflows vs. manual founder interventions.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Automated</p>
                <p className="text-lg font-bold text-blue-600">{automationPercentage}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Manual</p>
                <p className="text-lg font-bold text-slate-400">{100 - automationPercentage}</p>
              </div>
            </div>
          </motion.div>

          {/* Software Stack & Critical Configurations */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  Software Infrastructure
                </h3>
                <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-full uppercase">
                  {metrics?.softwareStack.length} Integrated Apps
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics?.softwareStack.map((app, i) => (
                  <div 
                    key={app}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {i % 3 === 0 ? <Database className="w-5 h-5 text-blue-500" /> : 
                       i % 3 === 1 ? <Cloud className="w-5 h-5 text-indigo-500" /> : 
                                    <Lock className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{app}</h4>
                      <p className="text-xs text-slate-500">Core Infrastructure</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Activity className="w-32 h-32" />
              </div>
              
              <div className="relative">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Operational Advisory
                </h3>
                <p className="text-slate-400 text-sm mb-6 max-w-md">
                  Based on your current admin volume ({Math.round(automationPercentage / 10)}h/week manual), we recommend the following scaling maneuvers:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Deploy Zero-Touch Onboarding</h4>
                      <p className="text-xs text-slate-500">Eliminate the 4h/week spent on manual client setup.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm">Sync Software Silos</h4>
                      <p className="text-xs text-slate-500">Integrate {metrics?.softwareStack[0]} with your CRM to automate lead routing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
