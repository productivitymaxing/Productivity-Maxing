import { GoogleGenerativeAI } from "@google/generative-ai"

export interface Env {
  DB: any
  productivity_maxing_db: D1Database
  JWT_SECRET: string
  GEMINI_API_KEY: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
}

type DiagnosticForm = Record<string, Record<string, string>>

type Audit = {
  score: number
  bottlenecks: string[]
  constraints: string[]
  recommendations: string[]
  roadmap: string[]
  summary: string
}

type SessionPayload = {
  sub: string
  email: string
  exp: number
}

type ConversationMessage = {
  role: "user" | "assistant"
  content: string
  createdAt: string
}

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
}

const allowedOrigins = new Set([
  "https://productivitymaxing.netlify.app",
  "https://6a034e852fe091ff67579297--productivitymaxing.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
])

const creditCosts: Record<string, number> = {
  dashboard: 5,
  kpi_tracker: 3,
  sop: 2,
  deep_analysis: 4,
  strategic_plan: 6,
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (!isAllowedOrigin(request)) return new Response("Forbidden origin", { status: 403 })
    if (request.method === "OPTIONS") return withCors(request, new Response(null, { headers: corsHeaders }))

    const url = new URL(request.url)

    try {
      let response: Response
      if (url.pathname === "/" || url.pathname === "/api/health") response = json({ ok: true, service: "business-intelligence-max" })
      else if (url.pathname === "/test-db") response = await handleTestDb(env)
      else if (url.pathname === "/api/auth/google" && request.method === "GET") response = await handleGoogleAuth(request, env)
      else if (url.pathname === "/api/auth/google/callback" && request.method === "GET") response = await handleGoogleCallback(request, env)
      else if (url.pathname === "/api/auth/github" && request.method === "GET") response = await handleGitHubAuth(request, env)
      else if (url.pathname === "/api/auth/github/callback" && request.method === "GET") response = await handleGitHubCallback(request, env)
      else if (url.pathname === "/api/auth/apple" && request.method === "GET") response = await handleAppleAuth(request, env)
      else if (url.pathname === "/api/auth/apple/callback" && request.method === "GET") response = await handleAppleCallback(request, env)
      else if (url.pathname === "/api/profile" && request.method === "GET") response = await handleGetProfile(request, env)
      else if (url.pathname === "/api/profile" && request.method === "PUT") response = await handleUpdateProfile(request, env)
      else if (url.pathname === "/api/audits" && request.method === "GET") response = await handleListAudits(request, env)
      else if (url.pathname === "/api/audits" && request.method === "POST") response = await handleCreateAudit(request, env)
      else if (url.pathname === "/api/credits/spend" && request.method === "POST") response = await handleSpendCredits(request, env)
      else if (url.pathname === "/api/conversations" && request.method === "GET") response = await handleListConversations(request, env)
      else if (url.pathname === "/api/conversations" && request.method === "POST") response = await handleSaveConversation(request, env)
      else if (url.pathname === "/api/ai/reply" && request.method === "POST") response = await handleGeminiReply(request, env)
      else if (url.pathname === "/api/assets" && request.method === "GET") response = await handleListAssets(request, env)
      else if (url.pathname === "/api/stripe/webhook" && request.method === "POST") response = await handleStripeWebhook(request, env)
      else response = json({ error: "Not found" }, 404)
      return withCors(request, response)
    } catch (error) {
      return withCors(request, json({ error: error instanceof Error ? error.message : "Internal error" }, 500))
    }
  },
}

async function handleTestDb(env: Env) {
  const result = await env.productivity_maxing_db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  return json(result)
}

