'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { shouldHideSiteChrome } from '@/lib/consoleRoutes'
import Image from 'next/image'
import { Menu, MessageCircle, Moon, Sun, X, LayoutDashboard, Layers, Settings2 } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasAudit, setHasAudit] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
    
    // Check for audit data
    const draft = localStorage.getItem('bi-max-pro-diagnose-draft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (parsed.financials?.currentMonthlyRevenue) {
          setHasAudit(true)
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextThemeIsDark = !isDark
    setIsDark(nextThemeIsDark)
    document.documentElement.classList.toggle('dark', nextThemeIsDark)
    localStorage.setItem('theme', nextThemeIsDark ? 'dark' : 'light')
  }

  if (shouldHideSiteChrome(pathname)) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/pm-logo-blue.svg"
              alt="Productivity Maxing logo"
              width={36}
              height={36}
              className="h-9 w-auto"
              priority
            />
            <span className="hidden sm:inline text-lg font-semibold tracking-tight">Productivity Maxing</span>
          </Link>

          <div className="hidden md:flex items-center space-x-7 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Home</Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">About</Link>
            <Link href="/business-tools" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Tools</Link>
            <Link href="/consulting" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Consulting</Link>
            {hasAudit && (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <Link 
                  href="/scale" 
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                >
                  <Layers size={14} />
                  Scale
                </Link>
                <Link 
                  href="/operations" 
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
                >
                  <Settings2 size={14} />
                  Ops
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
            >
              <MessageCircle size={15} />
              Start Here
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg border border-slate-200 p-2 dark:border-slate-700"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 text-sm">
            <Link href="/" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">About</Link>
            <Link href="/business-tools" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Tools</Link>
            <Link href="/consulting" onClick={() => setIsOpen(false)} className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Consulting</Link>
            {hasAudit && (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-blue-600 font-semibold hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link 
                  href="/scale" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  <Layers size={16} />
                  Scale
                </Link>
                <Link 
                  href="/operations" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  <Settings2 size={16} />
                  Operations
                </Link>
              </>
            )}
            <Link
              href="/onboarding"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition"
            >
              <MessageCircle size={14} />
              Start Here
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
