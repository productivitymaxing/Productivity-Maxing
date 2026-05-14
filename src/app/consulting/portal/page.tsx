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
  const [hasStarted, setHasStarted] = useState(false)
  const [selectedPath, setSelectedPath] = useState<"business" | "personal" | undefined>(undefined)
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<DiagnosticForm>(initialForm)
  const [audit, setAudit] = useState<Audit | null>(null)
  const [tier, setTier] = useState<Tier>("Free")
  const [credits, setCredits] = useState(15)
  const [user, setUser] = useState<BusinessIntelligenceUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState("Connecting to institutional business memory...")

  const handleBusinessSelection = () => {
    setSelectedPath("business")
    setHasStarted(true)
    if (user) {
      router.push("/consulting/dashboard")
    } else {
      setShowAuth(true)
    }
  }

  const handleAuthSuccess = async () => {
    await loadWorkspace()
    setShowAuth(false)
  }

  const isConsultingReady = hasStarted && selectedPath === "business" && !!user
  const [errorMessage, setErrorMessage] = useState("")
  const [conversationId, setConversationId] = useState<string>()
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: "assistant", content: "Sign in to activate protected Business Intelligence Max memory. Once authenticated, every consulting exchange is saved to Cloudflare D1 under your verified email.", createdAt: new Date().toISOString() },
  ])
  const [terminalInput, setTerminalInput] = useState("")
  const [isSavingConversation, setIsSavingConversation] = useState(false)

  const loadWorkspace = async () => {
    try {
      setIsLoading(true)
      setErrorMessage("")
      const [session, auditHistory, conversationHistory] = await Promise.all([
        businessIntelligenceApi.session(),
        businessIntelligenceApi.listAudits(),
        businessIntelligenceApi.listConversations(),
      ])
      setUser(session.user)
      setTier(session.user.subscription_tier)
      setCredits(session.user.credits_balance)
      
      const latestAudit = auditHistory.audits[0]
      if (latestAudit) {
        setAudit(normalizeAudit(latestAudit))
        router.push("/consulting/dashboard")
        return true
      }
      
      // Load saved onboarding progress
      const progress = await businessIntelligenceApi.getOnboardingProgress().catch(() => null)
      if (progress?.form) {
        setForm(progress.form as DiagnosticForm)
        setCurrentStep(progress.currentStep ?? 0)
        setHasStarted(true)
        setSelectedPath("business")
      } else {
        // First-time user: initialize onboarding state
        setHasStarted(true)
        setSelectedPath("business")
      }
      
      const latestConversation = conversationHistory.conversations[0]
      if (latestConversation) {
        setConversationId(latestConversation.id)
        setMessages(parseConversationMessages(latestConversation.messages_json))
      } else {
        setConversationId(undefined)
        setMessages([{ role: "assistant", content: `Secure consulting terminal active for ${session.user.email}. Ask about bottlenecks, systems, delegation, KPIs, revenue operations, or execution cadence.`, createdAt: new Date().toISOString() }])
      }
      setStatusMessage(`Cloudflare business memory connected for ${session.user.email}.`)
      return true
    } catch (error) {
      router.push("/consulting")
      return false
    } finally {
      setIsLoading(false)
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

  // Save progress automatically when user is authenticated and changes step or form data
  useEffect(() => {
    if (user && selectedPath === "business" && !audit) {
      const timer = setTimeout(() => {
        businessIntelligenceApi.saveOnboardingProgress(form, currentStep).catch(() => {})
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [form, currentStep, user, selectedPath, audit])

  const step = steps[currentStep]
  const completion = useMemo(() => Math.round(((currentStep + 1) / steps.length) * 100), [currentStep])
  const isStepComplete = step.fields.every(field => form[step.key][field.name]?.trim())

  const updateField = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [step.key]: { ...prev[step.key], [name]: value } }))
  }

  const submitAudit = async () => {
    try {
      setIsGenerating(true)
      setErrorMessage("")
      setStatusMessage("Running institutional operating diagnosis...")
      const result = await businessIntelligenceApi.createAudit(form)
      setAudit(normalizeAudit(result.audit))
      setStatusMessage("Free audit generated and stored in Cloudflare D1.")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Audit generation failed. Please try again.")
      setStatusMessage("Business Intelligence Max could not complete the diagnostic request.")
    } finally {
      setIsGenerating(false)
    }
  }

  const spendCredits = async (action: string, amount: number) => {
    if (tier === "Free" || credits < amount) return
    try {
      setIsGenerating(true)
      setErrorMessage("")
      setStatusMessage("Authorizing credit-backed generation...")
      const result = await businessIntelligenceApi.spendCredits(action, audit?.id)
      setCredits(result.creditsBalance)
      setStatusMessage("Generation completed and credit ledger updated.")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Credit-backed generation failed.")
      setStatusMessage("Credit transaction was not completed.")
    } finally {
      setIsGenerating(false)
    }
  }

  const sendTerminalMessage = async () => {
    const content = terminalInput.trim()
    if (!content) return
    if (!user) {
      setShowAuth(true)
      setErrorMessage("Sign in before using the protected consulting terminal.")
      return
    }

    const now = new Date().toISOString()
    const userMessage: ConversationMessage = { role: "user", content, createdAt: now }
    const pendingMessages = [...messages, userMessage]
    const title = pendingMessages.find(message => message.role === "user")?.content.slice(0, 80) || "Consulting terminal session"

    try {
      setTerminalInput("")
      setMessages(pendingMessages)
      setIsSavingConversation(true)
      setErrorMessage("")
      setStatusMessage("Gemini 3 Flash is mapping friction and revenue at risk...")
      const aiResult = await businessIntelligenceApi.generateReply({ conversationId, message: content, audit })
      const assistantMessage: ConversationMessage = { role: "assistant", content: aiResult.reply, createdAt: new Date().toISOString() }
      const nextMessages = [...pendingMessages, assistantMessage]
      setMessages(nextMessages)
      const result = await businessIntelligenceApi.saveConversation({ id: conversationId, title, messages: nextMessages })
      setConversationId(result.conversation.id)
      setStatusMessage(`Conversation history saved under ${result.userEmail}.`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save consulting conversation.")
      setStatusMessage("Consulting response generated, but database save did not complete.")
    } finally {
      setIsSavingConversation(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,103,255,0.28),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(0,36,148,0.28),transparent_20%),linear-gradient(180deg,rgba(3,11,72,1),rgba(6,27,133,1) 35%,rgba(10,31,85,1) 100%)] text-white">
      {isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xl font-semibold text-slate-300">Loading Business Intelligence Max...</p>
        </div>
      ) : isConsultingReady ? (
      <>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 pt-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mb-6 flex items-center justify-between"><div><p className="text-sm text-slate-500">Phase 1 — Free Audit</p><h2 className="text-3xl font-semibold">{step.title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">{completion}%</span></div>
          <p className="mb-6 text-slate-600 dark:text-slate-300">{step.prompt}</p><div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full bg-blue-600 dark:bg-cyan-300" style={{ width: `${completion}%` }} /></div>
          <div className="space-y-4">{step.fields.map(field => <label key={field.name} className="block"><span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{field.label}</span>{field.type === "textarea" ? <textarea value={form[step.key][field.name]} onChange={event => updateField(field.name, event.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-300" /> : <select value={form[step.key][field.name]} onChange={event => updateField(field.name, event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-300"><option value="">Select...</option>{field.options?.map(option => <option key={option} value={option}>{option}</option>)}</select>}</label>)}</div>
          <div className="mt-6 flex justify-between gap-3"><button disabled={currentStep === 0 || isGenerating} onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300">Back</button>{currentStep < steps.length - 1 ? <button disabled={!isStepComplete || isGenerating} onClick={() => setCurrentStep(prev => prev + 1)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-blue-400">Continue <ArrowRight size={16} /></button> : <button disabled={!isStepComplete || isGenerating} onClick={submitAudit} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-blue-400">{isGenerating ? "Running Institutional Audit..." : "Generate Free Audit"} <Sparkles size={16} /></button>}</div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-semibold">Instant Audit Output</h2><Gauge className="text-blue-600 dark:text-cyan-300" /></div>{!audit ? <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">Complete the diagnostic to generate your operational score, bottlenecks, recommendations and roadmap.</div> : <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Operational Score</p><p className="text-4xl font-semibold text-blue-600 dark:text-cyan-300">{audit.score}</p></div><div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Tier</p><p className="text-2xl font-semibold">{tier}</p></div><div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-950"><p className="text-sm text-slate-500">Credits</p><p className="text-2xl font-semibold">{credits}</p></div></div><AuditList title="Key Bottlenecks" items={audit.bottlenecks} /><AuditList title="Growth Constraints" items={audit.constraints} /><AuditList title="System Recommendations" items={audit.recommendations} /><AuditList title="30-Day Priority Roadmap" items={audit.roadmap} /><div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"><h3 className="mb-2 font-semibold">Executive Summary</h3><p className="text-slate-600 dark:text-slate-300">{audit.summary}</p></div></div>}</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-semibold">Pro Generation System</h2><Lock className="text-slate-400" /></div><div className="grid gap-3 sm:grid-cols-2">{creditActions.map(action => { const Icon = action.icon; const locked = tier === "Free"; return <button key={action.name} onClick={() => spendCredits(action.action, action.credits)} disabled={locked || credits < action.credits || isGenerating} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-500 disabled:opacity-55 dark:border-slate-800 dark:hover:border-cyan-300"><span className="flex items-center gap-3"><Icon size={18} /> {action.name}</span><span className="text-sm text-slate-500">{action.credits} credits</span></button> })}</div><div className="mt-5 grid gap-3 sm:grid-cols-3">{(["Free", "Pro", "Max"] as Tier[]).map(plan => <button key={plan} disabled className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed ${tier === plan ? "border-blue-600 bg-blue-50 dark:border-cyan-300 dark:bg-cyan-300/10" : "border-slate-200 opacity-60 dark:border-slate-800"}`}><p className="font-semibold">{plan}</p><p className="text-sm text-slate-500">{plan === "Free" ? "15 signup credits" : plan === "Pro" ? "250 monthly credits" : "1000 monthly credits"}</p></button>)}</div></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-black/20">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Authenticated Consulting Terminal</p>
              <h2 className="text-3xl font-semibold">Business Intelligence Max Command Line</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">{user?.email ? `Saving under ${user.email}` : "Sign in required"}</div>
          </div>
          <div className="mb-4 max-h-[420px] space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/70">
            {messages.map((message, index) => <div key={`${message.createdAt}-${index}`} className={`rounded-xl p-4 ${message.role === "user" ? "ml-auto max-w-3xl bg-blue-600 text-white dark:bg-cyan-300 dark:text-slate-950" : "mr-auto max-w-4xl border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"}`}><p className="mb-1 text-xs font-semibold uppercase opacity-70">{message.role === "user" ? "You" : "Business Intelligence Max"}</p><p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p></div>)}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea value={terminalInput} onChange={event => setTerminalInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) sendTerminalMessage() }} rows={3} placeholder={user ? "Ask for a diagnosis, execution plan, KPI system, SOP, or decision support..." : "Sign in to activate saved consulting memory..."} className="min-h-24 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-300" />
            <button disabled={!terminalInput.trim() || isSavingConversation} onClick={sendTerminalMessage} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-300"><Zap size={18} /> {isSavingConversation ? "Saving..." : "Send & Save"}</button>
          </div>
          <p className="mt-3 text-xs text-slate-500">Use Cmd/Ctrl + Enter to send. Messages are persisted to `ai_conversations` under the authenticated user from the signed Worker token.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-5">{[["Dashboard", "/consulting/dashboard", BarChart3], ["Reports", "/consulting/reports", FileText], ["Billing", "/consulting/billing", CreditCard], ["History", "/consulting/history", History], ["Settings", "/consulting/settings", Settings]].map(([label, href, Icon]) => { const C = Icon as typeof BarChart3; return <Link key={String(href)} href={String(href)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 font-semibold transition hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-cyan-300"><span className="flex items-center gap-3"><C size={18} />{String(label)}</span><ChevronRight size={16} /></Link> })}</div></section>
      </>) : null}
    </main>
  )
}

function AuditList({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="mb-2 font-semibold">{title}</h3><ul className="space-y-2">{items.map(item => <li key={item} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-300" size={15} />{item}</li>)}</ul></div>
}