async function handleLogin(request: Request, env: Env) {
  if (!env.JWT_SECRET) return json({ error: "JWT_SECRET is not configured for Business Intelligence Max." }, 500)
  const body = await request.json() as { email?: string; name?: string }
  const email = body.email?.trim().toLowerCase()
  if (!email || !email.includes("@")) return json({ error: "A valid email is required." }, 400)

  const user = await upsertUserByEmail(env, email, body.name)
  const token = await signSessionToken({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET)
  return json({ token, user })
}

async function handleSession(request: Request, env: Env) {
  const user = await requireUser(request, env)
  return json({ user })
}

async function handleGoogleAuth(request: Request, env: Env) {
  if (!env.GOOGLE_CLIENT_ID) return json({ error: "Google OAuth is not configured." }, 500)
  const state = crypto.randomUUID()
  const redirectUri = `${new URL(request.url).origin}/api/auth/google/callback`
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  })}`
  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  })
}

async function handleGoogleCallback(request: Request, env: Env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return json({ error: "Google OAuth is not configured." }, 500)

  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  if (!code) return json({ error: "Authorization code is required." }, 400)

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${url.origin}/api/auth/google/callback`,
      }),
    })

    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string }
    if (!tokenResponse.ok || !tokenData.access_token) {
      return json({ error: tokenData.error || "Failed to exchange authorization code." }, 400)
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json() as { email?: string; name?: string; error?: string }
    if (!userResponse.ok || !userData.email) {
      return json({ error: userData.error || "Failed to get user information." }, 400)
    }

    // Create/update user and return token
    const user = await upsertUserByEmail(env, userData.email, userData.name)
    const token = await signSessionToken({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET!)

    // Redirect to frontend with token
    const frontendUrl = `${url.origin}?token=${token}`
    return new Response(null, {
      status: 302,
      headers: { Location: frontendUrl },
    })
  } catch (error) {
    return json({ error: "OAuth authentication failed." }, 500)
  }
}

async function handleGitHubAuth(request: Request, env: Env) {
  if (!env.GITHUB_CLIENT_ID) return json({ error: "GitHub OAuth is not configured." }, 500)
  const state = crypto.randomUUID()
  const redirectUri = `${new URL(request.url).origin}/api/auth/github/callback`
  const authUrl = `https://github.com/login/oauth/authorize?${new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "user:email",
    state,
  })}`
  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  })
}

