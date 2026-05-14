"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, History, ChevronDown, ChevronUp, CheckCircle2, Calendar } from "lucide-react"
import { businessIntelligenceApi, normalizeAudit, type Audit } from "@/lib/businessIntelligenceApi"

type StoredState = { history?: Audit[] }

export default function ConsultingHistoryPage() {
  const [state, setState] = useState<StoredState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const auditHistory = await businessIntelligenceApi.listAudits()
        setState({ history: auditHistory.audits.map(normalizeAudit) })
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load audit history.")
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  const history = state.history ?? []

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <main className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/consulting" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Business Intelligence Max
        </Link>
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Audit History</p>
          <h1 className="text-4xl font-semibold tracking-tight">Business Memory Timeline</h1>
        </div>
        {isLoading && <StatusPanel message="Loading institutional business memory timeline..." />}
        {errorMessage && <ErrorPanel message={errorMessage} />}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">No saved audits yet. Complete the diagnostic to create your first business memory record.</div>
          ) : (
            history.map((audit, index) => {
              const auditId = audit.id || `audit-${index}`
              const isExpanded = expandedId === auditId
              const date = audit.created_at ? new Date(audit.created_at).toLocaleDateString() : "Recently"

              return (
                <div key={auditId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-900/60">
                  <button 
                    onClick={() => toggleExpand(auditId)}
                    className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-cyan-300">
                        <History size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Audit #{history.length - index}</h2>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Calendar size={14} /> {date}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">Score {audit.score}</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                  </button>
                  
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-6 dark:border-slate-800">
                      <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                        <h3 className="mb-2 font-semibold">Executive Summary</h3>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{audit.summary}</p>
                      </div>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <AuditDetailList title="Key Bottlenecks" items={audit.bottlenecks} />
                        <AuditDetailList title="Growth Constraints" items={audit.constraints} />
                        <AuditDetailList title="System Recommendations" items={audit.recommendations} />
                        <AuditDetailList title="30-Day Roadmap" items={audit.roadmap} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </main>
  )
}

function AuditDetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-300" size={15} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatusPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700 dark:border-cyan-900/50 dark:bg-cyan-950/20 dark:text-cyan-300">{message}</div>
}

function ErrorPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{message}</div>
}
