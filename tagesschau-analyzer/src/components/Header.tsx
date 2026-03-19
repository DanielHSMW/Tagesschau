import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut } from 'lucide-react'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
          Tagesschau<span className="text-blue-600">.Analyzer</span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button type="submit" className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Anmelden
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
