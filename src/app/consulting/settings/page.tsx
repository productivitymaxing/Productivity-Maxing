"use client"

import Link from "next/link"
import { ArrowLeft, Settings, User } from "lucide-react"

export default function ConsultingSettingsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/consulting" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-300">
          <ArrowLeft size={16} /> Back to Business Intelligence Max
        </Link>
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-cyan-300">Settings</p>
          <h1 className="text-4xl font-semibold tracking-tight">Business Context Profile</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Profile architecture for persistent context, business memory and future protected account routes.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SettingsCard title="Account" icon={<User />} fields={["Name", "Email", "Company name", "Industry", "Team size"]} />
          <SettingsCard title="Business Memory" icon={<Settings />} fields={["Revenue range", "Primary bottlenecks", "Goals", "Tools used", "Operational maturity score"]} />
        </div>
      </section>
    </main>
  )
}

function SettingsCard({ title, icon, fields }: { title: string; icon: React.ReactNode; fields: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold"><span className="text-blue-600 dark:text-cyan-300">{icon}</span>{title}</h2>
      <div className="space-y-3">
        {fields.map(field => (
          <label key={field} className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">{field}</span>
            <input className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-300" />
          </label>
        ))}
      </div>
    </div>
  )
}
