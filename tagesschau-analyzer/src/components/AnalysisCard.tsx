'use client'

import { useState } from 'react'
import { VideoWithAnalysis } from '@/types'
import { ChevronDown, Calendar, Youtube, Link as LinkIcon, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export default function AnalysisCard({ data }: { data: VideoWithAnalysis }) {
  const [isLeftOpen, setIsLeftOpen] = useState(false)
  const [isRightOpen, setIsRightOpen] = useState(false)

  const analysis = data.analyses

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight pr-4">
            {data.title}
          </h3>
          <a 
            href={`https://youtube.com/watch?v=${data.youtube_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 text-sm rounded-full transition-colors flex-shrink-0"
            title="Auf YouTube ansehen"
          >
            <Youtube className="w-6 h-6" />
          </a>
        </div>
        
        <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 mb-6 space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(data.published_at), 'dd. MMMM yyyy, HH:mm', { locale: de })} Uhr</span>
        </div>

        {analysis ? (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Zusammenfassung</h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {analysis.summary}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Visuelle Einordnung</h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {analysis.visual_description}
              </p>
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
              {/* Left Keypoints Accordion */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setIsLeftOpen(!isLeftOpen)}
                  className="w-full flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/40 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2 font-semibold text-red-900 dark:text-red-400">
                    <LinkIcon className="w-4 h-4" />
                    <span>Progressive / Linke Perspektive</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-red-700 dark:text-red-500 transition-transform ${isLeftOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLeftOpen && (
                  <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {analysis.left_keypoints}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Keypoints Accordion */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setIsRightOpen(!isRightOpen)}
                  className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/40 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2 font-semibold text-blue-900 dark:text-blue-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Systemverteidigende / Rechte Narrative</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-blue-700 dark:text-blue-500 transition-transform ${isRightOpen ? 'rotate-180' : ''}`} />
                </button>
                {isRightOpen && (
                  <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {analysis.right_keypoints}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
           <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-zinc-500 dark:text-zinc-400 text-sm text-center">
             Analyse läuft oder noch nicht verfügbar...
           </div>
        )}
      </div>
    </div>
  )
}
