
// @ts-nocheck
'use server';

import { config } from 'dotenv';
config();

import { generateHealthInsights } from '@/ai/flows/generate-health-insights';
import { refineInsightsWithReasoning } from '@/ai/flows/refine-insights-with-reasoning';
import { generateOtp } from '@/ai/flows/send-otp-flow';
import { mockMedicalProfile, mockToiletSensorData } from '@/lib/data';
import { z } from 'zod';
import nodemailer from 'nodemailer';

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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const text = `Your Smart Toilet verification code is ${otp}. Please enter this code to securely verify your account. This OTP is valid for 5 minutes. Do not share it with anyone. Dipendra Mahato`;
    const html = `<p>Your Smart Toilet verification code is <b>${otp}</b>. Please enter this code to securely verify your account. This OTP is valid for 5 minutes. Do not share it with anyone.</p><p>Dipendra Mahato</p>`;

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: email,
      subject: 'Your Smart Toilet for Real time Health Monitoring Verification Code',
      text: text,
      html: html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', email);
    return { success: true, otp: otp };

  } catch (error) {
    console.error('Error in sendOtpAction:', error);
    // Return a more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: `Failed to send OTP: ${errorMessage}` };
  }
}
