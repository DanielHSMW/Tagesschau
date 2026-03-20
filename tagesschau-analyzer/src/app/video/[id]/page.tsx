import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Calendar, AlertTriangle, Link as LinkIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export default async function VideoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: video, error } = await supabase
    .from('videos')
    .select(`*, analyses (*)`)
    .eq('id', params.id)
    .single()

  if (error || !video || !video.analyses || (Array.isArray(video.analyses) && video.analyses.length === 0)) {
    notFound()
  }

  const analysis = Array.isArray(video.analyses) ? video.analyses[0] : video.analyses

  return (
    <main className="min-h-screen pb-20 pt-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-bold mb-8 transition-colors group">
          <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Zurück zur Übersicht
        </Link>

        {/* Hero Entry with YouTube Embed */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl mb-12 border border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
          <div className="aspect-video w-full bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6 text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800/60 w-fit px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
              <Calendar className="w-5 h-5" />
              <span>{format(new Date(video.published_at), 'dd. MMMM yyyy, HH:mm', { locale: de })} Uhr</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-12">
              {video.title}
            </h1>

            <div className="space-y-12">
              {/* Summary Block */}
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  Executive Summary
                </h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  {analysis.summary}
                </p>
              </div>

              {/* Visuals Block */}
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
                  <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                  Visuelle Einordnung & Framing
                </h3>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  {analysis.visual_description}
                </p>
              </div>

              {/* Split Keypoints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800/50">
                
                {/* Progressive Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-2xl shadow-md font-bold text-lg">
                     <LinkIcon className="w-6 h-6" />
                     Progressive Narrative
                  </div>
                  <div className="p-6 bg-red-50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-900/30 h-full">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {analysis.left_keypoints}
                    </p>
                  </div>
                </div>

                {/* Status-Quo Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-2xl shadow-md font-bold text-lg">
                     <AlertTriangle className="w-6 h-6" />
                     Systemverteidigende Narrative
                  </div>
                  <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-900/30 h-full">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {analysis.right_keypoints}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
