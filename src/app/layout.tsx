import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MotoGear - Premium Motorcycle Equipment',
    template: '%s | MotoGear'
  },
  description: 'Premium motorcycle helmets, jackets, gloves, boots and accessories. Shop the best gear for your ride with expert reviews and fast shipping.',
  keywords: ['motorcycle', 'helmet', 'jacket', 'gloves', 'boots', 'gear', 'accessories', 'riding', 'safety'],
  authors: [{ name: 'MotoGear Store' }],
  creator: 'MotoGear Store',
  publisher: 'MotoGear Store',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'MotoGear - Premium Motorcycle Equipment',
    description: 'Premium motorcycle helmets, jackets, gloves, boots and accessories. Shop the best gear for your ride with expert reviews and fast shipping.',
    siteName: 'MotoGear',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MotoGear - Premium Motorcycle Equipment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MotoGear - Premium Motorcycle Equipment',
    description: 'Premium motorcycle helmets, jackets, gloves, boots and accessories. Shop the best gear for your ride with expert reviews and fast shipping.',
    images: ['/og-image.jpg'],
    creator: '@motogear',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Providers>
          <div id="root">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}