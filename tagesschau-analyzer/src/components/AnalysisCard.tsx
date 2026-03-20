'use client'

import { useState } from 'react'
import { VideoWithAnalysis } from '@/types'
import { ChevronDown, Calendar, Youtube, Link as LinkIcon, AlertTriangle, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { de } from 'date-fns/locale'

export default function AnalysisCard({ data, filter }: { data: VideoWithAnalysis; filter?: string }) {
  const [isLeftOpen, setIsLeftOpen] = useState(filter === 'progressive')
  const [isRightOpen, setIsRightOpen] = useState(filter === 'status-quo')

  const analysis = data.analyses

  return (
    <div className="glass-card rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group">
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {data.title}
          </h3>
          <a 
            href={`https://youtube.com/watch?v=${data.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white p-3 rounded-2xl transition-all duration-300 flex-shrink-0 shadow-sm"
            title="Auf YouTube ansehen"
          >
            <Youtube className="w-6 h-6" />
          </a>
        </div>
        
        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 space-x-2 bg-slate-100 dark:bg-slate-800/50 w-fit px-3 py-1.5 rounded-full">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(data.published_at), 'dd. MMMM yyyy, HH:mm', { locale: de })} Uhr</span>
        </div>

        {analysis ? (
          <div className="space-y-8">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                Zusammenfassung
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {analysis.summary}
              </p>
            </div>
            
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                Visuelle Einordnung
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {analysis.visual_description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-4">
              {/* Left Keypoints Accordion */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-red-200 dark:border-red-900/30">
                <button 
                  onClick={() => setIsLeftOpen(!isLeftOpen)}
                  className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-red-600 to-rose-500 text-white hover:opacity-90 transition-opacity text-left"
                >
                  <div className="flex items-center space-x-3 font-bold text-lg">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <span>Progressive / Linke Perspektive</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-white transition-transform duration-500 ${isLeftOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isLeftOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden bg-white dark:bg-slate-900">
                    <div className="p-6">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {analysis.left_keypoints}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Keypoints Accordion */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-blue-200 dark:border-blue-900/30">
                <button 
                  onClick={() => setIsRightOpen(!isRightOpen)}
                  className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-700 to-indigo-600 text-white hover:opacity-90 transition-opacity text-left"
                >
                  <div className="flex items-center space-x-3 font-bold text-lg">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <span>Systemverteidigende / Rechte Narrative</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-white transition-transform duration-500 ${isRightOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isRightOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden bg-white dark:bg-slate-900">
                    <div className="p-6">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {analysis.right_keypoints}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deep-Dive Button */}
            <div className="pt-4 flex justify-end">
              <Link href={`/video/${data.id}`} className="group relative flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black tracking-wide overflow-hidden shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all outline-none focus:ring-4 ring-slate-500/30">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Vollständige Analyse lesen</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
           <div className="p-8 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
             <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium">
               <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               Analyse läuft oder noch nicht verfügbar...
             </div>
           </div>
        )}
      </div>
    </div>
  )
}
