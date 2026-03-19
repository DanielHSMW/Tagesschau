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
    <html lang="de" className="antialiased">
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  )
}
