import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'

type BusinessToolCardProps = {
  title: string
  description: string
  href: string
  active?: boolean
  eyebrow?: string
}

export default function BusinessToolCard({
  title,
  description,
  href,
  active = false,
  eyebrow,
}: BusinessToolCardProps) {
  const content = (
    <div className={active
      ? 'group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700'
      : 'h-full rounded-2xl border border-slate-200 bg-slate-50/80 p-6 opacity-70 dark:border-slate-800 dark:bg-slate-900/50'
    }>
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">{eyebrow}</p>}
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        {active ? (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Open
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Clock size={15} />
            Coming Soon
          </div>
        )}
      </div>
    </div>
  )

  if (!active) {
    return (
      <div aria-disabled="true" className="cursor-not-allowed">
        {content}
      </div>
    )
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  )
}
