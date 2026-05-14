import { GoogleGenerativeAI } from "@google/generative-ai"
import { sendVerificationEmail } from "./utils/email"

export interface Env {
  DB: any
  productivity_maxing_db: D1Database
  JWT_SECRET: string
  RESEND_API_KEY?: string
  GEMINI_API_KEY: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  APPLE_CLIENT_ID?: string
  APPLE_TEAM_ID?: string
  APPLE_KEY_ID?: string
  APPLE_PRIVATE_KEY?: string
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

const apiBaseUrl = "https://api.productivitymaxing.com"

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
      else if (url.pathname === "/api/auth/verify-request" && request.method === "POST") response = await handleEmailVerifyRequest(request, env)
      else if (url.pathname === "/api/auth/verify" && request.method === "GET") response = await handleEmailVerify(request, env)
      else if (url.pathname === "/api/auth/verify-token" && request.method === "POST") response = await handleVerifyToken(request, env)
      else if (url.pathname === "/api/auth/apple" && request.method === "GET") response = await handleAppleAuth(request, env)
      else if (url.pathname === "/api/auth/apple/callback" && (request.method === "POST" || request.method === "GET")) response = await handleAppleCallback(request, env)
      else if (url.pathname === "/api/auth/login" && request.method === "POST") response = await handleLogin(request, env)
      else if (url.pathname === "/api/auth/session" && request.method === "GET") response = await handleSession(request, env)
      else if (url.pathname === "/api/profile" && request.method === "GET") response = await handleGetProfile(request, env)
      else if (url.pathname === "/api/profile" && request.method === "PUT") response = await handleUpdateProfile(request, env)
      else if (url.pathname === "/api/audits" && request.method === "GET") response = await handleListAudits(request, env)
      else if (url.pathname === "/api/audits" && request.method === "POST") response = await handleCreateAudit(request, env)
      else if (url.pathname === "/api/credits/spend" && request.method === "POST") response = await handleSpendCredits(request, env)
      else if (url.pathname === "/api/onboarding-progress" && request.method === "GET") response = await handleGetOnboardingProgress(request, env)
      else if (url.pathname === "/api/onboarding-progress" && request.method === "POST") response = await handleSaveOnboardingProgress(request, env)
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

async function handleEmailVerifyRequest(request: Request, env: Env) {
  if (!env.JWT_SECRET) return json({ error: "JWT_SECRET is not configured for Business Intelligence Max." }, 500)
  const body = await request.json() as { email?: string; name?: string; redirectTo?: string }
  const email = body.email?.trim().toLowerCase()
  if (!email || !email.includes("@")) return json({ error: "A valid email is required." }, 400)

  const token = await signEmailVerificationToken({ email, name: body.name, exp: Math.floor(Date.now() / 1000) + 60 * 15 }, env.JWT_SECRET)
  const redirectTo = body.redirectTo || new URL(request.url).origin
  const verificationUrl = `${new URL(request.url).origin}/api/auth/verify?token=${encodeURIComponent(token)}&redirect_to=${encodeURIComponent(redirectTo)}`

  // Send email if API key is configured
  if (env.RESEND_API_KEY) {
    await sendVerificationEmail(email, body.name || email.split('@')[0], verificationUrl, env.RESEND_API_KEY)
    return json({ success: true })
  }

  return json({ verificationUrl })
}

async function handleEmailVerify(request: Request, env: Env) {
  if (!env.JWT_SECRET) return json({ error: "JWT_SECRET is not configured for Business Intelligence Max." }, 500)
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const redirectTo = url.searchParams.get("redirect_to") || url.origin
  if (!token) return json({ error: "Verification token is required." }, 400)

  let payload
  try {
    payload = await verifyEmailVerificationToken(token, env.JWT_SECRET)
  } catch {
    return json({ error: "Invalid or expired verification token." }, 400)
  }

  const user = await upsertUserByEmail(env, payload.email, payload.name)
  const sessionToken = await signSessionToken({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET)
  const frontendUrl = `${redirectTo}?token=${sessionToken}`

  return new Response(null, {
    status: 302,
    headers: { Location: frontendUrl },
  })
}

async function handleVerifyToken(request: Request, env: Env) {
  if (!env.JWT_SECRET) return json({ error: "JWT_SECRET is not configured for Business Intelligence Max." }, 500)
  const body = await request.json() as { token?: string }
  if (!body.token) return json({ error: "Verification token is required." }, 400)

  let payload
  try {
    payload = await verifyEmailVerificationToken(body.token, env.JWT_SECRET)
  } catch {
    return json({ error: "Invalid or expired verification token." }, 400)
  }

  const user = await upsertUserByEmail(env, payload.email, payload.name)
  const sessionToken = await signSessionToken({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET)
  
  return json({ token: sessionToken, user })
}

async function handleGoogleAuth(request: Request, env: Env) {
  if (!env.GOOGLE_CLIENT_ID) return json({ error: "Google OAuth is not configured." }, 500)
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirect_to") || url.origin
  const state = encodeURIComponent(JSON.stringify({ redirect_to: redirectTo }))
  const redirectUri = `${apiBaseUrl}/api/auth/google/callback`
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

  const redirectTo = (() => {
    if (!state) return url.origin
    try {
      const parsed = JSON.parse(decodeURIComponent(state)) as { redirect_to?: string }
      return parsed.redirect_to || url.origin
    } catch {
      return url.origin
    }
  })()

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
        redirect_uri: `${apiBaseUrl}/api/auth/google/callback`,
      }),
    })

    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string; error_description?: string }
    if (!tokenResponse.ok || !tokenData.access_token) {
      const errorMsg = tokenData.error_description || tokenData.error || "Failed to exchange authorization code."
      return json({ error: `Google token exchange failed: ${errorMsg}` }, 400)
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
    const frontendUrl = `${redirectTo}?token=${token}`
    return new Response(null, {
      status: 302,
      headers: { Location: frontendUrl },
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    return json({ error: `Google OAuth failed: ${errorMsg}` }, 500)
  }
}

async function handleGitHubAuth(request: Request, env: Env) {
  if (!env.GITHUB_CLIENT_ID) return json({ error: "GitHub OAuth is not configured." }, 500)
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirect_to") || url.origin
  const state = encodeURIComponent(JSON.stringify({ redirect_to: redirectTo }))
  const redirectUri = `${apiBaseUrl}/api/auth/github/callback`
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

  const redirectTo = (() => {
    if (!state) return url.origin
    try {
      const parsed = JSON.parse(decodeURIComponent(state)) as { redirect_to?: string }
      return parsed.redirect_to || url.origin
    } catch {
      return url.origin
    }
  })()

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
        redirect_uri: `${apiBaseUrl}/api/auth/github/callback`,
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
    const frontendUrl = `${redirectTo}?token=${token}`
    return new Response(null, {
      status: 302,
      headers: { Location: frontendUrl },
    })
  } catch (error) {
    return json({ error: "OAuth authentication failed." }, 500)
  }
}

