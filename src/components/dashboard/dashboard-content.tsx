
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
    shadowColor: 'hover:shadow-cyan-500/20',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
  },
  {
    title: 'AI Process Tracker',
    description: 'Visualize AI stages from data capture to insights.',
    icon: BrainCircuit,
    href: '/dashboard/ai-process-tracker',
    borderColor: 'border-purple-400',
    shadowColor: 'hover:shadow-purple-500/20',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
  },
  {
    title: 'Urine & Stool Diagnostics',
    description: 'Analysis, classifications, and risk indicators.',
    icon: FlaskConical,
    href: '/dashboard/diagnostics',
    borderColor: 'border-teal-400',
    shadowColor: 'hover:shadow-teal-500/20',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
  },
  {
    title: 'Health Vitals & Trends',
    description: 'Daily, weekly, and long-term trend graphs.',
    icon: Activity,
    href: '/dashboard/vitals-trends',
    borderColor: 'border-green-400',
    shadowColor: 'hover:shadow-green-500/20',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
  },
  {
    title: 'Overall Health Status',
    description: 'AI-derived health scores and conclusions.',
    icon: Heart,
    href: '/dashboard/health-status',
    borderColor: 'border-blue-400',
    shadowColor: 'hover:shadow-blue-500/20',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
  },
  {
    title: 'Clinical Care & Doctor Support',
    description: 'Doctor profiles, consultations, and facilities.',
    icon: Stethoscope,
    href: '/dashboard/clinical-care',
    borderColor: 'border-red-400',
    shadowColor: 'hover:shadow-red-500/20',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
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
          <Link href={dashboard.href} key={dashboard.title} className="group">
             <Card 
                className={cn(
                    "h-full overflow-hidden transition-all duration-300 ease-in-out border-2 animate-slide-up shadow-md hover:-translate-y-1 hover:shadow-2xl", 
                    dashboard.bgColor, 
                    dashboard.borderColor, 
                    dashboard.shadowColor
                )}
                style={{ animationDelay: `${300 + index * 50}ms`, animationFillMode: 'backwards' }}
             >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                    <div className={cn("p-3 rounded-lg w-fit", dashboard.bgColor)}>
                        <dashboard.icon className={cn("h-6 w-6", dashboard.textColor)} />
                    </div>
                    <h2 className="font-headline text-lg font-semibold mt-4 text-foreground">{dashboard.title}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{dashboard.description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-end">
                        <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
