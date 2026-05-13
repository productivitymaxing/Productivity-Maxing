export type Tier = "Free" | "Pro" | "Max"

export type DiagnosticForm = Record<string, Record<string, string>>

export type Audit = {
  id?: string
  score: number
  bottlenecks: string[]
  constraints: string[]
  recommendations: string[]
  roadmap: string[]
  summary: string
  created_at?: string
  bottlenecks_json?: string
  constraints_json?: string
  recommendations_json?: string
  roadmap_json?: string
}

export type BusinessIntelligenceUser = {
  id: string
  email: string
  name?: string
  company_name?: string
  industry?: string
  team_size?: string
  business_stage?: string
  subscription_tier: Tier
  credits_balance: number
}

export type ConversationMessage = {
  role: "user" | "assistant"
  content: string
  createdAt: string
}

export type ConversationRecord = {
  id: string
  user_id?: string
  title: string
  messages_json: string
  created_at?: string
  updated_at?: string
}

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL ?? "https://business-intelligence-max-api.evangelmarfo.workers.dev"
const tokenKey = "business-intelligence-max-token"

export { workerUrl }

function getSessionToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(tokenKey)
}

function setSessionToken(token: string) {
  window.localStorage.setItem(tokenKey, token)
}

function clearSessionToken() {
  window.localStorage.removeItem(tokenKey)
}

function authHeaders() {
  const token = getSessionToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(`${workerUrl}${path}`, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers ?? {}) },
      signal: controller.signal,
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      const message = typeof payload?.error === "string" ? payload.error : "Business Intelligence Max API request failed."
      if (response.status === 401) clearSessionToken()
      throw new Error(message)
    }

    return payload as T
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Business Intelligence Max is taking longer than expected. Please try again.")
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (typeof value !== "string") return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function normalizeAudit(audit: Audit): Audit {
  return {
    ...audit,
    bottlenecks: audit.bottlenecks ?? parseJsonArray(audit.bottlenecks_json),
    constraints: audit.constraints ?? parseJsonArray(audit.constraints_json),
    recommendations: audit.recommendations ?? parseJsonArray(audit.recommendations_json),
    roadmap: audit.roadmap ?? parseJsonArray(audit.roadmap_json),
  }
}

export const businessIntelligenceApi = {
  async login(email: string, name?: string) {
    const result = await request<{ token: string; user: BusinessIntelligenceUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, name }) })
    setSessionToken(result.token)
    return result
  },
  async requestEmailVerification(email: string, name?: string, redirectTo?: string) {
    return request<{ verificationUrl: string }>("/api/auth/verify-request", { method: "POST", body: JSON.stringify({ email, name, redirectTo }) })
  },
  logout() {
    clearSessionToken()
  },
  hasSession() {
    return Boolean(getSessionToken())
  },
  session() {
    return request<{ user: BusinessIntelligenceUser }>("/api/auth/session")
  },
  profile() {
    return request<{ user: BusinessIntelligenceUser; business: unknown }>("/api/profile")
  },
  createAudit(form: DiagnosticForm) {
    return request<{ audit: Audit }>("/api/audits", { method: "POST", body: JSON.stringify({ form }) })
  },
  listAudits() {
    return request<{ audits: Audit[] }>("/api/audits")
  },
  spendCredits(action: string, auditId?: string) {
    return request<{ creditsBalance: number; assetId: string }>("/api/credits/spend", { method: "POST", body: JSON.stringify({ action, auditId }) })
  },
  listConversations() {
    return request<{ conversations: ConversationRecord[]; userEmail: string }>("/api/conversations")
  },
  saveConversation(input: { id?: string; title?: string; messages: ConversationMessage[] }) {
    return request<{ conversation: ConversationRecord; userEmail: string }>("/api/conversations", { method: "POST", body: JSON.stringify(input) })
  },
  generateReply(input: { conversationId?: string; message: string; audit?: Audit | null }) {
    return request<{ reply: string; userEmail: string }>("/api/ai/reply", { method: "POST", body: JSON.stringify(input) })
  },
  listAssets() {
    return request<{ assets: unknown[] }>("/api/assets")
  },
}
