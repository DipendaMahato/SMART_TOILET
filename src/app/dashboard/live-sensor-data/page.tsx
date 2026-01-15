
'use client';
import { useState } from 'react';
import { useUser } from '@/firebase';
import { useDatabase, useRtdbValue, useMemoFirebase } from '@/firebase';
import { ref, update } from 'firebase/database';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { CircularGauge } from '@/components/charts/circular-gauge';
import { SemiCircleGauge } from '@/components/charts/semi-circle-gauge';
import { TinyAreaChart } from '@/components/charts/tiny-area-chart';
import { JaggedLineChart } from '@/components/charts/jagged-line-chart';
import { ShieldCheck, BatteryFull, Droplet, Gauge, Signal, Wifi, Clock, Calendar, Zap, FlaskConical, CircleAlert, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export default function LiveSensorDataPage() {
    const { user } = useUser();
    const database = useDatabase();

    const sensorDataRef = useMemoFirebase(() => {
        if (!database || !user?.uid) return null;
        return ref(database, `Users/${user.uid}/sensorData`);
    }, [database, user?.uid]);

    const { data: latestData } = useRtdbValue(sensorDataRef);

    const sendCommand = (key: string, value: boolean) => {
        if (!sensorDataRef) return;
        update(sensorDataRef, { [key]: value })
            .catch((err) => alert("Error sending command: " + err.message));
    };

    const StatusBadge = ({ label, status, className }: { label?: string, status: string, className?: string }) => {
        return (
            <div className="flex items-center gap-1.5">
                {label && <span className="text-xs text-gray-400">{label}:</span>}
                <Badge variant="outline" className={cn('text-xs px-1.5 py-0', className)}>{status}</Badge>
            </div>
        );
    }
    
    const getChemicalColor = (level: number) => {
        if (level < 20) return 'text-red-500';
        if (level < 50) return 'text-yellow-400';
        return 'text-green-400';
    }

    const calculatedPH = latestData?.ph_level ? (latestData.ph_level / 2187.5).toFixed(2) : '0.00';
    const phStatus = parseFloat(calculatedPH) > 8.0 ? "HIGH" : "NORMAL";

    return (
        <div className="bg-navy p-4 md:p-8 rounded-2xl animate-fade-in min-h-full">
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h1 className="text-3xl font-headline font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-glow-green via-glow-cyan to-glow-blue animate-text-gradient bg-400">LIVE SENSOR DATA</h1>
                <p className="text-sm text-gray-400 flex items-center gap-2"><span className="text-status-green">●</span> Live Health Monitoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <SensorCard className="flex flex-col justify-between animate-slide-up border-glow-teal-green/50" style={{ animationDelay: '200ms' }}>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-300">Urine pH Level</h3>
                             <StatusBadge 
                                status={phStatus} 
                                className={phStatus === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <p className="text-5xl font-bold text-gray-200 my-4">{calculatedPH}</p>
                    </div>
                    <p className="text-xs text-gray-500">Normal Range: 4.5 - 8.0</p>
                </SensorCard>

                <SensorCard className="flex flex-col justify-between animate-slide-up border-glow-cyan-blue/50" style={{ animationDelay: '300ms' }}>
                    <div>
                        <h3 className="font-semibold text-gray-300">Specific Gravity</h3>
                        <p className="text-5xl font-bold text-gray-200 my-4">{latestData?.specificGravity || '1.015'}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Protein Status</p>
                        <StatusBadge 
                            status={latestData?.proteinValue > 20 ? 'HIGH' : 'OK'}
                            className={latestData?.proteinValue > 20 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                         />
                    </div>
                </SensorCard>

                <SensorCard 
                    className={cn(
                        "flex flex-col justify-between animate-slide-up",
                        latestData?.bloodDetected ? "border-glow-red-rose/70" : "border-status-green/50"
                    )} 
                    style={{ animationDelay: '400ms' }}
                >
                    <div>
                        <h3 className="font-semibold text-gray-300">Blood Detection</h3>
                        {latestData?.bloodDetected ? (
                             <div className="my-4">
                                <CircleAlert className="h-10 w-10 text-red-400 mx-auto"/>
                                <p className="text-xl font-bold text-red-400 text-center mt-2">DETECTED</p>
                             </div>
                        ) : (
                             <div className="my-4">
                                <CheckCircle className="h-10 w-10 text-green-400 mx-auto"/>
                                <p className="text-xl font-bold text-green-400 text-center mt-2">NEGATIVE</p>
                             </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        {latestData?.bloodDetected ? "Health Alert: Consider contacting a doctor." : "No trace of blood found."}
                    </p>
                </SensorCard>

                <SensorCard className="flex flex-col justify-between animate-slide-up border-glow-purple-violet/50" style={{ animationDelay: '500ms' }}>
                    <div>
                        <h3 className="font-semibold text-gray-300">Ammonia (NH3)</h3>
                        <p className="text-5xl font-bold text-gray-200 my-4">{latestData?.ammonia || 0}<span className="text-2xl text-gray-400"> ppm</span></p>
                    </div>
                    <p className="text-xs text-gray-500">Air quality analysis</p>
                </SensorCard>


                {/* Row 2 */}
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up border-primary/50" style={{ animationDelay: '600ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4">Toilet Usage Status</h3>
                    <CircularGauge value={latestData?.isOccupied ? 100 : 0} label={latestData?.isOccupied ? "IN USE" : "NOT IN USE"} />
                    <p className="text-xs text-gray-500 mt-4">{latestData?.isOccupied ? 'Status: Occupied' : 'Status: Available'}</p>
                </SensorCard>
                
                <SensorCard className="flex flex-col justify-between animate-slide-up border-glow-sky-royal-blue/50" style={{ animationDelay: '700ms' }}>
                    <h3 className="font-semibold text-gray-300">Water Flow Monitor</h3>
                    <div className="w-full h-24">
                        <TinyAreaChart />
                    </div>
                    <p className="text-sm text-gray-400 text-right">{latestData?.flowRate || 0} L/min</p>
                </SensorCard>
                
                <div className="grid grid-rows-2 gap-6">
                    <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up border-glow-cyan-blue/50" style={{ animationDelay: '800ms' }}>
                        <h3 className="font-semibold text-gray-300">Flush Usage Counter</h3>
                        <p className="text-5xl font-bold text-teal-400 my-1">{latestData?.usageCount || 0}</p>
                        <p className="text-xs text-gray-500">Flushes Today</p>
                    </SensorCard>
                     <SensorCard className="flex flex-col items-center justify-center animate-slide-up border-glow-lime-emerald/50" style={{ animationDelay: '900ms' }}>
                        <h3 className="font-semibold text-gray-300 mb-2">Turbidity</h3>
                        <SemiCircleGauge value={latestData?.turbidity || 0} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">{latestData?.turbidity || 0} NTU</p>
                    </SensorCard>
                </div>

                <div className="grid grid-rows-2 gap-6">
                    <SensorCard className="flex items-center justify-between px-4 animate-slide-up border-status-green/50" style={{ animationDelay: '1000ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm">Battery</h3>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-gray-200">{latestData?.battery_level || 0}%</p>
                           <BatteryFull className="h-6 w-6 text-green-400"/>
                        </div>
                    </SensorCard>
                    <SensorCard className="flex items-center justify-between px-4 animate-slide-up border-primary/50" style={{ animationDelay: '1100ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm">Connectivity</h3>
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-gray-200">{latestData?.isOnline ? 'ONLINE' : 'OFFLINE'}</p>
                           <Wifi className="h-6 w-6 text-teal-400"/>
                        </div>
                    </SensorCard>
                </div>

                 {/* Row 3 */}
                <SensorCard className="flex flex-col items-center justify-center animate-slide-up border-status-yellow/50" style={{ animationDelay: '1200ms' }}>
                     <h3 className="font-semibold text-gray-300 mb-2">Chemical Level Status</h3>
                     <FlaskConical className={cn("h-10 w-10", getChemicalColor(latestData?.chemical_rem || 0))} />
                     <p className={cn("text-lg font-bold mt-2", getChemicalColor(latestData?.chemical_rem || 0))}>{latestData?.chemical_rem || 0}%</p>
                </SensorCard>
                
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up border-status-green/50 shadow-green-500/20" style={{ animationDelay: '1300ms' }}>
                     <h3 className="font-semibold text-green-400 mb-2">Leakage Alert Status</h3>
                     <ShieldCheck className="text-green-500 h-10 w-10" />
                     <p className="text-sm font-bold text-green-400 my-2">{latestData?.leakageDetected ? 'CRITICAL LEAK DETECTED!' : 'NO LEAKS DETECTED'}</p>
                     <div className="w-full h-16">
                        <JaggedLineChart />
                     </div>
                </SensorCard>

                 <SensorCard className="animate-slide-up border-secondary/50" style={{ animationDelay: '1400ms' }}>
                    <h3 className="font-semibold text-gray-300 text-sm mb-2 flex items-center gap-2"><Zap size={16}/>Automation</h3>
                    <div className="space-y-2 mt-2">
                        <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Auto Flush</p>
                            <Switch 
                                checked={latestData?.autoFlushEnable || false} 
                                onCheckedChange={(checked) => sendCommand('autoFlushEnable', checked)} 
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Light Control</p>
                            <Switch
                                checked={latestData?.lightStatus || false} 
                                onCheckedChange={(checked) => sendCommand('lightStatus', checked)} 
                            />
                        </div>
                    </div>
                </SensorCard>
                 <SensorCard className="flex flex-col items-center justify-center animate-slide-up border-glow-lime-emerald/50" style={{ animationDelay: '1500ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-2">Stool Test Analysis</h3>
                    <div className="flex items-center gap-2">
                       <Calendar className="h-5 w-5 text-gray-500"/>
                       <p className="text-sm font-bold text-green-400">LAST TEST: {latestData?.stoolStatus || 'N/A'}</p>
                    </div>
                </SensorCard>

            </div>
        </div>
    );

    
