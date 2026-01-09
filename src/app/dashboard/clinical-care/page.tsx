
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MoreHorizontal, Search, Star, Phone, Video, MessageSquare, Calendar, ChevronRight, ChevronLeft, Building, User, Hospital, Stethoscope, FileText, FlaskConical, Pill, Siren } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SectionCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <Card className={cn("bg-card/50 border border-border/50", className)}>
    <CardHeader className="flex-row items-center justify-between">
      <CardTitle className="font-headline text-lg">{title}</CardTitle>
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const DoctorCard = ({ name, specialty, imageId, online }: { name: string, specialty: string, imageId: string, online?: boolean }) => {
    const doctorImage = PlaceHolderImages.find(img => img.id === imageId);
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Image 
                src={doctorImage?.imageUrl || ''}
                alt={name}
                width={48}
                height={48}
                className="rounded-full"
                data-ai-hint={doctorImage?.imageHint}
            />
            <div className="flex-1">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{specialty}</p>
                <div className="flex text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                </div>
            </div>
            <Button variant={online ? "default" : "outline"} size="sm">{online ? "Book Online" : "View Profile"}</Button>
        </div>
    );
};

const HospitalCard = ({ name, location, imageId, big }: { name: string, location: string, imageId: string, big?: boolean }) => {
    const hospitalImage = PlaceHolderImages.find(img => img.id === imageId);
    return (
        <Card className="bg-muted/30 p-4">
            <div className={cn("flex gap-4", big ? "flex-col" : "items-center")}>
                 <Image 
                    src={hospitalImage?.imageUrl || ''}
                    alt={name}
                    width={big ? 200 : 80}
                    height={big ? 120 : 60}
                    className="rounded-md w-full object-cover"
                    data-ai-hint={hospitalImage?.imageHint}
                />
                <div className={cn(!big && "flex-1")}>
                    <p className={cn("font-semibold", big && "mt-2")}>{name}</p>
                    <p className="text-sm text-muted-foreground">{location}</p>
                    <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                </div>
            </div>
            <div className={cn("grid grid-cols-2 gap-2 mt-4", big && "grid-cols-2")}>
                 <Button variant="outline" size="sm">View Online</Button>
                <Button variant="outline" size="sm">Book Appt.</Button>
                 {big && <>
                    <Button variant="outline" size="sm">Book in Person</Button>
                    <Button variant="default" size="sm">Book in Person</Button>
                 </>}
            </div>
        </Card>
    );
};


const FindDoctorsAndHospitals = () => (
    <SectionCard title="Find Doctors & Hospitals">
        <div className="relative mb-4">
            <Input placeholder="Specialization" className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
            <DoctorCard name="Dr. Aisha Rahman" specialty="Urology Specialist" imageId="doctor-1" online />
            <DoctorCard name="Doctor Profile" specialty="Cardiologist" imageId="doctor-2" />
            <DoctorCard name="Dr. Elena Petrova" specialty="General Physician" imageId="doctor-3" online/>
        </div>
    </SectionCard>
);

const BrowseProfilesAndConsult = () => (
    <SectionCard title="Browse Profiles & Consult">
        <div className="space-y-4">
            <HospitalCard name="City General Hospital" location="Downtown, Metrosburg" imageId="hospital-1" big/>
        </div>
    </SectionCard>
);

const ShareHealthData = () => (
    <SectionCard title="Share Health Data & Reports">
        <p className="text-sm font-semibold mb-2">Securely Share Your Data</p>
        <div className="space-y-3">
             <Input placeholder="Select Doctor/Hospital" className="bg-muted/50"/>
             <div className="flex items-center space-x-2">
                <Checkbox id="urine-reports" />
                <label htmlFor="urine-reports" className="text-sm">Urine Diagnostic Reports</label>
             </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="stool-reports" />
                <label htmlFor="stool-reports" className="text-sm">Stool Trend Reports</label>
             </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="health-trends" />
                <label htmlFor="health-trends" className="text-sm">Health Trend Records (Last 30 Days)</label>
             </div>
             <Button className="w-full">Confirm Booking</Button>
        </div>
        <Separator className="my-4"/>
        <p className="text-sm font-semibold mb-2">Shared Reports with Doctors</p>
        <div className="text-sm text-muted-foreground space-y-2">
            <p>We retain little information about the usage of the terms.</p>
            <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
                <span>/dev/health-report.pdf</span>
                <Button variant="ghost" size="sm">Download</Button>
            </div>
        </div>
    </SectionCard>
);


const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

const AppointmentCalendar = () => {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
    }, []);

    if (!date) {
        return <div className="p-2 rounded-md border min-h-[228px] flex items-center justify-center">Loading Calendar...</div>;
    }

    const month = date.getMonth();
    const year = date.getFullYear();

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(month, year);
        const firstDay = firstDayOfMonth(month, year);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-1 text-center"></div>);
        }

        for (let day = 1; day <= totalDays; day++) {
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            days.push(
                <div key={day} className={cn("p-1 text-center text-sm rounded-md cursor-pointer hover:bg-primary/20", isToday && "bg-primary text-primary-foreground")}>
                    {day}
                </div>
            );
        }
        return days;
    };

    return (
         <div className="p-2 rounded-md border">
            <div className="flex justify-between items-center mb-2">
                <Button variant="ghost" size="icon" onClick={() => setDate(new Date(year, month - 1, 1))}><ChevronLeft/></Button>
                <span className="font-semibold text-sm">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <Button variant="ghost" size="icon" onClick={() => setDate(new Date(year, month + 1, 1))}><ChevronRight/></Button>
            </div>
             <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
                {renderCalendarDays()}
            </div>
        </div>
    );
};


