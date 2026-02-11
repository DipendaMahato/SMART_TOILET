'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { subDays, startOfDay, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplets, FlaskConical, Bone, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = 'today' | 'weekly' | 'monthly';

// Helper function to convert Specific Gravity to a hydration percentage
const sgToHydration = (sg: number | null | undefined): number => {
  if (sg === null || sg === undefined || isNaN(sg) || sg === 0) return 0;
  // Clamp SG to a reasonable physiological range to avoid extreme percentages
  const clampedSg = Math.max(1.002, Math.min(1.035, sg));
  // Invert the scale: lower SG means higher hydration
  const percentage = 100 * (1.035 - clampedSg) / (1.035 - 1.002);
  return Math.round(Math.max(0, Math.min(100, percentage)));
};

// Helper to parse Bristol scale from string like "Type 4"
const parseBristol = (consistency: string | null | undefined): number => {
    if (!consistency) return 0;
    const match = consistency.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const HealthRecordCard = ({ record }: { record: any }) => {
    const recordDate = record.timestamp instanceof Timestamp ? record.timestamp.toDate() : new Date(record.timestamp);

    const dataPoints = [
        { label: 'Hydration', value: `${sgToHydration(record.urineSpecificGravity)}%`, icon: Droplets, color: 'text-teal-400' },
        { label: 'Urine pH', value: record.urinePH ?? 'N/A', icon: FlaskConical, color: 'text-purple-400' },
        { label: 'Specific Gravity', value: record.urineSpecificGravity ?? 'N/A', icon: FlaskConical, color: 'text-blue-400' },
        { label: 'Protein', value: record.urineProtein ?? 'N/A', icon: FlaskConical, color: 'text-yellow-400' },
        { label: 'Glucose', value: record.urineGlucose ?? 'N/A', icon: FlaskConical, color: 'text-orange-400' },
        { label: 'Stool Consistency', value: `Type ${parseBristol(record.stoolConsistency)}`, icon: Bone, color: 'text-amber-600' },
    ];

    return (
        <Card className="bg-white/5 border border-teal-500/20 shadow-lg shadow-teal-500/5 transition-all hover:border-teal-500/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-teal-500/10">
                <CardTitle className="text-base font-medium text-gray-300">
                    Health Record
                </CardTitle>
                <div className="text-xs text-gray-400 flex items-center gap-3">
                    <div className="flex items-center gap-1.5"><Calendar size={14} /><span>{format(recordDate, 'PPP')}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /><span>{format(recordDate, 'p')}</span></div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                    {dataPoints.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-opacity-20", color.replace('text-', 'bg-') + '/10')}>
                                <Icon className={cn("h-6 w-6", color)} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{label}</p>
                                <p className="text-lg font-bold">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const RecordSkeleton = () => (
     <Card className="bg-white/5 border border-teal-500/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/4" />
        </CardHeader>
        <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)


export default function VitalsTrendsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const { user } = useUser();
  const firestore = useFirestore();

  const queryStartDate = useMemo(() => {
    const now = new Date();
    if (timeRange === 'today') return startOfDay(now);
    if (timeRange === 'weekly') return startOfDay(subDays(now, 6));
    if (timeRange === 'monthly') return startOfDay(subDays(now, 29));
    return now;
  }, [timeRange]);

  const healthDataQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, `users/${user.uid}/healthData`),
      where('timestamp', '>=', queryStartDate),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user?.uid, queryStartDate]);

  const { data: healthRecords, isLoading } = useCollection<any>(healthDataQuery);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-lime-emerald to-glow-teal-green animate-text-gradient bg-400">User Health Records</h1>
          <p className="text-muted-foreground">
            View and manage your recorded health data.
          </p>
        </div>
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 w-full md:w-auto bg-card border border-input">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        {isLoading && (
            <>
                <RecordSkeleton />
                <RecordSkeleton />
            </>
        )}
        {!isLoading && healthRecords && healthRecords.length > 0 && (
            healthRecords.map(record => (
                <HealthRecordCard key={record.id} record={record} />
            ))
        )}
         {!isLoading && (!healthRecords || healthRecords.length === 0) && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No health records found for this period.</p>
            </div>
        )}
      </div>
    </div>
  );
}
