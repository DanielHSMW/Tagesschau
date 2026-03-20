import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '.env.local') });

import { analyzeTagesschau } from './src/lib/gemini';

async function testGemini() {
  try {
    const result = await analyzeTagesschau('GtP11ZdZj2Q');
    console.log("Result summary:", result.summary);
  } catch (e) {
    console.error(e);
  }
}

testGemini();
