import { Resend } from 'resend'
import { VideoWithAnalysis } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAnalysisEmail(emails: string[], data: VideoWithAnalysis) {
  if (!emails.length) return

  const subject = `Tagesschau Analyse: ${data.title}`
  
  const html = `
    <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
      <h1 style="color: #1a1a1a;">📺 Tagesschau KI-Analyse</h1>
      <h2 style="color: #333;">${data.title}</h2>
      <p style="color: #666;">Veröffentlicht: ${new Date(data.published_at).toLocaleString('de-DE')} Uhr</p>
      
      <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin-top: 0;">Zusammenfassung</h3>
        <p style="line-height: 1.6;">${data.analyses.summary.replace(/\n/g, '<br/>')}</p>
      </div>

      <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin-top: 0;">Visuelle Einordnung</h3>
        <p style="line-height: 1.6;">${data.analyses.visual_description.replace(/\n/g, '<br/>')}</p>
      </div>

      <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin-top: 0; color: #991b1b;">Progressive / Linke Perspektive</h3>
        <p style="line-height: 1.6; color: #7f1d1d;">${data.analyses.left_keypoints.replace(/\n/g, '<br/>')}</p>
      </div>

      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-top: 24px;">
        <h3 style="margin-top: 0; color: #1e40af;">Systemverteidigende / Rechte Narrative</h3>
        <p style="line-height: 1.6; color: #1e3a8a;">${data.analyses.right_keypoints.replace(/\n/g, '<br/>')}</p>
      </div>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; text-align: center;">
        <p>Du erhältst diese E-Mail, weil du dich auf Tagesschau-Analyzer registriert hast.</p>
        <p><a href="https://youtube.com/watch?v=${data.youtube_id}">Video auf YouTube ansehen</a></p>
      </div>
    </div>
  `

  // Send emails in batches if there are many, or send to a bcc list to save API calls.
  // Resend allows an array of up to 50 addresses per request.
  const batchSize = 50
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)
    await resend.emails.send({
      from: 'Tagesschau Analyzer <onboarding@resend.dev>', // Replace with your verified domain when going to production
      to: batch,
      subject: subject,
      html: html,
    })
  }
}
