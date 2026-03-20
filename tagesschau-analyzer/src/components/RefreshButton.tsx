'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleRefresh = async () => {
    setIsLoading(true)
    setMessage('Suche nach neuem Video...')
    try {
      const res = await fetch('/api/process-new-video')
      const data = await res.json()
      
      if (res.ok) {
        setMessage(data.message || 'Erfolgreich aktualisiert!')
      } else {
        setMessage(`Fehler: ${data.error || 'Unbekannt'}`)
      }
      
      // Refresh the page data
      setTimeout(() => {
        router.refresh()
        setTimeout(() => setMessage(''), 3000)
      }, 1000)

    } catch (err) {
      setMessage('Netzwerkfehler beim Aktualisieren.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="relative flex items-center space-x-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 dark:hover:bg-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Verarbeite...' : 'Neuestes Video abrufen'}</span>
        </button>
      </div>
      {message && (
        <div className="mt-4 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {message}
          </p>
        </div>
      )}
    </div>
  )
}
