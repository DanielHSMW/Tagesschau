'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function RefreshButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsLoading(true)
    const toastId = toast.loading('Suche nach neuem Video...')
    
    try {
      const res = await fetch('/api/process-new-video')
      const data = await res.json()
      
      if (res.ok) {
        if (data.message === 'Video already processed') {
          toast.info('Die neuste Tagesschau wurde bereits verarbeitet!', { id: toastId })
        } else {
          toast.success(data.message || 'Erfolgreich aktualisiert!', { id: toastId })
          setTimeout(() => {
            router.refresh()
          }, 1000)
        }
      } else {
        toast.error(`Fehler: ${data.error || 'Unbekannt'}`, { id: toastId })
      }
    } catch (err) {
      toast.error('Netzwerkfehler beim Aktualisieren.', { id: toastId })
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
    </div>
  )
}
