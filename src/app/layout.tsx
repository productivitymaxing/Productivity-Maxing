import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const clashDisplay = localFont({
  src: [
    { path: '../../public/fonts/ClashDisplay-Extralight.otf', weight: '200', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Productivity Maxing - Business Performance Engineering',
  description: 'We Engineer Elite Business Performance. Premium business tools, high performance frameworks, and workflows that scale output.',
  keywords: 'business performance, consulting, optimization, business tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={clashDisplay.variable}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
