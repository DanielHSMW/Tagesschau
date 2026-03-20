import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, Activity } from 'lucide-react'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b-0 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tighter text-slate-900 dark:text-white">
            Tagesschau<span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-500">.Analyzer</span>
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/insights" className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
              <Activity className="w-5 h-5 group-hover:hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 hidden group-hover:block"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            Insights & Daten
          </Link>
          {user ? (
            <div className="flex items-center space-x-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button type="submit" className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 px-6 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Anmelden
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
