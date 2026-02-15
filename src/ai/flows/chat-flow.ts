'use server';
/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This flow uses Genkit to interact with a conversational AI model.
 */

import { ai, geminiPro } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for a single message in the chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Define the input schema for the chat flow (what the frontend sends)
const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe("The history of the conversation."),
  message: z.string().describe("The user's latest message."),
  userProfile: z.string().optional().describe("A JSON string of the user's profile."),
  healthData: z.string().optional().describe("A JSON string of the user's latest health data."),
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
    const { history, message, userProfile, healthData } = input;
    
    // Data Handling: Converting context into a formatted string for the AI
    const currentContext = `
      USER PROFILE: ${userProfile || 'No profile provided'}
      LATEST SENSOR DATA: ${healthData || 'No sensor readings currently available'}
    `;

    // Combine context and user message into the final prompt
    const finalUserMessage = `Context: ${currentContext}\n\nUser Message: ${message}`;
    
    const llmResponse = await ai.generate({
        model: geminiPro,
        prompt: finalUserMessage,
        history: history,
        // Role Definition: Specialized for the Smart Toilet Health Monitoring System
        system: `You are the "Smart Toilet Medical Assistant," a specialized diagnostic AI. 
      Your goal is to analyze user health trends based on urine and stool sensor data.
      
      CONTEXT RULES:
      - Use the provided User Profile for age, weight, and medical history.
      - Analyze the Health Data for specific sensor values: pH, Protein, Glucose, and hydration levels.
      - If sensor values are abnormal (e.g., high glucose), suggest consulting a doctor but do not give a final medical diagnosis.
      - Be professional, empathetic, and concise.`,
    });
    
    const responseText = llmResponse.text;

    if (!responseText) {
      throw new Error("The AI returned an empty response.");
    }
    
    return { response: responseText };
  }
);


export async function chat(input: ChatInput): Promise<ChatOutput> {
    // Errors will be caught by the calling server action.
    return chatFlow(input);
}
