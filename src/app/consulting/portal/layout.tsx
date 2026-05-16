"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BusinessConsoleProvider,
  useBusinessConsole,
} from "@/contexts/BusinessConsoleContext"
import { CONSOLE_DASHBOARD, CONSOLE_SIGN_IN } from "@/lib/consoleRoutes"

function PortalAccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isLoading, isAuthenticated, onboardingComplete } = useBusinessConsole()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace(CONSOLE_SIGN_IN)
      return
    }
    if (onboardingComplete) {
      router.replace(CONSOLE_DASHBOARD)
    }
  }, [isLoading, isAuthenticated, onboardingComplete, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Pro-Diagnose intake...</p>
      </div>
    )
  }

  if (!isAuthenticated || onboardingComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Redirecting...</p>
      </div>
    )
  }

  return <>{children}</>
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessConsoleProvider>
      <PortalAccessGuard>{children}</PortalAccessGuard>
    </BusinessConsoleProvider>
  )
}
