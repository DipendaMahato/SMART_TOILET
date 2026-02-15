
'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant using the Google AI SDK.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */
import { z } from 'zod';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content } from "@google/genai";

// Schema definitions remain the same
const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

// Get API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

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

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];


export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history, message } = input;

  if (!API_KEY) {
      console.error("GEMINI_API_KEY environment variable not set.");
      return { response: "Sorry, the AI service is not configured correctly. Please contact support." };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        systemInstruction: systemPrompt,
    });
      
    // Format the history for the Google AI SDK
    const formattedHistory: Content[] = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }],
    }));

    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: formattedHistory,
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("No response content from AI model.");
    }

    return { response: responseText };

  } catch (error) {
    console.error("Error in chat flow with Google AI SDK:", error);
    if (error instanceof Error && error.message.includes('API key')) {
        return { response: "Sorry, there's an issue with the API key configuration. Please contact support." };
    }
    return { response: "Sorry, I had trouble connecting. Please try again." };
  }
}
