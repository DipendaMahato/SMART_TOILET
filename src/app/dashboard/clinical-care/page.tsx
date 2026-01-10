
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heart, Droplet, Footprints, Siren, ArrowRight } from 'lucide-react';
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
        
      {/* HEADER SECTION */}
      <header className="mb-8 animate-slide-up">
        <div className="flex items-start gap-4 mb-6">
          <Image 
            src="/hospital_logo.png" 
            alt="Hospital Logo" 
            width={64}
            height={64}
            className="w-16 h-16 object-contain rounded-lg mt-1"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Clinical Care</h1>
            <p className="text-muted-foreground mt-2 max-w-4xl">
              Our service is directly connected with Sri Ramakrishna Hospital, Coimbatore’s trusted multi-specialty healthcare center, delivering advanced medical care with a strong focus on patient comfort, dignity, and quality treatment through modern technology.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
          <Image 
            src="/sri-ramakrishna-hospital.jpg" 
            alt="Sri Ramakrishna Hospital" 
            width={1200}
            height={250}
            className="w-full h-48 md:h-64 object-cover object-center opacity-90 hover:opacity-100 transition-opacity"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          {services.map((service, index) => (
              <ServiceDashboardCard key={index} {...service} />
          ))}
      </div>
    </div>
  );
}
