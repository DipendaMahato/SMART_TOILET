
import {genkit} from 'genkit';
import { config } from 'dotenv';

config();

// Note: The googleAI plugin has been removed to resolve installation issues.
// Other AI flows like 'generateHealthInsights' may need to be reconfigured
// if you wish to use them.
export const ai = genkit({
  plugins: [
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
