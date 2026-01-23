
'use server';

import { config } from 'dotenv';
config();

import { headers } from 'next/headers';
import { mockMedicalProfile, mockToiletSensorData } from '@/lib/data';
import { generateHealthInsights } from '@/ai/flows/generate-health-insights';
import { refineInsightsWithReasoning } from '@/ai/flows/refine-insights-with-reasoning';
import { sendOtp as sendOtpFlow, SendOtpInput } from '@/ai/flows/send-otp-flow';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAiInsights() {
  await sleep(1500); // Simulate network latency

  try {
    const medicalProfileString = JSON.stringify(mockMedicalProfile, null, 2);
    const sensorDataString = JSON.stringify(mockToiletSensorData, null, 2);

    const initialResult = await generateHealthInsights({
      medicalProfileData: medicalProfileString,
      toiletSensorData: sensorDataString,
    });

    if (!initialResult.insights) {
      throw new Error("Initial insight generation failed.");
    }

    const finalResult = await refineInsightsWithReasoning({
      initialInsights: initialResult.insights,
      userProfile: medicalProfileString,
      healthData: sensorDataString,
    });
    
    return { 
      insights: finalResult.refinedInsights, 
      reasoning: initialResult.reasoning,
    };

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return { error: 'Failed to generate insights. Please try again later.' };
  }
}

export async function sendOtp(input: SendOtpInput) {
    try {
        const result = await sendOtpFlow(input);
        return { otp: result.otp };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { error: 'Failed to send OTP. Please check the email address and try again.' };
    }
}

export async function chatWithAi(history: { role: 'user' | 'model'; content: string }[], message: string) {
    const headersList = headers();
    const referer = headersList.get('referer') || "https://smarttoilet.netlify.app/";
    
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        defaultHeaders: {
            "HTTP-Referer": referer,
            "X-Title": "Smart Toilet Health Assistant",
        },
    });

    try {
        const systemPrompt = `You are 'Smart Toilet Assistance', a friendly and knowledgeable AI health assistant for a smart toilet application. Your goal is to communicate like a real, empathetic person.
- Your tone should be natural, human, and reassuring, like talking to a knowledgeable friend.
- **Strictly avoid using any special characters, markdown (like * or #), or symbols.** Format your responses as plain text only.
- Explain things in a simple and clear way, avoiding technical jargon.
- Your primary role is to provide information about the application and general health topics.
- If a user mentions symptoms of a serious disease, you must advise them to consult a medical professional. Do not attempt to diagnose.
- If asked about topics outside of health or the application, politely state that you are a health assistant and cannot answer that question.`;

        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.content,
            })),
            { role: 'user', content: message },
        ];

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528:free",
            messages: messages,
        });

        const response = completion.choices[0].message?.content;
        
        if (!response) {
            throw new Error('No response from AI model.');
        }

        return { response };
    } catch (error) {
        console.error('Error in AI chat:', error);
        return { error: 'Sorry, I encountered an error. Please try again.' };
    }
}
