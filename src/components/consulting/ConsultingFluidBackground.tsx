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
          backgroundColor: "#010818",
          backgroundImage: [
            "radial-gradient(ellipse 90% 70% at 8% 88%, rgba(0, 196, 255, 0.72) 0%, transparent 52%)",
            "radial-gradient(ellipse 75% 55% at 2% 35%, rgba(0, 102, 255, 0.85) 0%, transparent 48%)",
            "radial-gradient(ellipse 65% 50% at 78% 18%, rgba(0, 55, 180, 0.65) 0%, transparent 50%)",
            "radial-gradient(ellipse 55% 45% at 92% 72%, rgba(0, 80, 255, 0.55) 0%, transparent 48%)",
            "radial-gradient(ellipse 50% 40% at 48% 58%, rgba(0, 18, 80, 0.9) 0%, transparent 55%)",
            "linear-gradient(145deg, #000c2e 0%, #001a5c 28%, #002878 52%, #001040 78%, #000818 100%)",
          ].join(", "),
        }}
      />

      <div
        className="absolute -left-[12%] top-[2%] h-[58vh] w-[62vw] rounded-full opacity-80 blur-[110px]"
        style={{ background: "radial-gradient(circle, #0088ff 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-[8%] -left-[6%] h-[52vh] w-[48vw] rounded-full opacity-90 blur-[120px]"
        style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 68%)" }}
      />
      <div
        className="absolute right-[-8%] top-[8%] h-[45vh] w-[42vw] rounded-full opacity-70 blur-[100px]"
        style={{ background: "radial-gradient(circle, #0044cc 0%, transparent 72%)" }}
      />
      <div
        className="absolute bottom-[18%] right-[12%] h-[38vh] w-[36vw] rounded-full opacity-60 blur-[95px]"
        style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-soft-light"
        style={{
          backgroundImage: "url(/images/consulting-fluid-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(0, 8, 32, 0.55) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 20, 60, 0.35) 0%, transparent 50%)",
        }}
      />
    </div>
  )
}
