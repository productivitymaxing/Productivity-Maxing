"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react"
import { businessIntelligenceApi } from "@/lib/businessIntelligenceApi"

type Tier = "Free" | "Pro" | "Max"
type StoredState = { tier?: Tier; credits?: number }

const plans: { name: Tier; credits: number; description: string }[] = [
  { name: "Free", credits: 15, description: "Free audit and limited generations." },
  { name: "Pro", credits: 250, description: "Dashboards, trackers, saved context, exports." },
  { name: "Max", credits: 1000, description: "Priority generation, simulations and team-ready capacity." },
]

export default function ConsultingBillingPage() {
  const [state, setState] = useState<StoredState>({ tier: "Free", credits: 15 })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const session = await businessIntelligenceApi.session()
        setState({ tier: session.user.subscription_tier, credits: session.user.credits_balance })
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Unable to load billing profile.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBilling()
  }, [])

  return (
    <main className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/consulting" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Business Intelligence Max
        </Link>
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Billing & Credits</p>
          <h1 className="text-4xl font-semibold tracking-tight">Subscription Control Center</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Stripe-ready architecture for subscription sync, credit purchases, usage tracking and failed-generation rollback.</p>
        </div>
        {isLoading && <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700 dark:border-cyan-900/50 dark:bg-cyan-950/20 dark:text-cyan-300">Loading institutional billing profile from Cloudflare...</div>}
        {errorMessage && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{errorMessage}</div>}
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl border p-6 ${state.tier === plan.name ? "border-blue-600 bg-blue-50 dark:border-cyan-300 dark:bg-cyan-300/10" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60"}`}>
              <ShieldCheck className="mb-4 text-blue-600 dark:text-cyan-300" />
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{plan.description}</p>
              <p className="mt-6 text-4xl font-semibold">{plan.credits}</p>
              <p className="text-sm text-slate-500">monthly credits</p>
              <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white dark:bg-cyan-300 dark:text-slate-950">{state.tier === plan.name ? "Current Plan" : "Select Plan"}</button>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold"><CreditCard className="text-blue-600 dark:text-cyan-300" /> Credit Balance</h2>
          <p className="text-4xl font-semibold">{state.credits ?? 15}</p>
          <p className="mt-2 text-slate-500">Purchase credits and transaction history can be wired to Stripe webhooks in the backend phase.</p>
        </div>
      </section>
    </main>
  )
}
