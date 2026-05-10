export default function Consulting() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Business Performance Consulting</h1>
          <p className="text-xl text-gray-300">Diagnostic-Led Engagements Built on Our Pro-Stack Framework</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Who This Is For</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 font-bold text-xl">✓</span>
              <span className="text-lg">You are generating revenue but operational friction caps your ceiling.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 font-bold text-xl">✓</span>
              <span className="text-lg">You need execution and complete implementation.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 font-bold text-xl">✓</span>
              <span className="text-lg">You treat performance as an engineering problem with an engineering solution.</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">The Engagement Model</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h3 className="text-2xl font-bold mb-2">01 / Diagnose</h3>
              <p className="text-gray-700 font-semibold mb-2">Bottleneck Audit | Pro-Diagnose</p>
              <p className="text-gray-600">Business Performance Score across 4 dimensions. You see exactly where friction lives before committing to anything.</p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h3 className="text-2xl font-bold mb-2">02 / Optimize</h3>
              <p className="text-gray-700 font-semibold mb-2">90-Day Sprint | Pro-Optimize</p>
              <p className="text-gray-600">Bottlenecks mapped to playbooks. Systems built, documented, and installed. Weekly progress reports. No ambiguity.</p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h3 className="text-2xl font-bold mb-2">03 / Scale</h3>
              <p className="text-gray-700 font-semibold mb-2">Growth Execution | Pro-Scale</p>
              <p className="text-gray-600">90-day growth plan with defined KPIs. Natural handoff into retained advisory as the business expands.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">What Every Engagement Produces</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-700">Business Performance Score report (Across 5 operational dimensions)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-700">Custom optimization playbook (20-30 implemented improvements)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-700">Automated weekly progress reports (No manual updates required)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-700">Pro-Scale 90-day growth plan (Defined KPIs and execution roadmap)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 font-bold">•</span>
              <span className="text-gray-700">Full system documentation (Your team runs it without us)</span>
            </li>
          </ul>
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Engineer Your Performance?</h3>
          <p className="text-gray-700 mb-6">Contact us to schedule your diagnostic engagement.</p>
          <a href="mailto:legal@productivitymaxing.com" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-block transition">
            Get in Touch
          </a>
        </section>
      </div>
    </main>
  )
}
