'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, CheckCircle, TrendingDown, Clock, DollarSign, Zap, AlertTriangle, Activity, Cpu, Download
} from 'lucide-react'

export default function MaxAuditEngine() {
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'forensics' | 'revenue'>('overview')

  const integrations = [
    { id: 'stripe', name: 'Stripe', icon: '💳', status: 'connected' },
    { id: 'gmail', name: 'Gmail', icon: '📧', status: 'connected' },
    { id: 'notion', name: 'Notion', icon: '📝', status: 'pending' },
    { id: 'slack', name: 'Slack', icon: '💬', status: 'not-connected' },
  ]

  // Mock audit results data
  const auditResults = {
    frictionScore: 67,
    healthScore: 52,
    revenueBleed: 24500,
    analysisPeriod: 'Last 30 days',
    deadZones: [
      {
        id: 1,
        name: 'Manual Invoice Data Entry',
        system: 'Stripe → Google Sheets',
        hoursPerWeek: 12,
        costPerWeek: 720,
        costPerYear: 37440,
      },
      {
        id: 2,
        name: 'Customer Status Updates',
        system: 'Email → Notion Database',
        hoursPerWeek: 8,
        costPerWeek: 480,
        costPerYear: 24960,
      },
      {
        id: 3,
        name: 'Lead Follow-up Delays',
        system: 'Gmail Inbox Gap',
        hoursPerWeek: 5,
        costPerWeek: 300,
        costPerYear: 15600,
      },
    ],
    revenueRisks: [
      {
        id: 1,
        risk: 'Lead Follow-up Delays',
        impact: '$4,200',
        period: '/month',
        description: 'Leads not followed within 5 minutes experience 60% lower conversion',
        affectedLeads: 12,
      },
      {
        id: 2,
        risk: 'Invoice Processing Delays',
        impact: '$3,800',
        period: '/month',
        description: 'Delayed invoicing increases DSO by 3-5 days',
        affectedTransactions: 34,
      },
      {
        id: 3,
        risk: 'Missing Customer Context',
        impact: '$2,100',
        period: '/month',
        description: 'Support team lacks real-time customer data',
        affectedTickets: 28,
      },
    ],
  }

  const features = [
    {
      icon: <TrendingDown className="text-cyan-400" size={24} />,
      title: 'Friction Coefficient',
      description: 'A single composite score (0-100%) quantifying the exact % of business capacity lost to workflow friction.',
    },
    {
      icon: <Clock className="text-cyan-400" size={24} />,
      title: 'Time-Leak Forensics',
      description: 'Identifies "Dead Zones"—hidden hours spent on manual data transfer and repetitive admin tasks.',
    },
    {
      icon: <DollarSign className="text-cyan-400" size={24} />,
      title: 'Revenue-at-Risk',
      description: 'Quantifies the exact dollar cost of missed follow-ups, delays, and conversion leakage.',
    },
    {
      icon: <Zap className="text-cyan-400" size={24} />,
      title: 'Automation Blueprint',
      description: 'Receive a Make.com-compatible JSON blueprint with ROI for each automation.',
    },
  ]

  const tiers = [
    {
      name: 'Teaser Audit',
      price: 'Free',
      description: 'Start your diagnostic',
      features: [
        '1 integration analysis',
        '1-3 Dead Zone examples',
        'Partial Friction Report',
        'Email capture only',
      ],
      cta: 'Start Free Audit',
      highlighted: false,
    },
    {
      name: 'Full Diagnostic',
      price: '$499',
      description: 'Complete operational audit',
      features: [
        'All integrations analyzed',
        'Complete Friction Report',
        'Full Revenue-at-Risk analysis',
        'Make.com Blueprint (JSON)',
        'PDF export',
      ],
      cta: 'Run Full Diagnostic',
      highlighted: true,
    },
    {
      name: 'Continuous Monitor',
      price: '$99',
      description: 'Ongoing monitoring',
      period: '/month',
      features: [
        'Everything in Full Diagnostic',
        'Daily drift monitoring',
        'Weekly health digest',
        'Re-audit on demand',
        'System health alerts',
      ],
      cta: 'Start Monitoring',
      highlighted: false,
    },
  ]

  // Friction score bar component
  const FrictionBar = ({ score }: { score: number }) => {
    const getColor = (s: number) => {
      if (s < 30) return 'from-red-600 to-orange-500'
      if (s < 60) return 'from-yellow-600 to-orange-500'
      if (s < 80) return 'from-blue-600 to-cyan-500'
      return 'from-cyan-600 to-cyan-500'
    }
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Friction Coefficient</span>
          <span className="text-2xl font-bold text-cyan-400">{score}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full bg-gradient-to-r ${getColor(score)} transition-all duration-300`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Column */}
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs sm:text-sm text-cyan-400">
                <Zap size={14} />
                ProDiagnose
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Forensics for Your Business Infrastructure
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-400">
                Connect your tech stack. Get forensic clarity on operational friction. Receive a ready-to-build automation blueprint to recover lost capacity.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowResults(!showResults)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-5 sm:px-6 py-3 text-sm sm:text-base font-medium text-black shadow-lg shadow-cyan-600/20 transition"
                >
                  <Zap size={16} />
                  {showResults ? 'View Setup' : 'See Example Results'}
                </button>
                <Link
                  href="/consulting"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-600 hover:border-cyan-500 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-slate-300 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Column - Key Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur p-5 sm:p-6">
                <p className="text-sm font-mono text-slate-400 mb-2">METRIC</p>
                <p className="text-xl sm:text-2xl font-bold text-cyan-400">Friction Score</p>
                <p className="mt-3 text-xs text-slate-500">Operational capacity lost</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur p-5 sm:p-6">
                <p className="text-sm font-mono text-slate-400 mb-2">METRIC</p>
                <p className="text-xl sm:text-2xl font-bold text-cyan-400">Dead Zones</p>
                <p className="mt-3 text-xs text-slate-500">Hours of manual work</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur p-5 sm:p-6">
                <p className="text-sm font-mono text-slate-400 mb-2">METRIC</p>
                <p className="text-xl sm:text-2xl font-bold text-cyan-400">Revenue Risk</p>
                <p className="mt-3 text-xs text-slate-500">Cost of inefficiencies</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur p-5 sm:p-6">
                <p className="text-sm font-mono text-slate-400 mb-2">METRIC</p>
                <p className="text-xl sm:text-2xl font-bold text-cyan-400">Blueprint</p>
                <p className="mt-3 text-xs text-slate-500">Automation roadmap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard / Results Section */}
      {showResults && (
        <section className="px-4 py-16 bg-slate-950 border-y border-slate-800">
          <div className="mx-auto max-w-7xl">
            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">Audit Dashboard</h3>
                  <p className="text-sm text-slate-400">{auditResults.analysisPeriod}</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500 transition">
                  <Download size={16} />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Hero Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {/* Friction Score */}
              <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Friction Score</p>
                    <p className="text-3xl font-bold text-cyan-400">{auditResults.frictionScore}%</p>
                  </div>
                  <TrendingDown className="text-red-500" size={20} />
                </div>
                <p className="text-xs text-slate-500">High operational friction</p>
              </div>

              {/* Health Score */}
              <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Health Score</p>
                    <p className="text-3xl font-bold text-yellow-500">{auditResults.healthScore}%</p>
                  </div>
                  <Activity className="text-yellow-500" size={20} />
                </div>
                <p className="text-xs text-slate-500">System health status</p>
              </div>

              {/* Revenue Bleed */}
              <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Monthly Bleed</p>
                    <p className="text-3xl font-bold text-red-400">${(auditResults.revenueBleed / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <p className="text-xs text-slate-500">Revenue-at-risk per month</p>
              </div>

              {/* Integration Status */}
              <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Integrations</p>
                    <p className="text-3xl font-bold text-cyan-400">4 of 4</p>
                  </div>
                  <Cpu className="text-cyan-400" size={20} />
                </div>
                <p className="text-xs text-slate-500">Systems connected</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-slate-700 flex gap-8">
              {['overview', 'forensics', 'revenue'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-3 px-1 font-medium text-sm transition border-b-2 ${
                    activeTab === tab
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'forensics' && 'Time-Leak Forensics'}
                  {tab === 'revenue' && 'Revenue-at-Risk'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <FrictionBar score={auditResults.frictionScore} />
                <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="text-cyan-400" size={18} />
                    Next Steps
                  </h4>
                  <ol className="space-y-3 text-sm text-slate-300">
                    <li className="flex gap-3">
                      <span className="font-bold text-cyan-400 flex-shrink-0">1</span>
                      <span>Review the Time-Leak Forensics to identify your top 3 Dead Zones</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-cyan-400 flex-shrink-0">2</span>
                      <span>Analyze Revenue-at-Risk to understand impact on bottom line</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-cyan-400 flex-shrink-0">3</span>
                      <span>Schedule a consultation to discuss your custom Automation Blueprint</span>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'forensics' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400 mb-4">
                  &quot;Dead Zones&quot; are the hidden hours your team spends on manual work and repetitive admin tasks.
                </p>
                {auditResults.deadZones.map((zone) => (
                  <div key={zone.id} className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="font-bold text-white mb-2">{zone.name}</p>
                        <p className="text-sm text-slate-400 mb-4">{zone.system}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-slate-500">Hours per week</p>
                            <p className="text-lg font-bold text-cyan-400">{zone.hoursPerWeek} hrs</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500">Weekly cost</p>
                            <p className="text-xl font-bold text-red-400">${zone.costPerWeek.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Annualized</p>
                            <p className="text-lg font-bold text-red-500">${zone.costPerYear.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400 mb-4">
                  Specific revenue risks identified in your operations that impact conversion and cash flow.
                </p>
                {auditResults.revenueRisks.map((risk) => (
                  <div key={risk.id} className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-white">{risk.risk}</h4>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-400">{risk.impact}</p>
                        <p className="text-xs text-slate-500">{risk.period}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{risk.description}</p>
                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-slate-500">Affected records</p>
                        <p className="font-bold text-cyan-400">
                          {risk.affectedLeads || risk.affectedTransactions || risk.affectedTickets}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">How ProDiagnose Works</h3>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Connect your integrations, get a complete diagnostic, receive a blueprint to fix it.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur p-6">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Hub */}
      <section className="px-4 py-16 bg-slate-950/50 border-y border-slate-800">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">Connect Your Tech Stack</h3>
          <p className="text-center text-slate-400 mb-12">
            Currently supporting Stripe, Gmail, Notion, and Slack. More integrations in active development.
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {integrations.map((integration) => (
              <button
                key={integration.id}
                className={`rounded-lg p-4 text-center transition border ${
                  integration.status === 'connected'
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : integration.status === 'pending'
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/30'
                }`}
              >
                <span className="text-3xl mb-2 block">{integration.icon}</span>
                <p className="font-medium text-sm text-white">{integration.name}</p>
                <p className={`text-xs mt-2 ${
                  integration.status === 'connected' ? 'text-cyan-400' : integration.status === 'pending' ? 'text-yellow-400' : 'text-slate-500'
                }`}>
                  {integration.status === 'connected' ? '✓ Connected' : integration.status === 'pending' ? 'Pending' : 'Connect'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">Who Should Use ProDiagnose</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Founders & CEOs',
                desc: 'Scale without hiring by recovering lost operational capacity.',
                icon: '🚀',
              },
              {
                title: 'Operations Leaders',
                desc: 'Get objective data to justify automation investments to leadership.',
                icon: '📊',
              },
              {
                title: 'Finance Executives',
                desc: 'Identify where team output is misaligned with headcount and payroll.',
                icon: '💰',
              },
              {
                title: 'Consultants',
                desc: 'Use audit reports as a closing tool with hard data and clear ROI.',
                icon: '🎯',
              },
              {
                title: 'Service Providers',
                desc: 'Quantify the revenue impact of workflow inefficiencies.',
                icon: '⚙️',
              },
              {
                title: 'IT/Systems Teams',
                desc: 'Monitor automation health and detect system drift in real-time.',
                icon: '🛠️',
              },
            ].map((useCase, idx) => (
              <div key={idx} className="rounded-lg border border-slate-700 bg-slate-900/50 p-6">
                <span className="text-4xl block mb-3">{useCase.icon}</span>
                <h4 className="font-semibold text-white mb-2">{useCase.title}</h4>
                <p className="text-sm text-slate-400">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="audit-tiers" className="px-4 py-16 bg-slate-950/50 border-y border-slate-800">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">Audit Tiers</h3>
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Choose the level of diagnostic insight you need.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-6 sm:p-8 transition border ${
                  tier.highlighted
                    ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-slate-900'
                    : 'border-slate-700 bg-slate-900/50'
                }`}
              >
                {tier.highlighted && (
                  <span className="inline-block mb-4 bg-cyan-600 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h4 className="text-xl sm:text-2xl font-bold text-white">{tier.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-cyan-400">{tier.price}</span>
                  {tier.period && <span className="text-slate-400">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm text-slate-400">{tier.description}</p>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full rounded-lg px-6 py-3 font-medium transition text-sm sm:text-base ${
                    tier.highlighted
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-black'
                      : 'border border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Proof */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">The ProDiagnose Impact</h3>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900 p-6">
              <p className="text-4xl font-bold text-cyan-400 mb-2">4x</p>
              <p className="font-semibold text-white mb-2">Average Output Increase</p>
              <p className="text-sm text-slate-400">Post-engagement improvement in team capacity</p>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/10 to-slate-900 p-6">
              <p className="text-4xl font-bold text-green-400 mb-2">90%</p>
              <p className="font-semibold text-white mb-2">Client Retention</p>
              <p className="text-sm text-slate-400">Extend into retained advisory services</p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-slate-900 p-6">
              <p className="text-4xl font-bold text-purple-400 mb-2">14 days</p>
              <p className="font-semibold text-white mb-2">To First Improvement</p>
              <p className="text-sm text-slate-400">Measurable performance gains in two weeks</p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-slate-900 p-6">
              <p className="text-4xl font-bold text-orange-400 mb-2">3x</p>
              <p className="font-semibold text-white mb-2">Revenue Efficiency</p>
              <p className="text-sm text-slate-400">Operations efficiency gains across the board</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-cyan-600 to-cyan-700">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-4">
            See Your Friction Coefficient
          </h3>
          <p className="text-cyan-900 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Run a free teaser audit with just one integration to see how much operational capacity you could recover.
          </p>
          <Link
            href="#audit-tiers"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black hover:bg-slate-900 px-6 sm:px-8 py-3 font-medium text-cyan-400 transition"
          >
            Start Free Audit
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
