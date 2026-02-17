'use server';
/**
 * @fileOverview A conversational AI flow for the Smart Toilet assistant.
 *
 * - chat - A function that handles a conversational turn.
 * - ChatInput - The input type for the chat function.
 * - ChatMessage - The type for a single message in the history.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const geminiProModel = googleAI.model('gemini-3-pro-preview');

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
  userProfile: z.string().optional().describe('JSON string of the user\'s profile.'),
  healthData: z.string().optional().describe('JSON string of the user\'s latest health data.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { history, message, userProfile, healthData } = input;
    
    // Convert the simple history to the format expected by ai.generate
    const augmentedHistory = history.map(h => ({
        role: h.role,
        content: [{ text: h.content }]
    }));

    const response = await ai.generate({
      model: geminiProModel,
      prompt: message,
      history: augmentedHistory,
      system: `You are the "Smart Toilet Medical Assistant," a specialized diagnostic AI. Your goal is to analyze user health trends based on urine and stool sensor data.
      
      CONTEXT RULES:
      - Use the provided User Profile for age, weight, and medical history.
      - Analyze the Health Data for specific sensor values: pH, Protein, Glucose, and hydration levels.
      - If sensor values are abnormal (e.g., high glucose), suggest consulting a doctor but do not give a final medical diagnosis.
      - Be professional, empathetic, and concise.

      USER PROFILE: ${userProfile || 'No profile provided.'}
      LATEST SENSOR DATA: ${healthData || 'No sensor readings currently available.'}`,
      config: {
        maxOutputTokens: 8192,
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ]
      }
    });

    return response.text;
  }
);
