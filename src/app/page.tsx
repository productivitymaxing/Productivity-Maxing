'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, Bot, MessageSquareText, Sparkles, Zap } from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <main className="pb-20">
      <section className="px-4 pt-16 sm:pt-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-100 p-6 shadow-sm sm:p-12 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs sm:text-sm text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles size={14} />
              Built for high-performance teams
            </span>
            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              We Engineer Elite Business Performance
            </h1>
            <p className="mt-5 text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Premium Business tools. High performance frameworks. Workflows that scale output.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3">
              <Link href="/business-tools" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 sm:px-6 py-3 text-sm sm:text-base font-medium text-white shadow-sm transition hover:bg-blue-700 whitespace-nowrap">
                <Zap size={16} />
                Explore Tools
              </Link>
              <Link href="/consulting" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap">
                Book A Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Product Highlight</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">Create Max: Precision-Built Content Marketing Engine</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <MessageSquareText className="text-blue-600" size={20} />
              <h3 className="mt-4 text-xl font-semibold">Superior Workflow</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Built to execute content operations without drag.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <Bot className="text-blue-600" size={20} />
              <h3 className="mt-4 text-xl font-semibold">Brand Voice Synthesis</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Keep messaging consistent as output volume grows.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <BarChart3 className="text-blue-600" size={20} />
              <h3 className="mt-4 text-xl font-semibold">Predictive Performance Tracker</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Track what works and improve performance ahead of lag.</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/business-tools" className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition">
              Try for free
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Reviews</h2>
          <blockquote className="mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-200">
            &ldquo;Within 90 days of using CreateMax, our engagement has 10xed and generated leads for our business.&rdquo;
          </blockquote>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">- Anima A. - CEO, B2C Retail</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/70">
              <p className="text-3xl font-semibold text-blue-600">4x</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Average output increase post-engagement</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/70">
              <p className="text-3xl font-semibold text-blue-600">90%</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Of clients extend into retained advisory</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/70">
              <p className="text-3xl font-semibold text-blue-600">14d</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">To first measurable performance improvement</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/70">
              <p className="text-3xl font-semibold text-blue-600">3x</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Revenue operations efficiency gain</p>
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="px-4 pt-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg sm:p-8 lg:p-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">New Tools, delivered</h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100">No spam, unsubscribe anytime.</p>
          <form onSubmit={handleSubscribe} className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full flex-1 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button type="submit" className="rounded-xl bg-slate-900 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white transition hover:bg-black whitespace-nowrap">
              Subscribe
            </button>
          </form>
          {submitted && <p className="mt-4 text-blue-100">Thanks for subscribing!</p>}
        </div>
      </section>
    </main>
  )
}
