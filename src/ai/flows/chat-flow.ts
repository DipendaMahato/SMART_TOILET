'use server';
/**
 * @fileOverview A conversational AI flow for the Smart Toilet assistant.
 *
 * - chat - A function that takes chat history and a new message and returns the AI's response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { googleAI } from '@genkit-ai/google-genai';

// Use the gemini-pro-vision model, which is known to work in this environment.
const geminiProVision = googleAI.model('gemini-pro-vision');

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The history of the conversation.'),
  message: z.string().describe('The latest user message.'),
  userProfile: z.string().optional().describe('JSON string of the user\'s profile data.'),
  healthData: z.string().optional().describe('JSON string of the user\'s latest health data.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI model\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  model: geminiProVision, // Use the vision model which can also process text-only prompts.
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  system: `You are the "Smart Toilet Medical Assistant," a specialized diagnostic AI. Your goal is to analyze user health trends based on urine and stool sensor data.
      
      CONTEXT RULES:
      - Use the provided User Profile for age, weight, and medical history.
      - Analyze the Health Data for specific sensor values: pH, Protein, Glucose, and hydration levels.
      - If sensor values are abnormal (e.g., high glucose), suggest consulting a doctor but do not give a final medical diagnosis.
      - Be professional, empathetic, and concise.

      USER PROFILE: {{{userProfile}}}
      LATEST SENSOR DATA: {{{healthData}}}`,
  prompt: `{{#each history}}
{{role}}: {{content}}
{{/each}}
user: {{message}}
model: `,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const promptInput = {
        ...input,
        userProfile: input.userProfile || 'No profile provided.',
        healthData: input.healthData || 'No sensor readings currently available.',
    };

    const {output} = await prompt(promptInput);
    if (!output) {
      throw new Error('Chat flow failed to produce an output.');
    }
    return output;
  }
);
