'use client'

import { useState } from 'react'
import { ChevronDown, Search, Activity, ArrowRight } from 'lucide-react'
import MaxAuditEngine from './MaxAuditEngine'

export default function ProDiagnoseLauncher() {
  const [expanded, setExpanded] = useState(false)
  const [launched, setLaunched] = useState(false)

  if (launched) {
    return (
      <div>
        <button
          onClick={() => setLaunched(false)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          ← Back to ProDiagnose
        </button>
        <MaxAuditEngine />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-base font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition"
      >
        <Search className="h-5 w-5" />
        ProDiagnose
        <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 max-w-xl">
          <button
            onClick={() => setLaunched(true)}
            className="group w-full flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-cyan-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-500/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">AuditMax</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Launch the forensic audit engine
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-500" />
          </button>
        </div>
      )}
    </div>
  )
}
