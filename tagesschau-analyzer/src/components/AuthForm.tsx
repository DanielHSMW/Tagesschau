'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
    } else {
      setStatus('success')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Willkommen</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Melde dich an, um tägliche E-Mail-Analysen der Tagesschau zu erhalten.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            E-Mail-Adresse
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              placeholder="deine.email@beispiel.de"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || status === 'success'}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === 'success' ? (
            'Link gesendet'
          ) : (
            'Magic Link anfordern'
          )}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5" />
          <div className="text-sm text-green-800 dark:text-green-300">
            Wir haben dir einen Magic Link gesendet. Bitte prüfe deinen Posteingang.
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5" />
          <div className="text-sm text-red-800 dark:text-red-300">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  )
}
