'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 * This version uses a direct fetch call to the Google Gemini API for maximum reliability.
 */

import { z } from 'zod';

// Using the provided Google API Key directly to ensure connection.
const API_KEY = 'AIzaSyB4depNCthSUD2i493vjyODABeFNmDiMrQ';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history } = input;

  const systemInstruction = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant. Your primary goal is to provide helpful and accurate information about health, wellness, and the features of the Smart Toilet application based on the user's questions. You can answer questions about health metrics (like urine pH, hydration, etc.), suggest healthy habits, and explain what different sensor readings might mean in a general, educational context. IMPORTANT: You are an AI assistant, not a medical professional. You must not provide a medical diagnosis, prescribe treatment, or give definitive medical advice. Always include a disclaimer encouraging the user to consult with a real doctor for any health concerns. For example: "Remember, I'm an AI assistant. It's always best to consult with a healthcare professional for medical advice." Be friendly, empathetic, and encouraging in your tone. If asked about topics that are not related to health, wellness, or the application, politely decline by saying something like, "I'm a health assistant, so I can't help with that, but I'm here for any health questions you have! 😊"`;

  // The Gemini API requires conversation history to start with a 'user' role
  // and alternate between 'user' and 'model'.
  const processedHistory = [...history];

  // 1. Find the first user message to inject the system prompt.
  const firstUserIndex = processedHistory.findIndex(msg => msg.role === 'user');

  if (firstUserIndex !== -1) {
    // 2. Prepend system instruction to the first user message.
    processedHistory[firstUserIndex].content = `${systemInstruction}\n\n${processedHistory[firstUserIndex].content}`;
  } else {
    // If there's no user message, we can't make a valid API call.
    console.error("Chat flow called without any user messages in history.");
    return { response: "I need a question to respond. Please ask me something." };
  }

  // 3. Ensure the history starts with a user message.
  const validStartIndex = processedHistory.findIndex(msg => msg.role === 'user');
  let finalHistory = validStartIndex !== -1 ? processedHistory.slice(validStartIndex) : [];
  
  // 4. Ensure roles alternate correctly.
  finalHistory = finalHistory.reduce((acc, current) => {
    if (acc.length === 0 || acc[acc.length - 1].role !== current.role) {
      acc.push(current);
    }
    return acc;
  }, [] as ChatMessage[]);


  const contents = finalHistory.map(h => ({
    role: h.role,
    parts: [{ text: h.content }],
  }));

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
      throw new Error(`API request failed with status ${res.status}: ${JSON.stringify(errorBody.error?.message || errorBody)}`);
    }

    const data = await res.json();

    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        const blockReason = data.promptFeedback?.blockReason;
        const safetyRatings = data.promptFeedback?.safetyRatings;
        console.warn("AI response was blocked or empty.", { blockReason, safetyRatings });
        let errorMessage = "My response was blocked. This might be due to safety filters.";
        if (blockReason) {
            errorMessage += ` Reason: ${blockReason}.`;
        } else if (data.candidates && data.candidates[0]?.finishReason) {
            errorMessage += ` Finish reason: ${data.candidates[0].finishReason}.`
        }
        return { response: errorMessage };
    }
    
    const responseText = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.error("Invalid response structure from Google Gemini API:", data);
      throw new Error('No valid response text from AI model.');
    }
    
    return { response: responseText };

  } catch (e: any) {
    console.error("Fetch to Google Gemini API failed:", e);
    throw new Error(e.message || 'Failed to fetch from Google Gemini API');
  }
}
