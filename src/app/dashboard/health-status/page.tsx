
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Droplets, ShieldCheck, Heart, FileText, Bone, Activity } from 'lucide-react';
import React from 'react';

const summaryCards = [
  {
    title: 'Hydration',
    status: 'Optimal',
    icon: Droplets,
    color: 'border-teal-400',
    textColor: 'text-teal-400',
  },
  {
    title: 'Urinary Health',
    status: 'Stable - Low Risk',
    icon: ShieldCheck,
    color: 'border-blue-400',
    textColor: 'text-blue-400',
  },
  {
    title: 'Digestive Health',
    status: 'Good - Monitor Fiber',
    icon: Bone,
    color: 'border-orange-400',
    textColor: 'text-orange-400',
    highlight: true,
  },
  {
    title: 'Metabolic Indicators',
    status: 'No Concerns',
    icon: Activity,
    color: 'border-green-400',
    textColor: 'text-green-400',
  },
];

const HealthStatusCard = ({
  title,
  status,
  icon: Icon,
  color,
  textColor,
  highlight,
}: {
  title: string;
  status: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  highlight?: boolean;
}) => (
  <Card
    className={cn(
      'bg-card/50 border-2 border-transparent transition-all duration-300 hover:border-primary/50',
      color,
      highlight && 'bg-orange-400/10 shadow-lg shadow-orange-500/10'
    )}
  >
    <CardContent className="p-4 text-center">
      <Icon className={cn('mx-auto h-8 w-8 mb-2', textColor)} />
      <p className="font-semibold text-sm">{title}</p>
      <p className={cn('text-xs font-bold', textColor)}>{status}</p>
    </CardContent>
  </Card>
);

export default function HealthStatusPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overall Health Score */}
      <div className="text-center animate-slide-up">
        <div className="relative inline-block">
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="text-green-500 h-16 w-16 opacity-30" />
          </div>
          <svg className="h-48 w-48" viewBox="0 0 100 100">
            <circle
              className="text-gray-800"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
            <circle
              className="text-green-500 drop-shadow-[0_0_5px_#4ade80]"
              strokeWidth="4"
              strokeDasharray="289.027"
              strokeDashoffset="28.9" // 10% offset to leave a gap
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">Overall Health Score</p>
            <p className="text-5xl font-bold">
              98 <span className="text-3xl text-green-400">- Excellent</span>
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Last Assessment: Nov 14, 2023 - Data Period: Last 7 Days
        </p>
      </div>

      {/* System Health Summary */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-center text-xl font-headline font-semibold mb-4">System Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <HealthStatusCard key={card.title} {...card} />
          ))}
        </div>
      </div>

      {/* AI Clinical Health Conclusion */}
      <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
         <Card className="bg-card/50 border border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-center">AI Clinical Health Conclusion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-primary">AI Summary:</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Based on recent urine and stool analyses, your overall physiological markers are stable. Minor, non-critical fluctuations in hydration and certain metabolic indicators were noted, but remain within a healthy range. Your current health risk level is low. We recommend consistent annual check-ups.
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold text-primary">Preventive Health Recommendations:</h3>
                    <ul className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                        <li>Maintain consistent daily water intake.</li>
                        <li>Incorporate varied fiber-rich foods.</li>
                        <li>Schedule annual wellness checkup.</li>
                    </ul>
                </div>
                <div className="text-center pt-4">
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Download Detailed Health Report
                    </Button>
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
