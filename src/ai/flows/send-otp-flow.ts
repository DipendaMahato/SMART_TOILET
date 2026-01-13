'use server';
/**
 * @fileOverview A flow for generating and sending a One-Time Password (OTP) via email.
 *
 * - sendOtp - A function that generates a 6-digit OTP and sends it to a specified email address.
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as nodemailer from 'nodemailer';

const SendOtpInputSchema = z.object({
  email: z.string().email().describe('The email address to send the OTP to.'),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

const SendOtpOutputSchema = z.object({
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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'Smart Toilet App <smarttoiletapp5@gmail.com>',
      to: email,
      subject: 'Your OTP for Smart Toilet App',
      text: `Your OTP for the Smart Toilet App is ${otp}.

Use this code to verify your account.
Do not share this OTP with anyone.
— Team Smart Toilet

Developed by Dipendra Mahato`,
      html: `<p>Your OTP for the Smart Toilet App is <b>${otp}</b>.</p>
<p>Use this code to verify your account. Do not share this OTP with anyone.</p>
<p>— Team Smart Toilet</p>
<br>
<p>Developed by Dipendra Mahato</p>`,
    };

    await transporter.sendMail(mailOptions);

    return { otp };
  }
);
