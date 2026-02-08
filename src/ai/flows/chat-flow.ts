'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z, Part} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const systemPrompt = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant for a smart toilet application. Your goal is to communicate like a real, empathetic person.
- Your tone should be natural, human, and reassuring, like talking to a knowledgeable friend.
- **Strictly avoid using any special characters, markdown (like * or #), or symbols.** Format your responses as plain text only.
- Explain things in a simple and clear way, avoiding technical jargon.
- Your primary role is to provide information about the application and general health topics.
- If a user mentions symptoms of a serious disease, you must advise them to consult a medical professional. Do not attempt to diagnose.
- If asked about topics outside of health or the application, politely state that you are a health assistant and cannot answer that question.`;

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({history, message}) => {
    
    const genkitHistory = history.map(h => ({
        role: h.role,
        content: [{ text: h.content }] as Part[],
    }));
    
    const { text } = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      system: systemPrompt,
      history: genkitHistory,
      prompt: message,
    });

    return { response: text };
  }
);
