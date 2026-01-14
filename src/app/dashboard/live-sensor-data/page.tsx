
'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { CircularGauge } from '@/components/charts/circular-gauge';
import { SemiCircleGauge } from '@/components/charts/semi-circle-gauge';
import { TinyAreaChart } from '@/components/charts/tiny-area-chart';
import { JaggedLineChart } from '@/components/charts/jagged-line-chart';
import { ShieldCheck, BatteryFull, Droplet, Gauge, Signal, Wifi, Clock, Calendar, Zap, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export default function LiveSensorDataPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const healthDataQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/healthData`),
            orderBy('timestamp', 'desc'),
            limit(1)
        );
    }, [user, firestore]);

    const { data: healthData, isLoading } = useCollection(healthDataQuery);
    const latestData = healthData?.[0];

    const [autoFlush, setAutoFlush] = useState(true);
    const [lightControl, setLightControl] = useState(false);

    const StatusBadge = ({ label, status }: { label: string, status: 'OK' | 'HIGH' | 'MED' }) => {
        const statusClasses = {
            OK: 'bg-green-500/20 text-green-400 border-green-500/30',
            HIGH: 'bg-red-500/20 text-red-400 border-red-500/30',
            MED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        };
        return (
            <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">{label}:</span>
                <Badge variant="outline" className={cn('text-xs px-1.5 py-0', statusClasses[status])}>{status}</Badge>
            </div>
        );
    }
    
    const getChemicalColor = (level: number) => {
        if (level < 20) return 'text-red-500';
        if (level < 50) return 'text-yellow-400';
        return 'text-green-400';
    }

    const normalizeSpecificGravity = (sg: number) => {
        const minSg = 1.000;
        const maxSg = 1.040;
        return ((sg - minSg) / (maxSg - minSg)) * 100;
    }


    return (
        <div className="bg-navy p-4 md:p-8 rounded-2xl animate-fade-in min-h-full">
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h1 className="text-3xl font-headline font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-glow-green via-glow-cyan to-glow-blue animate-text-gradient bg-400">LIVE SENSOR DATA</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Row 1 */}
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4">Toilet Usage Status</h3>
                    <CircularGauge value={latestData?.isOccupied ? 100 : 0} label={latestData?.isOccupied ? "IN USE" : "NOT IN USE"} />
                    <p className="text-xs text-gray-500 mt-4">{latestData?.isOccupied ? 'Status: Occupied' : 'Status: Available'}</p>
                </SensorCard>

                <SensorCard className="border-green-500/50 shadow-green-500/20 lg:col-span-1 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '300ms' }}>
                     <h3 className="font-semibold text-green-400 mb-2">Leakage Alert Status</h3>
                     <ShieldCheck className="text-green-500 h-10 w-10" />
                     <p className="text-sm font-bold text-green-400 my-2">{latestData?.leakageDetected ? 'CRITICAL LEAK DETECTED!' : 'NO LEAKS DETECTED'}</p>
                     <div className="w-full h-16">
                        <JaggedLineChart />
                     </div>
                </SensorCard>
                
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4">Urine Test Analysis</h3>
                    <CircularGauge value={85} />
                    <div className="flex gap-4 mt-4">
                       <StatusBadge label="Glucose" status={latestData?.urineGlucose > 140 ? 'HIGH' : 'OK'} />
                       <StatusBadge label="Protein" status={latestData?.urineProtein > 20 ? 'HIGH' : 'OK'} />
                    </div>
                </SensorCard>

                {/* Row 2 */}
                <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-2 self-start">Specific Gravity</h3>
                    <SemiCircleGauge value={normalizeSpecificGravity(latestData?.urineSpecificGravity || 1.015)} />
                    <p className="text-xl font-bold text-gray-200 mt-2">{(latestData?.urineSpecificGravity || 0).toFixed(3)}</p>
                    <p className="text-xs text-gray-500">Normal Range: 1.005 - 1.030</p>
                </SensorCard>
                
                <SensorCard className="flex flex-col justify-between animate-slide-up" style={{ animationDelay: '600ms' }}>
                    <h3 className="font-semibold text-gray-300">Water Flow Monitor</h3>
                    <div className="w-full h-24">
                        <TinyAreaChart />
                    </div>
                    <p className="text-sm text-gray-400 text-right">{latestData?.waterFlowRate || 0} L/min</p>
                </SensorCard>
                
                <div className="grid grid-rows-2 gap-6">
                    <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up" style={{ animationDelay: '700ms' }}>
                        <h3 className="font-semibold text-gray-300">Flush Usage Counter</h3>
                        <p className="text-5xl font-bold text-teal-400 my-1">{latestData?.flushCount || 0}</p>
                        <p className="text-xs text-gray-500">Flushes Today</p>
                    </SensorCard>
                     <SensorCard className="animate-slide-up" style={{ animationDelay: '800ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm mb-2">Analysis in progress...</h3>
                        <div className="space-y-1">
                            <StatusBadge label="Urine pH" status={latestData?.urinePH > 7.5 ? 'HIGH' : 'OK'} />
                            <StatusBadge label="Protein" status={latestData?.urineProtein > 20 ? 'HIGH' : 'OK'} />
                        </div>
                    </SensorCard>
                </div>

                {/* Row 3 */}
                <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '900ms' }}>
                     <h3 className="font-semibold text-gray-300 mb-2">Chemical Level Status</h3>
                     <FlaskConical className={cn("h-10 w-10", getChemicalColor(latestData?.chemicalLevel || 0))} />
                     <p className={cn("text-lg font-bold mt-2", getChemicalColor(latestData?.chemicalLevel || 0))}>{latestData?.chemicalLevel || 0}%</p>
                </SensorCard>

                <div className="grid grid-cols-2 gap-6">
                     <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '1000ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm mb-2">Ammonia Gas</h3>
                        <SemiCircleGauge value={((latestData?.ammoniaLevel || 0) / 10) * 100} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">{(latestData?.ammoniaLevel || 0).toFixed(2)} ppm</p>
                    </SensorCard>
                     <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '1100ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm mb-2">Turbidity</h3>
                        <SemiCircleGauge value={latestData?.turbidity || 0} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">{latestData?.turbidity || 0} NTU</p>
                    </SensorCard>
                </div>

                <div className="grid grid-rows-2 gap-6">
                     <SensorCard className="flex items-center justify-between px-4 animate-slide-up" style={{ animationDelay: '1200ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm">Battery</h3>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-gray-200">{latestData?.batteryLevel || 0}%</p>
                           <BatteryFull className="h-6 w-6 text-green-400"/>
                        </div>
                    </SensorCard>
                    <SensorCard className="flex items-center justify-between px-4 animate-slide-up" style={{ animationDelay: '1300ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm">Connectivity</h3>
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-gray-200">{latestData?.isOnline ? 'ONLINE' : 'OFFLINE'}</p>
                           <Wifi className="h-6 w-6 text-teal-400"/>
                        </div>
                    </SensorCard>
                </div>
                 <SensorCard className="flex items-center justify-between px-4 animate-slide-up" style={{ animationDelay: '1400ms' }}>
                    <h3 className="font-semibold text-gray-300 text-sm">System Connectivity</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-200">{latestData?.signalStrength || 0}%</p>
                        <Signal className="h-6 w-6 text-green-400"/>
                    </div>
                </SensorCard>

                 <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '1500ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-2">Stool Test Analysis</h3>
                    <div className="flex items-center gap-2">
                       <Calendar className="h-5 w-5 text-gray-500"/>
                       <p className="text-sm font-bold text-green-400">LAST TEST: {latestData?.stoolConsistency || 'N/A'}</p>
                    </div>
                </SensorCard>
                 <SensorCard className="animate-slide-up" style={{ animationDelay: '1600ms' }}>
                    <h3 className="font-semibold text-gray-300 text-sm mb-2 flex items-center gap-2"><Zap size={16}/>Automation</h3>
                    <div className="space-y-2 mt-2">
                        <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Auto Flush</p>
                            <Switch checked={autoFlush} onCheckedChange={setAutoFlush} />
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Light Control</p>
                            <Switch checked={lightControl} onCheckedChange={setLightControl} />
                        </div>
                    </div>
                </SensorCard>
            </div>
        </div>
    );
}