async function handleGitHubCallback(request: Request, env: Env) {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return json({ error: "GitHub OAuth is not configured." }, 500)

  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  if (!code) return json({ error: "Authorization code is required." }, 400)

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/auth/github/callback`,
      }),
    })

    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string }
    if (!tokenResponse.ok || !tokenData.access_token) {
      return json({ error: tokenData.error || "Failed to exchange authorization code." }, 400)
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "Business-Intelligence-Max"
      },
    })

    const userData = await userResponse.json() as { email?: string; name?: string; login?: string; error?: string }
    if (!userResponse.ok) {
      return json({ error: userData.error || "Failed to get user information." }, 400)
    }

    // Get user email if not provided
    let email = userData.email
    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: { 
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "Business-Intelligence-Max"
        },
      })
      const emails = await emailsResponse.json() as Array<{ email: string; primary: boolean; verified: boolean }>
      const primaryEmail = emails.find(e => e.primary && e.verified)
      email = primaryEmail?.email
    }

    if (!email) {
      return json({ error: "Unable to get verified email from GitHub." }, 400)
    }

    // Create/update user and return token
    const user = await upsertUserByEmail(env, email, userData.name || userData.login)
    const token = await signSessionToken({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET!)

    // Redirect to frontend with token
    const frontendUrl = `${url.origin}?token=${token}`
    return new Response(null, {
      status: 302,
      headers: { Location: frontendUrl },
    })
  } catch (error) {
    return json({ error: "OAuth authentication failed." }, 500)
  }
}

async function handleAppleAuth(request: Request, env: Env) {
  // Apple Sign-In is more complex and typically requires a frontend implementation
  // For now, we'll return an error indicating it's not implemented
  return json({ error: "Apple Sign-In is not yet implemented. Please use email, Google, or GitHub authentication." }, 501)
}

async function handleAppleCallback(request: Request, env: Env) {
  return json({ error: "Apple Sign-In is not yet implemented." }, 501)
}

async function handleGetProfile(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const business = await env.productivity_maxing_db.prepare("SELECT * FROM businesses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").bind(user.id).first()
  return json({ user, business })
}

async function handleUpdateProfile(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const body = await request.json() as Record<string, string>
  await env.productivity_maxing_db.prepare("UPDATE users SET name = ?, company_name = ?, industry = ?, team_size = ?, business_stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(body.name ?? user.name, body.companyName ?? user.company_name, body.industry ?? user.industry, body.teamSize ?? user.team_size, body.businessStage ?? user.business_stage, user.id)
    .run()
  return handleGetProfile(request, env)
}

async function handleListAudits(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const { results } = await env.productivity_maxing_db.prepare("SELECT * FROM audits WHERE user_id = ? ORDER BY created_at DESC LIMIT 25").bind(user.id).all()
  return json({ audits: results })
}

async function handleCreateAudit(request: Request, env: Env) {
  // 1. Try to get the user, but don't crash if they are a guest
  const user = await requireUser(request, env).catch(() => null);

  // 2. Parse the audit data sent from the frontend
  const auditData = await request.json();

  // 3. LOGIC: If no user, just return the data (Guest Mode)
  if (!user) {
    return new Response(JSON.stringify({ 
      success: true, 
      isGuest: true,
      message: "Free audit generated successfully.",
      audit: auditData 
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Keeps CORS happy
      }
    });
  }

  // 4. LOGIC: If user exists, save to the D1 Database (Institutional Mode)
  const { success } = await env.DB.prepare(
    "INSERT INTO ai_conversations (user_id, message, response) VALUES (?, ?, ?)"
  )
  .bind(user.id, "New Audit Request", JSON.stringify(auditData))
  .run();

  return new Response(JSON.stringify({ success, isGuest: false, audit: auditData }), {
    headers: { "Content-Type": "application/json" }
  });
}

async function handleSpendCredits(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const body = await request.json() as { action: string; auditId?: string }
  const cost = creditCosts[body.action]
  if (!cost) return json({ error: "Unknown generation action" }, 400)
  if (user.subscription_tier === "Free") return json({ error: "Upgrade required" }, 402)
  if (user.credits_balance < cost) return json({ error: "Insufficient credits" }, 402)

  const newBalance = user.credits_balance - cost
  const txId = crypto.randomUUID()
  const assetId = crypto.randomUUID()

  await env.productivity_maxing_db.batch([
    env.productivity_maxing_db.prepare("UPDATE users SET credits_balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND credits_balance >= ?").bind(newBalance, user.id, cost),
    env.productivity_maxing_db.prepare("INSERT INTO credit_transactions (id, user_id, type, amount, balance_after, description) VALUES (?, ?, ?, ?, ?, ?)").bind(txId, user.id, "debit", -cost, newBalance, body.action),
    env.productivity_maxing_db.prepare("INSERT INTO generated_assets (id, user_id, audit_id, type, title, content_json, credits_spent) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(assetId, user.id, body.auditId ?? null, body.action, titleForAction(body.action), JSON.stringify(generateAsset(body.action)), cost),
  ])

  await logUsage(env, user.id, "credits.spend", { action: body.action, credits: cost, assetId })
  return json({ creditsBalance: newBalance, assetId })
}

async function handleListAssets(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const { results } = await env.productivity_maxing_db.prepare("SELECT * FROM generated_assets WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").bind(user.id).all()
  return json({ assets: results })
}

async function handleListConversations(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const { results } = await env.productivity_maxing_db.prepare("SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 20").bind(user.id).all()
  return json({ conversations: results, userEmail: user.email })
}

async function handleSaveConversation(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const body = await request.json() as { id?: string; title?: string; messages?: ConversationMessage[] }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-100) : []
  if (messages.length === 0) return json({ error: "Conversation messages are required." }, 400)

  const id = body.id || crypto.randomUUID()
  const title = body.title?.trim() || messages.find(message => message.role === "user")?.content.slice(0, 80) || "Consulting terminal session"
  const existing = await env.productivity_maxing_db.prepare("SELECT id FROM ai_conversations WHERE id = ? AND user_id = ?").bind(id, user.id).first()

  if (existing) {
    await env.productivity_maxing_db.prepare("UPDATE ai_conversations SET title = ?, messages_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?")
      .bind(title, JSON.stringify(messages), id, user.id)
      .run()
  } else {
    await env.productivity_maxing_db.prepare("INSERT INTO ai_conversations (id, user_id, title, messages_json) VALUES (?, ?, ?, ?)")
      .bind(id, user.id, title, JSON.stringify(messages))
      .run()
  }

  await logUsage(env, user.id, "conversation.saved", { conversationId: id, email: user.email, messageCount: messages.length })
  return json({ conversation: { id, user_id: user.id, title, messages_json: JSON.stringify(messages) }, userEmail: user.email })
}

async function handleGeminiReply(request: Request, env: Env) {
  const user = await requireUser(request, env)
  if (!env.GEMINI_API_KEY) return json({ error: "GEMINI_API_KEY is not configured." }, 500)

  const body = await request.json() as { conversationId?: string; message?: string; audit?: Audit | null }
  const message = body.message?.trim()
  if (!message) return json({ error: "A consulting message is required." }, 400)

  const storedConversation = body.conversationId
    ? await env.productivity_maxing_db.prepare("SELECT messages_json FROM ai_conversations WHERE id = ? AND user_id = ?").bind(body.conversationId, user.id).first<{ messages_json: string }>()
    : null
  const storedMessages = storedConversation ? parseStoredMessages(storedConversation.messages_json).slice(-20) : []

  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash",
    systemInstruction: [
      "You are the Elite Performance Engineer for Productivity Maxing.",
      "Your job is to diagnose operational drag, map friction, quantify Revenue at Risk, and turn founder chaos into execution systems.",
      "Always prioritize Friction Mapping: identify the workflow, decision, owner, handoff, delay, rework loop, and hidden constraint.",
      "Always include Revenue at Risk calculations when enough information exists. If exact numbers are missing, state assumptions and give a simple formula.",
      "Be direct, executive, practical, and implementation-oriented. Avoid generic motivation.",
      "Use concise sections: Diagnosis, Friction Map, Revenue at Risk, Operating Fix, Next 7 Days.",
      "Respect the user's prior D1 conversation context and do not pretend to know facts that are not in the provided context.",
    ].join("\n"),
  })

  const historyContext = storedMessages.map(item => `${item.role.toUpperCase()}: ${item.content}`).join("\n")
  const auditContext = body.audit ? JSON.stringify(body.audit) : "No current audit attached."
  const result = await model.generateContent([
    `Authenticated user email: ${user.email}`,
    `D1 conversation history:\n${historyContext || "No previous turns in this session."}`,
    `Current audit context:\n${auditContext}`,
    `User request:\n${message}`,
  ].join("\n\n"))
  const reply = result.response.text()

  await logUsage(env, user.id, "gemini.reply", { conversationId: body.conversationId ?? null, email: user.email, model: "gemini-3-flash" })
  return json({ reply, userEmail: user.email })
}

async function handleStripeWebhook(request: Request, env: Env) {
  const payload = await request.text()
  if (!env.STRIPE_WEBHOOK_SECRET) return json({ error: "Stripe webhook secret not configured" }, 501)
  await logUsage(env, "system", "stripe.webhook.received", { size: payload.length })
  return json({ received: true })
}

async function requireUser(request: Request, env: Env) {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET is not configured for Business Intelligence Max.")
  const authorization = request.headers.get("Authorization")
  const token = authorization?.startsWith("Bearer ") ? authorization.replace("Bearer ", "") : null
  if (!token) throw new Error("Unauthorized")

  const payload = await verifySessionToken(token, env.JWT_SECRET)
  const existing = await env.productivity_maxing_db.prepare("SELECT * FROM users WHERE id = ?").bind(payload.sub).first<any>()
  if (existing) return existing

  return upsertUserByEmail(env, payload.email)
}

async function upsertUserByEmail(env: Env, email: string, name?: string) {
  const existing = await env.productivity_maxing_db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<any>()
  if (existing) return existing
  const id = crypto.randomUUID()
  await env.productivity_maxing_db.prepare("INSERT INTO users (id, email, name, subscription_tier, credits_balance) VALUES (?, ?, ?, ?, ?)").bind(id, email, name ?? email.split("@")[0], "Free", 15).run()
  return env.productivity_maxing_db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<any>()
}

async function signSessionToken(payload: SessionPayload, secret: string) {
  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = await signHmac(`${encodedHeader}.${encodedPayload}`, secret)
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

async function verifySessionToken(token: string, secret: string): Promise<SessionPayload> {
  const [encodedHeader, encodedPayload, signature] = token.split(".")
  if (!encodedHeader || !encodedPayload || !signature) throw new Error("Unauthorized")
  const expectedSignature = await signHmac(`${encodedHeader}.${encodedPayload}`, secret)
  if (!timingSafeEqual(signature, expectedSignature)) throw new Error("Unauthorized")
  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload
  if (!payload.sub || !payload.email || payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Unauthorized")
  return payload
}

async function signHmac(input: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input))
  return base64UrlEncodeBytes(new Uint8Array(signature))
}

function base64UrlEncode(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value))
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = ""
  bytes.forEach(byte => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let result = 0
  for (let index = 0; index < left.length; index += 1) result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return result === 0
}

function parseStoredMessages(messagesJson: string): ConversationMessage[] {
  try {
    const parsed = JSON.parse(messagesJson)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((message): message is ConversationMessage => {
      return (message?.role === "user" || message?.role === "assistant") && typeof message.content === "string" && typeof message.createdAt === "string"
    })
  } catch {
    return []
  }
}

function generateAudit(form: DiagnosticForm): Audit {
  const flat = Object.values(form).flatMap(section => Object.values(section))
  const completed = flat.filter(Boolean).length
  const signal = flat.join(" ").toLowerCase()
  const penalties = ["manual", "overwhelm", "unpredictable", "none", "poor", "scattered", "critical", "excessive"].reduce((sum, word) => sum + (signal.includes(word) ? 7 : 0), 0)
  const score = Math.max(31, Math.min(92, 38 + completed * 2 - penalties + (signal.includes("automated") ? 10 : 0)))
  return {
    score,
    bottlenecks: ["Founder-dependent execution is limiting throughput.", "Workflow visibility is not yet strong enough for predictable scale.", "KPI reporting requires tighter operating cadence."],
    constraints: ["Manual coordination creates hidden time leakage.", "Client delivery and internal accountability are not fully systemized.", "Growth channels are vulnerable without a repeatable operating rhythm."],
    recommendations: ["Install a weekly executive operating dashboard with lead, delivery, finance and capacity metrics.", "Convert recurring delivery work into documented SOPs with ownership rules.", "Build a founder leverage system: delegation map, decision rules and escalation paths.", "Create a revenue operations tracker for leads, pipeline velocity and follow-up SLA."],
    roadmap: ["Week 1: Map bottlenecks, owner responsibilities and critical KPIs.", "Week 2: Build the operating dashboard and weekly review cadence.", "Week 3: Document top 5 recurring workflows as SOPs.", "Week 4: Deploy delegation, tracker and accountability system."],
    summary: "Your business has enough operational signal to improve quickly, but scaling will require a stronger management system: clearer metrics, fewer manual handoffs, documented delivery, and a tighter executive review cadence.",
  }
}

function generateAsset(action: string) {
  return {
    modules: ["Executive KPI panel", "Workflow owner map", "Weekly operating cadence", "Priority constraint tracker"],
    nextSteps: ["Assign owners", "Set review rhythm", "Track leading indicators", "Review weekly"],
    action,
  }
}

function titleForAction(action: string) {
  return action.split("_").map(part => part[0].toUpperCase() + part.slice(1)).join(" ")
}

async function logUsage(env: Env, userId: string, action: string, metadata: unknown) {
  await env.productivity_maxing_db.prepare("INSERT INTO usage_logs (id, user_id, action, metadata_json) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), userId, action, JSON.stringify(metadata)).run()
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("Origin")
  if (!origin) return true
  return allowedOrigins.has(origin)
}

function withCors(request: Request, response: Response) {
  const origin = request.headers.get("Origin")
  const headers = new Headers(response.headers)
  if (origin && allowedOrigins.has(origin)) headers.set("Access-Control-Allow-Origin", origin)
  headers.set("Vary", "Origin")
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value))
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

export default worker
