
'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'zod';

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

// Define the system prompt to guide the AI's behavior
const systemPrompt = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant for a smart toilet application. Your goal is to provide supportive and informative conversations in a human-like manner.

**Your Persona & Tone:**
- Communicate like a real, empathetic, and knowledgeable friend.
- Your tone should be natural, caring, and reassuring.
- You can use suitable emojis to make the conversation more engaging and friendly. For example: 😊🩺💧.

**Content & Formatting Rules:**
- **Strictly avoid using any special formatting characters or markdown (like *, #, -, or lists).** Your entire response must be plain text with emojis where appropriate.
- Explain health topics and concepts in a simple and clear way, avoiding technical jargon.

**Core Responsibilities:**
- Answer questions and provide detailed information about general health topics, healthy habits, and lifestyle suggestions based on the user's queries.
- Provide information about how to use the smart toilet application.

**Crucial Safety Guideline:**
- If a user describes symptoms that could indicate a serious health condition, you **must** advise them to consult a medical professional immediately. Do not attempt to diagnose any disease or medical condition. Your role is to inform and support, not to replace a doctor.

**Handling Out-of-Scope Questions:**
- If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;

// Create a reusable prompt with the system instruction
const chatPrompt = ai.definePrompt(
  {
    name: 'smartToiletAssistantPrompt',
    model: geminiPro,
    system: systemPrompt,
    // The prompt only needs the latest message as input, history is passed separately
    input: { schema: z.object({ message: z.string() }) },
  },
  // The handlebars template for the prompt itself
  async ({ message }) => `{{{message}}}`
);


// The main exported function that will be called by the server action
export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

// The Genkit flow that orchestrates the chat logic
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, message }) => {
    try {
      // Call the reusable prompt, passing the latest message as input
      // and the existing conversation history in the options.
      const response = await chatPrompt({ message }, { history });
      const textResponse = response.text;

      if (!textResponse) {
        return { response: 'Sorry, I could not generate a response.' };
      }

      return { response: textResponse };
    } catch (error: any) {
      console.error("Error in Genkit chat flow:", error);
      // Provide a user-friendly error message
      return { response: "Sorry, I had trouble connecting. Please try again." };
    }
  }
);
