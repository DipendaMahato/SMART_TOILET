'use server';
/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This flow uses Genkit to interact with a conversational AI model.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
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

// Use a reliable text-only model from the googleAI plugin
const textModel = googleAI.model('gemini-pro');

// Define the Genkit flow for the chat functionality
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history, message, userProfile, healthData } = input;
    
    // Combine all instructions and context into a single prompt for the current turn.
    // This is a robust way to provide context to the model for conversational chat.
    const fullPrompt = `You are the "Smart Toilet Medical Assistant," a specialized diagnostic AI. 
      Your goal is to analyze user health trends based on urine and stool sensor data.
      
      CONTEXT RULES:
      - Use the provided User Profile for age, weight, and medical history.
      - Analyze the Health Data for specific sensor values: pH, Protein, Glucose, and hydration levels.
      - If sensor values are abnormal (e.g., high glucose), suggest consulting a doctor but do not give a final medical diagnosis.
      - Be professional, empathetic, and concise.

      USER PROFILE: ${userProfile || 'No profile provided'}
      LATEST SENSOR DATA: ${healthData || 'No sensor readings currently available'}

      Now, please respond to the following user message:
      User Message: "${message}"`;
    
    const llmResponse = await ai.generate({
        model: textModel,
        prompt: fullPrompt, // The prompt contains the system instruction, context, and user message for this turn
        history: history, // The history contains previous turns of the conversation
    });
    
    const responseText = llmResponse.text;

    if (!responseText) {
      throw new Error("The AI returned an empty response.");
    }
    
    return { response: responseText };
  }
);


// This is the exported function that the server action will call.
export async function chat(input: ChatInput): Promise<ChatOutput> {
    // Errors will be caught by the calling server action.
    return chatFlow(input);
}
