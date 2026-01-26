
'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { CircularGauge } from '@/components/charts/circular-gauge';
import { SemiCircleGauge } from '@/components/charts/semi-circle-gauge';
import { JaggedLineChart } from '@/components/charts/jagged-line-chart';
import { ShieldCheck, BatteryFull, Droplet, Zap, CircleAlert, CheckCircle, Thermometer, BatteryMedium, BatteryLow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const WarningMessage = ({ text = 'Warning: Value out of range.' }: { text?: string }) => (
    <div className="flex items-center gap-2 text-sm text-red-400 mt-2">
        <CircleAlert size={16} />
        <span>{text}</span>
    </div>
);

export default function LiveSensorDataPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [latestData, setLatestData] = useState<any>(null);
    const [isToiletOccupied, setIsToiletOccupied] = useState<boolean>(false); // New state for global status
    const { toast } = useToast();
    const previousDataRef = useRef<any>(null);

    useEffect(() => {
        if (!user?.uid) return;
        
        const database = getDatabase();
        const sensorDataRef = ref(database, `Users/${user.uid}/sensorData`);
        
        const unsubscribe = onValue(sensorDataRef, (snapshot) => {
            const currentData = snapshot.val();
            if (!currentData) return;

            setLatestData(currentData);

            const prevData = previousDataRef.current;

            if (prevData && firestore && user) {
                const thresholds = {
                    ph_level: { min: 4.5, max: 8.0, name: 'Urine pH' },
                    specificGravity: { min: 1.005, max: 1.030, name: 'Specific Gravity' },
                    ammonia: { min: 5, max: 500, name: 'Ammonia Level' },
                    turbidity: { min: 0, max: 20, name: 'Water Turbidity' },
                };

                (Object.keys(thresholds) as Array<keyof typeof thresholds>).forEach(key => {
                    const config = thresholds[key];
                    const currentValue = parseFloat(currentData[key]);
                    const prevValue = parseFloat(prevData[key]);

                    if (isNaN(currentValue) || isNaN(prevValue)) return;

                    const isCurrentlyOutOfRange = currentValue < config.min || currentValue > config.max;
                    const wasPreviouslyInRange = prevValue >= config.min && prevValue <= config.max;
                    
                    if (isCurrentlyOutOfRange && wasPreviouslyInRange) {
                        const toastDescription = `${config.name} reading of ${currentValue} is outside the safe range of ${config.min} - ${config.max}.`;
                        const alertMessage = '⚠️ Alert: Value out of range. Please take necessary precautions and consult a doctor as soon as possible.';
                        
                        toast({
                            variant: 'destructive',
                            title: `🔴 Alert: ${config.name} Out of Range`,
                            description: `${toastDescription} Time: ${new Date().toLocaleTimeString()}`,
                            duration: 20000,
                        });
                        addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                            userId: user.uid,
                            timestamp: serverTimestamp(),
                            message: alertMessage,
                            type: 'Warning',
                            sensorName: config.name,
                            currentValue: currentValue.toString(),
                            normalRange: `${config.min} - ${config.max}`,
                            isRead: false
                        });
                    }
                });

                if (currentData.bloodDetected === true && prevData.bloodDetected === false) {
                    const alertMessage = `Traces of blood were detected in the latest analysis. Please consult a healthcare professional.`;
                    toast({
                        variant: 'destructive',
                        title: '🔴 Health Alert: Blood Detected',
                        description: `${alertMessage} Time: ${new Date().toLocaleTimeString()}`,
                        duration: 20000,
                    });
                     addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                        userId: user.uid,
                        timestamp: serverTimestamp(),
                        message: alertMessage,
                        type: 'Alert',
                        sensorName: 'Blood Detection',
                        currentValue: 'Detected',
                        normalRange: 'Negative',
                        isRead: false
                    });
                }
                
                if (currentData.leakageDetected === true && prevData.leakageDetected === false) {
                    const alertMessage = `A water leak has been detected. Please check the device immediately.`;
                    toast({
                        variant: 'destructive',
                        title: '⚠️ Maintenance Alert: Water Leak Detected',
                        description: `${alertMessage} Time: ${new Date().toLocaleTimeString()}`,
                        duration: 20000,
                    });
                     addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                        userId: user.uid,
                        timestamp: serverTimestamp(),
                        message: alertMessage,
                        type: 'Alert',
                        sensorName: 'Leakage Detection',
                        currentValue: 'Detected',
                        normalRange: 'Not Detected',
                        isRead: false
                    });
                }
            }
            
            previousDataRef.current = currentData;

        }, (error) => {
            console.error("Firebase onValue error:", error);
            toast({
                variant: 'destructive',
                title: 'Connection Error',
                description: 'Could not connect to live sensor data.',
            });
        });

        return () => {
            unsubscribe();
            previousDataRef.current = null;
        };
    }, [user, toast, firestore]);
    
    // New useEffect for global toilet status
    useEffect(() => {
        const database = getDatabase();
        // Specific path for global toilet status
        const toiletStatusRef = ref(database, 'Users/tpcTZoE1bjU9Xf3234BfPfY7qMu2/sensorData/isOccupied');
        
        const unsubscribe = onValue(toiletStatusRef, (snapshot) => {
            const value = snapshot.val();
            setIsToiletOccupied(!!value); // Update global state
        }, (error) => {
            console.error("Error fetching global toilet status:", error);
            toast({
                variant: 'destructive',
                title: 'Connection Error',
                description: 'Could not fetch live toilet usage status.',
            });
        });

        return () => unsubscribe();
    }, [toast]);


    const sendCommand = (key: string, value: boolean) => {
        if (!user?.uid) return;
        const database = getDatabase();
        const sensorDataRef = ref(database, `Users/${user.uid}/sensorData`);
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
    
    // --- Status Calculations ---
    const phValue = latestData?.ph_level ? parseFloat(latestData.ph_level) : null;
    const isPhOutOfRange = phValue !== null && (phValue < 4.5 || phValue > 8.0);
    const phStatus = isPhOutOfRange ? "WARNING" : "NORMAL";
    const calculatedPH = phValue?.toFixed(2) ?? '...';

    const sgValue = latestData?.specificGravity ? parseFloat(latestData.specificGravity) : null;
    const isSgOutOfRange = sgValue !== null && (sgValue < 1.005 || sgValue > 1.030);
    const sgStatus = isSgOutOfRange ? "WARNING" : "NORMAL";

    const ammoniaValue = latestData?.ammonia ? parseFloat(latestData.ammonia) : null;
    const isAmmoniaOutOfRange = ammoniaValue !== null && (ammoniaValue < 5 || ammoniaValue > 500);
    const ammoniaStatus = isAmmoniaOutOfRange ? "WARNING" : "NORMAL";

    const turbidityValue = latestData?.turbidity ? parseFloat(latestData.turbidity) : null;
    const isTurbidityOutOfRange = turbidityValue !== null && (turbidityValue < 0 || turbidityValue > 20);
    const turbidityStatus = isTurbidityOutOfRange ? "HIGH" : "NORMAL";

    const isBloodDetected = latestData?.bloodDetected === true;
    const isLeakageDetected = latestData?.leakageDetected === true;
    const batteryLevel = latestData?.battery_level || 0;


    return (
        <div className="bg-navy p-4 md:p-8 rounded-2xl animate-fade-in min-h-full">
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h1 className="text-3xl font-headline font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-glow-green via-glow-cyan to-glow-blue animate-text-gradient bg-400">LIVE SENSOR DATA</h1>
                <p className="text-sm text-gray-400 flex items-center gap-2"><span className="text-status-green">●</span> Live Health &amp; Device Monitoring with Real-Time Alerts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <SensorCard className={cn("flex flex-col justify-between animate-slide-up", isPhOutOfRange ? "border-status-red/70 shadow-status-red/20" : "border-glow-teal-green/50")} style={{ animationDelay: '200ms' }}>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-300">Urine pH Level</h3>
                             <StatusBadge 
                                status={phStatus} 
                                className={isPhOutOfRange ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <p className="text-5xl font-bold text-gray-200 my-4">{calculatedPH}</p>
                    </div>
                    <div>
                        {isPhOutOfRange && <WarningMessage />}
                        <p className="text-xs text-gray-500 mt-1">Normal Range: 4.5 - 8.0</p>
                    </div>
                </SensorCard>

                <SensorCard className={cn("flex flex-col justify-between animate-slide-up", isSgOutOfRange ? "border-status-red/70 shadow-status-red/20" : "border-glow-cyan-blue/50")} style={{ animationDelay: '300ms' }}>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-300">Specific Gravity</h3>
                            <StatusBadge 
                                status={sgStatus} 
                                className={isSgOutOfRange ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <p className="text-5xl font-bold text-gray-200 my-4">{latestData?.specificGravity || '...'}</p>
                    </div>
                    <div>
                        {isSgOutOfRange && <WarningMessage />}
                        <p className="text-xs text-gray-500 mt-1">Normal Range: 1.005 - 1.030</p>
                    </div>
                </SensorCard>

                <SensorCard 
                    className={cn(
                        "flex flex-col justify-between animate-slide-up",
                        isBloodDetected ? "border-glow-red-rose/70" : "border-status-green/50"
                    )} 
                    style={{ animationDelay: '400ms' }}
                >
                    <div>
                        <h3 className="font-semibold text-gray-300">Blood Detection</h3>
                        {isBloodDetected ? (
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
                    <div className='text-center'>
                        {isBloodDetected && <WarningMessage text="Health Alert: Consider contacting a doctor." />}
                        <p className="text-xs text-gray-500 mt-1">
                            {isBloodDetected ? "Traces of blood found." : "No trace of blood found."}
                        </p>
                    </div>
                </SensorCard>

                <SensorCard className={cn("flex flex-col justify-between animate-slide-up", isAmmoniaOutOfRange ? "border-status-red/70 shadow-status-red/20" : "border-glow-purple-violet/50")} style={{ animationDelay: '500ms' }}>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-300">Ammonia (NH3)</h3>
                            <StatusBadge 
                                status={ammoniaStatus} 
                                className={isAmmoniaOutOfRange ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <p className="text-5xl font-bold text-gray-200 my-4">{latestData?.ammonia ?? '...'}<span className="text-2xl text-gray-400"> ppm</span></p>
                    </div>
                    <div>
                        {isAmmoniaOutOfRange && <WarningMessage />}
                        <p className="text-xs text-gray-500 mt-1">Normal Range: 5 - 500 ppm</p>
                    </div>
                </SensorCard>


                {/* Row 2 */}
                <SensorCard className="lg:col-span-1 flex flex-col items-center justify-center animate-slide-up border-primary/50" style={{ animationDelay: '600ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4 text-center">Toilet Usage Status</h3>
                    <CircularGauge value={isToiletOccupied ? 100 : 0} label={isToiletOccupied ? "IN USE" : "NOT IN USE"} />
                    <p className="text-xs text-gray-500 mt-4">{isToiletOccupied ? 'Status: Occupied for Stool' : 'Status: Available'}</p>
                </SensorCard>
                
                <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up border-glow-sky-royal-blue/50" style={{ animationDelay: '700ms' }}>
                    <h3 className="font-semibold text-gray-300">Dipstick Availability</h3>
                    <p className="text-5xl font-bold text-glow-sky-royal-blue my-4">{latestData?.dipstickCount ?? '...'}</p>
                    <p className="text-xs text-gray-500">Dipsticks Remaining</p>
                </SensorCard>
                
                <div className="grid grid-rows-2 gap-6">
                    <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up border-glow-cyan-blue/50" style={{ animationDelay: '800ms' }}>
                        <h3 className="font-semibold text-gray-300">Toilet Usage Count</h3>
                        <p className="text-5xl font-bold text-teal-400 my-1">{latestData?.usageCount || 0}</p>
                        <p className="text-xs text-gray-500">used Today</p>
                    </SensorCard>
                     <SensorCard 
                        className={cn(
                            "flex flex-col items-center justify-center animate-slide-up",
                            isTurbidityOutOfRange ? 'border-status-red/50 shadow-status-red/10' : 'border-glow-lime-emerald/50'
                        )} 
                        style={{ animationDelay: '900ms' }}
                    >
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-semibold text-gray-300 mb-2">Turbidity</h3>
                            <StatusBadge 
                                status={turbidityStatus} 
                                className={isTurbidityOutOfRange ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <SemiCircleGauge value={latestData?.turbidity || 0} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">{latestData?.turbidity || '...'} NTU</p>
                        {isTurbidityOutOfRange && (
                            <WarningMessage text="High values may indicate infection." />
                        )}
                    </SensorCard>
                </div>

                <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up border-status-green/50" style={{ animationDelay: '1000ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4">Disease Symptoms Status</h3>
                    <ShieldCheck className="h-10 w-10 text-green-400 mx-auto my-2"/>
                    <p className="text-xl font-bold text-green-400 text-center mt-2">NORMAL</p>
                    <p className="text-xs text-gray-500 mt-1">No major symptoms detected.</p>
                </SensorCard>

                 {/* Row 3 */}
                <SensorCard className="animate-slide-up border-primary/50" style={{ animationDelay: '1200ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4 text-center">Temperature &amp; Humidity</h3>
                    <div className="flex justify-around items-center h-full">
                        <div className="text-center">
                            <Thermometer className="h-8 w-8 mx-auto text-orange-400" />
                            <p className="text-3xl font-bold mt-2">{latestData?.temperature ?? '...'}°C</p>
                            <p className="text-xs text-gray-400">Temperature</p>
                        </div>
                        <div className="h-16 w-px bg-border"></div>
                        <div className="text-center">
                            <Droplet className="h-8 w-8 mx-auto text-sky-400" />
                            <p className="text-3xl font-bold mt-2">{latestData?.humidity ?? '...'}%</p>
                            <p className="text-xs text-gray-400">Humidity</p>
                        </div>
                    </div>
                </SensorCard>
                
                <SensorCard className={cn("lg:col-span-1 flex flex-col items-center justify-center animate-slide-up", isLeakageDetected ? "border-status-red/70 shadow-status-red/20" : "border-status-green/50 shadow-green-500/20")} style={{ animationDelay: '1300ms' }}>
                     <h3 className="font-semibold text-gray-300 mb-2">Leakage Alert</h3>
                     {isLeakageDetected ? <CircleAlert className="h-10 w-10 text-red-400" /> : <ShieldCheck className="text-green-500 h-10 w-10" />}
                     <p className={cn("text-sm font-bold my-2", isLeakageDetected ? "text-red-400" : "text-green-400")}>{isLeakageDetected ? 'CRITICAL LEAK DETECTED!' : 'No Leaks Detected'}</p>
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
                 <SensorCard className={cn("animate-slide-up", 
                    batteryLevel > 75 ? "border-status-green/50" : 
                    batteryLevel > 25 ? "border-status-yellow/50" : 
                    "border-status-red/50"
                 )} style={{ animationDelay: '1500ms' }}>
                    <h3 className="font-semibold text-gray-300 text-sm mb-2">Battery Status</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {batteryLevel > 75 ? <BatteryFull className="h-8 w-8 text-status-green"/> :
                             batteryLevel > 25 ? <BatteryMedium className="h-8 w-8 text-status-yellow"/> :
                             <BatteryLow className="h-8 w-8 text-status-red"/>
                            }
                            <div>
                                <p className="text-3xl font-bold text-gray-200">{batteryLevel}%</p>
                                <p className="text-xs text-muted-foreground">Remaining</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-bold text-gray-200">~{((batteryLevel || 0) / 100 * 24).toFixed(1)}h</p>
                           <p className="text-xs text-muted-foreground">Est. Runtime</p>
                        </div>
                    </div>
                </SensorCard>

            </div>
        </div>
    );
}

    

    




    

    