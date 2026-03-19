import { GoogleGenAI } from '@google/genai'
import { YoutubeTranscript } from 'youtube-transcript'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export interface AnalysisResult {
  summary: string
  visual_description: string
  left_keypoints: string
  right_keypoints: string
}

export async function analyzeTagesschau(youtubeId: string): Promise<AnalysisResult> {
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`
  
  let transcriptText = ""
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeUrl)
    transcriptText = transcript.map(t => t.text).join(" ")
  } catch (error) {
    console.warn("Could not fetch YouTube transcript for", youtubeId, error)
  }

  const prompt = `Analysiere die folgende Tagesschau-Ausgabe (Video URL: ${youtubeUrl}).
${transcriptText ? `Hier ist das Transkript des gesamten Videos:\n"""\n${transcriptText}\n"""\n\n` : `Bitte greife auf dein Wissen über diese Ausgabe zu.\n\n`}
Führe basierend darauf eine dezidierte politische Medienanalyse durch. Wir wollen analysieren, inwiefern die Tagesschau systemverteidigende/status-quo-bewahrende Politik macht.

Gebe die Antwort **zwingend** in exakt diesem JSON-Format zurück:
{
  "summary": "Zusammenfassung: Was sind die Hauptthemen?",
  "visual_description": "Visuelle Beschreibung: Wie werden die Themen bebildert?",
  "left_keypoints": "Einordnung aus einer progressiven, anti-faschistischen, kapitalismuskritischen Perspektive. (Wo fehlt der soziale Kontext? Wo werden marginalisierte Gruppen ignoriert? Wo werden emanzipatorische Ansätze benannt?)",
  "right_keypoints": "Wo wird unkritisch der Status Quo, neoliberale Logik, Law-and-Order-Politik oder konservative Framing-Narrative übernommen?"
}

Wichtig: Die Ausgabe muss parsebares JSON sein, strukturiert gemäß dem oben genannten Format. Keine Backticks (\`\`\`) um den JSON Output.`


  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: {
        systemInstruction: 'Denke an deinen Knowledge-Cut-off: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite-preview',
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    })

    const text = response.text || '{}'
    return JSON.parse(text) as AnalysisResult
  } catch (error) {
    console.error('Error in analyzeTagesschau:', error)
    throw new Error('Gemini API call failed')
  }
}
