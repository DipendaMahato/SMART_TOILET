
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized health insights based on user medical profile data and real-time health data from a smart toilet.
 *
 * - generateHealthInsights - A function that takes user medical profile data and smart toilet sensor data to generate personalized health insights.
 * - GenerateHealthInsightsInput - The input type for the generateHealthInsights function.
 * - GenerateHealthInsightsOutput - The return type for the generateHealthInsights function.
 */

import {ai, openRouterModel} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHealthInsightsInputSchema = z.object({
  medicalProfileData: z
    .string()
    .describe('User medical profile data including gender, blood group, height, weight, and DOB.'),
  toiletSensorData: z
    .string()
    .describe('Real-time health data collected from the smart toilet sensors.'),
});

export type GenerateHealthInsightsInput = z.infer<typeof GenerateHealthInsightsInputSchema>;

const GenerateHealthInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized health insights and advice.'),
  reasoning: z.string().describe('The reasoning behind the health insights.'),
});

export type GenerateHealthInsightsOutput = z.infer<typeof GenerateHealthInsightsOutputSchema>;

export async function generateHealthInsights(
  input: GenerateHealthInsightsInput
): Promise<GenerateHealthInsightsOutput> {
  return generateHealthInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHealthInsightsPrompt',
  model: openRouterModel,
  input: {schema: GenerateHealthInsightsInputSchema},
  output: {schema: GenerateHealthInsightsOutputSchema},
  prompt: `You are an AI health assistant specializing in generating personalized health insights.

You will analyze the user's medical profile data and real-time health data from the smart toilet sensors to generate personalized health insights and advice.

Medical Profile Data: {{{medicalProfileData}}}
Toilet Sensor Data: {{{toiletSensorData}}}

Based on the data, provide insights into the user's current health status and offer advice for improvement.  Reason if a particular result from the toilet or health habit is important enough to include in your conclusions.  These insights would then form the foundation of more specific plans, should they be appropriate. For example, an abnormally high test of some biomarker in urine could indicate dehydration or more serious things like kidney disease, kidney stones, a urinary tract infection (UTI).  Explain your reasoning in the reasoning section of the output. Output both the insights and the reasoning.  Make sure the insights are actionable.
`,
});

const generateHealthInsightsFlow = ai.defineFlow(
  {
    name: 'generateHealthInsightsFlow',
    inputSchema: GenerateHealthInsightsInputSchema,
    outputSchema: GenerateHealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
