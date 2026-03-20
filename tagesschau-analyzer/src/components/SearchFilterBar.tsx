'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'

export default function SearchFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false })
    })
  }

  const handleFilterClick = (filterValue: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (params.get('f') === filterValue) {
      // Toggle off if already active
      params.delete('f')
    } else {
      params.set('f', filterValue)
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false })
    })
  }

  const activeFilter = searchParams.get('f')

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-12 shadow-md">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            {isPending ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Search className="w-5 h-5" />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nach Themen, Personen oder Keywords suchen..."
            className="w-full bg-slate-100/80 dark:bg-slate-900/50 outline-none border border-slate-200/50 dark:border-slate-800/50 py-4 pl-12 pr-4 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold px-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter:</span>
          </div>
          <button
            type="button"
            onClick={() => handleFilterClick('progressive')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === 'progressive' ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
          >
            Nur Progressive
          </button>
          <button
            type="button"
            onClick={() => handleFilterClick('status-quo')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === 'status-quo' ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
          >
            Nur Status-Quo
          </button>
        </div>

        {/* Submit Hidden (Triggers on Enter) */}
        <button type="submit" className="hidden">Suchen</button>
      </form>
    </div>
  )
}
