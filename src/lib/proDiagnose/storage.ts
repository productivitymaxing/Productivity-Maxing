import { emptyProDiagnoseForm, type ProDiagnoseFormValues } from "./schema"

const DRAFT_KEY = "bi-max-pro-diagnose-draft"
const STEP_KEY = "bi-max-pro-diagnose-step"

export type ProDiagnoseDraft = {
  form: ProDiagnoseFormValues
  step: number
}

export function loadProDiagnoseDraft(): ProDiagnoseDraft {
  if (typeof window === "undefined") {
    return { form: emptyProDiagnoseForm, step: 0 }
  }

  try {
    const rawForm = window.localStorage.getItem(DRAFT_KEY)
    const rawStep = window.localStorage.getItem(STEP_KEY)
    const form = rawForm ? (JSON.parse(rawForm) as ProDiagnoseFormValues) : emptyProDiagnoseForm
    const step = rawStep ? Math.min(3, Math.max(0, Number(rawStep))) : 0
    return { form: { ...emptyProDiagnoseForm, ...form }, step: Number.isFinite(step) ? step : 0 }
  } catch {
    return { form: emptyProDiagnoseForm, step: 0 }
  }
}

export function saveProDiagnoseDraft(form: ProDiagnoseFormValues, step: number) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  window.localStorage.setItem(STEP_KEY, String(step))
}

export function clearProDiagnoseDraft() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(DRAFT_KEY)
  window.localStorage.removeItem(STEP_KEY)
}
