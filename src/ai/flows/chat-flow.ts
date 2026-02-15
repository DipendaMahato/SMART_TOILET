'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This version uses a direct fetch call to the Google Gemini API for maximum reliability.
 */

import { z } from 'zod';

// Using the provided Google API Key directly to ensure connection.
const API_KEY = 'AIzaSyB4depNCthSUD2i493vjyODABeFNmDiMrQ';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

// This is the output schema, which remains the same.
const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// The chat function is simplified to take just the user's message string.
export async function chat(message: string): Promise<ChatOutput> {

  const systemInstruction = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. Your primary goal is to provide helpful and accurate information about health, wellness, and the features of the Smart Toilet application based on the user's questions. You can answer questions about health metrics (like urine pH, hydration, etc.), suggest healthy habits, and explain what different sensor readings might mean in a general, educational context. IMPORTANT: You are an AI assistant, not a medical professional. You must not provide a medical diagnosis, prescribe treatment, or give definitive medical advice. Always include a disclaimer encouraging the user to consult with a real doctor for any health concerns. For example: "Remember, I'm an AI assistant. It's always best to consult with a healthcare professional for medical advice." Be friendly, empathetic, and encouraging in your tone. If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\n${message}` }],
    }
  ];

  const safetySettings = [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  ];
  
  const generationConfig = {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
  };

  const payload = {
    contents,
    safetySettings,
    generationConfig,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error("Google Gemini API Error:", res.status, errorBody);
      throw new Error(`API request failed with status ${res.status}: ${errorBody.error?.message || JSON.stringify(errorBody)}`);
    }

    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      const blockReason = data.promptFeedback?.blockReason;
      const finishReason = data.candidates?.[0]?.finishReason;
      console.warn("AI response was blocked or empty.", { blockReason, finishReason });
      let errorMessage = "My response was blocked or empty.";
      if (blockReason) errorMessage += ` Reason: ${blockReason}.`;
      if (finishReason) errorMessage += ` Finish reason: ${finishReason}.`;
      throw new Error(errorMessage);
    }
    
    return { response: responseText };

  } catch (e: any) {
    console.error("Fetch to Google Gemini API failed:", e);
    throw new Error(e.message || 'Failed to fetch from Google Gemini API');
  }
}
