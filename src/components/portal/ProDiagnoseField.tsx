"use client"

import type { FieldError } from "react-hook-form"
import { cn } from "@/lib/utils"

type ProDiagnoseFieldProps = {
  label: string
  hint?: string
  error?: FieldError
  children: React.ReactNode
}

export function ProDiagnoseField({ label, hint, error, children }: ProDiagnoseFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600 dark:text-red-400">{error.message}</span>}
    </label>
  )
}

export const fieldClassName = cn(
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition",
  "focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20",
  "dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-300 dark:focus:ring-cyan-300/20",
)
