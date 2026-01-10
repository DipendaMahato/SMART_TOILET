
'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Phone } from 'lucide-react';

export default function GeneralHealthCheckupPage() {
  return (
    <div className="space-y-8 animate-fade-in">
        <header className="flex items-center gap-4 animate-slide-up">
            <Image 
                src="/hospital_logo.png" 
                alt="Hospital Logo" 
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
            />
            <div>
                <h1 className="text-3xl font-bold font-headline">General Health Checkup</h1>
                <p className="text-muted-foreground">Consult with our lead specialist for general health.</p>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 animate-slide-up" style={{animationDelay: '200ms'}}>
                <Card className="text-center p-6">
                    <CardContent className="flex flex-col items-center">
                         <div className="relative mb-4">
                            <Image
                                src="/Dr. A. Arthi.webp"
                                alt="Dr. A. Arthi"
                                width={150}
                                height={150}
                                className="rounded-full object-cover border-4 border-primary shadow-lg"
                            />
                            <div className="absolute bottom-0 right-2 bg-green-500 rounded-full w-5 h-5 border-2 border-card" title="Online"></div>
                         </div>
                        <h3 className="text-2xl font-bold font-headline">Dr. A. Arthi</h3>
                        <p className="text-primary font-semibold">Lead Consultant - General Health</p>
                        <p className="text-sm text-muted-foreground mt-2">MBBS, MD (General Medicine)</p>
                        <p className="text-sm text-muted-foreground">12+ Years of Experience</p>

                        <div className="mt-6 w-full space-y-3">
                            <Button className="w-full">
                                <Calendar className="mr-2 h-4 w-4" />
                                Book an Appointment
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Phone className="mr-2 h-4 w-4" />
                                Contact Clinic
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{animationDelay: '300ms'}}>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">About Dr. A. Arthi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Dr. A. Arthi is a highly respected physician with over a decade of experience in general medicine. She is known for her compassionate approach and dedication to providing comprehensive care. Her expertise lies in diagnosing and managing a wide range of acute and chronic illnesses, with a special focus on preventive health and patient education. Dr. Arthi is committed to helping her patients achieve their best possible health outcomes through personalized treatment plans.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <Clock className="h-5 w-5 text-primary"/>
                            <span>Monday - Friday: 9:00 AM - 5:00 PM</span>
                        </div>
                         <div className="flex items-center gap-4 text-muted-foreground">
                            <Clock className="h-5 w-5 text-primary"/>
                            <span>Saturday: 9:00 AM - 1:00 PM</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
