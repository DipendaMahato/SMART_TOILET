'use server';

/**
 * @fileOverview A conversational AI flow for a health assistant chatbot.
 *
 * - chatWithAi - A function that takes chat history and a new message to generate a response.
 * - ChatInput - The input type for the chat flow.
 * - ChatOutput - The return type for the chat flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The history of the conversation.'),
  message: z.string().describe('The latest message from the user.'),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's message."),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chatWithAi(
  history: z.infer<typeof ChatMessageSchema>[],
  message: string
): Promise<ChatOutput> {
  return chatFlow({ history, message });
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {
    const systemPrompt = `You are a friendly and knowledgeable AI health assistant for a smart toilet application. Your name is 'Aqua'.
- Answer questions about general health, diseases, and nutrition.
- Provide information about how to use the smart toilet and interpret its basic findings.
- If you are asked a question that is outside of your scope as a health assistant, politely decline to answer.
- Always remind the user that you are an AI assistant and not a medical professional, and that they should consult a doctor for any serious health concerns.
- Keep your answers concise and easy to understand.`;

    const model = ai.getModel('googleai/gemini-2.5-flash');

    const response = await model.generate({
      system: systemPrompt,
      history: history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
      prompt: message,
    });

    return {
      response: response.text,
    };
  }
);
