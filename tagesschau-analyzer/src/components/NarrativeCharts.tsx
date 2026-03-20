'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

interface ChartProps {
  pieData: { name: string; value: number; color: string }[];
  timelineData: any[];
}

export default function NarrativeCharts({ pieData, timelineData }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Narrative Distribution Pie Chart */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Narrativ-Dominanz (Gesamt)</h3>
        <p className="text-sm text-slate-500 mb-8">
          Basierend auf der Textmenge der extrahierten Keypoints der KI.
        </p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                stroke="transparent"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Bar Chart */}
      <div className="glass-card rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Verlauf der letzten Sendungen</h3>
        <p className="text-sm text-slate-500 mb-8">
          Textvolumen nach politischer Perspektive in Zeichen.
        </p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(51, 65, 85, 0.1)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Progressiv" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              <Bar dataKey="StatusQuo" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
