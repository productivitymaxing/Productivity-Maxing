"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowRight,
  Apple,
  BarChart3,
  Brain,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  History,
  Lock,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Workflow,
  Zap,
} from "lucide-react"
import { businessIntelligenceApi, normalizeAudit, type Audit, type BusinessIntelligenceUser, type ConversationMessage, workerUrl } from "@/lib/businessIntelligenceApi"

type Tier = "Free" | "Pro" | "Max"
type StepKey = "foundation" | "operations" | "marketing" | "productivity" | "systems"
type DiagnosticForm = Record<StepKey, Record<string, string>>

const steps: { key: StepKey; title: string; prompt: string; fields: { name: string; label: string; type?: "select" | "textarea"; options?: string[] }[] }[] = [
  { key: "foundation", title: "Business Foundation", prompt: "Establish the operating context before diagnosing friction.", fields: [
    { name: "businessType", label: "Business type", options: ["Agency", "Startup", "Consulting", "SaaS", "Service Business", "Ecommerce"] },
    { name: "revenueModel", label: "Revenue model", options: ["Retainer", "One-time projects", "Subscription", "Marketplace", "Productized service", "Mixed"] },
    { name: "teamSize", label: "Team size", options: ["Solo", "2-5", "6-15", "16-50", "51+"] },
    { name: "monthlyRevenue", label: "Monthly revenue range", options: ["Pre-revenue", "$1k-$10k", "$10k-$50k", "$50k-$250k", "$250k+"] },
    { name: "growthStage", label: "Growth stage", options: ["Validation", "Early traction", "Scaling", "Operational complexity", "Mature optimization"] },
  ]},
  { key: "operations", title: "Operations", prompt: "Identify where execution slows down, breaks, or depends too heavily on the founder.", fields: [
    { name: "bottlenecks", label: "Biggest operational bottlenecks", type: "textarea" },
    { name: "workflowIssues", label: "Workflow inefficiencies", type: "textarea" },
    { name: "communication", label: "Team communication problems", type: "textarea" },
    { name: "delivery", label: "Delivery issues", type: "textarea" },
    { name: "clientManagement", label: "Client management issues", type: "textarea" },
  ]},
  { key: "marketing", title: "Marketing", prompt: "Evaluate demand generation, conversion consistency, and market positioning clarity.", fields: [
    { name: "leadGeneration", label: "Lead generation consistency", options: ["Unpredictable", "Occasional", "Consistent", "Scalable"] },
    { name: "conversion", label: "Conversion systems", options: ["No system", "Manual follow-up", "Basic CRM", "Measured funnel", "Optimized pipeline"] },
    { name: "contentCapacity", label: "Content production capacity", options: ["None", "Founder-led", "Part-time", "Team process", "Systemized engine"] },
    { name: "channels", label: "Marketing channels", type: "textarea" },
    { name: "positioning", label: "Brand positioning clarity", options: ["Unclear", "Basic", "Specific", "Strong", "Category-defining"] },
  ]},
  { key: "productivity", title: "Productivity", prompt: "Measure time leakage, delegation quality, documentation maturity, and founder load.", fields: [
    { name: "overwhelm", label: "Founder overwhelm score", options: ["Low", "Moderate", "High", "Critical"] },
    { name: "delegation", label: "Delegation effectiveness", options: ["Poor", "Developing", "Functional", "Strong", "Excellent"] },
    { name: "meetings", label: "Meeting overload", options: ["Low", "Moderate", "High", "Excessive"] },
    { name: "documentation", label: "Process documentation level", options: ["None", "Scattered", "Basic", "Documented", "Systemized"] },
    { name: "timeLeakage", label: "Time leakage areas", type: "textarea" },
  ]},
  { key: "systems", title: "Systems & Automation", prompt: "Inspect software stack, automation, reporting, KPI visibility, and internal operating infrastructure.", fields: [
    { name: "softwareStack", label: "Current software stack", type: "textarea" },
    { name: "automation", label: "Automation level", options: ["Manual", "Some zaps", "Basic automations", "Integrated workflows", "Automated operating system"] },
    { name: "reporting", label: "Reporting systems", options: ["None", "Manual sheets", "Basic dashboards", "Automated reporting", "Executive command center"] },
    { name: "kpis", label: "KPI visibility", options: ["Invisible", "Lagging", "Partial", "Weekly", "Real-time"] },
    { name: "internalDocs", label: "Internal documentation maturity", options: ["None", "Fragmented", "Basic", "Centralized", "Operational knowledge base"] },
  ]},
]

const initialForm = steps.reduce((acc, step) => {
  acc[step.key] = step.fields.reduce<Record<string, string>>((fieldAcc, field) => {
    fieldAcc[field.name] = ""
    return fieldAcc
  }, {})
  return acc
}, {} as DiagnosticForm)

const creditActions = [
  { name: "Dashboard Generation", action: "dashboard", credits: 5, icon: BarChart3 },
  { name: "KPI Tracker Generation", action: "kpi_tracker", credits: 3, icon: Gauge },
  { name: "SOP Generator", action: "sop", credits: 2, icon: Workflow },
  { name: "AI Deep Analysis", action: "deep_analysis", credits: 4, icon: Brain },
  { name: "Strategic Planning Session", action: "strategic_plan", credits: 6, icon: Sparkles },
]

