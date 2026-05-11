import { Clock } from 'lucide-react'
import BusinessToolsHeader from '@/components/BusinessToolsHeader'

export default function ProOptimizePage() {
  return (
    <main className="pb-20">
      <BusinessToolsHeader
        eyebrow="Pro-Optimize"
        title="The refinement layer for workflows and process improvement."
        description="Pro-Optimize will support workflow refinement and process improvement, including the Pro-Create content operations engine. It is not yet available as a live tool."
        backHref="/business-tools"
      />

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-slate-50/80 p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <Clock size={15} />
            Coming Soon
          </div>
        </div>
      </section>
    </main>
  )
}
