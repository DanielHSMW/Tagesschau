import { createClient } from '@/lib/supabase/server'
import AnalysisCard from '@/components/AnalysisCard'
import RefreshButton from '@/components/RefreshButton'
import { VideoWithAnalysis } from '@/types'

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch videos with their analyses
  const { data: videos, error } = await supabase
    .from('videos')
    .select(`
      *,
      analyses (
        *
      )
    `)
    .order('published_at', { ascending: false })
    .limit(10)

  // Map supabase join to expected component format
  const formattedVideos: VideoWithAnalysis[] = (videos || []).map(v => ({
    ...v,
    analyses: Array.isArray(v.analyses) ? v.analyses[0] : v.analyses
  }))

  return (
    <main className="min-h-screen pb-20 relative">
      <div className="container mx-auto px-4 pt-20 pb-16 max-w-4xl">
        <div className="mb-16 text-center space-y-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
            Die <span className="text-gradient bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">Tagesschau</span> <br/>
            KI-Analyse
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Automatisierte politische Medienanalyse der 20-Uhr-Nachrichten. 
            Wir untersuchen Framing, Bildsprache und gesellschaftliche Narrative mit modernster KI.
          </p>
          <div className="pt-4">
            <RefreshButton />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl mb-8 border border-red-500/20 glass-card">
            Fehler beim Laden der Daten: {error.message}
          </div>
        )}

        <div className="space-y-8">
          {formattedVideos.length > 0 ? (
            formattedVideos.map(video => (
              <AnalysisCard key={video.id} data={video} />
            ))
          ) : (
             <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <p className="text-zinc-500 dark:text-zinc-400">
                  Noch keine Analysen vorhanden. Das Backend verarbeitet das neueste Video...
                </p>
             </div>
          )}
        </div>
      </div>
    </main>
  )
}
