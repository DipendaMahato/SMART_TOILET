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

// Define the input schema for the chat flow
const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  message: z.string().describe("The user's latest message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Define the output schema for the chat flow
const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Define the chat function that will be called from the server action.
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

// Define the Genkit flow for the chat functionality
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {

    const systemInstruction = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. Your primary goal is to provide helpful and accurate information about health, wellness, and the features of the Smart Toilet application based on the user's questions. You can answer questions about health metrics (like urine pH, hydration, etc.), suggest healthy habits, and explain what different sensor readings might mean in a general, educational context. IMPORTANT: You are an AI assistant, not a medical professional. You must not provide a medical diagnosis, prescribe treatment, or give definitive medical advice. Always include a disclaimer encouraging the user to consult with a real doctor for any health concerns. For example: "Remember, I'm an AI assistant. It's always best to consult with a healthcare professional for medical advice." Be friendly, empathetic, and encouraging in your tone. If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;

    // Reformat history for the generate call
    const generateHistory = history.map(msg => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const { output } = await ai.generate({
      model: geminiPro,
      prompt: [{ text: message }],
      history: generateHistory,
      system: systemInstruction, // Use the system parameter for the instruction
    });

    if (!output || !output.text) {
      throw new Error("The AI returned an empty response.");
    }
    
    return { response: output.text };
  }
);
