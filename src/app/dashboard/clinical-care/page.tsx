
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heart, Droplet, Footprints, Clock, ShieldPlus, Siren, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const services = [
    {
        title: 'GENERAL HEALTH CHECKUP',
        icon: Heart,
        color: 'border-green-400',
        textColor: 'text-green-400',
        href: '#',
    },
    {
        title: 'URINARY HEALTH CHECKUP',
        icon: Droplet,
        color: 'border-teal-400',
        textColor: 'text-teal-400',
        href: '#',
    },
    {
        title: 'DIGESTIVE HEALTH CHECKUP',
        icon: Footprints,
        color: 'border-yellow-400',
        textColor: 'text-yellow-400',
        href: '#',
    },
    {
        title: 'EMERGENCY CARE',
        icon: Siren,
        color: 'border-red-400',
        textColor: 'text-red-400',
        href: '#',
    },
];

const ServiceDashboardCard = ({ title, icon: Icon, color, textColor, href }: typeof services[0]) => (
    <Link href={href} className="group">
        <Card className={cn("bg-card/90 h-full flex flex-col justify-between transition-all duration-300 group-hover:bg-card/80 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/10 border-2 border-transparent hover:border-primary/20", color)}>
            <CardHeader>
                <CardTitle className="font-headline text-sm tracking-wider text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                     <Icon className={cn("w-10 h-10", textColor)} />
                     <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
            </CardContent>
        </Card>
    </Link>
);

export default function ClinicalCarePage() {
  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-0">
        <div className="relative w-full rounded-2xl overflow-hidden mb-8">
            <Image 
                src="https://images.unsplash.com/photo-1533042789716-e9a9c97cf4ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxob3NwaXRhbCUyMGJ1aWxkaW5nfGVufDB8fHx8MTc2NzkyODAxNXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Hospital Building"
                width={1200}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint="hospital building"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg">
                <Image
                    src="https://picsum.photos/seed/hospitallogo/150/50"
                    alt="Hospital Logo"
                    width={150}
                    height={50}
                    data-ai-hint="hospital logo"
                />
            </div>
        </div>

        <div className="flex items-center gap-4 animate-slide-up">
            <ShieldPlus className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold">CLINICAL CARE & HOSPITAL SERVICES</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
            {services.map((service, index) => (
                <ServiceDashboardCard key={index} {...service} />
            ))}
        </div>

        <div className="flex items-center justify-start gap-2 text-xs text-muted-foreground animate-slide-up" style={{ animationDelay: '500ms' }}>
            <Clock className="w-4 h-4" />
            <span>LAST SYNC: 19 MIN AGO</span>
        </div>
    </div>
  );
}
