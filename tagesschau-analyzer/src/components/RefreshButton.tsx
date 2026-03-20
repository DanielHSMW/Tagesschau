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
    <div className="flex flex-col items-center mt-6">
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'Verarbeite...' : 'Neuestes Video abrufen'}</span>
      </button>
      {message && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>
      )}
    </div>
  )
}
