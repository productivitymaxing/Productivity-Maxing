export const CONSOLE_SIGN_IN = "/consulting"
export const CONSOLE_PORTAL = "/consulting/portal"
export const CONSOLE_DASHBOARD = "/consulting/dashboard"

export const consoleNavItems = [
  {
    href: CONSOLE_DASHBOARD,
    label: "Central Command",
    description: "Executive operating view",
    segment: "dashboard",
  },
  {
    href: "/consulting/pro-diagnose",
    label: "Pro-Diagnose",
    description: "Audit tracker & baseline",
    segment: "pro-diagnose",
  },
  {
    href: "/consulting/pro-scale",
    label: "Pro-Scale",
    description: "CRM & growth pipeline",
    segment: "pro-scale",
  },
  {
    href: "/consulting/pro-operations",
    label: "Pro-Operations",
    description: "Systems health & advisory",
    segment: "pro-operations",
  },
  {
    href: "/consulting/pro-optimize",
    label: "Pro-Optimize",
    description: "Moat & future-proof matrix",
    segment: "pro-optimize",
  },
] as const

export const CONSOLE_ROUTE_PREFIXES = [
  CONSOLE_DASHBOARD,
  "/consulting/pro-diagnose",
  "/consulting/pro-scale",
  "/consulting/pro-operations",
  "/consulting/pro-optimize",
]

export function isConsoleRoute(pathname: string) {
  return CONSOLE_ROUTE_PREFIXES.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export function shouldHideSiteChrome(pathname: string) {
  return isConsoleRoute(pathname) || pathname === CONSOLE_PORTAL || pathname.startsWith(`${CONSOLE_PORTAL}/`)
}

export function getConsolePageTitle(pathname: string) {
  const item = consoleNavItems.find(nav => pathname === nav.href || pathname.startsWith(`${nav.href}/`))
  return item?.label ?? "Business Intelligence Max"
}
