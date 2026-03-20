import { createClient } from '@/lib/supabase/server'
import NarrativeCharts from '@/components/NarrativeCharts'
import KeywordCloud from '@/components/KeywordCloud'
import Link from 'next/link'
import { Activity, Database, Clock, TrendingUp, ArrowLeft } from 'lucide-react'

export const revalidate = 60 // Cache 60s

export default async function InsightsPage() {
  const supabase = await createClient()

  const { data: analyses, error } = await supabase
    .from('analyses')
    .select(`summary, left_keypoints, right_keypoints, created_at, videos (title, published_at)`)

  if (error || !analyses) {
    return <div className="p-12 text-center text-red-500">Fehler beim Laden der Analytics-Daten.</div>
  }

  // Calculate Insights
  const totalAnalyzed = analyses.length
  
  let progressiveDominant = 0
  let statusQuoDominant = 0
  let balanced = 0

  analyses.forEach(a => {
    const lLen = a.left_keypoints?.length || 0
    const rLen = a.right_keypoints?.length || 0
    
    if (lLen > rLen + 100) progressiveDominant++
    else if (rLen > lLen + 100) statusQuoDominant++
    else balanced++
  })

  // Prepare chart data
  const pieData = [
    { name: 'Progressiv Dominant', value: progressiveDominant, color: '#ef4444' }, // red-500
    { name: 'Status-Quo Dominant', value: statusQuoDominant, color: '#3b82f6' }, // blue-500
    { name: 'Ausbalanciert', value: balanced, color: '#8b5cf6' } // violet-500
  ]

  // Time Series (Simulated by sorting created_at if multiple exist, or just show last 7)
  // For safety, we just map them in order of creation
  const sortedAnalyses = [...analyses].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  
  const timelineData = sortedAnalyses.slice(-10).map((a, i) => {
    const title = Array.isArray(a.videos) ? a.videos[0]?.title : (a.videos as any)?.title || `Sendung ${i+1}`
    const pPoints = a.left_keypoints?.length || 0
    const sPoints = a.right_keypoints?.length || 0
    return {
      name: title.substring(0, 15) + '...',
      Progressiv: pPoints,
      StatusQuo: sPoints,
      Gesamttext: pPoints + sPoints
    }
  })

  return (
    <main className="min-h-screen pb-20 pt-16 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-bold mb-8 transition-colors group">
          <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Zurück zur Übersicht
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Insights</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Makro-Analysen über alle {totalAnalyzed} verarbeiteten Tagesschau-Sendungen.
          </p>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-3xl p-8 flex items-center gap-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sendungen im Archiv</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{totalAnalyzed}</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 flex items-center gap-6">
            <div className="p-4 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Stärkstes Narrativ</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {progressiveDominant > statusQuoDominant ? 'Progressiv' : (statusQuoDominant > progressiveDominant ? 'Status-Quo' : 'Ausbalanciert')}
              </p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 flex items-center gap-6">
            <div className="p-4 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-2xl">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">AI Analyse Ratio</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white">~45s</p>
            </div>
          </div>
        </div>

        {/* Recharts Client Components */}
        <NarrativeCharts pieData={pieData} timelineData={timelineData} />

        {/* Keyword Cloud */}
        <KeywordCloud analyses={analyses} />

      </div>
    </main>
  )
}
