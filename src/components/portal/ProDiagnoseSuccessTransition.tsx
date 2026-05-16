"use client"

import { CheckCircle2, Loader2 } from "lucide-react"

type ProDiagnoseSuccessTransitionProps = {
  visible: boolean
  message?: string
}

export default function ProDiagnoseSuccessTransition({
  visible,
  message = "Baseline locked. Opening Central Command...",
}: ProDiagnoseSuccessTransitionProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md">
      <SuccessCard message={message} />
    </div>
  )
}

function SuccessCard({ message }: { message: string }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/95 p-10 text-center shadow-2xl ring-1 ring-white/10">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-semibold text-white">Pro-Diagnose Complete</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{message}</p>
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
        Routing to dashboard
      </div>
    </div>
  )
}
