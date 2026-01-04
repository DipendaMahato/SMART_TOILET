'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Activity,
  Heart,
  FlaskConical,
  BrainCircuit,
  RadioTower,
  Stethoscope,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const subDashboards = [
  {
    title: 'Live Sensor Data',
    description: 'Real-time IoT sensor readings, device status, and active user detection.',
    icon: RadioTower,
    href: '/dashboard/live-sensor-data',
  },
  {
    title: 'AI Process Tracker',
    description: 'Visualize AI stages: data capture, preprocessing, inference, and validation.',
    icon: BrainCircuit,
    href: '/dashboard/ai-process-tracker',
  },
  {
    title: 'Urine & Stool Diagnostics',
    description: 'Diagnostic dashboards for urine and stool analysis, classifications, and risk indicators.',
    icon: FlaskConical,
    href: '/dashboard/diagnostics',
  },
  {
    title: 'Health Vitals & Trends',
    description: 'Analytical views of health vitals with daily, weekly, and long-term trend graphs.',
    icon: Activity,
    href: '/dashboard/vitals-trends',
  },
  {
    title: 'Overall Health Status',
    description: 'Consolidated summary with AI-derived health scores, conclusions, and risk levels.',
    icon: Heart,
    href: '/dashboard/health-status',
  },
  {
    title: 'Clinical Care & Doctor Support',
    description: 'Clinical support screens with doctor profiles, consultations, and hospital facilities.',
    icon: Stethoscope,
    href: '/dashboard/clinical-care',
  },
];


export function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Health Command Center</h1>
        <p className="text-muted-foreground">
          Select a dashboard below to explore your health data in detail.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subDashboards.map((dashboard) => (
          <Link href={dashboard.href} key={dashboard.title}>
            <Card className="h-full hover:border-primary hover:bg-muted/50 transition-all flex items-center justify-center p-6">
                <CardHeader>
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <dashboard.icon className="h-10 w-10 text-primary" />
                    <CardTitle className="font-headline text-xl">{dashboard.title}</CardTitle>
                  </div>
                </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
