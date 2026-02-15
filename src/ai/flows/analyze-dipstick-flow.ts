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
import { geminiPro } from '@/ai/genkit';

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
  model: geminiPro,
  input: {schema: AnalyzeDipstickInputSchema},
  output: {schema: AnalyzeDipstickOutputSchema},
  prompt: `You are an expert at analyzing urine dipstick test results from an image.
  Analyze the provided image of the urine dipstick against a standard color chart.
  For each parameter pad on the dipstick (Leukocytes, Nitrite, Urobilinogen, Protein, pH, Blood, Specific Gravity, Ketone, Bilirubin, Glucose), identify the resulting color and determine its corresponding value.
  Classify each result's status as "Normal", "Needs Attention", or "Abnormal" based on standard medical reference ranges.
  Return the results as a structured array of objects.

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
