
'use client';

import { useState, useMemo } from 'react';
import { useUser, useDatabase, useRtdbValue, useMemoFirebase } from '@/firebase';
import { ref } from 'firebase/database';
import { subDays, startOfDay, format, isSameDay, parse, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplets, FlaskConical, Bone, Calendar as CalendarIcon, Clock, TestTube2, HeartPulse, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';


type TimeRange = 'today' | 'weekly' | 'monthly' | '';

// Helper function to convert Specific Gravity to a hydration percentage
const sgToHydration = (sg: number | null | undefined): number => {
  if (sg === null || sg === undefined || isNaN(sg) || sg === 0) return 0;
  // Clamp SG to a reasonable physiological range to avoid extreme percentages
  const clampedSg = Math.max(1.002, Math.min(1.035, sg));
  // Invert the scale: lower SG means higher hydration
  const percentage = 100 * (1.035 - clampedSg) / (1.035 - 1.002);
  return Math.round(Math.max(0, Math.min(100, percentage)));
};

const HealthRecordCard = ({ record }: { record: any }) => {
    const recordDate = record.timestamp;

    const dataPoints = [
        { label: 'Hydration', value: `${sgToHydration(record.specificGravity)}%`, icon: Droplets, color: 'text-teal-400' },
        { label: 'Urine pH', value: record.ph ? parseFloat(record.ph).toFixed(2) : 'N/A', icon: FlaskConical, color: 'text-purple-400' },
        { label: 'Specific Gravity', value: record.specificGravity ? parseFloat(record.specificGravity).toFixed(3) : 'N/A', icon: FlaskConical, color: 'text-blue-400' },
        { label: 'TDS', value: record.tds !== undefined ? `${record.tds} ppm` : 'N/A', icon: Waves, color: 'text-green-400' },
        { label: 'Turbidity', value: record.turbidity !== undefined ? `${record.turbidity} NTU` : 'N/A', icon: Waves, color: 'text-gray-400' },
        { label: 'Protein', value: record.protein ?? 'N/A', icon: FlaskConical, color: 'text-yellow-400' },
        { label: 'Glucose', value: record.glucose ?? 'N/A', icon: FlaskConical, color: 'text-orange-400' },
        { label: 'Blood', value: record.blood === false ? 'Negative' : (record.blood ? 'Positive' : 'N/A'), icon: HeartPulse, color: 'text-red-500' },
        { label: 'Bilirubin', value: record.bilirubin ?? 'N/A', icon: TestTube2, color: 'text-red-400' },
        { label: 'Urobilinogen', value: record.urobilinogen ?? 'N/A', icon: TestTube2, color: 'text-pink-400' },
        { label: 'Ketone', value: record.ketone ?? 'N/A', icon: TestTube2, color: 'text-indigo-400' },
        { label: 'Ascorbic Acid', value: record.ascorbicAcid ?? 'N/A', icon: TestTube2, color: 'text-lime-400' },
        { label: 'Nitrite', value: record.nitrite ?? 'N/A', icon: FlaskConical, color: 'text-gray-400' },
        { label: 'Leukocytes', value: record.leukocytes ?? 'N/A', icon: FlaskConical, color: 'text-cyan-400' },
        { label: 'Stool Consistency', value: record.stoolConsistency, icon: Bone, color: 'text-amber-600' },
    ];

    return (
        <Card className="bg-white/5 border border-teal-500/20 shadow-lg shadow-teal-500/5 transition-all hover:border-teal-500/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-teal-500/10">
                <CardTitle className="text-base font-medium text-gray-300">
                    Health Record
                </CardTitle>
                <div className="text-xs text-gray-400 flex items-center gap-3">
                    <div className="flex items-center gap-1.5"><CalendarIcon size={14} /><span>{format(recordDate, 'PPP')}</span></div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /><span>{format(recordDate, 'p')}</span></div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                    {dataPoints.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-opacity-20", color.replace('text-', 'bg-') + '/10')}>
                                <Icon className={cn("h-6 w-6", color)} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{label}</p>
                                <p className="text-lg font-bold">{String(value)}</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
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
  const [customDate, setCustomDate] = useState<Date | undefined>();
  const [dateInput, setDateInput] = useState('');
  const { user } = useUser();
  const database = useDatabase();

  const healthDataReportsRef = useMemoFirebase(() => {
    if (!database || !user?.uid) return null;
    return ref(database, `Users/${user.uid}/Reports`);
  }, [database, user?.uid]);

  const { data: reports, isLoading } = useRtdbValue<any>(healthDataReportsRef);

  const healthRecords = useMemo(() => {
    if (!reports) return [];

    const allRecords: any[] = [];

    // This loop iterates through all dates in the reports object from Firebase.
    Object.keys(reports).forEach(dateStr => {
      // Basic validation for the date string format.
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
      
      const sessions = reports[dateStr];
      if (typeof sessions !== 'object' || sessions === null) return;

      // This inner loop iterates through all sessions for a given date.
      Object.keys(sessions).forEach(sessionId => {
        const session = sessions[sessionId];
        if (typeof session !== 'object' || session === null) return;
        
        // Combine date and time to create a precise timestamp for the record.
        const timeStr = session.metadata?.time || '00:00:00';
        const recordTimestamp = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
        
        if (!isValid(recordTimestamp)) return;
        
        // Map the data from Firebase to a structured record object.
        const chemistry = session.Chemistry_Result || {};
        const sensorData = session.sensorData || {};
        const record = {
          id: `${dateStr}-${sessionId}`,
          timestamp: recordTimestamp,
          ph: sensorData.ph_value_sensor,
          specificGravity: sensorData.specific_gravity_sensor,
          tds: sensorData.tds_value,
          turbidity: sensorData.turbidity,
          bilirubin: chemistry.chem_bilirubin,
          urobilinogen: chemistry.chem_urobilinogen,
          ketone: chemistry.chem_ketones,
          ascorbicAcid: chemistry.chem_ascorbicAcid,
          glucose: chemistry.chem_glucose,
          protein: chemistry.chem_protein,
          blood: sensorData.blood_detected_sensor, // Sourced from sensorData
          nitrite: chemistry.chem_nitrite,
          leukocytes: chemistry.chem_leukocytes,
          stoolConsistency: 'N/A', // Placeholder
        };
        allRecords.push(record);
      });
    });
    
    // Now, filter the collected records based on the selected time range or custom date.
    const filteredRecords = allRecords.filter(record => {
        if (customDate) {
            // If a custom date is set, only include records from that day.
            return isSameDay(record.timestamp, customDate);
        }
        if (timeRange) {
            const now = new Date();
            let startDate: Date;
            if (timeRange === 'today') startDate = startOfDay(now);
            else if (timeRange === 'weekly') startDate = startOfDay(subDays(now, 6));
            else startDate = startOfDay(subDays(now, 29)); // monthly
            // Include records that are on or after the calculated start date.
            return record.timestamp >= startDate;
        }
        // By default, if no filter is active (e.g., during initial load with empty input), show weekly.
        if (!customDate && !timeRange) {
            const weeklyStartDate = startOfDay(subDays(new Date(), 6));
            return record.timestamp >= weeklyStartDate;
        }
        return false;
    });

    // Sort the final, filtered records in descending order (newest first).
    return filteredRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  }, [reports, timeRange, customDate]);

  const handleTimeRangeChange = (value: string) => {
      if (value) {
          setTimeRange(value as TimeRange);
          setCustomDate(undefined);
          setDateInput('');
      }
  };

  const handleDateSelect = (date: Date | undefined) => {
      setCustomDate(date);
      if (date) {
          setTimeRange('');
          setDateInput(format(date, 'yyyy-MM-dd'));
      }
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-lime-emerald to-glow-teal-green animate-text-gradient bg-400">User Health Records</h1>
          <p className="text-muted-foreground">
            View and manage your recorded health data.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
            <Tabs value={timeRange} onValueChange={handleTimeRangeChange} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-3 w-full md:w-auto bg-card border border-input">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
            </Tabs>
             <div className="relative w-full md:w-[200px]">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={dateInput}
                    onChange={(e) => {
                        const inputText = e.target.value;
                        setDateInput(inputText);

                        const parsedDate = parse(inputText, 'yyyy-MM-dd', new Date());

                        if (isValid(parsedDate) && /^\d{4}-\d{2}-\d{2}$/.test(inputText)) {
                            const [year, month, day] = inputText.split('-').map(Number);
                            const localDate = new Date(year, month - 1, day);
                            handleDateSelect(localDate);
                        } else if (inputText === '') {
                            if (customDate) {
                                handleDateSelect(undefined);
                                setTimeRange('weekly'); 
                            }
                        }
                    }}
                    className="w-full bg-card border-input pl-9"
                />
            </div>
        </div>
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

    