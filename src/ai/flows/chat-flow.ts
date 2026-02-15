'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This version uses a direct fetch call to the OpenRouter API for stability.
 */

import { z } from 'zod';

const API_KEY = 'sk-eeb9c5be46b94055897c4ef5f9eec563'; // User-provided OpenRouter key
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']), // Internally we use 'model', but will map to 'assistant' for API
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history, message } = input;
  
  const systemInstruction = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. Your primary goal is to provide helpful and accurate information about health, wellness, and the features of the Smart Toilet application based on the user's questions. You can answer questions about health metrics (like urine pH, hydration, etc.), suggest healthy habits, and explain what different sensor readings might mean in a general, educational context. IMPORTANT: You are an AI assistant, not a medical professional. You must not provide a medical diagnosis, prescribe treatment, or give definitive medical advice. Always include a disclaimer encouraging the user to consult with a real doctor for any health concerns. For example: "Remember, I'm an AI assistant. It's always best to consult with a healthcare professional for medical advice." Be friendly, empathetic, and encouraging in your tone. If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;
  
  // Map roles: 'model' -> 'assistant' for the OpenRouter/OpenAI compatible API
  const messages = history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      content: h.content,
  }));

  // Add the system instruction and the new user message
  const apiMessages = [
      { role: 'system', content: systemInstruction },
      ...messages,
      { role: 'user', content: message }
  ];

  const payload = {
    model: 'google/gemini-flash-1.5', // A fast and capable model available on OpenRouter
    messages: apiMessages,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // Required header for OpenRouter
        'HTTP-Referer': 'https://smart-toilet-app.com', 
        'X-Title': 'Smart Toilet App',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("OpenRouter API Error:", res.status, errorBody);
      throw new Error(`API request failed with status ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    
    const responseText = data.choices?.[0]?.message?.content;
    
    if (!responseText) {
      console.error("Invalid response structure from OpenRouter API:", data);
      throw new Error('No valid response text from AI model.');
    }
    
    return { response: responseText };

  } catch (e: any) {
    console.error("Fetch to OpenRouter failed:", e);
    // Re-throw the error so it's caught by the server action
    throw new Error(e.message || 'Failed to fetch from OpenRouter');
  }
}
