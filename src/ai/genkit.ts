import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openai} from 'genkit/plugins/openai';
import { config } from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    openai({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    }),
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
