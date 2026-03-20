import Parser from 'rss-parser'

const parser = new Parser()

export default async function NewsTicker() {
  let items: any[] = []
  
  try {
    const feed = await parser.parseURL('https://www.tagesschau.de/xml/rss2/')
    // Take the top 10 news items
    items = feed.items.slice(0, 10)
  } catch (error) {
    console.error('Failed to fetch Tagesschau RSS:', error)
  }

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-6 text-center text-slate-500">
        Nachrichten konnten nicht geladen werden.
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col relative w-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm bg-white/40 dark:bg-slate-900/40">
      <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
          <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Tagesschau News</h3>
        </div>
      </div>
      
      {/* 
        The scrolling container needs a fixed max height and hidden overflow.
        We duplicate the items array so the CSS marquee loops seamlessly.
      */}
      <div className="relative flex-1 overflow-hidden marquee-container h-[400px] md:h-[500px]">
        {/* Top/Bottom gradient fade masks to make scrolling look premium */}
        <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-white dark:from-slate-950 to-transparent z-10 pointer-events-none opacity-80"></div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent z-10 pointer-events-none opacity-80"></div>

        <div className="animate-marquee-vertical flex flex-col">
          {[...items, ...items].map((item, index) => (
            <a 
              key={`${item.guid || index}-${index}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 border-b border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800/80 transition-colors group"
            >
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 format-date">
                {new Date(item.pubDate).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {item.contentSnippet || item.content}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
