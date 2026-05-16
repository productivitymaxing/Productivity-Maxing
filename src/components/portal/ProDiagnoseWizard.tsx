"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, type FieldPath } from "react-hook-form"
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, Sparkles } from "lucide-react"
import { useBusinessConsole } from "@/contexts/BusinessConsoleContext"
import { CONSOLE_DASHBOARD } from "@/lib/consoleRoutes"
import { submitProDiagnoseAudit } from "@/lib/proDiagnose/mockApi"
import {
  emptyProDiagnoseForm,
  proDiagnoseStepKeys,
  proDiagnoseStepSchemas,
  type ProDiagnoseFormValues,
  type ProDiagnoseStepKey,
} from "@/lib/proDiagnose/schema"
import { clearProDiagnoseDraft, loadProDiagnoseDraft, saveProDiagnoseDraft } from "@/lib/proDiagnose/storage"
import { cn } from "@/lib/utils"
import ProDiagnoseSuccessTransition from "./ProDiagnoseSuccessTransition"
import {
  DefensibilityStep,
  FinancialsStep,
  GrowthStep,
  OperationsStep,
} from "./ProDiagnoseSteps"

const STEP_META: { key: ProDiagnoseStepKey; title: string; subtitle: string }[] = [
  { key: "financials", title: "Financials", subtitle: "Revenue baseline & margin profile" },
  { key: "growth", title: "Growth (CRM)", subtitle: "Pipeline volume & conversion" },
  { key: "operations", title: "Operations", subtitle: "Team, stack & founder load" },
  { key: "defensibility", title: "Defensibility", subtitle: "Competition & moat clarity" },
]

export default function ProDiagnoseWizard() {
  const router = useRouter()
  const { user, completeOnboarding } = useBusinessConsole()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const draft = useMemo(() => loadProDiagnoseDraft(), [])

  const form = useForm<ProDiagnoseFormValues>({
    defaultValues: draft.form,
    mode: "onChange",
  })

  const { register, handleSubmit, watch, setError, clearErrors, formState: { errors } } = form
  const values = watch()

  useEffect(() => {
    setCurrentStep(draft.step)
  }, [draft.step])

  useEffect(() => {
    saveProDiagnoseDraft(values, currentStep)
  }, [values, currentStep])

  const completion = Math.round(((currentStep + 1) / STEP_META.length) * 100)
  const stepMeta = STEP_META[currentStep]

  const validateCurrentStep = useCallback(async () => {
    const stepKey = proDiagnoseStepKeys[currentStep]
    const schema = proDiagnoseStepSchemas[currentStep]
    const result = schema.safeParse(values[stepKey])

    clearErrors(stepKey)

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = [stepKey, ...issue.path].join(".") as FieldPath<ProDiagnoseFormValues>
        setError(path, { message: issue.message })
      }
      return false
    }
    return true
  }, [clearErrors, currentStep, setError, values])

  const goNext = async () => {
    const valid = await validateCurrentStep()
    if (!valid) return
    setCurrentStep(prev => Math.min(prev + 1, STEP_META.length - 1))
  }

  const goBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const onSubmit = handleSubmit(async data => {
    setSubmitError("")
    setIsSubmitting(true)
    try {
      const audit = await submitProDiagnoseAudit(data)
      clearProDiagnoseDraft()
      completeOnboarding(audit)
      setShowSuccess(true)
      window.setTimeout(() => {
        router.push(CONSOLE_DASHBOARD)
      }, 2200)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  })

  const renderStep = () => {
    switch (stepMeta.key) {
      case "financials":
        return <FinancialsStep register={register} errors={errors} />
      case "growth":
        return <GrowthStep register={register} errors={errors} />
      case "operations":
        return <OperationsStep register={register} errors={errors} />
      case "defensibility":
        return <DefensibilityStep register={register} errors={errors} />
    }
  }

  return (
    <>
      <ProDiagnoseSuccessTransition visible={showSuccess} />

      <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200">
              <ShieldCheck size={14} />
              Pro-Diagnose Intake
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Business Discovery Baseline</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Complete all four pillars to unlock Central Command. Your inputs persist locally until submission.
            </p>
            {user?.email && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Authenticated as <span className="font-semibold text-slate-700 dark:text-slate-200">{user.email}</span>
              </p>
            )}
          </header>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
            {STEP_META.map((step, index) => {
              const active = index === currentStep
              const done = index < currentStep
              return (
                <div
                  key={step.key}
                  className={cn(
                    "min-w-[140px] flex-1 rounded-2xl border px-4 py-3 transition",
                    active
                      ? "border-blue-600/40 bg-blue-600/10 dark:border-cyan-400/40 dark:bg-cyan-400/10"
                      : done
                        ? "border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-400/30"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50",
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pillar {index + 1}</p>
                  <p className="mt-1 text-sm font-semibold">{step.title}</p>
                </div>
              )
            })}
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-black/30 sm:p-8">
            <FormHeader stepMeta={stepMeta} completion={completion} currentStep={currentStep} />

            <div className="mt-8">{renderStep()}</div>

            {submitError && (
              <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {submitError}
              </p>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={currentStep === 0 || isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={16} /> Back
              </button>

              {currentStep < STEP_META.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                >
                  {isSubmitting ? (
                    <>Running baseline analysis...</>
                  ) : (
                    <>
                      Submit & unlock dashboard <Sparkles size={16} />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Lock size={14} />
              Console locked until Pro-Diagnose submission is complete
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

function FormHeader({
  stepMeta,
  completion,
  currentStep,
}: {
  stepMeta: (typeof STEP_META)[number]
  completion: number
  currentStep: number
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-300">
          Step {currentStep + 1} of {STEP_META.length}
        </p>
        <h2 className="mt-1 text-2xl font-semibold">{stepMeta.title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stepMeta.subtitle}</p>
      </div>
      <span className="w-fit rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        {completion}%
      </span>
    </div>
  )
}
