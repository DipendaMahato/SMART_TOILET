'use server';

import { config } from 'dotenv';
config();

import { mockMedicalProfile, mockToiletSensorData } from '@/lib/data';
import { generateHealthInsights } from '@/ai/flows/generate-health-insights';
import { refineInsightsWithReasoning } from '@/ai/flows/refine-insights-with-reasoning';
import { sendOtp as sendOtpFlow, SendOtpInput } from '@/ai/flows/send-otp-flow';
import { analyzeDipstick as analyzeDipstickFlow, AnalyzeDipstickInput } from '@/ai/flows/analyze-dipstick-flow';
import { chat as chatFlow } from '@/ai/flows/chat-flow';

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
    const result = await chatFlow({
      history,
      message,
      userProfile,
      healthData,
    });
    return { response: result.response };
  } catch (error: any) {
    console.error("Genkit chatFlow Error:", error);
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
