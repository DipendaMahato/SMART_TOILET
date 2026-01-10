
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, Building2, MapPin, Clock, X } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

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
        bio: 'Dr. A. Arthi is a highly respected physician with over a decade of experience in general medicine. She is known for her compassionate approach and dedication to providing comprehensive care.',
        theme: {
            border: 'border-blue-500/30',
            shadow: 'shadow-blue-500/20',
            text: 'text-blue-500',
            bg: 'bg-blue-500'
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
        floor: 'First Floor – (Multi-Speciality)',
        bio: 'Dr. Suresh is a leading expert in diabetology and endocrinology, with nearly three decades of experience in managing complex hormonal and metabolic disorders.',
        theme: {
            border: 'border-indigo-500/30',
            shadow: 'shadow-indigo-500/20',
            text: 'text-indigo-500',
            bg: 'bg-indigo-500'
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
        bio: 'A specialist in gastroenterology and hepatology, Dr. Arulselvan is skilled in diagnosing and treating a wide array of digestive and liver-related conditions.',
        theme: {
            border: 'border-emerald-500/30',
            shadow: 'shadow-emerald-500/20',
            text: 'text-emerald-500',
            bg: 'bg-emerald-500'
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
        bio: 'Dr. N. Manjunathan leads a dedicated team of emergency physicians, nurses, and support staff, available 24/7. Our state-of-the-art emergency department is equipped to handle all medical emergencies, from minor injuries to life-threatening conditions, ensuring rapid diagnosis and treatment.',
        theme: {
            border: 'border-red-500/30',
            shadow: 'shadow-red-500/20',
            text: 'text-red-500',
            bg: 'bg-red-500'
        },
        isEmergency: true
    },
];

type Doctor = (typeof doctors)[0];

const DoctorDetailModal = ({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
        <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl animate-slide-up-fast" onClick={e => e.stopPropagation()}>
            <CardHeader className="text-center relative">
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full" onClick={onClose}><X size={20}/></Button>
                <div className="relative mx-auto mt-4">
                    <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={128}
                        height={128}
                        className={cn("rounded-full object-cover border-4 shadow-lg", doctor.theme.border)}
                    />
                </div>
                <CardTitle className="font-headline text-3xl mt-4">{doctor.name}</CardTitle>
                <p className={cn("font-semibold text-lg", doctor.theme.text)}>{doctor.specialty}</p>
                <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">{doctor.bio}</p>
                <div className="text-sm text-muted-foreground space-y-2 border-t border-b border-border py-4">
                    <p className="flex items-center justify-center gap-2"><Building2 className="h-4 w-4" /> <strong>Experience:</strong> {doctor.experience}</p>
                    <p className="flex items-center justify-center gap-2"><Clock className="h-4 w-4" /> <strong>Availability:</strong> {doctor.availability}</p>
                    <p className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4" /> <strong>Location:</strong> {doctor.floor}</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className={cn("w-full", doctor.theme.bg)} size="lg">
                    <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                </Button>
                <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Contact
                </Button>
            </CardFooter>
        </div>
    </div>
);


export default function ClinicalCarePage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <div className="min-h-full w-full bg-mesh-gradient animate-mesh-flow p-4 md:p-8">
      <header className="mb-12 animate-slide-up text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Image 
            src="/hospital_logo.png" 
            alt="Hospital Logo" 
            width={64}
            height={64}
            className="w-16 h-16 object-contain rounded-lg bg-white/50 p-2 shadow-sm"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-headline text-slate-800">Clinical Care Dashboard</h1>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
          Access specialized checkups and emergency care from our trusted hospital partner, Sri Ramakrishna Hospital.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
              <div 
                key={index} 
                className="animate-slide-up cursor-pointer group" 
                style={{ animationDelay: `${200 + index * 100}ms` }}
                onClick={() => setSelectedDoctor(doctor)}
              >
                  <Card className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-3xl h-full text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <CardContent className="p-8">
                        <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={128}
                            height={128}
                            className="rounded-full object-cover border-4 border-white shadow-lg mx-auto mb-4"
                        />
                         {doctor.isEmergency && (
                            <Badge variant="destructive" className="mb-2">24/7 Emergency</Badge>
                        )}
                        <h3 className="font-headline text-xl font-semibold text-slate-900">{doctor.name}</h3>
                        <p className={cn("font-medium text-sm", doctor.theme.text)}>{doctor.category}</p>
                    </CardContent>
                  </Card>
              </div>
          ))}
      </div>

       {selectedDoctor && <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />}

       <div className="fixed bottom-0 left-0 w-full bg-[#004a99]/90 backdrop-blur-sm h-16 z-40 overflow-hidden">
            <a href="https://www.sriramakrishnahospital.com" target="_blank" rel="noopener noreferrer" className="flex items-center h-full">
                <p className="text-white font-semibold whitespace-nowrap animate-marquee-lr">
                    <span className="mx-8">For more services, please visit: www.sriramakrishnahospital.com</span>
                    <span className="mx-8">For more services, please visit: www.sriramakrishnahospital.com</span>
                </p>
            </a>
       </div>
    </div>
  );
}
