import ProDiagnoseLauncher from '@/components/ProDiagnoseLauncher'

export default function BusinessTools() {
  return (
    <main>
      {/* Hero */}
      <section className="px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Business Tools Suite</h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
            A comprehensive platform of diagnostic and optimization tools built to eliminate operational friction and drive measurable business performance.
          </p>
        </div>
      </section>

      {/* ProDiagnose Section */}
      <section className="px-4 py-8 sm:py-12 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Operational Diagnostics</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
              Deep forensic analysis of your business infrastructure to identify hidden operational friction and revenue leakage.
            </p>
          </div>
          <ProDiagnoseLauncher />
        </div>
      </section>

      {/* Additional Context */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">The Platform Architecture</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-sm sm:text-base">
            Our business tools are built on a foundation of five interconnected performance layers designed to work together as a unified system.
          </p>
          
          <div className="grid gap-5 sm:gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-blue-600 flex-shrink-0">1</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">Diagnostic Layer (MaxAudit)</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Forensic visibility into operational friction. Quantify the hidden cost of broken workflows with the Friction Coefficient, Dead Zone analysis, and Revenue-at-Risk assessment.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-blue-600 flex-shrink-0">2</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">Core Infrastructure</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    The foundational layer where business data and digital assets are organized for accessibility, security, and scalability.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-blue-600 flex-shrink-0">3</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">Automation Engines</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    The connective tissue of the business. We build workflows that move information between systems and execute repetitive tasks without manual intervention.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-blue-600 flex-shrink-0">4</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">Cognitive Intelligence</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Deployment of advanced generative and agentic AI models to handle complex decision-making, content generation, and strategic automation.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-blue-600 flex-shrink-0">5</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">Revenue Governance</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    The oversight layer ensuring every operational dollar spent contributes to measurable growth and sustainable profitability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Together */}
      <section className="px-4 py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">How The Tools Work Together</h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 dark:bg-slate-800">
              <p className="font-semibold text-blue-600 text-sm mb-2">STEP 1: DIAGNOSE</p>
              <h3 className="font-bold text-lg mb-2">Run MaxAudit Engine</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Connect your tech stack and get a complete forensic audit. Understand your Friction Coefficient, identify Dead Zones, quantify revenue risk.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 dark:bg-slate-800">
              <p className="font-semibold text-blue-600 text-sm mb-2">STEP 2: PRESCRIBE</p>
              <h3 className="font-bold text-lg mb-2">Generate Automation Blueprint</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Receive a ready-to-build blueprint with Make.com-compatible schemas. Know exactly which automations will recover the most capacity.
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 dark:bg-slate-800">
              <p className="font-semibold text-blue-600 text-sm mb-2">STEP 3: BUILD & MONITOR</p>
              <h3 className="font-bold text-lg mb-2">Deploy Automations & Track Health</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Deploy automations using your infrastructure layer. Monitor ongoing health with drift alerts, performance tracking, and continuous optimization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
