"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, History } from "lucide-react"
import { businessIntelligenceApi, normalizeAudit, type Audit } from "@/lib/businessIntelligenceApi"

type StoredState = { history?: Audit[] }

export default function ConsultingHistoryPage() {
  const [state, setState] = useState<StoredState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

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
            history.map((audit, index) => (
              <div key={`${audit.score}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-2xl font-semibold"><History className="text-blue-600 dark:text-cyan-300" /> Audit #{index + 1}</h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">Score {audit.score}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{audit.summary}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

function StatusPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700 dark:border-cyan-900/50 dark:bg-cyan-950/20 dark:text-cyan-300">{message}</div>
}

function ErrorPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{message}</div>
}
