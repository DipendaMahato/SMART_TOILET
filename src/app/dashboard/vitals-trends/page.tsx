
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { subMonths, subDays, startOfDay, endOfDay, startOfHour, format, eachDayOfInterval, lastDayOfMonth, eachMonthOfInterval, startOfMonth, getMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HydrationTrendChart } from '@/components/charts/trends/hydration-trend-chart';
import { UrinePhTrendChart } from '@/components/charts/trends/urine-ph-trend-chart';
import { UrineBiomarkerTrendChart } from '@/components/charts/trends/urine-biomarker-trend-chart';
import { StoolConsistencyTrendChart } from '@/components/charts/trends/stool-consistency-trend-chart';
import { Skeleton } from '@/components/ui/skeleton';

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

// Helper to calculate average of a property in an array of objects
const average = (arr: any[], prop: string): number => {
  const validItems = arr.filter(item => typeof item[prop] === 'number' && !isNaN(item[prop]));
  if (validItems.length === 0) return 0;
  const sum = validItems.reduce((acc, item) => acc + item[prop], 0);
  return sum / validItems.length;
};


const ChartCard = ({ title, children, isLoading }: { title: string; children: React.ReactNode; isLoading?: boolean }) => (
  <Card className="bg-white/5 border border-teal-500/20 shadow-lg shadow-teal-500/5">
    <CardHeader>
      <CardTitle className="text-gray-300 font-semibold text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        children
      )}
    </CardContent>
  </Card>
);

