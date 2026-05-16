"use client"

import { useState } from "react"
import ConsoleHeader from "./ConsoleHeader"
import ConsoleSidebar from "./ConsoleSidebar"

export default function ConsoleShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <DesktopSidebar />

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            <ConsoleSidebar />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <ConsoleHeader onMenuToggle={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  )
}

function DesktopSidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72">
      <ConsoleSidebar />
    </div>
  )
}
