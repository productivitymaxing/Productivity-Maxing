"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, LogIn, LogOut, Menu, Moon, Sun, User } from "lucide-react"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"
import { CONSOLE_SIGN_IN, getConsolePageTitle } from "@/lib/consoleRoutes"
import { cn } from "@/lib/utils"

type ConsoleHeaderProps = {
  onMenuToggle?: () => void
}

export default function ConsoleHeader({ onMenuToggle }: ConsoleHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useBusinessConsole()
  const [isDark, setIsDark] = useState(false)
  const title = getConsolePageTitle(pathname)

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark
    setIsDark(shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const nextThemeIsDark = !isDark
    setIsDark(nextThemeIsDark)
    document.documentElement.classList.toggle("dark", nextThemeIsDark)
    localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-cyan-300">
              Business Intelligence Max
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>

        <HeaderActions
          isDark={isDark}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
          user={user}
          signOut={signOut}
          router={router}
        />
      </div>
    </header>
  )
}

function HeaderActions({
  isDark,
  toggleTheme,
  isAuthenticated,
  user,
  signOut,
  router,
}: {
  isDark: boolean
  toggleTheme: () => void
  isAuthenticated: boolean
  user: { email: string; name?: string; subscription_tier: string } | null
  signOut: () => void
  router: ReturnType<typeof useRouter>
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900",
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-200">
              <User size={16} />
            </span>
            <span className="hidden max-w-[140px] truncate sm:inline">
              {isAuthenticated ? user?.name || user?.email : "Account"}
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {isAuthenticated && user ? (
            <>
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-xs text-slate-500">
                Tier: {user.subscription_tier}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600 dark:text-red-400">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={() => router.push(CONSOLE_SIGN_IN)}>
              <LogIn size={16} className="mr-2" />
              Sign In
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