function generateAudit(form: DiagnosticForm): Audit {
  const flat = Object.values(form).flatMap(section => Object.values(section))
  const completed = flat.filter(Boolean).length
  const signal = flat.join(" ").toLowerCase()
  const penalties = ["manual", "overwhelm", "unpredictable", "none", "poor", "scattered", "critical", "excessive"].reduce((sum, word) => sum + (signal.includes(word) ? 7 : 0), 0)
  const score = Math.max(31, Math.min(92, 38 + completed * 2 - penalties + (signal.includes("automated") ? 10 : 0)))
  return {
    score,
    bottlenecks: ["Founder-dependent execution is limiting throughput.", "Workflow visibility is not yet strong enough for predictable scale.", "KPI reporting requires tighter operating cadence."],
    constraints: ["Manual coordination creates hidden time leakage.", "Client delivery and internal accountability are not fully systemized.", "Growth channels are vulnerable without a repeatable operating rhythm."],
    recommendations: ["Install a weekly executive operating dashboard with lead, delivery, finance and capacity metrics.", "Convert recurring delivery work into documented SOPs with ownership rules.", "Build a founder leverage system: delegation map, decision rules and escalation paths.", "Create a revenue operations tracker for leads, pipeline velocity and follow-up SLA."],
    roadmap: ["Week 1: Map bottlenecks, owner responsibilities and critical KPIs.", "Week 2: Build the operating dashboard and weekly review cadence.", "Week 3: Document top 5 recurring workflows as SOPs.", "Week 4: Deploy delegation, tracker and accountability system."],
    summary: "Your business has enough operational signal to improve quickly, but scaling will require a stronger management system: clearer metrics, fewer manual handoffs, documented delivery, and a tighter executive review cadence.",
  }
}

function parseConversationMessages(messagesJson: string): ConversationMessage[] {
  try {
    const parsed = JSON.parse(messagesJson)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(message => message?.role && message?.content && message?.createdAt) as ConversationMessage[]
  } catch {
    return []
  }
}

export default function ConsultingPage() {
  const router = useRouter()
  const [showAuth, setShowAuth] = useState(false)
  const [selectedPath, setSelectedPath] = useState<"business" | "personal" | undefined>(undefined)
  const [user, setUser] = useState<BusinessIntelligenceUser | null>(null)

  const handleBusinessSelection = () => {
    setSelectedPath("business")
    if (user) {
      router.push("/consulting/portal")
    } else {
      setShowAuth(true)
    }
  }

  const handleAuthSuccess = async () => {
    await loadWorkspace()
    setShowAuth(false)
  }

  const loadWorkspace = async () => {
    try {
      const [session, auditHistory] = await Promise.all([
        businessIntelligenceApi.session(),
        businessIntelligenceApi.listAudits(),
      ])
      setUser(session.user)
      
      const latestAudit = auditHistory.audits[0]
      if (latestAudit) {
        router.push("/consulting/dashboard")
        return true
      }
      
      // Authenticated but no audit: redirect to portal
      router.push("/consulting/portal")
      return true
    } catch (error) {
      // User is not authenticated
      return false
    }
  }

  useEffect(() => {
    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
      window.localStorage.setItem("business-intelligence-max-token", token)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      // Load user session
      loadWorkspace()
    } else {
      // Check if user is already authenticated
      loadWorkspace()
    }
  }, [router])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,103,255,0.28),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(0,36,148,0.28),transparent_20%),linear-gradient(180deg,rgba(3,11,72,1),rgba(6,27,133,1) 35%,rgba(10,31,85,1) 100%)] text-white">
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950/50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">Business Intelligence Max</div>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">Welcome to Business Intelligence Max</h1>
            <div className="w-fit space-y-6">
              <p className="text-xl leading-9 text-slate-200/90">Your Apt Business Operational Advisory.</p>
              <button onClick={handleBusinessSelection} className="w-full rounded-3xl bg-blue-600 px-8 py-5 text-lg font-semibold text-white shadow-xl shadow-blue-900/20 transition hover:bg-blue-500">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {showAuth && <AuthOverlay onClose={() => setShowAuth(false)} onAuthenticated={handleAuthSuccess} selectedPath={selectedPath} />}
    </main>
  )
}

