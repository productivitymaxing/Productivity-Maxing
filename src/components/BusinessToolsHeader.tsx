import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type BusinessToolsHeaderProps = {
  eyebrow: string
  title: string
  description: string
  backHref?: string
  backLabel?: string
}

export default function BusinessToolsHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel = 'Back to Business Tools',
}: BusinessToolsHeaderProps) {
  return (
    <section className="px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl">
        {backHref && (
          <Link href={backHref} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft size={15} />
            {backLabel}
          </Link>
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">{description}</p>
      </div>
    </section>
  )
}
