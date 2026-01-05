'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-health-insights.ts';
import '@/ai/flows/refine-insights-with-reasoning.ts';
import '@/ai/flows/send-otp-flow.ts';
import '@/ai/flows/chat-flow.ts';
