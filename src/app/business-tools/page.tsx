import BusinessToolCard from '@/components/BusinessToolCard'
import BusinessToolsHeader from '@/components/BusinessToolsHeader'

export default function BusinessTools() {
  return (
    <main className="pb-20">
      <BusinessToolsHeader
        eyebrow="Business Tools Suite"
        title="Infrastructure built to turn complex operations into high-output systems."
        description="We combine proprietary performance tools with a modern technical stack to eliminate friction and drive growth."
      />

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2">
            <BusinessToolCard
              title="Pro-Diagnose"
              description="Advanced auditing to identify operational bottlenecks and provide precise performance scoring."
              href="/business-tools/pro-diagnose"
              active
              eyebrow="Active"
            />
            <BusinessToolCard
              title="Pro-Optimize"
              description="The refinement layer for workflows and process improvement including our Pro-Create content operations engine."
              href="/business-tools/pro-optimize"
            />
            <BusinessToolCard
              title="Pro-Scale"
              description="Systematic growth strategies and execution planning focused on high impact results."
              href="/business-tools/pro-scale"
            />
            <BusinessToolCard
              title="Pro-Operations"
              description="The central engine for governance and consistent service delivery across the entire enterprise."
              href="/business-tools/pro-operations"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">The Technical Stack</p>
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Five core layers built for speed and intelligence.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Our infrastructure ensures data moves with speed and intelligence across the business.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[
              ['Core Infrastructure', 'The foundational layer where business data and digital assets are organized for accessibility and security.'],
              ['Automation Engines', 'The connective tissue of the business. Workflows move information between systems and execute repetitive tasks without manual intervention.'],
              ['Cognitive AI Layers', 'Advanced generative and agentic AI models handle complex decision making and content generation.'],
              ['Demand Capture', 'Precision systems designed to identify, track and convert high value market opportunities into predictable revenue.'],
              ['Revenue Governance', 'A rigorous oversight layer that ensures every operational dollar spent contributes to measurable growth and profitability.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
