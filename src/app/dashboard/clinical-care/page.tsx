
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heart, Droplet, Footprints, Activity, Clock, ShieldPlus } from 'lucide-react';

const dashboards = [
    {
        title: 'GENERAL HEALTH CHECKUP',
        icon: Heart,
        color: 'border-green-400',
        textColor: 'text-green-400',
        details: [
            { label: 'WELLNESS SCORE', value: 'GOOD' },
        ],
    },
    {
        title: 'URINARY HEALTH',
        icon: Droplet,
        color: 'border-teal-400',
        textColor: 'text-teal-400',
        details: [
            { label: 'URINE ANALYSIS', value: 'LOW RISK' },
        ],
    },
    {
        title: 'DIGESTIVE HEALTH',
        icon: Footprints,
        color: 'border-yellow-400',
        textColor: 'text-yellow-400',
        details: [
            { label: 'BOWEL REGULARITY', value: 'NORMAL' },
        ],
    },
    {
        title: 'METABOLIC & LIFESTYLE HEALTH',
        icon: Activity,
        color: 'border-purple-400',
        textColor: 'text-purple-400',
        details: [
            { label: 'GLUCOSE', value: 'STABLE' },
        ],
    },
];


const HealthDashboardCard = ({ title, icon: Icon, color, textColor, details }: typeof dashboards[0]) => (
    <Card className={cn("bg-card/50 border-2 hover:-translate-y-1 transition-transform duration-300", color)}>
        <CardHeader>
            <CardTitle className="font-headline text-sm tracking-wider text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {details.slice(0, 1).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Icon className={cn("w-6 h-6", textColor)} />
                    <div>
                         <p className="font-semibold text-lg">
                            {item.label}: <span className={cn(textColor)}>{item.value}</span>
                        </p>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);

export default function ClinicalCarePage() {
  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-0">
        <div className="flex items-center gap-4 animate-slide-up">
            <ShieldPlus className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold">CLINICAL CARE & HOSPITAL SERVICES</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            {dashboards.map((dashboard, index) => (
                <HealthDashboardCard key={index} {...dashboard} />
            ))}
        </div>

        <div className="flex items-center justify-start gap-2 text-xs text-muted-foreground animate-slide-up" style={{ animationDelay: '500ms' }}>
            <Clock className="w-4 h-4" />
            <span>LAST SYNC: 19 MIN AGO</span>
        </div>
    </div>
  );
}
