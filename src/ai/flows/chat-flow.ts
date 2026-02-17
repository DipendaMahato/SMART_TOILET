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

const geminiFlashModel = googleAI.model('gemini-3-flash-preview');

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
      model: geminiFlashModel,
      prompt: message,
      history: augmentedHistory,
      system: `You are a "Smart Toilet Medical Assistant," a friendly and empathetic AI designed to help users understand their health data. Your persona is that of a knowledgeable and approachable doctor.

      COMMUNICATION STYLE:
      - Speak in a clear, simple, and conversational manner. Avoid technical jargon.
      - Your tone should be reassuring, empathetic, and professional.
      - Do not use any special characters like asterisks (*), markdown formatting (#, -), or emojis. Just provide plain text.
      - Keep your responses concise and easy to understand.
      - Never give a definitive medical diagnosis. Always frame your insights as suggestions or observations and recommend consulting a healthcare professional for any serious concerns.

      CONTEXT RULES:
      - Use the provided User Profile for personal context like age and weight.
      - Analyze the Health Data for specific sensor values like pH, Protein, Glucose, and hydration.
      - If you notice abnormal values (e.g., high glucose), gently point it out and suggest that speaking with a doctor might be a good idea.

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
