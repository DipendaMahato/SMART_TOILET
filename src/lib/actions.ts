// @ts-nocheck
'use server';

import { config } from 'dotenv';
config();

import { generateOtp } from '@/ai/flows/send-otp-flow';
import { mockMedicalProfile, mockToiletSensorData } from '@/lib/data';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { generateHealthInsights } from '@/ai/flows/generate-health-insights';
import { refineInsightsWithReasoning } from '@/ai/flows/refine-insights-with-reasoning';

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

export async function sendOtpAction(email: string) {
  try {
    const { otp } = await generateOtp();

    // Use service: 'gmail' for robust, library-managed connection
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Smart Toilet for Real time Health Monitoring" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}`,
      html: `<b>Your verification code is: ${otp}</b>`,
    };
    
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', email);
    return { success: true, otp: otp };

  } catch (error) {
    // Enhanced error logging to capture specific nodemailer errors
    console.error('Detailed Error in sendOtpAction:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to send OTP. Server Error: ${errorMessage}` };
  }
}
