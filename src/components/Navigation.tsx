'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, MessageCircle, Moon, Sun, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextThemeIsDark = !isDark
    setIsDark(nextThemeIsDark)
    document.documentElement.classList.toggle('dark', nextThemeIsDark)
    localStorage.setItem('theme', nextThemeIsDark ? 'dark' : 'light')
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
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link
              href="#newsletter"
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
            <Link href="/" className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Home</Link>
            <Link href="/about" className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">About</Link>
            <Link href="/business-tools" className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Tools</Link>
            <Link href="/consulting" className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Consulting</Link>
            <Link
              href="#newsletter"
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
