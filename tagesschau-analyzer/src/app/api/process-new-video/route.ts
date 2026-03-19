import { NextResponse } from 'next/server'
import { getLatestPlaylistVideo } from '@/lib/youtube'
import { analyzeTagesschau } from '@/lib/gemini'
import { sendAnalysisEmail } from '@/lib/resend'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60 // Vercel maximum duration for hobby is 10s, pro is 60s/300s. We set to 60s for analysis.

// Create a service role client to bypass RLS for DB operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // 1. Fetch latest video from YouTube Playlist
    const latestVideo = await getLatestPlaylistVideo()
    if (!latestVideo) {
      return NextResponse.json({ message: 'No video found in playlist' }, { status: 404 })
    }

    // 2. Check if this video is already in the database
    const { data: existingVideo } = await supabaseAdmin
      .from('videos')
      .select('id')
      .eq('youtube_id', latestVideo.videoId)
      .single()

    if (existingVideo) {
      return NextResponse.json({ message: 'Video already processed', videoId: latestVideo.videoId })
    }

    // 3. Not in DB -> Insert Video Metadata
    const { data: newVideo, error: videoError } = await supabaseAdmin
      .from('videos')
      .insert({
        youtube_id: latestVideo.videoId,
        title: latestVideo.title,
        published_at: latestVideo.publishedAt
      })
      .select()
      .single()

    if (videoError || !newVideo) {
      throw new Error(`Failed to insert video: ${videoError?.message}`)
    }

    // 4. Run Gemini Video Understanding Analysis
    const analysisResult = await analyzeTagesschau(latestVideo.videoId)

    // 5. Insert Analysis into DB
    const { data: newAnalysis, error: analysisError } = await supabaseAdmin
      .from('analyses')
      .insert({
        video_id: newVideo.id,
        summary: analysisResult.summary,
        visual_description: analysisResult.visual_description,
        left_keypoints: analysisResult.left_keypoints,
        right_keypoints: analysisResult.right_keypoints
      })
      .select()
      .single()

    if (analysisError || !newAnalysis) {
      throw new Error(`Failed to insert analysis: ${analysisError?.message}`)
    }

    // 6. Fetch all subscriber emails
    // A subscriber here is any registered user in auth.users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Failed to fetch users:', usersError.message)
    } else {
      const emailList = users.users
        .map(u => u.email)
        .filter((email): email is string => Boolean(email))
      
      // 7. Send notification emails
      if (emailList.length > 0) {
        await sendAnalysisEmail(emailList, {
          ...newVideo,
          analyses: newAnalysis // matches VideoWithAnalysis format
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Video processed and analyzed successfully',
      video: newVideo.youtube_id
    })

  } catch (error: any) {
    console.error('Process New Video Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
