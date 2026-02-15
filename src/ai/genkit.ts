
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Note: dotenv/config is not needed in Next.js as it handles .env files automatically.

export const ai = genkit({
  plugins: [
    googleAI({apiKey: "AIzaSyA33EygILpeWqgw9LdQBzNNOAysoSmcX9M"}),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Use a more stable and widely available model to prevent access issues.
export const geminiPro = googleAI.model('gemini-1.5-flash-latest');
