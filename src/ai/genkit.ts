
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Note: dotenv/config is not needed in Next.js as it handles .env files automatically.

export const ai = genkit({
  plugins: [
    googleAI({
        apiKey: "AIzaSyBrJl1i6DGKJy99MHmmH2Aqc66aUV6sjms",
    }),
  ],
});

// Use a performant text model for general purpose use.
export const geminiPro = googleAI.model('gemini-pro');

