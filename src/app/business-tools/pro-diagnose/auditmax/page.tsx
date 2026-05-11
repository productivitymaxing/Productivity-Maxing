import BusinessToolsHeader from '@/components/BusinessToolsHeader'
import MaxAuditEngine from '@/components/MaxAuditEngine'

export default function AuditMaxPage() {
  return (
    <main className="pb-20">
      <BusinessToolsHeader
        eyebrow="AuditMax"
        title="Operational audit engine for diagnosing workflow friction and revenue leakage."
        description="Connect your operational view, surface dead zones, and quantify the cost of friction across the systems that run the business."
        backHref="/business-tools/pro-diagnose"
        backLabel="Back to Pro-Diagnose"
      />

      <section className="px-4 py-12 sm:py-16">
        <MaxAuditEngine />
      </section>
    </main>
  )
}
