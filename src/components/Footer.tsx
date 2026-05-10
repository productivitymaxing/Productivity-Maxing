import Link from 'next/link'
import { Mail, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Productivity Maxing</h3>
            <p className="text-slate-600 dark:text-slate-400">Engineering elite business performance.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link href="/business-tools" className="hover:text-slate-900 dark:hover:text-white transition">Business Tools</Link></li>
              <li><Link href="/consulting" className="hover:text-slate-900 dark:hover:text-white transition">Consulting</Link></li>
              <li><a href="#newsletter" className="hover:text-slate-900 dark:hover:text-white transition">Newsletter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition">About</Link></li>
              <li>
                <a href="mailto:info@productivitymaxing.com" className="inline-flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition">
                  <Mail size={14} />
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition">Terms</Link></li>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck size={14} />
                Security-first
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Productivity Maxing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
