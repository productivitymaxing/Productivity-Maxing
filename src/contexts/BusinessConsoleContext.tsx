"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  businessIntelligenceApi,
  normalizeAudit,
  type Audit,
  type BusinessIntelligenceUser,
} from "@/lib/businessIntelligenceApi"
import { CONSOLE_PORTAL, CONSOLE_SIGN_IN } from "@/lib/consoleRoutes"

const AUTH_COOKIE = "bi_max_auth"
const ONBOARDING_COOKIE = "bi_max_onboarding"
const ONBOARDING_AUDIT_KEY = "bi-max-onboarding-audit"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function loadCachedOnboardingAudit(): Audit | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(ONBOARDING_AUDIT_KEY)
    return raw ? (JSON.parse(raw) as Audit) : null
  } catch {
    return null
  }
}

function saveCachedOnboardingAudit(audit: Audit | null) {
  if (typeof window === "undefined") return
  if (!audit) {
    window.localStorage.removeItem(ONBOARDING_AUDIT_KEY)
    return
  }
  window.localStorage.setItem(ONBOARDING_AUDIT_KEY, JSON.stringify(audit))
}

type BusinessConsoleContextValue = {
  user: BusinessIntelligenceUser | null
  audit: Audit | null
  isLoading: boolean
  isAuthenticated: boolean
  onboardingComplete: boolean
  refresh: () => Promise<void>
  completeOnboarding: (audit: Audit) => void
  signOut: () => void
}

const BusinessConsoleContext = createContext<BusinessConsoleContextValue | null>(null)

function setClientCookie(name: string, value: string | null) {
  if (typeof document === "undefined") return
  if (!value) {
    document.cookie = `${name}=; path=/; max-age=0`
    return
  }
  document.cookie = `${name}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function BusinessConsoleProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<BusinessIntelligenceUser | null>(null)
  const [audit, setAudit] = useState<Audit | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const onboardingComplete = Boolean(audit)
  const isAuthenticated = Boolean(user)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const [session, auditHistory] = await Promise.all([
        businessIntelligenceApi.session(),
        businessIntelligenceApi.listAudits(),
      ])
      const latestAudit = auditHistory.audits[0]
        ? normalizeAudit(auditHistory.audits[0])
        : loadCachedOnboardingAudit()

      setUser(session.user)
      setAudit(latestAudit ? normalizeAudit(latestAudit) : null)
      setClientCookie(AUTH_COOKIE, "1")
      setClientCookie(ONBOARDING_COOKIE, latestAudit ? "complete" : null)
    } catch {
      setUser(null)
      setAudit(null)
      setClientCookie(AUTH_COOKIE, null)
      setClientCookie(ONBOARDING_COOKIE, null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const completeOnboarding = useCallback((nextAudit: Audit) => {
    const normalized = normalizeAudit(nextAudit)
    setAudit(normalized)
    saveCachedOnboardingAudit(normalized)
    setClientCookie(AUTH_COOKIE, "1")
    setClientCookie(ONBOARDING_COOKIE, "complete")
  }, [])

  const signOut = useCallback(() => {
    businessIntelligenceApi.logout()
    setUser(null)
    setAudit(null)
    saveCachedOnboardingAudit(null)
    setClientCookie(AUTH_COOKIE, null)
    setClientCookie(ONBOARDING_COOKIE, null)
    router.push(CONSOLE_SIGN_IN)
  }, [router])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    if (token) {
      window.localStorage.setItem("business-intelligence-max-token", token)
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (businessIntelligenceApi.hasSession()) {
      setClientCookie(AUTH_COOKIE, "1")
    }

    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      user,
      audit,
      isLoading,
      isAuthenticated,
      onboardingComplete,
      refresh,
      completeOnboarding,
      signOut,
    }),
    [user, audit, isLoading, isAuthenticated, onboardingComplete, refresh, completeOnboarding, signOut],
  )

  return (
    <BusinessConsoleContext.Provider value={value}>
      {children}
    </BusinessConsoleContext.Provider>
  )
}

export function useBusinessConsole() {
  const context = useContext(BusinessConsoleContext)
  if (!context) {
    throw new Error("useBusinessConsole must be used within BusinessConsoleProvider")
  }
  return context
}

export function useConsoleRouteGuard(requireOnboarding = true) {
  const { isLoading, isAuthenticated, onboardingComplete } = useBusinessConsole()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace(CONSOLE_SIGN_IN)
      return
    }
    if (requireOnboarding && !onboardingComplete) {
      router.replace(CONSOLE_PORTAL)
    }
  }, [isLoading, isAuthenticated, onboardingComplete, requireOnboarding, router])
}
