import { YoutubeTranscript } from 'youtube-transcript';

async function logTranscript() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('GtP11ZdZj2Q');
    const text = transcript.map(t => t.text).join(" ");
    console.log("Substring of transcript:");
    console.log(text.substring(0, 1000));
  } catch (error) {
    console.error("Failed:", error);
  }
}

logTranscript();
