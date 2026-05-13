"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { businessIntelligenceApi, normalizeAudit, type Audit } from "@/lib/businessIntelligenceApi"

type StoredState = {
  audit?: Audit
}

export default function ConsultingReportsPage() {
  const [state, setState] = useState<StoredState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadReports = async () => {
      try {
        const auditHistory = await businessIntelligenceApi.listAudits()
        setState({ audit: auditHistory.audits[0] ? normalizeAudit(auditHistory.audits[0]) : undefined })
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load reports.")
      } finally {
        setIsLoading(false)
      }
    }

    loadReports()
  }, [])

  return (
    <main className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/consulting" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Business Intelligence Max
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Operational Report</p>
              <h1 className="text-4xl font-semibold tracking-tight">Executive Audit Brief</h1>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <Download size={16} /> Export
            </button>
          </div>
          {isLoading && <StatusPanel message="Loading institutional audit report from Cloudflare D1..." />}
          {errorMessage && <ErrorPanel message={errorMessage} />}
          <div className="space-y-6">
            <ReportBlock title="AI Summary" items={[state.audit?.summary ?? "Complete the diagnostic to generate an executive operational assessment."]} />
            <ReportBlock title="Growth Constraints" items={state.audit?.constraints ?? ["No constraints recorded yet."]} />
            <ReportBlock title="30-Day Roadmap" items={state.audit?.roadmap ?? ["No roadmap generated yet."]} />
          </div>
        </div>
      </section>
    </main>
  )
}

function ReportBlock({ title, items }: { title: string; items: string[] }) {
  return <section><h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold"><FileText className="text-blue-600 dark:text-cyan-300" /> {title}</h2><div className="space-y-3">{items.map(item => <p key={item} className="rounded-xl bg-slate-50 p-4 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">{item}</p>)}</div></section>
}

function StatusPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700 dark:border-cyan-900/50 dark:bg-cyan-950/20 dark:text-cyan-300">{message}</div>
}

function ErrorPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{message}</div>
}
