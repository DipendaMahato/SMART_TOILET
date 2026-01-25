
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Droplets, ShieldCheck, Heart, FileText, Bone, Activity } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { DownloadableReport } from '@/components/insights/downloadable-report';
import { useUser, useFirestore, useDatabase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { HealthAssistantWidget } from '@/components/dashboard/health-assistant-widget';

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
  const reportRef = useRef<HTMLDivElement>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();
  const database = useDatabase();

  useEffect(() => {
    // Set the date only on the client-side to avoid hydration mismatch
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  const handleDownload = async () => {
      if (!user || !firestore || !database) {
          alert("User not logged in or database not available.");
          return;
      }
      setLoading(true);

      try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.exists() ? userDocSnap.data() : null;

          const rtdbRef = ref(database, `Users/${user.uid}/sensorData`);
          const rtdbSnap = await get(rtdbRef);
          const latestHealthData = rtdbSnap.exists() ? rtdbSnap.val() : {};
          
          setReportData({ user: userData, health: latestHealthData });

          // This timeout ensures that the reportData state has been updated and the
          // DownloadableReport component has re-rendered with the new data before we try to print it.
          setTimeout(() => {
              const element = reportRef.current;
              if (element && window.html2pdf) {
                   const opt = {
                      margin:       0,
                      filename:     `Health_Report_${user.displayName?.replace(' ', '_') || 'User'}.pdf`,
                      image:        { type: 'jpeg', quality: 0.98 },
                      html2canvas:  { scale: 3, useCORS: true },
                      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
                  };
                  window.html2pdf().from(element).set(opt).save();
              }
              setLoading(false);
          }, 500);

      } catch (error) {
          console.error("Error generating report:", error);
          alert("Failed to generate report.");
          setLoading(false);
      }
  };


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="fixed -left-[9999px] top-0 opacity-0">
          <DownloadableReport ref={reportRef} data={reportData} />
      </div>

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
              strokeDashoffset="28.9"
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
          {currentDate ? `Last Assessment: ${currentDate}` : 'Loading date...'} - Data Period: Last 7 Days
        </p>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <HealthAssistantWidget />
      </div>

      <div className="animate-slide-up text-center" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-text-gradient bg-400 mb-4">System Health Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <HealthStatusCard key={card.title} {...card} />
          ))}
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
         <Card className="bg-card/50 border border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-text-gradient bg-400">Clinical Health Conclusion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-primary">Summary:</h3>
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
                    <Button onClick={handleDownload} loading={loading}>
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