async function handleAppleAuth(request: Request, env: Env) {
  if (!env.APPLE_CLIENT_ID) return json({ error: "Apple OAuth is not configured." }, 500)
  
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get("redirect_to") || url.origin
  const state = encodeURIComponent(JSON.stringify({ redirect_to: redirectTo }))
  const redirectUri = `${apiBaseUrl}/api/auth/apple/callback`
  
  const authUrl = `https://appleid.apple.com/auth/authorize?${new URLSearchParams({
    client_id: env.APPLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "name email",
    response_mode: "form_post",
    state,
  })}`
  
  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  })
}

async function handleAppleCallback(request: Request, env: Env) {
  if (!env.APPLE_CLIENT_ID || !env.APPLE_TEAM_ID || !env.APPLE_KEY_ID || !env.APPLE_PRIVATE_KEY || !env.JWT_SECRET) {
    return json({ error: "Apple OAuth is not fully configured." }, 500)
  }

  const url = new URL(request.url)
  let code: string | null = null
  let state: string | null = null
  let user_data: any = null

  if (request.method === "POST") {
    const formData = await request.formData()
    code = formData.get("code") as string
    state = formData.get("state") as string
    const userJson = formData.get("user") as string
    if (userJson) {
      try {
        user_data = JSON.parse(userJson)
      } catch {}
    }
  } else {
    code = url.searchParams.get("code")
    state = url.searchParams.get("state")
  }

  if (!code) return json({ error: "Authorization code is required." }, 400)

  const redirectTo = (() => {
    if (!state) return url.origin
    try {
      const parsed = JSON.parse(decodeURIComponent(state)) as { redirect_to?: string }
      return parsed.redirect_to || url.origin
    } catch {
      return url.origin
    }
  })()

  try {
    // 1. Generate client_secret (JWT)
    const clientSecret = await generateAppleClientSecret(env)

    // 2. Exchange code for tokens
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${apiBaseUrl}/api/auth/apple/callback`,
      }),
    })

    const tokenData = await tokenResponse.json() as { id_token?: string; error?: string; error_description?: string }
    if (!tokenResponse.ok || !tokenData.id_token) {
      const errorMsg = tokenData.error_description || tokenData.error || "Failed to exchange authorization code."
      return json({ error: `Apple token exchange failed: ${errorMsg}` }, 400)
    }

    // 3. Decode id_token to get email (no verification for now, or minimal)
    const idTokenParts = tokenData.id_token.split(".")
    if (idTokenParts.length !== 3) return json({ error: "Invalid id_token from Apple." }, 400)
    const payload = JSON.parse(base64UrlDecode(idTokenParts[1])) as { email?: string; sub: string }
    
    if (!payload.email) return json({ error: "Email not provided by Apple." }, 400)

    // 4. Create/update user
    const name = user_data?.name ? `${user_data.name.firstName} ${user_data.name.lastName}`.trim() : payload.email.split("@")[0]
    const user = await upsertUserByEmail(env, payload.email, name)
    const token = await signSessionToken({ sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 }, env.JWT_SECRET)

    // 5. Redirect back to frontend
    const frontendUrl = `${redirectTo}?token=${token}`
    return new Response(null, {
      status: 302,
      headers: { Location: frontendUrl },
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    return json({ error: `Apple OAuth failed: ${errorMsg}` }, 500)
  }
}

async function generateAppleClientSecret(env: Env) {
  const header = { alg: "ES256", kid: env.APPLE_KEY_ID }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: env.APPLE_TEAM_ID,
    iat: now,
    exp: now + 3600, // 1 hour
    aud: "https://appleid.apple.com",
    sub: env.APPLE_CLIENT_ID,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const unsignedToken = `${encodedHeader}.${encodedPayload}`
  
  const signature = await signAppleP8(unsignedToken, env.APPLE_PRIVATE_KEY!)
  return `${unsignedToken}.${signature}`
}

async function signAppleP8(input: string, privateKeyP8: string) {
  // Extract the base64 part of the P8 key
  const pemHeader = "-----BEGIN PRIVATE KEY-----"
  const pemFooter = "-----END PRIVATE KEY-----"
  const pemContents = privateKeyP8.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "")
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    key,
    new TextEncoder().encode(input)
  )

  return base64UrlEncodeBytes(new Uint8Array(signature))
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
  const user = await requireUser(request, env).catch(() => null);
  const body = await request.json() as { form: DiagnosticForm };
  
  if (!body.form) return json({ error: "Diagnostic form is required." }, 400);

  const audit = await generateAudit(body.form, env);

  if (!user) {
    return json({ 
      success: true, 
      isGuest: true,
      message: "Free audit generated successfully. Sign in to save your results.",
      audit 
    });
  }

  const auditId = crypto.randomUUID();
  await env.productivity_maxing_db.prepare(
    "INSERT INTO audits (id, user_id, form_json, score, bottlenecks_json, constraints_json, recommendations_json, roadmap_json, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
  .bind(
    auditId, 
    user.id, 
    JSON.stringify(body.form), 
    audit.score, 
    JSON.stringify(audit.bottlenecks), 
    JSON.stringify(audit.constraints), 
    JSON.stringify(audit.recommendations), 
    JSON.stringify(audit.roadmap), 
    audit.summary
  )
  .run();

  await logUsage(env, user.id, "audit.created", { auditId, score: audit.score });

  return json({ success: true, isGuest: false, audit: { ...audit, id: auditId } });
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

async function handleGetOnboardingProgress(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const log = await env.productivity_maxing_db.prepare("SELECT metadata_json FROM usage_logs WHERE user_id = ? AND action = 'onboarding_progress' ORDER BY created_at DESC LIMIT 1").bind(user.id).first<{ metadata_json: string }>()
  
  if (!log) return json({ form: null, currentStep: 0 })
  
  try {
    const data = JSON.parse(log.metadata_json)
    return json({ form: data.form || null, currentStep: data.currentStep || 0 })
  } catch {
    return json({ form: null, currentStep: 0 })
  }
}

async function handleSaveOnboardingProgress(request: Request, env: Env) {
  const user = await requireUser(request, env)
  const body = await request.json() as { form: DiagnosticForm; currentStep: number }
  
  await logUsage(env, user.id, "onboarding_progress", { form: body.form, currentStep: body.currentStep })
  return json({ success: true })
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

async function signEmailVerificationToken(payload: { email: string; name?: string; exp: number }, secret: string) {
  const header = { alg: "HS256", typ: "JWT" }
  const tokenPayload = { ...payload, type: "email_verification" }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))
  const signature = await signHmac(`${encodedHeader}.${encodedPayload}`, secret)
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

async function verifyEmailVerificationToken(token: string, secret: string): Promise<{ email: string; name?: string; exp: number }> {
  const [encodedHeader, encodedPayload, signature] = token.split(".")
  if (!encodedHeader || !encodedPayload || !signature) throw new Error("Unauthorized")
  const expectedSignature = await signHmac(`${encodedHeader}.${encodedPayload}`, secret)
  if (!timingSafeEqual(signature, expectedSignature)) throw new Error("Unauthorized")

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as { email?: string; name?: string; exp?: number; type?: string }
  const exp = payload.exp
  if (!payload.email || !payload.email.includes("@") || payload.type !== "email_verification" || typeof exp !== "number" || exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Unauthorized")
  }

  return { email: payload.email, name: payload.name, exp }
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

async function generateAudit(form: DiagnosticForm, env: Env): Promise<Audit> {
  const flat = Object.values(form).flatMap(section => Object.values(section))
  const completed = flat.filter(Boolean).length
  const signal = flat.join(" ").toLowerCase()
  const penalties = ["manual", "overwhelm", "unpredictable", "none", "poor", "scattered", "critical", "excessive"].reduce((sum, word) => sum + (signal.includes(word) ? 7 : 0), 0)
  const score = Math.max(31, Math.min(92, 38 + completed * 2 - penalties + (signal.includes("automated") ? 10 : 0)))

  if (!env.GEMINI_API_KEY) {
    return {
      score,
      bottlenecks: ["Founder-dependent execution is limiting throughput.", "Workflow visibility is not yet strong enough for predictable scale.", "KPI reporting requires tighter operating cadence."],
      constraints: ["Manual coordination creates hidden time leakage.", "Client delivery and internal accountability are not fully systemized.", "Growth channels are vulnerable without a repeatable operating rhythm."],
      recommendations: ["Install a weekly executive operating dashboard with lead, delivery, finance and capacity metrics.", "Convert recurring delivery work into documented SOPs with ownership rules.", "Build a founder leverage system: delegation map, decision rules and escalation paths.", "Create a revenue operations tracker for leads, pipeline velocity and follow-up SLA."],
      roadmap: ["Week 1: Map bottlenecks, owner responsibilities and critical KPIs.", "Week 2: Build the operating dashboard and weekly review cadence.", "Week 3: Document top 5 recurring workflows as SOPs.", "Week 4: Deploy delegation, tracker and accountability system."],
      summary: "Your business has enough operational signal to improve quickly, but scaling will require a stronger management system: clearer metrics, fewer manual handoffs, documented delivery, and a tighter executive review cadence.",
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash",
      generationConfig: { responseMimeType: "application/json" }
    })

    const prompt = `
      You are the Elite Performance Engineer for Productivity Maxing.
      Diagnose the following business based on their diagnostic form data:
      ${JSON.stringify(form, null, 2)}

      Your task is to provide a detailed operational audit.
      The operational score has already been calculated as ${score}/100.
      
      Respond ONLY with a JSON object in the following format:
      {
        "bottlenecks": ["string", "string", "string"],
        "constraints": ["string", "string", "string"],
        "recommendations": ["string", "string", "string", "string"],
        "roadmap": ["Week 1: ...", "Week 2: ...", "Week 3: ...", "Week 4: ..."],
        "summary": "Detailed executive summary string"
      }

      Focus on friction mapping, revenue at risk, and actionable implementation.
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const aiAudit = JSON.parse(responseText)

    return {
      score,
      bottlenecks: Array.isArray(aiAudit.bottlenecks) ? aiAudit.bottlenecks : [],
      constraints: Array.isArray(aiAudit.constraints) ? aiAudit.constraints : [],
      recommendations: Array.isArray(aiAudit.recommendations) ? aiAudit.recommendations : [],
      roadmap: Array.isArray(aiAudit.roadmap) ? aiAudit.roadmap : [],
      summary: typeof aiAudit.summary === "string" ? aiAudit.summary : "",
    }
  } catch (error) {
    console.error("Gemini audit generation failed:", error)
    // Fallback to static if AI fails
    return {
      score,
      bottlenecks: ["Founder-dependent execution is limiting throughput."],
      constraints: ["Manual coordination creates hidden time leakage."],
      recommendations: ["Install a weekly executive operating dashboard."],
      roadmap: ["Week 1: Map bottlenecks and critical KPIs."],
      summary: "Audit generated with fallback logic due to intelligence service interruption.",
    }
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
