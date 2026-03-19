export interface YouTubeVideoData {
  videoId: string
  title: string
  publishedAt: string
}

export async function getLatestPlaylistVideo(): Promise<YouTubeVideoData | null> {
  const PLAYLIST_ID = 'PL4A2F331EE86DCC22'
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`

  try {
    const response = await fetch(rssUrl, { next: { revalidate: 0 } })
    if (!response.ok) return null
    
    const xml = await response.text()
    
    // Simple regex parsing for the XML feed to avoid an heavy XML parser dependency
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    const entries = [...xml.matchAll(entryRegex)]
    
    if (entries.length === 0) return null

    // First entry is the latest video
    const latestEntry = entries[0][1]
    
    const videoIdMatch = latestEntry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
    const titleMatch = latestEntry.match(/<title>(.*?)<\/title>/)
    const publishedMatch = latestEntry.match(/<published>(.*?)<\/published>/)

    if (!videoIdMatch || !titleMatch || !publishedMatch) return null

    return {
      videoId: videoIdMatch[1],
      title: titleMatch[1],
      publishedAt: publishedMatch[1],
    }
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error)
    return null
  }
}
