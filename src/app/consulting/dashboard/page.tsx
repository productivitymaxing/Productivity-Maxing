"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Gauge, Workflow, ChevronRight, History, ShieldCheck, ListTodo, LogOut } from "lucide-react"
import { businessIntelligenceApi, normalizeAudit, type Audit, type BusinessIntelligenceUser } from "@/lib/businessIntelligenceApi"

import { useRouter } from "next/navigation"

type StoredState = {
  user?: BusinessIntelligenceUser
  audit?: Audit
}

export default function ConsultingDashboardPage() {
  const router = useRouter()
  const [state, setState] = useState<StoredState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSignOut = () => {
    businessIntelligenceApi.logout()
    router.push("/consulting")
  }

  useEffect(() => {
    // Check for OAuth token in URL directly on dashboard
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
      window.localStorage.setItem("business-intelligence-max-token", token)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    const loadDashboard = async () => {
      try {
        const [session, auditHistory] = await Promise.all([
          businessIntelligenceApi.session(),
          businessIntelligenceApi.listAudits(),
        ])
        
        if (auditHistory.audits.length === 0) {
          router.push("/consulting/portal")
          return
        }
        
        setState({ user: session.user, audit: auditHistory.audits[0] ? normalizeAudit(auditHistory.audits[0]) : undefined })
      } catch (error) {
        router.push("/consulting")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  return (
    <main className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/consulting" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Business Intelligence Max
        </Link>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Business Intelligence Max</p>
            <h1 className="text-4xl font-semibold tracking-tight">Operational Dashboard</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Executive view of operating score, constraints, credits and generated systems.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/consulting/history" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
              <History size={16} /> View Audit History
            </Link>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/30">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
        {isLoading && <StatusPanel message="Loading institutional operating dashboard from Cloudflare business memory..." />}
        {errorMessage && <ErrorPanel message={errorMessage} />}
        
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Operational Score" value={state.audit?.score ? String(state.audit.score) : "No audit"} icon={<Gauge />} />
          <Metric label="Credits Remaining" value={String(state.user?.credits_balance ?? 15)} icon={<BarChart3 />} />
          <Metric label="Generation Access" value={state.user?.subscription_tier === "Free" ? "Locked" : "Ready"} icon={<Workflow />} />
        </div>

        {state.audit && (
          <div className="mt-10 space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Priority Bottlenecks" icon={<Workflow className="text-blue-600" />} items={state.audit.bottlenecks} />
              <Panel title="Growth Constraints" icon={<ShieldCheck className="text-blue-600" />} items={state.audit.constraints} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="AI Recommendations" icon={<Gauge className="text-blue-600" />} items={state.audit.recommendations} />
              <Panel title="30-Day Priority Roadmap" icon={<ListTodo className="text-blue-600" />} items={state.audit.roadmap} />
            </div>
          </div>
        )}

        {!state.audit && !isLoading && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <h2 className="text-xl font-semibold">No Audit Found</h2>
            <p className="mt-2 text-slate-500">Complete your first business diagnostic to see your operational insights here.</p>
            <Link href="/consulting" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Start Diagnostic <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"><div className="mb-4 text-blue-600 dark:text-cyan-300">{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-semibold">{value}</p></div>
}

function Panel({ title, items, icon }: { title: string; items: string[]; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <ul className="space-y-3 text-slate-600 dark:text-slate-300">
        {items.map(item => (
          <li key={item} className="flex gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/70">
            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-cyan-300" />
            <span className="text-sm leading-relaxed">{item}</span>
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
