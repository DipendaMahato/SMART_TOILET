
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heart, Droplet, Footprints, Siren, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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

const slidingImages = [
  '/sri-ramakrishna-hospital.jpg',
  '/hospital.jpg'
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slidingImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-0">
        
      {/* HEADER SECTION */}
      <header className="mb-8 animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <Image 
            src="/hospital_logo.png" 
            alt="Hospital Logo" 
            width={64}
            height={64}
            className="w-16 h-16 object-contain rounded-lg mt-1"
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline animate-text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Sri Ramakrishna Hospital</h1>
            <p className="text-muted-foreground mt-2 max-w-4xl">
              Access specialized checkups and emergency care services from our trusted hospital partner.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border shadow-lg relative h-48 md:h-64">
          {slidingImages.map((src, index) => (
             <Image 
                key={src}
                src={src}
                alt="Sri Ramakrishna Hospital" 
                fill
                className={cn(
                    "w-full h-full object-cover object-center transition-opacity duration-1000",
                    index === currentImageIndex ? 'opacity-90' : 'opacity-0'
                )}
            />
          ))}
        </div>
         <p className="text-muted-foreground mt-4 text-center md:text-left max-w-4xl mx-auto md:mx-0">
          Our service is directly connected with Sri Ramakrishna Hospital, Coimbatore’s trusted multi-specialty healthcare center, delivering advanced medical care with a strong focus on patient comfort, dignity, and quality treatment through modern technology.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          {services.map((service, index) => (
              <ServiceDashboardCard key={index} {...service} />
          ))}
      </div>
    </div>
  );
}
