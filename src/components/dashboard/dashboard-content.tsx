
'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Activity,
  Heart,
  FlaskConical,
  BrainCircuit,
  RadioTower,
  Stethoscope,
  ArrowRight,
  Bot,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const subDashboards = [
  {
    title: 'Live Sensor Data',
    description: 'Real-time IoT sensor readings and device status.',
    icon: RadioTower,
    href: '/dashboard/live-sensor-data',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-cyan-400/20',
  },
  {
    title: 'AI Process Tracker',
    description: 'Visualize AI stages from data capture to insights.',
    icon: BrainCircuit,
    href: '/dashboard/ai-process-tracker',
    borderColor: 'border-purple-400',
    shadowColor: 'shadow-purple-400/20',
  },
  {
    title: 'Urine & Stool Diagnostics',
    description: 'Analysis, classifications, and risk indicators.',
    icon: FlaskConical,
    href: '/dashboard/diagnostics',
    borderColor: 'border-teal-400',
    shadowColor: 'shadow-teal-400/20',
  },
  {
    title: 'Health Vitals & Trends',
    description: 'Daily, weekly, and long-term trend graphs.',
    icon: Activity,
    href: '/dashboard/vitals-trends',
    borderColor: 'border-green-400',
    shadowColor: 'shadow-green-400/20',
  },
  {
    title: 'Overall Health Status',
    description: 'AI-derived health scores and conclusions.',
    icon: Heart,
    href: '/dashboard/health-status',
    borderColor: 'border-blue-400',
    shadowColor: 'shadow-blue-400/20',
  },
  {
    title: 'Clinical Care & Doctor Support',
    description: 'Doctor profiles, consultations, and facilities.',
    icon: Stethoscope,
    href: '/dashboard/clinical-care',
    borderColor: 'border-red-400',
    shadowColor: 'shadow-red-400/20',
  },
];


export function DashboardContent() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div style={{ animationDelay: '200ms', animationFillMode: 'backwards' }} className="animate-slide-up">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Select a dashboard below to explore your health data in detail.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subDashboards.map((dashboard, index) => (
          <Link href={dashboard.href} key={dashboard.title} className="group" style={{ animationDelay: `${300 + index * 50}ms`, animationFillMode: 'backwards' }}>
             <div className={cn("relative p-px rounded-2xl overflow-hidden transition-all duration-300 ease-in-out group-hover:-translate-y-1", dashboard.borderColor)}>
                 <div className="absolute inset-0 w-full h-full bg-background rounded-[23px] -z-10"></div>
                 <div className="absolute -z-10 w-[200%] h-[200%] -top-1/2 -left-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0)_100%)] animate-border-spin"></div>

                <Card className={cn("h-full overflow-hidden transition-all duration-300 ease-in-out bg-card/80 backdrop-blur-sm group-hover:shadow-lg animate-slide-up border-none", dashboard.shadowColor)}>
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div>
                      <div className="p-3 rounded-lg w-fit bg-primary/10">
                          <dashboard.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="font-headline text-lg font-semibold mt-4 text-foreground">{dashboard.title}</h2>
                      <p className="text-muted-foreground text-sm mt-1">{dashboard.description}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-end">
                          <ArrowRight className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                      </div>
                  </CardContent>
                </Card>
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
