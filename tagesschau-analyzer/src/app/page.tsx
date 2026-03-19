import { createClient } from '@/lib/supabase/server'
import AnalysisCard from '@/components/AnalysisCard'
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
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Die <span className="text-blue-600">Tagesschau</span> KI-Analyse
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Automatisierte politische Medienanalyse der 20-Uhr-Nachrichten. 
            Wir untersuchen Framing, Bildsprache und gesellschaftliche Narrative.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-8 border border-red-200">
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
