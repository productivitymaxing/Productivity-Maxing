"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Terminal, 
  Activity, 
  Mic, 
  Send, 
  X, 
  Info, 
  ChevronRight,
  Zap,
  TrendingDown,
  Clock,
  AlertTriangle,
  CreditCard,
  Mail,
  MessageSquare,
  User
} from "lucide-react"

// Types
interface Message {
  id: string
  role: "system" | "user" | "assistant"
  content: string
  timestamp: Date
}

interface DiagnosticData {
  frictionScore: number
  revenueAtRisk: number
  timeLeaked: number
  bottlenecks: string[]
  dimensions: {
    processes: number
    systems: number
    team: number
    strategy: number
    metrics: number
  }
}

export default function ConsultingTerminal() {
  // State
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [step, setStep] = useState(0)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({
    frictionScore: 0,
    revenueAtRisk: 0,
    timeLeaked: 0,
    bottlenecks: [],
    dimensions: { processes: 0, systems: 0, team: 0, strategy: 0, metrics: 0 }
  })
  const [showBlueprintCTA, setShowBlueprintCTA] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-initialize on mount
  useEffect(() => {
    const initMessage: Message = {
      id: "init",
      role: "assistant",
      content: "System Ready. Beginning Operational Triage. State your primary business bottleneck to begin friction mapping.",
      timestamp: new Date()
    }
    setMessages([initMessage])
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle user message
  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Acknowledged. Analyzing operational architecture for friction points...",
        "Processing. I've identified potential bottlenecks in your workflow. Elaborate on your current process automation level.",
        "Data received. Mapping revenue leakage vectors. What systems currently handle your customer acquisition flow?",
        "Understood. Calculating time-to-execution metrics. How many hours per week do you spend on manual coordination tasks?",
        "Noted. Evaluating system redundancy and single points of failure. Describe your current tech stack integration status.",
        "Analysis complete. I've synthesized your operational friction profile. Ready to generate your Institutional Blueprint."
      ]

      const responseIndex = Math.min(step, responses.length - 1)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[responseIndex],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setStep(prev => prev + 1)
      
      // Update diagnostic data based on step
      setDiagnosticData(prev => ({
        frictionScore: Math.min(85, prev.frictionScore + 15 + Math.random() * 10),
        revenueAtRisk: Math.min(50000, prev.revenueAtRisk + 8000 + Math.random() * 5000),
        timeLeaked: Math.min(40, prev.timeLeaked + 6 + Math.random() * 4),
        bottlenecks: [...prev.bottlenecks, `Bottleneck-${step + 1}: ${getBottleneckName(step)}`],
        dimensions: {
          processes: Math.min(85, prev.dimensions.processes + 12 + Math.random() * 8),
          systems: Math.min(80, prev.dimensions.systems + 10 + Math.random() * 10),
          team: Math.min(75, prev.dimensions.team + 8 + Math.random() * 12),
          strategy: Math.min(70, prev.dimensions.strategy + 15 + Math.random() * 10),
          metrics: Math.min(90, prev.dimensions.metrics + 18 + Math.random() * 8)
        }
      }))

      setIsTyping(false)

      // Show blueprint CTA after 6 steps
      if (step >= 5) {
        setShowBlueprintCTA(true)
      }
    }, 1500)
  }

  const getBottleneckName = (step: number): string => {
    const names = [
      "Manual Data Entry",
      "Approval Latency",
      "Context Switching",
      "Tool Fragmentation",
      "Communication Overhead",
      "Decision Bottlenecks"
    ]
    return names[step] || "Unknown"
  }

  // Render friction radar chart (simplified SVG)
  const renderFrictionRadar = () => {
    const { processes, systems, team, strategy, metrics } = diagnosticData.dimensions
    const values = [processes, systems, team, strategy, metrics]
    const labels = ["PROCESSES", "SYSTEMS", "TEAM", "STRATEGY", "METRICS"]
    const maxVal = 100
    const centerX = 100
    const centerY = 100
    const radius = 80
    const angleStep = (2 * Math.PI) / 5

    // Calculate points
    const points = values.map((val, i) => {
      const angle = i * angleStep - Math.PI / 2
      const r = (val / maxVal) * radius
      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`
    }).join(" ")

    // Background pentagons
    const bgPentagons = [20, 40, 60, 80].map((level, idx) => {
      const bgPoints = Array.from({ length: 5 }, (_, i) => {
        const angle = i * angleStep - Math.PI / 2
        const r = (level / maxVal) * radius
        return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`
      }).join(" ")
      return (
        <polygon
          key={idx}
          points={bgPoints}
          fill="none"
          stroke="#334155"
          strokeWidth="0.5"
          opacity="0.5"
        />
      )
    })

    // Axis lines and labels
    const axes = Array.from({ length: 5 }, (_, i) => {
      const angle = i * angleStep - Math.PI / 2
      const x2 = centerX + radius * Math.cos(angle)
      const y2 = centerY + radius * Math.sin(angle)
      const labelX = centerX + (radius + 20) * Math.cos(angle)
      const labelY = centerY + (radius + 20) * Math.sin(angle)
      
      return (
        <g key={i}>
          <line
            x1={centerX}
            y1={centerY}
            x2={x2}
            y2={y2}
            stroke="#334155"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] fill-slate-400 "
          >
            {labels[i]}
          </text>
        </g>
      )
    })

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {bgPentagons}
        {axes}
        <polygon
          points={points}
          fill="rgba(0, 255, 136, 0.2)"
          stroke="#00ff88"
          strokeWidth="2"
        />
        {values.map((val, i) => {
          const angle = i * angleStep - Math.PI / 2
          const r = (val / maxVal) * radius
          const x = centerX + r * Math.cos(angle)
          const y = centerY + r * Math.sin(angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#00ff88"
            />
          )
        })}
      </svg>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col text-slate-100 font-[var(--font-clash-display)] overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800/70 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center justify-between bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative grid h-11 w-11 place-items-center overflow-hidden border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
            <div className="absolute inset-1 border border-white/10" />
            <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan-200/70" />
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-200/70" />
            <Terminal className="relative z-10 h-5 w-5 text-cyan-100" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl text-slate-100 tracking-tight">
              PERFORMANCE ENGINE
            </h1>
            <p className="text-xs text-slate-500">
              Lead Performance Engineer // AI-Diagnostic Mode
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowLearnMore(true)}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-100 text-sm bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-colors"
          >
            <Info className="w-4 h-4" />
            Learn More
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-cyan-300 hover:bg-blue-400 text-slate-950 text-sm font-semibold shadow-[0_0_35px_rgba(34,211,238,0.2)] transition-colors"
            onClick={() => window.location.href = "mailto:info@productivitymaxing.com?subject=Escalate%20to%20Principal%20Consultant"}
          >
            <User className="w-4 h-4" />
            Escalate to Principal Consultant
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.9fr)] overflow-hidden">
        {/* Left Panel: Terminal Chat (60%) */}
        <div className="min-h-[70vh] flex flex-col border-r border-slate-800/70 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.13),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.32),rgba(2,6,23,0))]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] p-4 sm:p-5 border backdrop-blur-xl ${
                    msg.role === "user"
                      ? "bg-cyan-300/10 border-cyan-300/20 ml-8 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                      : msg.role === "system"
                      ? "bg-[#00ff88]/10 border-[#00ff88]/30"
                      : "bg-white/[0.035] border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] ${
                      msg.role === "user" ? "text-blue-400" : "text-[#00ff88]"
                    }`}>
                      {msg.role === "user" ? "YOU" : "LEAD ENGINEER"}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-base text-slate-200 leading-relaxed tracking-wide">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/[0.035] border border-white/10 p-4 max-w-[80%] backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-[#00ff88]">LEAD ENGINEER</span>
                    <span className="text-[10px] text-slate-600">{new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <span>Analyzing operational signal...</span>
                  </div>
                </div>
              </div>
            )}
            
            {showBlueprintCTA && (
              <div className="flex justify-center py-6">
                <div className="bg-cyan-300/10 border border-cyan-300/30 p-6 text-center shadow-[0_0_60px_rgba(34,211,238,0.12)]">
                  <p className="text-sm text-[#00ff88] mb-4">
                    DIAGNOSTIC COMPLETE. 6 FRICTION ZONES IDENTIFIED.
                  </p>
                  <button
                className="flex items-center gap-2 px-6 py-3 bg-cyan-300 hover:bg-blue-400 text-slate-950 font-semibold transition-colors"
                onClick={() => window.open("/consulting/blueprint", "_blank")}
              >
                <Zap className="w-4 h-4" />
                Generate Institutional Blueprint
              </button>
                  <p className="text-[10px] text-slate-500 mt-3">
                    Full analysis + actionable playbook delivered to your inbox
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800/70 p-4 bg-slate-950/70 backdrop-blur-2xl">
            <div className="flex gap-3">
              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`p-2 border border-slate-700 ${isVoiceMode ? "bg-[#00ff88]/20 text-[#00ff88]" : "text-slate-400 bg-transparent"} hover:border-slate-500 transition-colors`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isVoiceMode ? "Voice mode active (WebRTC placeholder)..." : "State your operational bottleneck..."}
                  disabled={isVoiceMode}
                  className="w-full bg-white/[0.035] border border-white/10 text-slate-100 text-base placeholder:text-slate-500 h-12 px-4 focus:border-cyan-300/60 focus:outline-none disabled:opacity-50"
                />
                {isVoiceMode && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="block h-2 w-2 bg-[#00ff88]" />
                  </div>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isVoiceMode}
                className="px-4 py-2 bg-cyan-300 hover:bg-blue-400 disabled:hover:bg-cyan-300 text-slate-950 font-semibold disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-slate-600">
                Step {Math.min(step + 1, 6)} of 6 • {step >= 6 ? "DIAGNOSTIC COMPLETE" : "FREE TIER"}
              </p>
              {isVoiceMode && (
                <p className="text-[10px] text-[#00ff88]">
                  Voice Mode: PAID TIER REQUIRED
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Synthesis Dashboard (40%) */}
        <div className="bg-slate-950/70 border-l border-slate-800/70 flex flex-col backdrop-blur-2xl">
          {/* Dashboard Header */}
          <div className="border-b border-slate-800/70 p-5">
            <div className="relative mx-auto mb-5 grid h-36 w-36 place-items-center border border-cyan-300/20 bg-cyan-300/[0.03] shadow-[0_0_34px_rgba(34,211,238,0.12)]">
              <div className="absolute inset-3 border border-white/10" />
              <div className="absolute inset-7 border border-cyan-300/20" />
              <div className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan-200/80" />
              <div className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan-200/40" />
              <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan-200/40" />
              <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan-200/80" />
              <div className="relative z-10 grid h-16 w-16 place-items-center border border-white/10 bg-slate-950">
                <Activity className="h-7 w-7 text-cyan-200" />
              </div>
            </div>
            <h2 className="text-xl text-slate-100 flex items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-cyan-300" />
              Consultant Core Online
            </h2>
            <p className="text-sm text-slate-500 mt-1 text-center">
              Live operational synthesis
            </p>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Revenue at Risk Counter */}
            <div className="bg-white/[0.035] border border-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#ff2244]" />
                  <span className="text-xs text-slate-400">Revenue at Risk</span>
                </div>
                <span className="text-[10px] text-slate-600">Annual projection</span>
              </div>
              <p className="text-4xl text-rose-400 tracking-tight">
                ${diagnosticData.revenueAtRisk.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff2244] transition-all duration-500"
                  style={{ width: `${Math.min(100, (diagnosticData.revenueAtRisk / 50000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Time Leaked Counter */}
            <div className="bg-white/[0.035] border border-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#ffcc00]" />
                  <span className="text-xs text-slate-400">Time Leaked</span>
                </div>
                <span className="text-[10px] text-slate-600">Hours/week</span>
              </div>
              <p className="text-4xl text-amber-300 tracking-tight">
                {diagnosticData.timeLeaked.toFixed(1)}h
              </p>
              <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ffcc00] transition-all duration-500"
                  style={{ width: `${Math.min(100, (diagnosticData.timeLeaked / 40) * 100)}%` }}
                />
              </div>
            </div>

            {/* Friction Radar Chart */}
            <div className="bg-white/[0.035] border border-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[#00ff88]" />
                <span className="text-xs text-slate-400">Friction Map</span>
              </div>
              <div className="h-48">
                {renderFrictionRadar()}
              </div>
            </div>

            {/* Bottlenecks List */}
            <div className="bg-white/[0.035] border border-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#00aaff]" />
                <span className="text-xs text-slate-400">Identified Bottlenecks</span>
              </div>
              <div className="space-y-2">
                {diagnosticData.bottlenecks.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">
                    Awaiting diagnostic data...
                  </p>
                ) : (
                  diagnosticData.bottlenecks.map((bottleneck, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-[#00ff88]" />
                      <span className="text-slate-300">{bottleneck}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Live Data Integration (Paid Tier) */}
            <div className="bg-white/[0.03] border border-dashed border-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">Live Data Integration</span>
                <span className="text-[10px] text-cyan-300 ml-auto">Paid Tier</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="flex items-center justify-center gap-1 px-3 py-2 border border-white/10 text-slate-500 text-[10px] disabled:opacity-50"
                  disabled
                >
                  <CreditCard className="w-3 h-3" />
                  Stripe
                </button>
                <button
                  className="flex items-center justify-center gap-1 px-3 py-2 border border-white/10 text-slate-500 text-[10px] disabled:opacity-50"
                  disabled
                >
                  <Mail className="w-3 h-3" />
                  Gmail
                </button>
                <button
                  className="flex items-center justify-center gap-1 px-3 py-2 border border-white/10 text-slate-500 text-[10px] disabled:opacity-50"
                  disabled
                >
                  <MessageSquare className="w-3 h-3" />
                  Slack
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-2">
                Connect live data sources for real-time telemetry analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Slide-over */}
      {showLearnMore && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLearnMore(false)}
          />
          <div className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full overflow-y-auto">
            <div className="sticky top-0 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-slate-200">
                Performance Consulting
              </h2>
              <button
                onClick={() => setShowLearnMore(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Who This Is For */}
              <section>
                <h3 className="text-2xl text-slate-200 mb-4">
                  Who This Is For
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00ff88] font-bold text-xl">✓</span>
                    <span className="text-slate-300 text-sm">
                      You are generating revenue but operational friction caps your ceiling.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00ff88] font-bold text-xl">✓</span>
                    <span className="text-slate-300 text-sm">
                      You need execution and complete implementation.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00ff88] font-bold text-xl">✓</span>
                    <span className="text-slate-300 text-sm">
                      You treat performance as an engineering problem with an engineering solution.
                    </span>
                  </li>
                </ul>
              </section>

              {/* Engagement Model */}
              <section>
                <h3 className="text-2xl text-slate-200 mb-4">
                  The Engagement Model
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#00ff88] pl-4 py-2 bg-slate-900/50">
                    <h4 className="text-xl text-slate-200 mb-1">
                      01 / Diagnose
                    </h4>
                    <p className="text-[#00aaff] text-xs mb-2">
                      Bottleneck Audit | Pro-Diagnose
                    </p>
                    <p className="text-slate-400 text-sm">
                      Business Performance Score across 5 dimensions. You see exactly where friction lives before committing to anything.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#00aaff] pl-4 py-2 bg-slate-900/50">
                    <h4 className="text-xl text-slate-200 mb-1">
                      02 / Optimize
                    </h4>
                    <p className="text-[#00aaff] text-xs mb-2">
                      90-Day Sprint | Pro-Optimize
                    </p>
                    <p className="text-slate-400 text-sm">
                      Bottlenecks mapped to playbooks. Systems built, documented, and installed. Weekly progress reports. No ambiguity.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#ffcc00] pl-4 py-2 bg-slate-900/50">
                    <h4 className="text-xl text-slate-200 mb-1">
                      03 / Scale
                    </h4>
                    <p className="text-[#00aaff] text-xs mb-2">
                      Growth Execution | Pro-Scale
                    </p>
                    <p className="text-slate-400 text-sm">
                      90-day growth plan with defined KPIs. Natural handoff into retained advisory as the business expands.
                    </p>
                  </div>
                </div>
              </section>

              {/* Deliverables */}
              <section>
                <h3 className="text-2xl text-slate-200 mb-4">
                  What Every Engagement Produces
                </h3>
                <ul className="space-y-2">
                  {[
                    "Business Performance Score report (Across 5 operational dimensions)",
                    "Custom optimization playbook (20-30 implemented improvements)",
                    "Automated weekly progress reports (No manual updates required)",
                    "Pro-Scale 90-day growth plan (Defined KPIs and execution roadmap)",
                    "Full system documentation (Your team runs it without us)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#00ff88] font-bold">•</span>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* CTA */}
              <div className="bg-slate-900 border border-slate-800 p-6 text-center">
                <h3 className="text-xl text-slate-200 mb-3">
                  Ready to Engineer Your Performance?
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Continue your diagnostic or escalate to a Principal Consultant.
                </p>
                <button
                  className="px-6 py-3 bg-[#00ff88] hover:bg-[#00dd77] text-slate-950  font-semibold transition-colors"
                  onClick={() => setShowLearnMore(false)}
                >
                  Return to Diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
