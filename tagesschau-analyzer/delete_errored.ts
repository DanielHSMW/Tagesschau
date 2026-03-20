import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://zlbktsdoqehmqdblslmv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYmt0c2RvcWVobXFkYmxzbG12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkxNjI4OSwiZXhwIjoyMDg5NDkyMjg5fQ.lRjbU8Pc0CeD-I8QmVLSaXO2h4yE6Sp5gT6scnCuJHU'
);

async function deleteErroredVideo() {
  const { data, error } = await supabaseAdmin
    .from('videos')
    .delete()
    .eq('youtube_id', '3z_PKF6Svwk');
  
  if (error) {
    console.error("Error deleting:", error);
  } else {
    console.log("Deleted video 3z_PKF6Svwk from DB so it can be re-processed.");
  }
}

deleteErroredVideo();
