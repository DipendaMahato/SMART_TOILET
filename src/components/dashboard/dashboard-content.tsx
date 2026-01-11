
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
    borderColor: 'border-glow-cyan-blue',
    shadowColor: 'shadow-glow-cyan-blue/20',
    bgColor: 'bg-gradient-to-br from-glow-cyan-blue-start/20 to-glow-cyan-blue-end/20',
    textColor: 'text-glow-cyan-blue',
    animation: 'animate-light-trace',
  },
  {
    title: 'AI Process Tracker',
    description: 'Visualize AI stages from data capture to insights.',
    icon: BrainCircuit,
    href: '/dashboard/ai-process-tracker',
    borderColor: 'border-glow-purple-violet',
    shadowColor: 'shadow-glow-purple-violet/20',
    bgColor: 'bg-gradient-to-br from-glow-purple-violet-start/20 to-glow-purple-violet-end/20',
    textColor: 'text-glow-purple-violet',
    animation: '',
  },
  {
    title: 'Urine & Stool Diagnostics',
    description: 'Analysis, classifications, and risk indicators.',
    icon: FlaskConical,
    href: '/dashboard/diagnostics',
    borderColor: 'border-glow-teal-green',
    shadowColor: 'shadow-glow-teal-green/20',
    bgColor: 'bg-gradient-to-br from-glow-teal-green/20 to-glow-teal-green/10',
    textColor: 'text-glow-teal-green',
    animation: 'animate-orbit-glow',
  },
  {
    title: 'Health Vitals & Trends',
    description: 'Daily, weekly, and long-term trend graphs.',
    icon: Activity,
    href: '/dashboard/vitals-trends',
    borderColor: 'border-glow-lime-emerald',
    shadowColor: 'shadow-glow-lime-emerald/20',
    bgColor: 'bg-gradient-to-br from-glow-lime-emerald-start/20 to-glow-lime-emerald-end/20',
    textColor: 'text-glow-lime-emerald',
    animation: 'animate-heartbeat-pulse',
  },
  {
    title: 'Overall Health Status',
    description: 'AI-derived health scores and conclusions.',
    icon: Heart,
    href: '/dashboard/health-status',
    borderColor: 'border-glow-sky-royal-blue',
    shadowColor: 'shadow-glow-sky-royal-blue/20',
    bgColor: 'bg-gradient-to-br from-glow-sky-royal-blue-start/20 to-glow-sky-royal-blue-end/20',
    textColor: 'text-glow-sky-royal-blue',
    animation: 'animate-breathing-glow',
  },
  {
    title: 'Clinical Care & Doctor Support',
    description: 'Doctor profiles, consultations, and facilities.',
    icon: Stethoscope,
    href: '/dashboard/clinical-care',
    borderColor: 'border-glow-red-rose',
    shadowColor: 'shadow-glow-red-rose/20',
    bgColor: 'bg-gradient-to-br from-glow-red-rose-start/20 to-glow-red-rose-end/20',
    textColor: 'text-glow-red-rose',
    animation: 'animate-alert-glow',
  },
];

const AnimatedBorderCard = ({
    href,
    title,
    description,
    icon: Icon,
    borderColor,
    shadowColor,
    bgColor,
    textColor,
    animation,
    index
} : (typeof subDashboards)[0] & { index: number}) => {
    return (
        <Link href={href} className="group relative block">
            <div 
                className={cn(
                    'absolute -inset-0.5 rounded-2xl blur-sm transition duration-300 group-hover:blur-md opacity-75 group-hover:opacity-100',
                    bgColor,
                    animation,
                )} 
                style={{ animationDelay: `${index * 100}ms`}}
            />
            <Card
                className={cn(
                    "relative h-full overflow-hidden transition-all duration-300 ease-in-out bg-card/80 backdrop-blur-lg border-2",
                    "group-hover:-translate-y-1 group-hover:shadow-2xl",
                    borderColor,
                    shadowColor
                )}
            >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                        <div className={cn("p-3 rounded-xl w-fit bg-opacity-20", bgColor)}>
                            <Icon className={cn("h-6 w-6", textColor)} style={{ filter: `drop-shadow(0 0 8px currentColor)`}} />
                        </div>
                        <h2 className="font-headline text-lg font-semibold mt-4 text-foreground">{title}</h2>
                        <p className="text-muted-foreground text-sm mt-1">{description}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-end">
                        <ArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export function DashboardContent() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div style={{ animationDelay: '200ms', animationFillMode: 'backwards' }} className="animate-slide-up">
        <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-mint to-glow-cyan animate-text-gradient bg-400">Dashboard</h1>
        <p className="text-muted-foreground">
          Select a dashboard below to explore your health data in detail.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {subDashboards.map((dashboard, index) => (
            <AnimatedBorderCard
                key={dashboard.title}
                index={index}
                {...dashboard}
             />
        ))}
      </div>
    </div>
  );
}
