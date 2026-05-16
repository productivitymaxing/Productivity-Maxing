"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  Gauge,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"
import {
  formatCurrency,
  getRevenueSnapshot,
  getScaleReadiness,
  getTargetRevenue,
} from "@/lib/auditInsights"
import { cn } from "@/lib/utils"

const pillarCards = [
  { href: "/consulting/pro-diagnose", title: "Pro-Diagnose", description: "Audit baseline & intake intelligence" },
  { href: "/consulting/pro-scale", title: "Pro-Scale", description: "Pipeline velocity & revenue expansion" },
  { href: "/consulting/pro-operations", title: "Pro-Operations", description: "Systems health & workflow advisory" },
  { href: "/consulting/pro-optimize", title: "Pro-Optimize", description: "Defensibility & future-proof matrix" },
]

export default function CentralCommandDashboard() {
  const { user, audit, isLoading } = useBusinessConsole()

  if (isLoading) {
    return <LoadingState />
  }

  const score = audit?.score ?? 0
  const revenue = getRevenueSnapshot(audit)
  const target = getTargetRevenue(revenue, score)
  const readiness = getScaleReadiness(score)
  const progress =
    revenue.midpoint > 0
      ? Math.min(100, Math.round((revenue.midpoint / target.high) * 100))
      : Math.round(score * 0.85)

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/60 p-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-blue-950/30 sm:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-600/10 blur-3xl dark:bg-cyan-400/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-cyan-300">
              Central Command
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Executive Operating Posture
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {audit?.summary ??
                "Complete your Pro-Diagnose intake to unlock institutional revenue modeling and scale trajectory mapping."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <StatusChip label={readiness.label} tone={readiness.tone} />
              <StatusChip label={`${user?.subscription_tier ?? "Free"} tier`} tone="sky" />
              <StatusChip label={`${user?.credits_balance ?? 0} credits`} tone="slate" />
            </div>
          </div>
          <HeroMetrics score={score} progress={progress} revenue={revenue} target={target} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current revenue band" value={revenue.label} hint="From Pro-Diagnose foundation intake" icon={<TrendingUp size={20} />} />
        <MetricCard label="Target growth band" value={target.label} hint={`${target.upliftPct}% uplift modeled from operating score`} icon={<Target size={20} />} />
        <MetricCard label="Operational score" value={audit ? String(score) : "—"} hint="Institutional audit baseline" icon={<Gauge size={20} />} />
        <MetricCard label="Scale trajectory" value={target.upliftPct > 0 ? `+${target.upliftPct}%` : "Pending"} hint="Modeled path to next revenue tier" icon={<Zap size={20} />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TrajectoryPanel
          title="Where you are"
          subtitle="Current operating reality"
          items={[
            { label: "Revenue midpoint", value: revenue.midpoint > 0 ? formatCurrency(revenue.midpoint) : "Not captured" },
            { label: "Operating score", value: audit ? `${score}/100` : "Awaiting audit" },
            { label: "Primary constraint", value: audit?.constraints[0] ?? "Run Pro-Diagnose to map constraints" },
          ]}
        />
        <TrajectoryPanel
          title="Where you could be"
          subtitle="90-day institutional target"
          accent
          items={[
            { label: "Target band", value: target.label },
            { label: "Priority move", value: audit?.recommendations[0] ?? "Complete intake to unlock recommendations" },
            { label: "Week-one action", value: audit?.roadmap[0] ?? "Deploy Pro-Diagnose audit cadence" },
          ]}
        />
      </section>

      {audit && (
        <section className="grid gap-6 lg:grid-cols-2">
          <InsightPanel title="Priority bottlenecks" items={audit.bottlenecks} />
          <InsightPanel title="Growth constraints" items={audit.constraints} />
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pillarCards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-600/5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-cyan-400/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{card.title}</p>
              <ArrowUpRight size={16} className="text-slate-400 transition group-hover:text-blue-600 dark:group-hover:text-cyan-300" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}

function HeroMetrics({
  score,
  progress,
  revenue,
  target,
}: {
  score: number
  progress: number
  revenue: ReturnType<typeof getRevenueSnapshot>
  target: ReturnType<typeof getTargetRevenue>
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Operating score</p>
          <p className="mt-1 text-5xl font-semibold text-blue-600 dark:text-cyan-300">{score || "—"}</p>
        </div>
        <Sparkles className="text-blue-600/40 dark:text-cyan-300/40" size={28} />
      </div>
      <div className="mt-6">
        <ProgressBar progress={progress} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <Stat label="Current" value={revenue.label} />
        <Stat label="Target" value={target.label} />
      </div>
    </div>
  )
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <>
      <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
        <span>Trajectory to target band</span>
        <span>{progress}%</span>
      </div>
      <ProgressTrack progress={progress} />
    </>
  )
}

function ProgressTrack({ progress }: { progress: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/70">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}

function MetricCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4 text-blue-600 dark:text-cyan-300">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  )
}

function TrajectoryPanel({
  title,
  subtitle,
  items,
  accent,
}: {
  title: string
  subtitle: string
  items: { label: string; value: string }[]
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        accent
          ? "border-blue-600/20 bg-blue-600/5 dark:border-cyan-400/20 dark:bg-cyan-400/5"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{subtitle}</p>
      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <dl className="mt-6 space-y-4">
        {items.map(item => (
          <div key={item.label} className="border-t border-slate-200/80 pt-4 first:border-0 first:pt-0 dark:border-slate-800">
            <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function InsightPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map(item => (
          <li key={item} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-cyan-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatusChip({ label, tone }: { label: string; tone: "emerald" | "sky" | "amber" | "rose" | "slate" }) {
  const tones = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    sky: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-cyan-200",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    slate: "border-slate-300/50 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  }
  return <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>{label}</span>
}

function LoadingState() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Synchronizing institutional operating intelligence...
      </p>
    </div>
  )
}
