'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { geminiPro } from '@/ai/genkit';

// Define the shape of a single message for chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

// Define the input for the main chat function
const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Define the output of the main chat function
const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history, message } = input;
    
    // For debugging, we are simplifying the prompt to a basic string.
    // This helps isolate if the connection issue is related to the complex prompt structure.
    const simplePrompt = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. The user is asking: "${message}". Please provide a helpful and concise response.`;

    const generateResponse = await ai.generate({
        model: geminiPro,
        prompt: simplePrompt,
    });

    const responseText = generateResponse.text;

    return { response: responseText };
  }
);


// The main exported function that will be called by the server action
export async function chat(input: ChatInput): Promise<ChatOutput> {
  try {
    const result = await chatFlow(input);
    if (!result.response) {
      throw new Error('No response from AI model.');
    }
    return { response: result.response };
  } catch (error: any) {
    console.error("Error in AI chat flow:", error);
    return { response: "Sorry, I had trouble connecting. Please try again." };
  }
}
