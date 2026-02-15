
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

// Use a model that is confirmed to work in other parts of the application.
export const geminiPro = googleAI.model('gemini-pro-vision');
