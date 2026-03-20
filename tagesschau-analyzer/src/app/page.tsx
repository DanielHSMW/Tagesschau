import { createClient } from '@/lib/supabase/server'
import AnalysisCard from '@/components/AnalysisCard'
import RefreshButton from '@/components/RefreshButton'
import { VideoWithAnalysis } from '@/types'

import { Suspense } from 'react'

import NewsTicker from '@/components/NewsTicker'

export const revalidate = 60 // Revalidate cache every 60 seconds

// Skeleton Loader Component
function VideoFeedSkeleton() {
  return (
    <div className="space-y-12 w-full animate-pulse">
      <div className="glass-card rounded-3xl p-8 space-y-8">
        <div className="flex items-start justify-between mb-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3 mb-8"></div>
        
        <div className="space-y-4">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full"></div>
        </div>
      </div>
    </div>
  )
}

function NewsTickerSkeleton() {
  return (
    <div className="glass-card rounded-3xl h-full min-h-[300px] w-full animate-pulse p-6 space-y-6">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2 mb-8"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-3 pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-1/4"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-full"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6"></div>
        </div>
      ))}
    </div>
  )
}

// Data Fetching Component
async function VideoFeed() {
  const supabase = await createClient()
  
  const { data: videos, error } = await supabase
    .from('videos')
    .select(`*, analyses (*)`)
    .order('published_at', { ascending: false })
    .limit(10)

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl mb-8 border border-red-500/20 glass-card">
        Fehler beim Laden der Daten: {error.message}
      </div>
    )
  }

  const formattedVideos: VideoWithAnalysis[] = (videos || []).map(v => ({
    ...v,
    analyses: Array.isArray(v.analyses) ? v.analyses[0] : v.analyses
  }))

  if (formattedVideos.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-3xl">
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
          Noch keine Analysen vorhanden. Lade das neueste Video herunter!
        </p>
      </div>
    )
  }

  const neuesteVideo = formattedVideos[0]
  const archiveVideos = formattedVideos.slice(1)

  return (
    <div className="space-y-16">
      {/* Top Section: Ticker + Neueste Analyse */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Sidebar: News Ticker */}
        <div className="lg:col-span-4 xl:col-span-3 hidden md:block">
          <Suspense fallback={<NewsTickerSkeleton />}>
            <NewsTicker />
          </Suspense>
        </div>
        
        {/* Right Area: Neueste Analyse */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pl-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">Neueste Sendung</h2>
          </div>
          <AnalysisCard data={neuesteVideo} />
        </div>
      </section>

      {/* Bottom Section: Archiv (Full Width) */}
      {archiveVideos.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6 pl-2">
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vergangene Analysen</h2>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90 hover:opacity-100 transition-opacity">
            {archiveVideos.map(video => (
              <AnalysisCard key={video.id} data={video} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen pb-20 relative">
      <div className="container mx-auto px-4 pt-16 pb-16 max-w-[1400px]">
        
        {/* Hero Section */}
        <div className="mb-20 text-center space-y-8 relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
            <span className="text-gradient bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400">Tagesschau</span>
            <br />
            Analyzer
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Automatisierte politische Medienanalyse der 20-Uhr-Nachrichten. 
            Wir untersuchen Framing, Bildsprache und gesellschaftliche Narrative mit modernster KI.
          </p>
          <div className="pt-4">
            <RefreshButton />
          </div>
        </div>

        {/* Main Content Area */}
        <Suspense fallback={<VideoFeedSkeleton />}>
          <VideoFeed />
        </Suspense>

      </div>
    </main>
  )
}
