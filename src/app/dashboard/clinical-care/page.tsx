
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, AlertTriangle, Building2, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const doctors = [
    {
        category: 'General Health',
        name: 'Dr. A. Arthi',
        specialty: 'Lead Consultant - General Health',
        image: '/Dr. A. Arthi.png',
        qualifications: 'MBBS, MD (General Medicine), DNB (General Medicine), MRCPUK',
        experience: '8+ Years of Experience',
        availability: 'MON - SAT (08:00 AM – 05:00 PM)',
        floor: 'Ground floor',
        theme: {
            border: 'border-primary/30',
            shadow: 'shadow-primary/10',
            text: 'text-primary',
            bg: 'bg-primary'
        }
    },
    {
        category: 'Urinary Health',
        name: 'Dr. Suresh Dhamodharan',
        specialty: 'Consultant Diabetes & Endocrinology',
        image: '/Dr.Suresh-Dhamodharan.png',
        qualifications: 'MBBS, MRCP, (U.K.), CCST (Int-Medicine) (London), CCST (Diabetology and Endocrinology ) (London)',
        experience: '29 Years of Experience',
        availability: 'MON - SAT (08:00 AM – 04:00 PM)',
        floor: 'First Floor – (Multi-Speciality), Bay 15 C',
        theme: {
            border: 'border-secondary/30',
            shadow: 'shadow-secondary/10',
            text: 'text-secondary',
            bg: 'bg-secondary'
        }
    },
    {
        category: 'Digestive Health',
        name: 'Honorary Dr. V. Arulselvan',
        specialty: 'Consultant Medical Gastroenterologist & Hepatologist',
        image: '/Honorary Dr. V. ARULSELVAN.png',
        qualifications: 'MBBS, MD, DM(GASTRO)',
        experience: '12 Years of Experience',
        availability: 'MON - SAT (01:00 PM – 05:00 PM)',
        floor: 'First Floor – (Multi-Speciality)',
        theme: {
            border: 'border-status-green/30',
            shadow: 'shadow-status-green/10',
            text: 'text-status-green',
            bg: 'bg-status-green'
        }
    },
    {
        category: 'Emergency Care',
        name: 'Dr. N. Manjunathan',
        specialty: 'Chief Emergency Medical Officer',
        image: '/Dr. N. MANJUNATHAN.png',
        qualifications: 'M.D.',
        experience: '09 Years of Experience',
        availability: 'Full Time',
        floor: 'Ground Floor – (Multi-Speciality)',
        theme: {
            border: 'border-status-red/30',
            shadow: 'shadow-status-red/10',
            text: 'text-status-red',
            bg: 'bg-status-red'
        },
        isEmergency: true
    },
];

const AnimatedFooter = () => (
    <CardFooter className="bg-muted/50 p-0 overflow-hidden rounded-b-xl">
         <a 
          href="https://www.sriramakrishnahospital.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground whitespace-nowrap animate-marquee hover:pause"
        >
          <span className="mx-4">For more services, please visit our website: www.sriramakrishnahospital.com</span>
          <span className="mx-4">For more services, please visit our website: www.sriramakrishnahospital.com</span>
        </a>
    </CardFooter>
);

const DoctorCard = ({ doctor }: { doctor: (typeof doctors)[0] }) => {
    return (
        <Card className={cn("flex flex-col h-full", doctor.theme.border)}>
            <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                    <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={128}
                        height={128}
                        className={cn("rounded-full object-cover border-4 border-card shadow-lg", doctor.theme.border)}
                    />
                    {doctor.isEmergency && (
                        <div className="absolute -top-1 -right-1">
                            <Badge variant="destructive" className="flex items-center gap-1 text-base p-2">
                                <AlertTriangle className="h-4 w-4" /> 24/7
                            </Badge>
                        </div>
                    )}
                </div>
                <CardTitle className="font-headline text-2xl">{doctor.name}</CardTitle>
                <p className={cn("font-semibold", doctor.theme.text)}>{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                    <p className="flex items-center gap-2"><Building2 className="h-4 w-4" /> <strong>Experience:</strong> {doctor.experience}</p>
                    <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> <strong>Availability:</strong> {doctor.availability}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <strong>Location:</strong> {doctor.floor}</p>
                </div>
                <div className="flex gap-2">
                    <Button className={cn("w-full", doctor.theme.bg, `hover:${doctor.theme.bg}/90`)}>
                        <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                    </Button>
                    <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> Contact
                    </Button>
                </div>
            </CardContent>
            <AnimatedFooter />
        </Card>
    );
};

export default function ClinicalCarePage() {
  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-0">
      <header className="mb-8 animate-slide-up">
        <div className="flex items-center gap-4 mb-4">
          <Image 
            src="/hospital_logo.png" 
            alt="Hospital Logo" 
            width={64}
            height={64}
            className="w-16 h-16 object-contain rounded-lg"
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline animate-text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Clinical Care Dashboard</h1>
            <p className="text-muted-foreground mt-1 max-w-4xl">
              Access specialized checkups and emergency care services from our trusted hospital partner, Sri Ramakrishna Hospital.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {doctors.map((doctor, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${200 + index * 100}ms` }}>
                  <DoctorCard doctor={doctor} />
              </div>
          ))}
      </div>
    </div>
  );
}
