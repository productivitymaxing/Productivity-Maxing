'use client'

import { useState } from 'react'
import MaxAuditEngine from '@/components/MaxAuditEngine'

export default function ProDiagnoseLauncher() {
  const [showTools, setShowTools] = useState(false)
  const [activeTool, setActiveTool] = useState<'auditmax' | null>(null)

  if (activeTool === 'auditmax') {
    return <MaxAuditEngine />
  }

  return (
    <div className="mx-auto max-w-7xl">
      <button
        type="button"
        onClick={() => setShowTools((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-500 transition hover:border-cyan-500/60 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:text-cyan-400 dark:focus:ring-offset-slate-950"
        aria-expanded={showTools}
      >
        <span>🔍</span>
        ProDiagnose
      </button>

      {showTools && (
        <div className="mt-5 max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTool('auditmax')}
            className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-cyan-500/50 hover:bg-cyan-500/5 dark:border-slate-800 dark:hover:border-cyan-500/50 dark:hover:bg-cyan-500/10"
          >
            <span className="block text-lg font-bold">AuditMax</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
              Launch the operational audit engine.
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
