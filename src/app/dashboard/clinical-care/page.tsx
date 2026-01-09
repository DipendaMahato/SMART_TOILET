'use client';
import Image from 'next/image';

export default function ClinicalCarePage() {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="animate-slide-up">
            <h1 className="text-3xl font-headline font-bold">Clinical Care & Hospital Services</h1>
            <p className="text-muted-foreground">
                This section is currently under construction.
            </p>
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Image 
                src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Hospital Building"
                width={1200}
                height={600}
                className="rounded-2xl object-cover w-full h-auto"
                data-ai-hint="hospital building"
            />
        </div>
    </div>
  );
}
