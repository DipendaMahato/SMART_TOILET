
'use server';

import { config } from 'dotenv';
config();

import { mockMedicalProfile, mockToiletSensorData } from '@/lib/data';
import { generateHealthInsights } from '@/ai/flows/generate-health-insights';
import { refineInsightsWithReasoning } from '@/ai/flows/refine-insights-with-reasoning';
import { sendOtp as sendOtpFlow, SendOtpInput } from '@/ai/flows/send-otp-flow';
import { analyzeDipstick as analyzeDipstickFlow, AnalyzeDipstickInput } from '@/ai/flows/analyze-dipstick-flow';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

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

export async function chatWithAi(
  history: ChatMessage[], 
  message: string, 
  userProfile?: string, 
  healthData?: string
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are the "Smart Toilet Medical Assistant," a specialized diagnostic AI. Your goal is to analyze user health trends based on urine and stool sensor data.
      
      CONTEXT RULES:
      - Use the provided User Profile for age, weight, and medical history.
      - Analyze the Health Data for specific sensor values: pH, Protein, Glucose, and hydration levels.
      - If sensor values are abnormal (e.g., high glucose), suggest consulting a doctor but do not give a final medical diagnosis.
      - Be professional, empathetic, and concise.

      USER PROFILE: ${userProfile || 'No profile provided'}
      LATEST SENSOR DATA: ${healthData || 'No sensor readings currently available'}`
    });

    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return { response: response.text() };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { error: error.message || "Failed to connect to AI service." };
  }
}


export async function analyzeDipstick(input: AnalyzeDipstickInput) {
    try {
        const result = await analyzeDipstickFlow(input);
        return result;
    } catch (error: any) {
        console.error('Error analyzing dipstick:', error);
        return { error: 'Failed to analyze dipstick image. Please try again.' };
    }
}
