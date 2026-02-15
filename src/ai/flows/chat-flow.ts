
'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant using OpenRouter.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

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

// Hardcoding the API key to ensure it is available and to bypass any environment variable loading issues.
const OPENROUTER_API_KEY = "sk-eeb9c5be46b94055897c4ef5f9eec563";


// The main exported function that will be called by the server action
export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history, message } = input;

  const messagesForApi = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-flash-1.5",
        "messages": messagesForApi
      })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter API Error:", response.status, errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid response structure from OpenRouter:", data);
        throw new Error("Received an invalid response from the AI service.");
    }
    
    const aiMessage = data.choices[0].message.content;

    if (!aiMessage) {
        return { response: 'Sorry, I could not generate a response.' };
    }

    return { response: aiMessage };

  } catch (error: any) {
    console.error("Error connecting to OpenRouter:", error);
    // Provide a user-friendly error message
    return { response: "Sorry, I had trouble connecting. Please try again." };
  }
}
