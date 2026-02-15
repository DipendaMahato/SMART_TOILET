'use server';
/**
 * @fileOverview An AI flow to analyze a urine dipstick photo.
 *
 * - analyzeDipstick - A function that takes an image of a urine dipstick and returns the health parameters.
 * - AnalyzeDipstickInput - The input type for the analyzeDipstick function.
 * - AnalyzeDipstickOutput - The return type for the analyzeDipstick function.
 * - DipstickResult - The type for a single analysis result item.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const geminiProVision = googleAI.model('gemini-pro-vision');

const AnalyzeDipstickInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a urine dipstick, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDipstickInput = z.infer<typeof AnalyzeDipstickInputSchema>;

const DipstickResultSchema = z.object({
    parameter: z.string().describe('The name of the parameter being measured, e.g., "Leukocytes", "Nitrite", "Protein", "pH", "Blood", "Specific Gravity", "Ketone", "Bilirubin", "Glucose", "Urobilinogen".'),
    value: z.string().describe('The measured value from the dipstick pad, e.g., "Negative", "Trace", "7.0", "1.015", "Normal".'),
    status: z.enum(["Normal", "Needs Attention", "Abnormal"]).describe('The status of the parameter based on its value.'),
});
export type DipstickResult = z.infer<typeof DipstickResultSchema>;

const AnalyzeDipstickOutputSchema = z.object({
  results: z.array(DipstickResultSchema).describe('An array of analysis results for each parameter on the dipstick.'),
});
export type AnalyzeDipstickOutput = z.infer<typeof AnalyzeDipstickOutputSchema>;

export async function analyzeDipstick(input: AnalyzeDipstickInput): Promise<AnalyzeDipstickOutput> {
  return analyzeDipstickFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDipstickPrompt',
  model: geminiProVision,
  input: {schema: AnalyzeDipstickInputSchema},
  output: {schema: AnalyzeDipstickOutputSchema},
  prompt: `You are a medical lab AI expert specializing in analyzing urine dipstick test results from images.

Your task is to analyze the provided image of the urine dipstick.

1.  **Examine the Image**: Carefully look at the dipstick in the photo.
2.  **Identify Parameters**: For each parameter pad (Leukocytes, Nitrite, Urobilinogen, Protein, pH, Blood, Specific Gravity, Ketone, Bilirubin, Glucose), identify the resulting color.
3.  **Determine Value**: Compare the color to a standard medical reference chart to determine the value.
4.  **Classify Status**: Based on the value, classify the status as "Normal", "Needs Attention", or "Abnormal".
5.  **Handle Bad Images**: If the image is unclear, blurry, or not a valid dipstick, you must still return a result, but use the value "Invalid Image" for each parameter and the status "Abnormal".
6.  **Format Output**: You MUST return the results as a valid JSON object that strictly follows the provided output schema. Ensure all fields are present for all 10 parameters.

Analyze the following image:
Dipstick Photo: {{media url=imageDataUri}}`,
});

const analyzeDipstickFlow = ai.defineFlow(
  {
    name: 'analyzeDipstickFlow',
    inputSchema: AnalyzeDipstickInputSchema,
    outputSchema: AnalyzeDipstickOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Analysis failed to produce an output.');
    }
    return output;
  }
);
