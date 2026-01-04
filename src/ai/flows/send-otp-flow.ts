'use server';
/**
 * @fileOverview A flow for generating and sending a One-Time Password (OTP) to a user's email.
 *
 * - sendOtp - A function that generates an OTP and sends it via email.
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const SendOtpInputSchema = z.object({
  email: z.string().email().describe('The email address to send the OTP to.'),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

const SendOtpOutputSchema = z.object({
  success: z.boolean().describe('Whether the OTP was sent successfully.'),
  otp: z.string().length(6).describe('The 6-digit OTP that was sent.'),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const text = `Your Smart Toilet verification code is ${otp}. Please enter this code to securely verify your account. This OTP is valid for 5 minutes. Do not share it with anyone.\n\nDipendra Mahato`;
    const html = `<p>Your Smart Toilet verification code is <b>${otp}</b>.</p><p>Please enter this code to securely verify your account. This OTP is valid for 5 minutes. Do not share it with anyone.</p><p>Dipendra Mahato</p>`;

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: email,
      subject: 'Your TotoHealth Verification Code',
      text: text,
      html: html,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent to:', email);
      return { success: true, otp };
    } catch (error) {
      console.error('Error sending OTP email:', error);
      // In a real app, you might not want to expose the OTP in the error case
      // For this prototype, we return it for easier testing.
      return { success: false, otp }; 
    }
  }
);
