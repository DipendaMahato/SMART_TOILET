
'use client';

import { useState, useMemo } from 'react';
import { useUser, useDatabase, useRtdbValue, useMemoFirebase } from '@/firebase';
import { ref, remove } from 'firebase/database';
import { subDays, startOfDay, format, isSameDay, parse, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Droplets, FlaskConical, Bone, Calendar as CalendarIcon, Clock, TestTube2, HeartPulse, Waves, Search, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

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

const HealthRecordCard = ({ record, onDelete }: { record: any, onDelete: (id: string) => void }) => {
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
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-400 flex items-center gap-3">
                        <div className="flex items-center gap-1.5"><CalendarIcon size={14} /><span>{format(recordDate, 'PPP')}</span></div>
                        <div className="flex items-center gap-1.5"><Clock size={14} /><span>{format(recordDate, 'p')}</span></div>
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-status-red" aria-label="Delete Record">
                                <Trash2 size={16} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this record?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this health record from the database.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Yes, Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
  const [dateInput, setDateInput] = useState('');
  const [searchedDate, setSearchedDate] = useState<Date | undefined>();
  const { user } = useUser();
  const database = useDatabase();
  const { toast } = useToast();

  const healthDataReportsRef = useMemoFirebase(() => {
    if (!database || !user?.uid) return null;
    return ref(database, `Users/${user.uid}/Reports`);
  }, [database, user?.uid]);

  const { data: reports, isLoading } = useRtdbValue<any>(healthDataReportsRef);

  const handleDeleteRecord = async (recordId: string) => {
    if (!database || !user?.uid) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Cannot delete record. Database not connected or user not authenticated.",
        });
        return;
    }

    const parts = recordId.split('-');
    if (parts.length < 4) { // e.g., "2026-02-14-Sens_165030" -> ["2026", "02", "14", "Sens_165030"]
        toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid record ID format for deletion.",
        });
        return;
    }
    const dateStr = parts.slice(0, 3).join('-');
    const sessionKey = parts.slice(3).join('-');
    
    // We only delete the hardware session as it's the primary key for the record.
    // The associated medical session will become orphaned but won't appear in the UI.
    const recordRef = ref(database, `Users/${user.uid}/Reports/${dateStr}/Hardware_Sessions/${sessionKey}`);

    try {
        await remove(recordRef);
        toast({
            title: "Record Deleted",
            description: `The health record from ${format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'PPP')} has been successfully deleted.`,
        });
    } catch (error: any) {
        console.error("Error deleting record:", error);
        toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: error.message || "An unexpected error occurred.",
        });
    }
  };

  const healthRecords = useMemo(() => {
    if (!reports) return [];

    const allRecords: any[] = [];

    Object.keys(reports).forEach(dateStr => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
      
      const dailyReport = reports[dateStr];
      if (typeof dailyReport !== 'object' || dailyReport === null) return;

      const hardwareSessions = dailyReport.Hardware_Sessions || {};
      const medicalSessions = dailyReport.Medical_Sessions || {};

      const sortedHwKeys = Object.keys(hardwareSessions).sort();
      const sortedMedKeys = Object.keys(medicalSessions).sort();

      sortedHwKeys.forEach(hwKey => {
          const hwSession = hardwareSessions[hwKey];
          if (typeof hwSession !== 'object' || hwSession === null || !hwSession.metadata) return;
          
          const hwTimeStr = hwSession.metadata.time || '00:00:00';
          const hwTimestamp = parse(`${dateStr} ${hwTimeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
          
          if (!isValid(hwTimestamp)) return;

          let matchedMedSession: any = null;
          let minTimeDiff = Infinity;
          
          sortedMedKeys.forEach(medKey => {
              const medSession = medicalSessions[medKey];
              const medTimeStr = medSession.metadata?.time || '00:00:00';
              const medTimestamp = parse(`${dateStr} ${medTimeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
              
              if(isValid(medTimestamp)) {
                  const timeDiff = medTimestamp.getTime() - hwTimestamp.getTime();
                  if (timeDiff >= 0 && timeDiff < minTimeDiff) {
                      minTimeDiff = timeDiff;
                      matchedMedSession = medSession;
                  }
              }
          });
          
          const chemistry = matchedMedSession?.Chemistry_Result || {};
          const sensorData = hwSession.sensorData || {};
          
          const record = {
            id: `${dateStr}-${hwKey}`,
            timestamp: hwTimestamp,
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
            blood: sensorData.blood_detected_sensor,
            nitrite: chemistry.chem_nitrite,
            leukocytes: chemistry.chem_leukocytes,
            stoolConsistency: 'N/A', // Placeholder
          };
          allRecords.push(record);
      });
    });
    
    const filteredRecords = allRecords.filter(record => {
        if (searchedDate) {
            return isSameDay(record.timestamp, searchedDate);
        }
        if (timeRange) {
            const now = new Date();
            let startDate: Date;
            if (timeRange === 'today') startDate = startOfDay(now);
            else if (timeRange === 'weekly') startDate = startOfDay(subDays(now, 6));
            else startDate = startOfDay(subDays(now, 29)); // monthly
            return record.timestamp >= startDate;
        }
        return false;
    });

    return filteredRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  }, [reports, timeRange, searchedDate]);

  const handleTimeRangeChange = (value: string) => {
      if (value) {
          setTimeRange(value as TimeRange);
          setSearchedDate(undefined);
          setDateInput('');
      }
  };

  const handleSearch = () => {
    if (!dateInput) {
        setSearchedDate(undefined);
        setTimeRange('weekly');
        return;
    }

    const parsedDate = parse(dateInput, 'yyyy-MM-dd', new Date());

    if (isValid(parsedDate) && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        const [year, month, day] = dateInput.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        setSearchedDate(localDate);
        setTimeRange('');
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Date Format",
            description: "Please enter the date in YYYY-MM-DD format.",
        });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch();
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
             <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <div className="relative w-full md:w-[180px]">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="w-full bg-card border-input pl-9"
                    />
                </div>
                <Button type="submit" size="icon">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                </Button>
            </form>
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
                <HealthRecordCard key={record.id} record={record} onDelete={handleDeleteRecord} />
            ))
        )}
         {!isLoading && (!healthRecords || healthRecords.length === 0) && (
            <div className="text-center py-16 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground font-semibold text-lg">No health records found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                    {searchedDate ? `There are no records for ${format(searchedDate, 'PPP')}.` : 'No records for the selected period.'}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}

    