function AuditList({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="mb-2 font-semibold">{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-300" size={15} />{item}</li>)}</ul></div>
}

function AuthOverlay({ onClose, onAuthenticated, selectedPath }: { onClose: () => void; onAuthenticated: () => Promise<void>; selectedPath?: "business" | "personal" }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [mode, setMode] = useState<"signup" | "signin">("signup")
  const [verificationLink, setVerificationLink] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [providerMessage, setProviderMessage] = useState("")

  const handleEmailAction = async () => {
    try {
      setIsSigningIn(true)
      setErrorMessage("")
      setProviderMessage("")
      setVerificationLink("")

      if (mode === "signup") {
        const result = await businessIntelligenceApi.requestEmailVerification(email, name, `${window.location.origin}/consulting`)
        if (result.verificationUrl) {
          // Development mode fallback when no RESEND_API_KEY is configured
          setVerificationLink(result.verificationUrl)
          setProviderMessage("Development mode: Click the link below to verify.")
        } else {
          setProviderMessage(`A verification link has been sent to ${email}. Please check your inbox.`)
        }
        return
      }

      await businessIntelligenceApi.login(email, name)
      await onAuthenticated()
      onClose()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to establish secure session.")
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleProviderClick = (provider: string) => {
    const providerRoutes = {
      Google: "/api/auth/google",
      GitHub: "/api/auth/github",
      Apple: "/api/auth/apple",
    }
    const route = providerRoutes[provider as keyof typeof providerRoutes]
    if (route) {
      const redirectTo = encodeURIComponent(`${window.location.origin}/consulting`)
      window.location.href = `${workerUrl}${route}?redirect_to=${redirectTo}`
    } else {
      setProviderMessage(`${provider} sign in is not configured yet. Use secure email access to continue today.`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-950/90 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/50 ring-1 ring-white/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Productivity Maxing</p>
            <h2 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Sign Up / Sign In</h2>
          </div>
          <button onClick={onClose} className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800">Back to welcome</button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <button type="button" onClick={() => handleProviderClick("Google")} className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google logo" className="h-5 w-5 rounded-full bg-white p-0.5" />
            Continue with Google
          </button>
          <button type="button" onClick={() => handleProviderClick("GitHub")} className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub logo" className="h-5 w-5 rounded-full bg-white p-0.5" />
            Continue with GitHub
          </button>
          <button type="button" onClick={() => handleProviderClick("Apple")} className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
              <svg viewBox="0 0 448.334 448.334" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M362.806,278.708c-5.486-12.602-8.572-26.77-8.572-41.686c0-6.328,0.561-12.423,1.621-18.299c4.52-25.415,18.36-46.409,37.439-60.018c3.43-2.415,7.014-4.598,10.723-6.53c-25.749-40.627-67.708-44.103-80.895-45.49c-28.68-2.992-69.111,22.367-91.059,22.367h-0.592c-21.946,0-62.379-25.359-91.059-22.367c-14.276,1.465-59.916,9.555-87.441,53.408c-9.665,15.385-17.114,34.322-20.169,59.315c-1.093,9.009-1.622,18.424-1.498,28.867c0.125,10.489,0.967,20.597,2.4,30.605c3.087,21.369,8.886,41.461,16.367,59.924c8.323,20.48,18.735,38.857,29.801,54.499c24.474,34.649,52.186,54.655,67.835,55.014c32.109,0.717,60.009-21.003,83.047-20.442c0.25,0.078,0.498,0.078,0.717,0.063l0.311-0.031l0.281,0.031c0.219,0.016,0.467,0,0.686-0.078c23.037-0.592,50.969,21.144,83.141,20.427c15.586-0.358,43.332-20.38,67.803-55.03c11.066-15.641,21.478-34.049,29.739-54.545c1.246-3.055,2.432-6.157,3.615-9.306C393.107,321.931,373.404,303.196,362.806,278.708z" />
                <path d="M288.176,73.384c24.691-29.21,23.724-71.256,21.479-73.11c-2.213-1.886-42.987,5.61-68.27,33.831c-25.282,28.259-23.722,71.255-21.478,73.125C222.12,109.101,263.519,102.585,288.176,73.384z" />
              </svg>
            </span>
            Continue with Apple
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Official Productivity Maxing access</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Email {mode === "signup" ? "sign up" : "sign in"}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use email sign up to create your account, then verify it before accessing Business Intelligence Max.</p>
            </div>
            <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="inline-flex items-center justify-center rounded-3xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
              {mode === "signup" ? "Already have an account? Sign in" : "New here? Sign up"}
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mode === "signup" && (
              <input value={name} onChange={event => setName(event.target.value)} placeholder="Full name" className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
            )}
            <input value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
          </div>
          {errorMessage && <p className="mt-4 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{errorMessage}</p>}
          {providerMessage && <p className="mt-4 rounded-3xl border border-slate-600 bg-slate-900/90 p-4 text-sm text-slate-300">{providerMessage}</p>}
          {verificationLink && (
            <div className="mt-4 rounded-3xl border border-slate-700 bg-slate-900/90 p-4 text-sm text-slate-200">
              <p className="font-semibold text-slate-100">Email verification ready</p>
              <p className="mt-2 text-slate-300">Use the link below to verify your account and continue to Business Intelligence Max.</p>
              <a href={verificationLink} className="mt-3 inline-flex rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Verify email</a>
            </div>
          )}
          <button disabled={isSigningIn || !email.trim()} onClick={handleEmailAction} className="mt-6 w-full rounded-3xl bg-sky-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
            {isSigningIn ? (mode === "signup" ? "Sending verification..." : "Signing in...") : (mode === "signup" ? "Continue with email" : "Sign in with email")}
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400">
            <ShieldCheck size={16} className="text-sky-500" />
            Secure Sign-In
          </div>
        </div>
      </div>
    </div>
  )
}
