'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This version uses a direct fetch call to the Google Generative AI API.
 */

import { z } from 'zod';

// IMPORTANT: Using a hardcoded API key for stability.
const API_KEY = 'AIzaSyBrJl1i6DGKJy99MHmmH2Aqc66aUV6sjms';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
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

// The main exported function that will be called by the server action
export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history, message } = input;
  
  const systemInstruction = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. Your primary goal is to provide helpful and accurate information about health, wellness, and the features of the Smart Toilet application based on the user's questions. You can answer questions about health metrics (like urine pH, hydration, etc.), suggest healthy habits, and explain what different sensor readings might mean in a general, educational context. IMPORTANT: You are an AI assistant, not a medical professional. You must never provide a medical diagnosis, prescribe treatment, or give definitive medical advice. Always include a disclaimer encouraging the user to consult with a real doctor for any health concerns. For example: "Remember, I'm an AI assistant. It's always best to consult with a healthcare professional for medical advice." Be friendly, empathetic, and encouraging in your tone. If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;

  // Gemini requires a structured conversational history.
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.content }],
  }));

  // Add the new user message to the history
  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });
  
  const payload = {
    contents: contents,
    systemInstruction: {
      parts: [{
        text: systemInstruction
      }]
    },
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
        },
    ],
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Google AI API Error:", errorBody);
    // The error from the API is often the most useful for debugging.
    throw new Error(`API request failed: ${errorBody?.error?.message || res.statusText}`);
  }

  const data = await res.json();
  
  // Handle cases where the model response might be blocked by safety settings
  if (!data.candidates || data.candidates.length === 0) {
    const blockReason = data.promptFeedback?.blockReason;
    if (blockReason) {
        return { response: `I am unable to respond to that request as it was blocked for the following reason: ${blockReason}.` };
    }
    throw new Error('No candidates returned from AI model and no block reason provided.');
  }
  
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!responseText) {
    console.error("Invalid response structure from Google AI API:", data);
    throw new Error('No valid response text from AI model.');
  }
  
  return { response: responseText };
}
