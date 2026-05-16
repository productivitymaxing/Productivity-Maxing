"use client"

import ConsoleShell from "@/components/console/ConsoleShell"
import {
  BusinessConsoleProvider,
  useConsoleRouteGuard,
} from "@/contexts/BusinessConsoleContext"

function ConsoleRouteGuard({ children }: { children: React.ReactNode }) {
  useConsoleRouteGuard(true)
  return <>{children}</>
}

export default function ConsultingConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessConsoleProvider>
      <ConsoleRouteGuard>
        <ConsoleShell>{children}</ConsoleShell>
      </ConsoleRouteGuard>
    </BusinessConsoleProvider>
  )
}