const BookAppointment = () => (
    <SectionCard title="Book an Appointment">
        <Input placeholder="Select Doctor/Hospital" className="bg-muted/50 mb-4" />
        <AppointmentCalendar />
    </SectionCard>
);

const MedicalHistory = () => (
    <SectionCard title="My Medical History">
        <Button variant="outline" className="w-full justify-start mb-4"><FileText className="mr-2"/> Session Sheet</Button>
        <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="urine-reports-hist" />
                <label htmlFor="urine-reports-hist" className="text-sm">Urine Diagnostic Reports</label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="health-trends-hist" />
                <label htmlFor="health-trends-hist" className="text-sm">Health Trend Records (Last 30 Days)</label>
            </div>
        </div>
        <Input placeholder="Search Prescriptions" className="mb-4 bg-muted/50" />
        <Button className="w-full"><FlaskConical className="mr-2"/> Schedule Home Sample Collection</Button>
    </SectionCard>
);

const ClinicalNotes = () => (
    <SectionCard title="Clinical Notes & Prescriptions">
        <Tabs defaultValue="clinical-notes">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
                <TabsTrigger value="e-prescriptions">E-Prescriptions</TabsTrigger>
                <TabsTrigger value="medicines">Medicines</TabsTrigger>
            </TabsList>
            <TabsContent value="clinical-notes" className="mt-4 space-y-3">
                <div className="flex items-start space-x-3">
                    <Checkbox id="note1" />
                    <label htmlFor="note1" className="text-sm">Urine Diagnosis: mots 284-30 2339</label>
                </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="note2" />
                    <label htmlFor="note2" className="text-sm">Ahse ipreid altrieetiniseed is stleythe tersert instiegs</label>
                </div>
                <div className="flex items-start space-x-3">
                    <Checkbox id="note3" />
                    <label htmlFor="note3" className="text-sm">Thee def/Aestire 200-90 2008</label>
                </div>
            </TabsContent>
        </Tabs>
    </SectionCard>
);

const LabAndPharmacyServices = () => (
    <SectionCard title="Lab & Pharmacy Services">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h3 className="font-semibold mb-2">Book Lab Tests</h3>
                <div className="space-y-2">
                     <div className="flex items-start space-x-3">
                        <Checkbox id="lab1" />
                        <label htmlFor="lab1" className="text-sm">Uved Presciption 293-00 2223</label>
                    </div>
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2">Order Medicines</h3>
                <div className="space-y-2">
                     <div className="flex items-start space-x-3">
                        <Checkbox id="med1" />
                        <label htmlFor="med1" className="text-sm">Sesad Presciption 303-30 2027</label>
                    </div>
                </div>
            </div>
        </div>
    </SectionCard>
);

const LabAndPharmacySupport = () => (
    <SectionCard title="Lab & Pharmacy Support">
        <div className="space-y-3">
             <Button variant="destructive" className="w-full justify-start"><Siren className="mr-2"/>Emergency: Find Nearest Hospital</Button>
             <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full justify-center"><Phone className="mr-2"/> Priority Contact</Button>
                <Button variant="outline" className="w-full justify-center"><MessageSquare className="mr-2"/> Chat</Button>
             </div>
             <Button variant="outline" className="w-full justify-start"><FileText className="mr-2"/> Consultation History</Button>
        </div>
    </SectionCard>
);


export default function ClinicalCarePage() {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="animate-slide-up">
            <h1 className="text-3xl font-headline font-bold">Clinical Care & Hospital Services</h1>
            <p className="text-muted-foreground">
                Access end-to-end medical services from the comfort of your home.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="hidden xl:block xl:col-span-1">
                <Card className="p-4 bg-card/50">
                    <h3 className="font-headline text-lg p-2">Clinical Care</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 text-primary bg-primary/10">
                            <Stethoscope className="h-5 w-5" />
                            <span className="font-semibold">Specialization</span>
                            <ChevronRight className="h-5 w-5 ml-auto" />
                        </a>
                         <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 text-muted-foreground">
                            <Hospital className="h-5 w-5" />
                            <span>Book Orafies</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 text-muted-foreground">
                            <Pill className="h-5 w-5" />
                            <span>Medication</span>
                        </a>
                         <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 text-muted-foreground">
                            <FileText className="h-5 w-5" />
                            <span>Heel torxtmtbes</span>
                        </a>
                         <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 text-muted-foreground">
                            <User className="h-5 w-5" />
                            <span>Ceanconkates</span>
                        </a>
                    </nav>
                </Card>
            </div>
            <div className="lg:col-span-3 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 md:col-span-2 space-y-6">
                    <FindDoctorsAndHospitals />
                    <BookAppointment />
                    <ClinicalNotes />
                </div>
                <div className="lg:col-span-1 md:col-span-1 space-y-6">
                    <BrowseProfilesAndConsult />
                    <MedicalHistory />
                    <LabAndPharmacyServices />
                </div>
                 <div className="lg:col-span-1 md:col-span-1 space-y-6">
                    <ShareHealthData />
                    <LabAndPharmacySupport />
                </div>
            </div>
        </div>
    </div>
  );
}
