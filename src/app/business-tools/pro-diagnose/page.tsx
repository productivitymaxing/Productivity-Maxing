import BusinessToolCard from '@/components/BusinessToolCard'
import BusinessToolsHeader from '@/components/BusinessToolsHeader'

export default function ProDiagnosePage() {
  return (
    <main className="pb-20">
      <BusinessToolsHeader
        eyebrow="Pro-Diagnose"
        title="Advanced auditing for operational bottlenecks and precise performance scoring."
        description="Pro-Diagnose is the active diagnostic layer of the proprietary performance suite."
        backHref="/business-tools"
      />

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">Available tools</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Start with AuditMax to run the current diagnostic engine.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BusinessToolCard
              title="AuditMax"
              description="Run the operational audit engine and identify the hidden cost of broken workflows."
              href="/business-tools/pro-diagnose/auditmax"
              active
              eyebrow="Live tool"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
