'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HydrationTrendChart } from '@/components/charts/trends/hydration-trend-chart';
import { UrinePhTrendChart } from '@/components/charts/trends/urine-ph-trend-chart';
import { UrineBiomarkerTrendChart } from '@/components/charts/trends/urine-biomarker-trend-chart';
import { StoolConsistencyTrendChart } from '@/components/charts/trends/stool-consistency-trend-chart';

const todayData = {
  hydration: [
    { name: '6am', glucose: 30 }, { name: '9am', glucose: 45 }, { name: '12pm', glucose: 40 }, { name: '3pm', glucose: 55 }, { name: '6pm', glucose: 60 }, { name: '9pm', glucose: 50 },
  ],
  ph: [
    { name: '6am', value: 15 }, { name: '9am', value: 18 }, { name: '12pm', value: 20 }, { name: '3pm', value: 25 }, { name: '6pm', value: 22 }, { name: '9pm', value: 24 },
  ],
  biomarker: [
    { name: '6am', protein: 10, glucose: 5 }, { name: '9am', protein: 12, glucose: 8 }, { name: '12pm', protein: 8, glucose: 6 }, { name: '3pm', protein: 15, glucose: 7 }, { name: '6pm', protein: 11, glucose: 9 }, { name: '9pm', protein: 13, glucose: 5 },
  ],
  stool: [
    { name: '6am', bristol: 20, highRisk: 30 }, { name: '9am', bristol: 25, highRisk: 30 }, { name: '12pm', bristol: 22, highRisk: 30 }, { name: '3pm', bristol: 28, highRisk: 30 }, { name: '6pm', bristol: 30, highRisk: 30 }, { name: '9pm', bristol: 26, highRisk: 30 },
  ],
};

const weeklyData = {
  hydration: [
    { name: 'Sun', glucose: 40 }, { name: 'Mon', glucose: 42 }, { name: 'Tue', glucose: 35 }, { name: 'Wed', glucose: 50 }, { name: 'Thu', glucose: 48 }, { name: 'Fri', glucose: 55 }, { name: 'Sat', glucose: 52 },
  ],
  ph: [
    { name: 'Sun', value: 20 }, { name: 'Mon', value: 22 }, { name: 'Tue', value: 18 }, { name: 'Wed', value: 25 }, { name: 'Thu', value: 24 }, { name: 'Fri', value: 28 }, { name: 'Sat', value: 26 },
  ],
  biomarker: [
    { name: 'Sun', protein: 14, glucose: 7 }, { name: 'Mon', protein: 16, glucose: 9 }, { name: 'Tue', protein: 12, glucose: 6 }, { name: 'Wed', protein: 18, glucose: 10 }, { name: 'Thu', protein: 15, glucose: 8 }, { name: 'Fri', protein: 20, glucose: 12 }, { name: 'Sat', protein: 17, glucose: 9 },
  ],
  stool: [
    { name: 'Sun', bristol: 25, highRisk: 30 }, { name: 'Mon', bristol: 28, highRisk: 30 }, { name: 'Tue', bristol: 22, highRisk: 30 }, { name: 'Wed', bristol: 30, highRisk: 30 }, { name: 'Thu', bristol: 27, highRisk: 30 }, { name: 'Fri', value: 32, highRisk: 30 }, { name: 'Sat', bristol: 29, highRisk: 30 },
  ],
};

const monthlyData = {
  hydration: [
    { name: 'Jan', glucose: 60 }, { name: 'Feb', glucose: 58 }, { name: 'Mar', glucose: 65 }, { name: 'Apr', glucose: 62 }, { name: 'May', glucose: 70 }, { name: 'Jun', glucose: 68 }, { name: 'Jul', glucose: 72 },
  ],
  ph: [
    { name: 'Jan', value: 25 }, { name: 'Feb', value: 28 }, { name: 'Mar', value: 30 }, { name: 'Apr', value: 27 }, { name: 'May', value: 32 }, { name: 'Jun', value: 31 }, { name: 'Jul', value: 35 },
  ],
  biomarker: [
    { name: 'Jan', protein: 18, glucose: 9 }, { name: 'Feb', protein: 22, glucose: 11 }, { name: 'Mar', protein: 20, glucose: 10 }, { name: 'Apr', protein: 25, glucose: 13 }, { name: 'May', protein: 23, glucose: 12 }, { name: 'Jun', protein: 28, glucose: 15 }, { name: 'Jul', protein: 26, glucose: 14 },
  ],
  stool: [
    { name: 'Jan', bristol: 30, highRisk: 30 }, { name: 'Feb', bristol: 32, highRisk: 30 }, { name: 'Mar', bristol: 28, highRisk: 30 }, { name: 'Apr', value: 35, highRisk: 30 }, { name: 'May', bristol: 33, highRisk: 30 }, { name: 'Jun', value: 38, highRisk: 30 }, { name: 'Jul', value: 36, highRisk: 30 },
  ],
};

type TimeRange = 'today' | 'weekly' | 'monthly';

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="bg-white/5 border border-teal-500/20 shadow-lg shadow-teal-500/5">
    <CardHeader>
      <CardTitle className="text-gray-300 font-semibold text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

export default function VitalsTrendsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

  const dataMap = {
    today: todayData,
    weekly: weeklyData,
    monthly: monthlyData,
  };

  const currentData = dataMap[timeRange];

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
        <ChartCard title="Hydration Trend (%)">
          <HydrationTrendChart data={currentData.hydration} />
        </ChartCard>
        <ChartCard title="Urine pH Trend">
          <UrinePhTrendChart data={currentData.ph} />
        </ChartCard>
        <ChartCard title="Dipstick Biomarker Trend (Protein/Glucose)">
          <UrineBiomarkerTrendChart data={currentData.biomarker} />
        </ChartCard>
        <ChartCard title="Stool Consistency Trend (Bristol Scale)">
          <StoolConsistencyTrendChart data={currentData.stool} />
        </ChartCard>
      </div>
    </div>
  );
}
