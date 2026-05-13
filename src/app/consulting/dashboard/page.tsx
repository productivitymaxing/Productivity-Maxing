"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Gauge, Workflow } from "lucide-react"
import { businessIntelligenceApi, normalizeAudit, type Audit, type BusinessIntelligenceUser } from "@/lib/businessIntelligenceApi"

type StoredState = {
  user?: BusinessIntelligenceUser
  audit?: Audit
}

export default function ConsultingDashboardPage() {
  const [state, setState] = useState<StoredState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [session, auditHistory] = await Promise.all([
          businessIntelligenceApi.session(),
          businessIntelligenceApi.listAudits(),
        ])
        setState({ user: session.user, audit: auditHistory.audits[0] ? normalizeAudit(auditHistory.audits[0]) : undefined })
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load dashboard.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <main className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/consulting" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Business Intelligence Max
        </Link>
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Business Intelligence Max</p>
          <h1 className="text-4xl font-semibold tracking-tight">Operational Dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Executive view of operating score, constraints, credits and generated systems.</p>
        </div>
        {isLoading && <StatusPanel message="Loading institutional operating dashboard from Cloudflare business memory..." />}
        {errorMessage && <ErrorPanel message={errorMessage} />}
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Operational Score" value={state.audit?.score ? String(state.audit.score) : "No audit"} icon={<Gauge />} />
          <Metric label="Credits Remaining" value={String(state.user?.credits_balance ?? 15)} icon={<BarChart3 />} />
          <Metric label="Generation Access" value={state.user?.subscription_tier === "Free" ? "Locked" : "Ready"} icon={<Workflow />} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Priority Bottlenecks" items={state.audit?.bottlenecks ?? ["Complete the diagnostic to populate bottlenecks."]} />
          <Panel title="AI Recommendations" items={state.audit?.recommendations ?? ["Generate a free audit to receive recommendations."]} />
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"><div className="mb-4 text-blue-600 dark:text-cyan-300">{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></div>
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"><h2 className="mb-4 text-2xl font-semibold">{title}</h2><ul className="space-y-3 text-slate-600 dark:text-slate-300">{items.map(item => <li key={item} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/70">{item}</li>)}</ul></div>
}

function StatusPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700 dark:border-cyan-900/50 dark:bg-cyan-950/20 dark:text-cyan-300">{message}</div>
}

function ErrorPanel({ message }: { message: string }) {
  return <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{message}</div>
}
