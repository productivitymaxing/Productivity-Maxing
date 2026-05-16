import { redirect } from "next/navigation"
import { CONSOLE_SIGN_IN } from "@/lib/consoleRoutes"

export default function ConsultingSignInRedirect() {
  redirect(CONSOLE_SIGN_IN)
}
