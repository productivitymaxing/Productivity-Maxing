"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Crosshair,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Workflow,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { consoleNavItems } from "@/lib/consoleRoutes"

const iconMap = {
  dashboard: LayoutDashboard,
  "pro-diagnose": Crosshair,
  "pro-scale": TrendingUp,
  "pro-operations": Workflow,
  "pro-optimize": Shield,
} as const

export default function ConsoleSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 lg:w-72">
      <div className="border-b border-slate-200/80 px-5 py-6 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <BrandIcon />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-cyan-300">
              BI Max
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Operating System
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {consoleNavItems.map(item => {
          const Icon = iconMap[item.segment]
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col gap-1 rounded-2xl border px-4 py-3.5 transition",
                active
                  ? "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-800 dark:hover:bg-slate-900/60",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={cn(
                    active
                      ? "text-blue-600 dark:text-cyan-300"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200",
                  )}
                />
                <span className="text-sm font-semibold tracking-tight">{item.label}</span>
              </span>
              <span className="pl-8 text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/80 px-5 py-5 dark:border-slate-800/80">
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Elite Business Performance console. Institutional memory synced to Cloudflare D1.
        </p>
      </div>
    </aside>
  )
}

function BrandIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/25 dark:from-cyan-400 dark:to-blue-600 dark:shadow-cyan-500/20">
      <Activity size={20} />
    </div>
  )
}
