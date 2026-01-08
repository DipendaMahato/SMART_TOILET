'use client';
import { useState, useEffect } from 'react';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { CircularGauge } from '@/components/charts/circular-gauge';
import { SemiCircleGauge } from '@/components/charts/semi-circle-gauge';
import { TinyAreaChart } from '@/components/charts/tiny-area-chart';
import { JaggedLineChart } from '@/components/charts/jagged-line-chart';
import { AlertTriangle, BatteryFull, Droplet, Gauge, Signal, Wifi, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function LiveSensorDataPage() {
    const [usageStatus, setUsageStatus] = useState(8);
    const [waterTank, setWaterTank] = useState(77);
    const [flushCount, setFlushCount] = useState(42);
    const [ammonia, setAmmonia] = useState(5.18);
    const [battery, setBattery] = useState(92);
    const [connectivity, setConnectivity] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setUsageStatus(Math.random() * 10);
            setWaterTank(Math.floor(Math.random() * 20) + 70);
            setAmmonia(Math.random() * 2 + 4);
            setBattery(Math.floor(Math.random() * 10) + 90);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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

    return (
        <div className="bg-navy p-4 md:p-8 rounded-2xl animate-fade-in min-h-full">
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h1 className="text-3xl font-headline font-bold text-gray-200 tracking-wider">LIVE SENSOR DATA</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Row 1 */}
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4">Toilet Usage Status</h3>
                    <CircularGauge value={(usageStatus / 10) * 100} label="IN USE" />
                    <p className="text-xs text-gray-500 mt-4">Available: {Math.round(usageStatus)}</p>
                </SensorCard>

                <SensorCard className="border-red-500/50 shadow-red-500/20 lg:col-span-1 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '300ms' }}>
                     <h3 className="font-semibold text-red-400 mb-2">Leakage Alert Status</h3>
                     <AlertTriangle className="text-red-500 h-10 w-10" />
                     <p className="text-sm font-bold text-red-400 my-2">CRITICAL LEAK DETECTED!</p>
                     <div className="w-full h-16">
                        <JaggedLineChart />
                     </div>
                </SensorCard>
                
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4">Urine Test Analysis</h3>
                    <CircularGauge value={85} />
                    <div className="flex gap-4 mt-4">
                       <StatusBadge label="Glucose" status="OK" />
                       <StatusBadge label="Nitrite" status="HIGH" />
                    </div>
                </SensorCard>

                {/* Row 2 */}
                <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-2 self-start">Water Tank Level</h3>
                    <SemiCircleGauge value={waterTank} />
                </SensorCard>
                
                <SensorCard className="flex flex-col justify-between animate-slide-up" style={{ animationDelay: '600ms' }}>
                    <h3 className="font-semibold text-gray-300">Water Flow Monitor</h3>
                    <div className="w-full h-24">
                        <TinyAreaChart />
                    </div>
                    <p className="text-sm text-gray-400 text-right">2.4 L/min</p>
                </SensorCard>
                
                <div className="grid grid-rows-2 gap-6">
                    <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up" style={{ animationDelay: '700ms' }}>
                        <h3 className="font-semibold text-gray-300">Flush Usage Counter</h3>
                        <p className="text-5xl font-bold text-teal-400 my-1">{flushCount}</p>
                        <p className="text-xs text-gray-500">Flushes Today</p>
                    </SensorCard>
                     <SensorCard className="animate-slide-up" style={{ animationDelay: '800ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm mb-2">Analysis in progress...</h3>
                        <div className="space-y-1">
                            <StatusBadge label="Glucose" status="OK" />
                            <StatusBadge label="Protein" status="HIGH" />
                        </div>
                    </SensorCard>
                </div>

                {/* Row 3 */}
                <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '900ms' }}>
                     <h3 className="font-semibold text-gray-300 mb-2">Water Tank Level</h3>
                     <Droplet className="h-10 w-10 text-teal-400" />
                </SensorCard>

                <div className="grid grid-cols-2 gap-6">
                     <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '1000ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm mb-2">Ammonia Gas</h3>
                        <SemiCircleGauge value={(ammonia / 10) * 100} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">{ammonia.toFixed(2)} ppm</p>
                    </SensorCard>
                     <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '1100ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm mb-2">Ammonia Gas</h3>
                        <SemiCircleGauge value={(5 / 10) * 100} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">5 ppm</p>
                    </SensorCard>
                </div>

                <div className="grid grid-rows-2 gap-6">
                     <SensorCard className="flex items-center justify-between px-4 animate-slide-up" style={{ animationDelay: '1200ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm">Battery</h3>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-gray-200">ONLINE</p>
                           <BatteryFull className="h-6 w-6 text-green-400"/>
                        </div>
                    </SensorCard>
                    <SensorCard className="flex items-center justify-between px-4 animate-slide-up" style={{ animationDelay: '1300ms' }}>
                        <h3 className="font-semibold text-gray-300 text-sm">Connectivity</h3>
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-bold text-gray-200">ONLINE</p>
                           <Wifi className="h-6 w-6 text-teal-400"/>
                        </div>
                    </SensorCard>
                </div>
                 <SensorCard className="flex items-center justify-between px-4 animate-slide-up" style={{ animationDelay: '1400ms' }}>
                    <h3 className="font-semibold text-gray-300 text-sm">System Connectivity</h3>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-200">{battery}%</p>
                        <Signal className="h-6 w-6 text-green-400"/>
                    </div>
                </SensorCard>

                 <SensorCard className="flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '1500ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-2">Stool Test Analysis</h3>
                    <div className="flex items-center gap-2">
                       <Calendar className="h-5 w-5 text-gray-500"/>
                       <p className="text-sm font-bold text-green-400">LAST TEST: NORMAL</p>
                    </div>
                </SensorCard>
            </div>
        </div>
    );
}