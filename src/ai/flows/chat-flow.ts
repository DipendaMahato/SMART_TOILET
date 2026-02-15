'use server';
/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This flow uses Genkit to interact with a conversational AI model.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for a single message in the chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Define the input schema for the chat flow (what the frontend sends)
// This is temporarily simplified to debug the connection issue.
const ChatInputSchema = z.object({
  message: z.string().describe("The user's latest message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


// Define the output schema for the chat flow
const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


// Define the Genkit flow for the chat functionality
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    // Using ai.generate directly for maximum simplicity to debug the connection.
    // This will confirm if the basic model and API key are working.
    const result = await ai.generate({
        model: geminiPro,
        prompt: `You are a helpful assistant. Answer the following question: ${input.message}`,
    });
    
    const responseText = result.text;
    if (!responseText) {
      throw new Error("The AI returned an empty response.");
    }
    
    return { response: responseText };
  }
);


// Define the chat function that will be called from the server action.
// The input signature is kept the same to avoid breaking the calling action,
// but we will only use the 'message' property for this debugging step.
export async function chat(input: { history: any[], message: string, userProfile?: string, healthData?: string }): Promise<ChatOutput> {
  return chatFlow({ message: input.message });
}