export default function VitalsTrendsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const { user } = useUser();
  const firestore = useFirestore();

  const queryStartDate = useMemo(() => {
    const now = new Date();
    if (timeRange === 'today') return startOfDay(now);
    if (timeRange === 'weekly') return startOfDay(subDays(now, 6));
    if (timeRange === 'monthly') return startOfMonth(subMonths(now, 5));
    return now;
  }, [timeRange]);

  const healthDataQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, `users/${user.uid}/healthData`),
      where('timestamp', '>=', queryStartDate),
      orderBy('timestamp', 'asc')
    );
  }, [firestore, user?.uid, queryStartDate]);

  const { data: rawHealthData, isLoading } = useCollection<any>(healthDataQuery);

  const processedData = useMemo(() => {
    if (!rawHealthData) {
      return { hydration: [], ph: [], biomarker: [], stool: [] };
    }

    const healthData = rawHealthData.map(d => ({
        ...d,
        timestamp: d.timestamp instanceof Timestamp ? d.timestamp.toDate() : new Date(d.timestamp),
    }));

    if (timeRange === 'today') {
        const hours = Array.from({ length: 24 }, (_, i) => new Date(new Date().setHours(i, 0, 0, 0)));
        const groupedByHour = hours.map(hour => {
            const name = format(hour, 'ha');
            const entries = healthData.filter(d => startOfHour(d.timestamp).getTime() === hour.getTime());
            
            if (entries.length === 0) return null;

            return {
                name,
                hydration: sgToHydration(average(entries, 'urineSpecificGravity')),
                ph: average(entries, 'urinePH'),
                sg: average(entries, 'urineSpecificGravity'),
                protein: average(entries, 'urineProtein'),
                glucose: average(entries, 'urineGlucose'),
                bristol: average(entries.map(e => ({ value: parseBristol(e.stoolConsistency) })), 'value'),
                normalStool: 4,
            };
        }).filter(d => d !== null);

        return {
            hydration: groupedByHour.map(d => ({ name: d!.name, hydration: d!.hydration })),
            ph: groupedByHour.map(d => ({ name: d!.name, ph: d!.ph, sg: d!.sg })),
            biomarker: groupedByHour.map(d => ({ name: d!.name, protein: d!.protein, glucose: d!.glucose })),
            stool: groupedByHour.map(d => ({ name: d!.name, bristol: d!.bristol, normalStool: d!.normalStool })),
        };
    }

    if (timeRange === 'weekly') {
        const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
        const groupedByDay = last7Days.map(day => {
            const name = format(day, 'E');
            const entries = healthData.filter(d => startOfDay(d.timestamp).getTime() === startOfDay(day).getTime());
            
            return {
                name,
                hydration: entries.length > 0 ? sgToHydration(average(entries, 'urineSpecificGravity')) : null,
                ph: entries.length > 0 ? average(entries, 'urinePH') : null,
                sg: entries.length > 0 ? average(entries, 'urineSpecificGravity') : null,
                protein: entries.length > 0 ? average(entries, 'urineProtein') : null,
                glucose: entries.length > 0 ? average(entries, 'urineGlucose') : null,
                bristol: entries.length > 0 ? average(entries.map(e => ({ value: parseBristol(e.stoolConsistency) })), 'value') : null,
                normalStool: 4,
            };
        });
        return {
            hydration: groupedByDay.map(d => ({ name: d.name, hydration: d.hydration })),
            ph: groupedByDay.map(d => ({ name: d.name, ph: d.ph, sg: d.sg })),
            biomarker: groupedByDay.map(d => ({ name: d.name, protein: d.protein, glucose: d.glucose })),
            stool: groupedByDay.map(d => ({ name: d.name, bristol: d.bristol, normalStool: d.normalStool })),
        };
    }

    if (timeRange === 'monthly') {
        const last6Months = eachMonthOfInterval({ start: subMonths(new Date(), 5), end: new Date() });
         const groupedByMonth = last6Months.map(month => {
            const name = format(month, 'MMM');
            const entries = healthData.filter(d => startOfMonth(d.timestamp).getTime() === startOfMonth(month).getTime());
            
            return {
                name,
                hydration: entries.length > 0 ? sgToHydration(average(entries, 'urineSpecificGravity')) : null,
                ph: entries.length > 0 ? average(entries, 'urinePH') : null,
                sg: entries.length > 0 ? average(entries, 'urineSpecificGravity') : null,
                protein: entries.length > 0 ? average(entries, 'urineProtein') : null,
                glucose: entries.length > 0 ? average(entries, 'urineGlucose') : null,
                bristol: entries.length > 0 ? average(entries.map(e => ({ value: parseBristol(e.stoolConsistency) })), 'value') : null,
                normalStool: 4,
            };
        });
         return {
            hydration: groupedByMonth.map(d => ({ name: d.name, hydration: d.hydration })),
            ph: groupedByMonth.map(d => ({ name: d.name, ph: d.ph, sg: d.sg })),
            biomarker: groupedByMonth.map(d => ({ name: d.name, protein: d.protein, glucose: d.glucose })),
            stool: groupedByMonth.map(d => ({ name: d.name, bristol: d.bristol, normalStool: d.normalStool })),
        };
    }

    return { hydration: [], ph: [], biomarker: [], stool: [] };
  }, [rawHealthData, timeRange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-lime-emerald to-glow-teal-green animate-text-gradient bg-400">Health Vitals &amp; Trends</h1>
          <p className="text-muted-foreground">
            Analytical views of health vitals with daily, weekly, and long-term trend graphs.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <ChartCard title="Hydration Trend (%)" isLoading={isLoading}>
          <HydrationTrendChart data={processedData.hydration} />
        </ChartCard>
        <ChartCard title="Urine pH and Specific Gravity Trend" isLoading={isLoading}>
          <UrinePhTrendChart data={processedData.ph} />
        </ChartCard>
        <ChartCard title="Dipstick Biomarker Trend (Protein/Glucose)" isLoading={isLoading}>
          <UrineBiomarkerTrendChart data={processedData.biomarker} />
        </ChartCard>
        <ChartCard title="Stool Consistency Trend (Bristol Scale)" isLoading={isLoading}>
          <StoolConsistencyTrendChart data={processedData.stool} />
        </ChartCard>
      </div>
    </div>
  );
}
