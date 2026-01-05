import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { config } from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    googleAI({
        apiKey: process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
