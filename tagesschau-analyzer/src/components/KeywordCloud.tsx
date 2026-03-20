'use client'

import { useMemo } from 'react'

interface KeywordCloudProps {
  analyses: { left_keypoints: string; right_keypoints: string }[]
}

export default function KeywordCloud({ analyses }: KeywordCloudProps) {
  const keywords = useMemo(() => {
    const stopWords = new Set([
      'und', 'der', 'die', 'das', 'ist', 'sind', 'von', 'auf', 'mit', 'den', 'dem', 'einer', 'eine', 'eines', 'zu', 'für', 'des', 'im', 'in', 'an', 'es', 'als', 'auch', 'wird', 'werden', 'war', 'wurde', 'gekommen', 'haben', 'hat', 'dass', 'nicht', 'nach', 'bei', 'aus', 'um', 'über', 'vor', 'durch', 'man', 'nur', 'wenn', 'oder', 'so', 'durch', 'seit', 'bis', 'einen', 'einem', 'ihre', 'ihr', 'ihren', 'unter', 'sich', 'einer', 'diese', 'dieser', 'dieses', 'unser', 'unsere', 'uns', 'wie', 'noch', 'kann', 'können', 'dann', 'her', 'da', 'hier'
    ])

    const allText = analyses.map(a => `${a.left_keypoints} ${a.right_keypoints}`).join(' ')
    const words = allText.toLowerCase().match(/\b(\w+)\b/g) || []
    
    const freqMap: Record<string, number> = {}
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        freqMap[word] = (freqMap[word] || 0) + 1
      }
    })

    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, freq]) => ({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        freq
      }))
  }, [analyses])

  return (
    <div className="glass-card rounded-3xl p-8 mt-12">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Themen-Fokus (Wortwolke)</h3>
      <p className="text-sm text-slate-500 mb-8">
        Häufigste Begriffe aus allen bisherigen KI-Diskursanalysen.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4 py-8">
        {keywords.map(({ word, freq }, i) => {
          const size = Math.min(1.5 + freq * 0.2, 4) // font size range
          const opacity = Math.min(0.4 + freq * 0.1, 1)
          
          return (
            <span 
              key={word}
              className="hover:scale-110 transition-transform cursor-default select-none font-black tracking-tight"
              style={{ 
                fontSize: `${size}rem`,
                opacity: opacity,
                color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#6366f1' : '#8b5cf6',
                textShadow: i % 5 === 0 ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              {word}
            </span>
          )
        })}
      </div>
    </div>
  )
}
