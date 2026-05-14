"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2, XCircle } from "lucide-react"
import { businessIntelligenceApi } from "@/lib/businessIntelligenceApi"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const redirectTo = searchParams.get("redirect_to") || "/consulting"
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("No verification token provided in the URL.")
      return
    }

    const verifyToken = async () => {
      try {
        await businessIntelligenceApi.verifyEmailToken(token)
        setStatus("success")
      } catch (error) {
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Verification failed. The token may be expired or invalid.")
      }
    }

    verifyToken()
  }, [token])

  const handleContinue = () => {
    router.push(redirectTo)
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-center shadow-2xl shadow-slate-950/50 ring-1 ring-white/10">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
          <h1 className="text-2xl font-semibold">Verifying your email...</h1>
          <p className="text-slate-400">Please wait while we establish your secure session.</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/20">
            <ShieldCheck className="h-10 w-10 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Email Verified</h1>
            <p className="mt-2 text-slate-400">Your secure session is established. You can now access Business Intelligence Max.</p>
          </div>
          <button onClick={handleContinue} className="mt-4 w-full rounded-3xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-500">
            Continue to Business Intelligence Max Portal
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white">Verification Failed</h1>
            <p className="mt-2 text-slate-400">{errorMessage}</p>
          </div>
          <button onClick={() => router.push("/consulting")} className="mt-4 w-full rounded-3xl border border-slate-700 bg-slate-900 px-6 py-4 text-lg font-semibold text-slate-200 transition hover:bg-slate-800">
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  )
}

export default function EmailVerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(0,103,255,0.28),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(0,36,148,0.28),transparent_20%),linear-gradient(180deg,rgba(3,11,72,1),rgba(6,27,133,1) 35%,rgba(10,31,85,1) 100%)] px-4 text-white">
      <Suspense fallback={
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 text-center shadow-2xl shadow-slate-950/50 ring-1 ring-white/10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-sky-500" />
            <h1 className="text-2xl font-semibold">Loading verification status...</h1>
          </div>
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </main>
  )
}
