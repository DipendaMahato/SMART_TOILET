
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

const subDashboards = [
  {
    title: 'Live Sensor Data',
    description: 'Real-time IoT sensor readings and device status.',
    icon: RadioTower,
    href: '/dashboard/live-sensor-data',
    gradient: 'from-cyan-50 to-blue-100',
    iconColor: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
  },
  {
    title: 'AI Process Tracker',
    description: 'Visualize AI stages from data capture to insights.',
    icon: BrainCircuit,
    href: '/dashboard/ai-process-tracker',
    gradient: 'from-violet-50 to-purple-100',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-100',
  },
  {
    title: 'Urine & Stool Diagnostics',
    description: 'Analysis, classifications, and risk indicators.',
    icon: FlaskConical,
    href: '/dashboard/diagnostics',
    gradient: 'from-teal-50 to-cyan-100',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-100',
  },
  {
    title: 'Health Vitals & Trends',
    description: 'Daily, weekly, and long-term trend graphs.',
    icon: Activity,
    href: '/dashboard/vitals-trends',
    gradient: 'from-orange-50 to-amber-100',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  {
    title: 'Overall Health Status',
    description: 'AI-derived health scores and conclusions.',
    icon: Heart,
    href: '/dashboard/health-status',
    gradient: 'from-rose-50 to-pink-100',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
  },
  {
    title: 'Clinical Care & Doctor Support',
    description: 'Doctor profiles, consultations, and facilities.',
    icon: Stethoscope,
    href: '/dashboard/clinical-care',
    gradient: 'from-emerald-50 to-green-100',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
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
            <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-soft hover:border-primary/20 hover:-translate-y-1 animate-slide-up bg-glass-white/80 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className={`p-3 rounded-lg w-fit ${dashboard.iconBg}`}>
                    <dashboard.icon className={`h-6 w-6 ${dashboard.iconColor}`} />
                  </div>
                  <h2 className="font-headline text-lg font-semibold mt-4 text-gray-800">{dashboard.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">{dashboard.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-end">
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
