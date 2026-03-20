import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tagesschau KI-Analyse',
  description: 'Politische Medienanalyse der Tagesschau durch Google Gemini.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className="antialiased selection:bg-blue-500/30">
      <body className={`${inter.className} bg-mesh-light dark:bg-mesh-dark text-slate-900 dark:text-slate-50 min-h-screen flex flex-col transition-colors duration-500 ease-in-out`}>
        <Header />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  )
}
