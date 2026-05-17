/**
 * Theme-locked fluid blue mesh background for the public consulting landing.
 * Uses fixed colors only — no dark: variants — so light/dark mode cannot alter it.
 */
export function ConsultingFluidBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="consulting-fluid-base absolute inset-0"
        style={{
          backgroundColor: "#000b29",
          backgroundImage: [
            "radial-gradient(circle at 0% 0%, rgba(0, 92, 255, 0.9) 0%, transparent 55%)",
            "radial-gradient(circle at 100% 0%, rgba(0, 72, 255, 0.85) 0%, transparent 55%)",
            "radial-gradient(circle at 10% 100%, rgba(0, 180, 255, 0.9) 0%, transparent 55%)",
            "radial-gradient(circle at 90% 100%, rgba(0, 120, 255, 0.8) 0%, transparent 55%)",
            "radial-gradient(ellipse at center, #0020b8 0%, #000b29 70%, #00040f 100%)",
          ].join(", "),
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)",
        }}
      />
    </div>
  )
}
