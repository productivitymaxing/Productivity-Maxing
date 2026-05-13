"use client"

import { useEffect, useMemo, useState } from "react"
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
    if (!user) {
      setShowAuth(true)
    }
  }

  const handleAuthSuccess = async () => {
    await loadWorkspace()
    setShowAuth(false)
    setHasStarted(true)
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
      if (latestAudit) setAudit(normalizeAudit(latestAudit))
      const latestConversation = conversationHistory.conversations[0]
      if (latestConversation) {
        setConversationId(latestConversation.id)
        setMessages(parseConversationMessages(latestConversation.messages_json))
      } else {
        setConversationId(undefined)
        setMessages([{ role: "assistant", content: `Secure consulting terminal active for ${session.user.email}. Ask about bottlenecks, systems, delegation, KPIs, revenue operations, or execution cadence.`, createdAt: new Date().toISOString() }])
      }
      setStatusMessage(`Cloudflare business memory connected for ${session.user.email}.`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Sign in to connect your protected Business Intelligence Max memory.")
      setStatusMessage("Business Intelligence Max is waiting for authenticated business context.")
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
  }, [])

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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,103,255,0.28),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(0,36,148,0.28),transparent_20%),linear-gradient(180deg,rgba(3,11,72,1),rgba(6,27,133,1) 35%,rgba(10,31,85,1) 100%)] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,103,255,0.20),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(0,36,148,0.22),transparent_20%),linear-gradient(180deg,rgba(3,11,72,0.95),rgba(6,27,133,0.9))]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950/90 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-100">Business Intelligence Max</div>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">Welcome to Business Intelligence Max</h1>
            <p className="text-xl leading-9 text-slate-200/90">Your Apt Business Operational Advisory.</p>
            <p className="max-w-2xl text-base leading-8 text-slate-300/90">Choose the priority path for your business and sign in to unlock the official Productivity Maxing advisory experience.</p>
            <div className="grid gap-4 sm:max-w-lg sm:grid-cols-[1.15fr_0.85fr]">
              <button onClick={handleBusinessSelection} className="rounded-3xl bg-white/10 px-8 py-5 text-lg font-semibold text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/20 transition hover:bg-white/15">Business</button>
              <button disabled className="rounded-3xl border border-white/15 bg-white/5 px-8 py-5 text-left text-lg font-semibold text-slate-200 opacity-80">
                <span>Personal</span>
                <span className="mt-2 block text-xs uppercase tracking-[0.22em] text-slate-300">Coming soon</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {isConsultingReady && (
      <>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
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
      </>)}
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
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [providerMessage, setProviderMessage] = useState("")

  const signIn = async () => {
    try {
      setIsSigningIn(true)
      setErrorMessage("")
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
      const redirectTo = encodeURIComponent(window.location.origin)
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
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Secure your official Productivity Maxing advisory experience. One secure sign in gives you access to Business Intelligence Max consulting and saved operational memory.</p>
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
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Official Productivity Maxing access</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Email sign in</h3>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{selectedPath === "business" ? "Business" : "Personal"}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={name} onChange={event => setName(event.target.value)} placeholder="Full name" className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
            <input value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500" />
          </div>
          {errorMessage && <p className="mt-4 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{errorMessage}</p>}
          {providerMessage && <p className="mt-4 rounded-3xl border border-slate-600 bg-slate-900/90 p-4 text-sm text-slate-300">{providerMessage}</p>}
          <button disabled={isSigningIn || !email.trim()} onClick={signIn} className="mt-6 w-full rounded-3xl bg-sky-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{isSigningIn ? "Signing in..." : "Continue with email"}</button>
          <p className="mt-4 text-sm leading-6 text-slate-400">You can sign up or sign in with any verified email address. Your session is protected by Cloudflare Worker token authentication.</p>
        </div>
      </div>
    </div>
  )
}
