"use client"

import { useEffect, useState } from "react"
import { loadProDiagnoseDraft } from "@/lib/proDiagnose/storage"
import { calculateDashboardMetrics, type DashboardMetrics } from "@/lib/dashboard-utils"
import MetricCards from "@/components/dashboard/MetricCards"
import GrowthChart from "@/components/dashboard/GrowthChart"
import OperationalLevers from "@/components/dashboard/OperationalLevers"
import { motion } from "framer-motion"
import { AlertCircle, ArrowRight, LayoutDashboard, Layers, Settings2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = loadProDiagnoseDraft()
    // Check if the form is actually filled (at least some revenue)
    if (data.form.financials.currentMonthlyRevenue) {
      const calculated = calculateDashboardMetrics(data.form)
      setMetrics(calculated)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full mb-4" />
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-xl"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">No Audit Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Complete the Pro-Diagnose sequence to generate your Central Command dashboard and calculated metrics.
          </p>
          <Link 
            href="/consulting"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all group"
          >
            Start Pro-Diagnose
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
              <LayoutDashboard className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Central Command</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Workspace <span className="text-slate-400 dark:text-slate-600">/</span> Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
              <span className="text-xs text-slate-500 uppercase font-medium">Status</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Audit Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* 4-Card Metric Matrix */}
        <MetricCards metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Growth Trajectory Chart */}
          <div className="lg:col-span-2 space-y-8">
            <GrowthChart data={metrics.growthTrajectory} />
            
            {/* Quick Access Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/scale" className="group">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Layers className="w-24 h-24" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg">Pro-Scale Engine</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Manage your customer pipeline, track conversion velocity, and monitor LTV/CAC ratios.</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                    Open Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link href="/operations" className="group">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Settings2 className="w-24 h-24" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                      <Settings2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-lg">Pro-Operations</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">Audit your software stack, monitor automation health, and implement systemic optimizations.</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                    Open Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Operational Levers */}
          <div className="lg:col-span-1">
            <OperationalLevers levers={metrics.operationalLevers} />
          </div>
        </div>
      </div>
    </main>
  )
}
