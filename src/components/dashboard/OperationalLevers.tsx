"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, CheckCircle2, Settings2 } from "lucide-react"

interface OperationalLever {
  title: string
  impact: "High" | "Medium"
  description: string
}

interface OperationalLeversProps {
  levers: OperationalLever[]
}

export default function OperationalLevers({ levers }: OperationalLeversProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm h-full"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">Operational Levers</h3>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Top Efficiency Gains</p>
        </div>
      </div>

      <div className="space-y-6">
        {levers.map((lever, i) => (
          <motion.div
            key={lever.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="group relative p-4 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                lever.impact === "High" 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
                {lever.impact} Impact
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {lever.title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {lever.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-4 rounded-2xl bg-slate-900 dark:bg-blue-900/10 border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
        <span className="text-sm font-semibold text-white">Unlock Detailed Implementation Roadmap</span>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.div>
  )
}
