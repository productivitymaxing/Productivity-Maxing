"use client"

import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type PillarModulePageProps = {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  metrics: { label: string; value: string; hint: string }[]
  focusAreas: string[]
}

export default function PillarModulePage({
  eyebrow,
  title,
  description,
  icon: Icon,
  metrics,
  focusAreas,
}: PillarModulePageProps) {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50 sm:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
            <Icon size={26} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-cyan-300">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(metric => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{metric.hint}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-8 dark:border-slate-700 dark:bg-slate-900/30">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Institutional focus matrix</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {focusAreas.map((area, index) => (
            <li
              key={area}
              className={cn(
                "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200",
              )}
            >
              <span className="mr-2 text-xs font-semibold text-blue-600 dark:text-cyan-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              {area}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Module intelligence layers will activate as institutional data accumulates across the Business Operating System.
        </p>
      </section>
    </div>
  )
}
