
'use server';

/**
 * @fileOverview A conversational AI flow for the Smart Toilet Assistant.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema.omit({ role: true }).extend({ role: z.enum(['user', 'model']) })),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


const systemPrompt = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant for a smart toilet application. Your goal is to communicate like a real, empathetic person.
- Your tone should be natural, human, and reassuring, like talking to a knowledgeable friend.
- **Strictly avoid using any special characters, markdown (like * or #), or symbols.** Format your responses as plain text only.
- Explain things in a simple and clear way, avoiding technical jargon.
- Your primary role is to provide information about the application and general health topics.
- If a user mentions symptoms of a serious disease, you must advise them to consult a medical professional. Do not attempt to diagnose.
- If asked about topics outside of health or the application, politely state that you are a health assistant and cannot answer that question.`;


export async function chat(input: ChatInput): Promise<ChatOutput> {
  const { history, message } = input;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://studio.firebase.google.com/",
        "X-Title": "Smart Toilet App",
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": messages
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenRouter API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response content from AI model.");
    }

    return { response: aiResponse };

  } catch (error) {
    console.error("Error in chat flow:", error);
    // Return a user-friendly error in the expected output format
    return { response: "Sorry, I had trouble connecting. Please try again." };
  }
}
