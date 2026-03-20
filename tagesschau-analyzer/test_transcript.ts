import { YoutubeTranscript } from 'youtube-transcript';

async function testTranscript() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript('GtP11ZdZj2Q');
    console.log("Success! Character count:", transcript.map(t => t.text).join(" ").length);
  } catch (error) {
    console.error("Failed:", error);
  }
}

testTranscript();
