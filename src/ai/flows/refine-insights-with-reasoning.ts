'use server';

/**
 * @fileOverview Refines initial health insights with a reasoning tool to assess the importance of individual health metrics and habits.
 *
 * - refineInsightsWithReasoning - A function that takes initial health insights and user profile data, uses AI to reason about the importance of each insight, and returns refined, actionable insights.
 * - RefineInsightsInput - The input type for the refineInsightsWithReasoning function.
 * - RefineInsightsOutput - The return type for the refineInsightsWithReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineInsightsInputSchema = z.object({
  initialInsights: z.string().describe('The initial health insights generated from the user profile and health data.'),
  userProfile: z.string().describe('The user profile data, including medical details and preferences.'),
  healthData: z.string().describe('The health data streamed from the toilet sensors.'),
});
export type RefineInsightsInput = z.infer<typeof RefineInsightsInputSchema>;

const RefineInsightsOutputSchema = z.object({
  refinedInsights: z.string().describe('The refined health insights, evaluated for importance and relevance.'),
});
export type RefineInsightsOutput = z.infer<typeof RefineInsightsOutputSchema>;

export async function refineInsightsWithReasoning(input: RefineInsightsInput): Promise<RefineInsightsOutput> {
  return refineInsightsWithReasoningFlow(input);
}

const reasoningTool = ai.defineTool({
  name: 'assessInsightImportance',
  description: 'Assesses the importance and relevance of a given health insight based on user profile data and health data trends.',
  inputSchema: z.object({
    insight: z.string().describe('The health insight to be assessed.'),
    userProfile: z.string().describe('The user profile data for context.'),
    healthData: z.string().describe('The user health data for context.'),
  }),
  outputSchema: z.boolean().describe('Whether the insight is deemed important and relevant (true) or not (false).'),
}, async (input) => {
  // Placeholder implementation for the reasoning tool.  This would contain actual logic.
  // that uses the insight, userProfile, and healthData to make a judgement about
  // the importance of the insight.
  // For now, we just return true to indicate that the insight is important.
  return true; // Assume all insights are important for now
});

const refineInsightsPrompt = ai.definePrompt({
  name: 'refineInsightsPrompt',
  model: 'google/gemini-1.5-flash-latest',
  tools: [reasoningTool],
  input: {schema: RefineInsightsInputSchema},
  output: {schema: RefineInsightsOutputSchema},
  prompt: `You are an AI health assistant that refines health insights based on their importance and relevance.

  You will receive initial health insights, user profile data, and health data streamed from toilet sensors.

  Your task is to use the assessInsightImportance tool to determine if each insight is important and relevant to the user's health.
  Only include insights that are deemed important by the tool in the refined insights.

  Initial Insights: {{{initialInsights}}}
  User Profile: {{{userProfile}}}
  Health Data: {{{healthData}}}

  Refined Insights:`, // Prompt should ask for a concise summary of relevant insights
});

const refineInsightsWithReasoningFlow = ai.defineFlow(
  {
    name: 'refineInsightsWithReasoningFlow',
    inputSchema: RefineInsightsInputSchema,
    outputSchema: RefineInsightsOutputSchema,
  },
  async input => {
    const {output} = await refineInsightsPrompt(input);
    return {
      refinedInsights: output?.refinedInsights || 'No relevant insights found.',
    };
  }
);
