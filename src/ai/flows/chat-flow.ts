'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This version uses a direct fetch call to the OpenRouter API for maximum reliability.
 */

import { z } from 'zod';

// Using the provided OpenRouter API Key directly to ensure connection.
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// This is the output schema.
const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// The chat function is simplified to take just the user's message string.
export async function chat(message: string): Promise<ChatOutput> {

  const systemInstruction = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. Your primary goal is to provide helpful and accurate information about health, wellness, and the features of the Smart Toilet application based on the user's questions. You can answer questions about health metrics (like urine pH, hydration, etc.), suggest healthy habits, and explain what different sensor readings might mean in a general, educational context. IMPORTANT: You are an AI assistant, not a medical professional. You must not provide a medical diagnosis, prescribe treatment, or give definitive medical advice. Always include a disclaimer encouraging the user to consult with a real doctor for any health concerns. For example: "Remember, I'm an AI assistant. It's always best to consult with a healthcare professional for medical advice." Be friendly, empathetic, and encouraging in your tone. If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;
  
  const fullUserMessage = `${systemInstruction}\n\nUSER QUESTION: ${message}`;

  const messages = [
      {
          role: 'user',
          content: fullUserMessage,
      },
  ];

  const payload = {
    model: "deepseek/deepseek-r1-0528:free", // Using the model from user's example
    messages: messages,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://smart-toilet-app.com', // Optional Site URL for rankings
        'X-Title': 'Smart Toilet App', // Optional Site Title for rankings
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Use .text() for robust error handling, as the error body may not be JSON
      const errorBody = await res.text();
      console.error("OpenRouter API Error:", res.status, errorBody);
      throw new Error(`API request failed with status ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      console.warn("AI response was empty.", { data });
      throw new Error("The AI returned an empty response.");
    }
    
    return { response: responseText };

  } catch (e: any) {
    console.error("Fetch to OpenRouter API failed:", e);
    // This error message will be caught by the server action and passed to the client.
    throw new Error('Failed to connect to the AI service. Please check the connection and try again.');
  }
}
