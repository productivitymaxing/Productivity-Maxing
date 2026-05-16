import { ConsultingFluidBackground } from "@/components/consulting/ConsultingFluidBackground"

export default function PublicConsultingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="consulting-landing-shell relative min-h-screen text-white">
      <ConsultingFluidBackground />
      <div className="relative">{children}</div>
    </div>
  )
}
