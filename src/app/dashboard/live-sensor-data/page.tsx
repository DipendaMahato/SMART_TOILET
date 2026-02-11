
'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useDatabase } from '@/firebase';
import { getDatabase, ref, onValue, update, get } from 'firebase/database';
import { collection, addDoc, serverTimestamp, doc, getDoc, Timestamp } from 'firebase/firestore';
import { SensorCard } from '@/components/dashboard/sensor-card';
import { CircularGauge } from '@/components/charts/circular-gauge';
import { ShieldCheck, Droplet, Zap, CircleAlert, CheckCircle, Thermometer, FlaskConical, Download, Waves } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ChemistryReport } from '@/components/insights/chemistry-report';
import { Button } from '@/components/ui/button';
import { UrineQualityResult } from '@/components/dashboard/urine-quality-result';

const WarningMessage = ({ text = 'Warning: Value out of range.' }: { text?: string }) => (
    <div className="flex items-center gap-2 text-sm text-red-400 mt-2">
        <CircleAlert size={16} />
        <span>{text}</span>
    </div>
);

// Helper to get the latest session from RTDB data
const getLatestSession = (data: any) => {
    if (!data?.Reports) return { latestDate: null, latestSessionId: null, latestSession: null };

    const latestDate = Object.keys(data.Reports).sort().pop();
    if (!latestDate) return { latestDate: null, latestSessionId: null, latestSession: null };
    
    const sessions = data.Reports[latestDate];
    if (!sessions) return { latestDate, latestSessionId: null, latestSession: null };

    const latestSessionId = Object.keys(sessions).sort().pop();
    if (!latestSessionId) return { latestDate, latestSessionId: null, latestSession: null };

    return { latestDate, latestSessionId, latestSession: sessions[latestSessionId] };
}

export default function LiveSensorDataPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const database = useDatabase();
    const [latestData, setLatestData] = useState<any>(null);
    const [userCount, setUserCount] = useState<number>(0);
    const { toast } = useToast();
    const previousDataRef = useRef<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const sensorData = latestData?.sensorData;
    const chemistryData = latestData?.Chemistry_Result;

    const isToiletOccupied = sensorData?.isOccupied === 1;
    
    const chemistryParameters = [
        { key: 'chem_bilirubin', label: 'Bilirubin' },
        { key: 'chem_urobilinogen', label: 'Urobilinogen' },
        { key: 'chem_ketones', label: 'Ketones' },
        { key: 'chem_ascorbicAcid', label: 'Ascorbic Acid' },
        { key: 'chem_glucose', label: 'Glucose' },
        { key: 'chem_protein', label: 'Protein' },
        { key: 'chem_blood', label: 'Blood' },
        { key: 'chem_ph', label: 'pH' },
        { key: 'chem_nitrite', label: 'Nitrite' },
        { key: 'chem_leukocytes', label: 'Leukocytes' },
        { key: 'chem_specificGravity', label: 'Specific Gravity' },
    ];

    useEffect(() => {
        if (!user?.uid || !database) return;
        
        const userRef = ref(database, `Users/${user.uid}`);
        
        const unsubscribe = onValue(userRef, async (snapshot) => {
            const currentData = snapshot.val();
            if (!currentData || !firestore || !user) return;

            const { latestDate: currentLatestDate, latestSessionId: currentLatestSessionId, latestSession: currentLatestSession } = getLatestSession(currentData);
            const prevData = previousDataRef.current;
            const { latestSessionId: prevLatestSessionId } = getLatestSession(prevData);

            if (currentLatestSessionId && currentLatestSessionId !== prevLatestSessionId) {
                const chemistry = currentLatestSession.Chemistry_Result;
                const metadata = currentLatestSession.metadata;

                if (chemistry && metadata && currentLatestDate) {
                    try {
                        const dateString = `${currentLatestDate}T${metadata.time}`;
                        const sessionTimestamp = new Date(dateString);

                        if (!isNaN(sessionTimestamp.getTime())) {
                            const healthData = {
                                userId: user.uid,
                                timestamp: Timestamp.fromDate(sessionTimestamp),
                                urinePH: chemistry.chem_ph ?? null,
                                urineSpecificGravity: chemistry.chem_specificGravity ?? null,
                                urineProtein: chemistry.chem_protein ?? null,
                                urineGlucose: chemistry.chem_glucose ?? null,
                                stoolConsistency: 'Type 4', 
                                stoolColor: 'Brown',
                                ...chemistry,
                                ...(currentLatestSession.sensorData || {})
                            };
                            await addDoc(collection(firestore, `users/${user.uid}/healthData`), healthData);
                            toast({
                                title: "New Health Record Saved",
                                description: "A new session has been recorded to your health history.",
                            });
                        }
                    } catch (error) {
                        console.error("Error saving new health record to Firestore:", error);
                        toast({
                            variant: "destructive",
                            title: "Sync Error",
                            description: "Failed to save the latest health record.",
                        });
                    }
                }
            }

            const unifiedCurrentData = {
                sensorData: {
                    ...(currentLatestSession?.sensorData || {}),
                    isOccupied: currentData.Live_Status?.isOccupied,
                },
                Chemistry_Result: currentLatestSession?.Chemistry_Result || {},
            };
            
            setLatestData(unifiedCurrentData);
            setUserCount(unifiedCurrentData.sensorData?.usageCount ?? 0);

            const { latestSession: prevLatestSession } = getLatestSession(prevData);
            const unifiedPrevData = {
                sensorData: {
                    ...(prevLatestSession?.sensorData || {}),
                    isOccupied: prevData?.Live_Status?.isOccupied,
                },
                Chemistry_Result: prevLatestSession?.Chemistry_Result || {},
            };

            const currentSensorData = unifiedCurrentData.sensorData;
            const prevSensorData = unifiedPrevData.sensorData;
            const currentChemData = unifiedCurrentData.Chemistry_Result;
            const prevChemData = unifiedPrevData.Chemistry_Result;

            if (currentSensorData && prevSensorData && firestore && user) {
                const thresholds = {
                    ph_value_sensor: { min: 4.5, max: 8.0, name: 'Urine pH' },
                    specific_gravity_sensor: { min: 1.005, max: 1.030, name: 'Specific Gravity' },
                    ammonia_gas_ppm: { min: 5, max: 500, name: 'Ammonia Level' },
                };

                (Object.keys(thresholds) as Array<keyof typeof thresholds>).forEach(key => {
                    if (currentSensorData[key] === undefined || prevSensorData[key] === undefined) return;

                    const config = thresholds[key];
                    const currentValue = parseFloat(currentSensorData[key]);
                    const prevValue = parseFloat(prevSensorData[key]);

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

                if (currentSensorData.blood_detected_sensor === true && prevSensorData.blood_detected_sensor === false) {
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
                
                const tempThreshold = 37;
                const currentTemp = parseFloat(currentSensorData.temperature);
                const prevTemp = parseFloat(prevSensorData.temperature);

                if (!isNaN(currentTemp) && !isNaN(prevTemp)) {
                    if (currentTemp > tempThreshold && prevTemp <= tempThreshold) {
                        const alertMessage = `Dehydration detected. Drink plenty of water regularly.`;
                        toast({
                            variant: 'destructive',
                            title: '💧 Dehydration Alert',
                            description: `${alertMessage} Time: ${new Date().toLocaleTimeString()}`,
                            duration: 20000,
                        });
                        addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                            userId: user.uid,
                            timestamp: serverTimestamp(),
                            message: alertMessage,
                            type: 'Warning',
                            sensorName: 'Dehydration',
                            currentValue: `High Temp (${currentTemp}°C)`,
                            normalRange: 'Normal Temp (< 37°C)',
                            isRead: false
                        });
                    }
                }

                // TDS Check for abnormal values
                const tdsAbnormalThreshold = 500;
                const currentTds = parseFloat(currentSensorData.tds_value);
                const prevTds = parseFloat(prevSensorData.tds_value);
                if (!isNaN(currentTds) && !isNaN(prevTds)) {
                    if (currentTds > tdsAbnormalThreshold && prevTds <= tdsAbnormalThreshold) {
                        const alertMessage = `High TDS level detected, which may indicate health issues. Further evaluation is recommended.`;
                        toast({
                            variant: 'destructive',
                            title: '🔴 Health Alert: Abnormal TDS',
                            description: `TDS value of ${currentTds} ppm is abnormal. Time: ${new Date().toLocaleTimeString()}`,
                            duration: 20000,
                        });
                        addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                            userId: user.uid,
                            timestamp: serverTimestamp(),
                            message: alertMessage,
                            type: 'Alert',
                            sensorName: 'TDS Level',
                            currentValue: `${currentTds.toFixed(0)} ppm`,
                            normalRange: '< 300 ppm',
                            isRead: false
                        });
                    }
                }

                // Turbidity Check for abnormal values
                const turbidityAbnormalThreshold = 50;
                const currentTurbidity = parseFloat(currentSensorData.turbidity);
                const prevTurbidity = parseFloat(prevSensorData.turbidity);
                if (!isNaN(currentTurbidity) && !isNaN(prevTurbidity)) {
                    if (currentTurbidity > turbidityAbnormalThreshold && prevTurbidity <= turbidityAbnormalThreshold) {
                        const alertMessage = `Urine is cloudy (High Turbidity). This can be a sign of a UTI or kidney issues. Please consult a doctor.`;
                        toast({
                            variant: 'destructive',
                            title: '🔴 Health Alert: High Turbidity',
                            description: `Turbidity value of ${currentTurbidity} NTU is abnormal. Time: ${new Date().toLocaleTimeString()}`,
                            duration: 20000,
                        });
                        addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                            userId: user.uid,
                            timestamp: serverTimestamp(),
                            message: alertMessage,
                            type: 'Alert',
                            sensorName: 'Urine Turbidity',
                            currentValue: `${currentTurbidity.toFixed(1)} NTU`,
                            normalRange: '< 20 NTU',
                            isRead: false
                        });
                    }
                }
            }

            if (prevChemData && currentChemData && firestore && user) {
                const checkAndNotify = (key: string, name: string, normalRangeText: string, isAbnormal: (val: any) => boolean) => {
                    const currentValue = currentChemData[key];
                    const prevValue = prevChemData[key];
                    
                    if (currentValue === undefined || prevValue === undefined) return;

                    if (isAbnormal(currentValue) && !isAbnormal(prevValue)) {
                        const toastDescription = `${name} reading of ${currentValue} is outside the safe range.`;
                        toast({
                            variant: 'destructive',
                            title: `🔴 Health Alert: Abnormal ${name}`,
                            description: `${toastDescription} Time: ${new Date().toLocaleTimeString()}`,
                            duration: 20000,
                        });
                        addDoc(collection(firestore, `users/${user.uid}/notifications`), {
                            userId: user.uid,
                            timestamp: serverTimestamp(),
                            message: `Abnormal ${name} level detected. Please consult a healthcare professional.`,
                            type: 'Alert',
                            sensorName: name,
                            currentValue: String(currentValue),
                            normalRange: normalRangeText,
                            isRead: false
                        });
                    }
                };

                const isAbnormalNegative = (val: any) => {
                    const lval = String(val).toLowerCase();
                    if (lval === 'neg' || lval === 'negative' || lval === '0' || lval === '0.0') {
                        return false;
                    }
                    const nval = parseFloat(val);
                    if (!isNaN(nval) && nval === 0) {
                        return false;
                    }
                    return true; 
                };

                checkAndNotify('chem_ph', 'pH (Chemistry)', '4.5 - 8.0', val => parseFloat(val) < 4.5 || parseFloat(val) > 8.0);
                checkAndNotify('chem_specificGravity', 'Specific Gravity (Chemistry)', '1.005 - 1.030', val => parseFloat(val) < 1.005 || parseFloat(val) > 1.030);
                checkAndNotify('chem_glucose', 'Glucose', 'Negative', isAbnormalNegative);
                checkAndNotify('chem_protein', 'Protein', 'Negative/Trace (<30)', val => parseFloat(val) > 30);
                checkAndNotify('chem_blood', 'Blood (Chemistry)', 'Negative', isAbnormalNegative);
                checkAndNotify('chem_bilirubin', 'Bilirubin', 'Negative', isAbnormalNegative);
                checkAndNotify('chem_ketones', 'Ketones', 'Negative', isAbnormalNegative);
                checkAndNotify('chem_leukocytes', 'Leukocytes', 'Negative', isAbnormalNegative);
                checkAndNotify('chem_nitrite', 'Nitrite', 'Negative', isAbnormalNegative);
                checkAndNotify('chem_urobilinogen', 'Urobilinogen', '0.2 - 1.0', val => {
                    if (String(val).toLowerCase() === 'norm' || String(val).toLowerCase() === 'normal') return false;
                    const numVal = parseFloat(val);
                    return isNaN(numVal) || numVal < 0.2 || numVal > 1.0;
                });
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
        };
    }, [user, database, firestore, toast]);
    
    const sendCommand = (key: string, value: boolean) => {
        if (!user?.uid || !database) return;
        const sensorDataRef = ref(database, `Users/${user.uid}/sensorData`);
        update(sensorDataRef, { [key]: value })
            .catch((err) => alert("Error sending command: " + err.message));
    };

    const handleDownload = async () => {
        if (!user || !firestore || !database) {
            alert("User not logged in or database services not available.");
            return;
        }
        setLoading(true);

        try {
            // Fetch user profile from Firestore
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.exists() ? userDocSnap.data() : { displayName: user.displayName, email: user.email };

            // Fetch latest data from Realtime Database
            const rtdbRef = ref(database, `Users/${user.uid}`);
            const rtdbSnap = await get(rtdbRef);
            const rtdbData = rtdbSnap.exists() ? rtdbSnap.val() : {};

            let latestSessionData = null;
            const reports = rtdbData.Reports;
            if (reports) {
                const latestDate = Object.keys(reports).sort().pop();
                if (latestDate) {
                    const sessions = reports[latestDate];
                    const latestSessionId = Object.keys(sessions).sort().pop();
                    if (latestSessionId) {
                        latestSessionData = sessions[latestSessionId];
                    }
                }
            }

            const combinedHealthData = {
                ...(latestSessionData?.sensorData || {}),
                ...(latestSessionData?.Chemistry_Result || {}),
            };

            const combinedData = { user: userData, health: combinedHealthData };
            setReportData(combinedData);

            // Wait for state to update and component to re-render
            setTimeout(() => {
                const element = reportRef.current;
                if (element && window.html2pdf) {
                    const opt = {
                        margin: 0,
                        filename: `Chemistry_Report_${(userData as any).firstName || 'User'}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 3, useCORS: true },
                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
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

    const StatusBadge = ({ label, status, className }: { label?: string, status: string, className?: string }) => {
        return (
            <div className="flex items-center gap-1.5">
                {label && <span className="text-xs text-gray-400">{label}:</span>}
                <Badge variant="outline" className={cn('text-xs px-1.5 py-0', className)}>{status}</Badge>
            </div>
        );
    }
    
    // --- Status Calculations ---
    const phValue = sensorData?.ph_value_sensor ? parseFloat(sensorData.ph_value_sensor) : null;
    const isPhOutOfRange = phValue !== null && (phValue < 4.5 || phValue > 8.0);
    const phStatus = isPhOutOfRange ? "WARNING" : "NORMAL";
    const calculatedPH = phValue?.toFixed(2) ?? '...';

    const sgValue = sensorData?.specific_gravity_sensor ? parseFloat(sensorData.specific_gravity_sensor) : null;
    const isSgOutOfRange = sgValue !== null && (sgValue < 1.005 || sgValue > 1.030);
    const sgStatus = isSgOutOfRange ? "WARNING" : "NORMAL";

    const ammoniaValue = sensorData?.ammonia_gas_ppm ? parseFloat(sensorData.ammonia_gas_ppm) : null;
    const isAmmoniaOutOfRange = ammoniaValue !== null && (ammoniaValue < 5 || ammoniaValue > 500);
    const ammoniaStatus = isAmmoniaOutOfRange ? "WARNING" : "NORMAL";

    const isBloodDetected = sensorData?.blood_detected_sensor === true;
    const tempValue = sensorData?.temperature ? parseFloat(sensorData.temperature) : null;
    const isTempHigh = tempValue !== null && tempValue > 37;

    const getChemStatus = (key: string, value: any): { status: string; color: string } => {
        if (value === undefined || value === null || value === '...') return { status: 'N/A', color: 'text-gray-400' };
        
        const lowerCaseValue = String(value).toLowerCase();
        const numValue = parseFloat(value);

        switch(key) {
            case 'chem_ph':
                if (isNaN(numValue)) return { status: 'Invalid', color: 'text-status-yellow' };
                return (numValue >= 4.5 && numValue <= 8.0) ? { status: 'Normal', color: 'text-status-green' } : { status: 'Abnormal', color: 'text-status-red' };
            
            case 'chem_specificGravity':
                if (isNaN(numValue)) return { status: 'Invalid', color: 'text-status-yellow' };
                return (numValue >= 1.005 && numValue <= 1.030) ? { status: 'Normal', color: 'text-status-green' } : { status: 'Abnormal', color: 'text-status-red' };
            
            case 'chem_urobilinogen':
                if (lowerCaseValue === 'norm' || lowerCaseValue === 'normal') return { status: 'Normal', color: 'text-status-green' };
                if (isNaN(numValue)) return { status: 'Abnormal', color: 'text-status-red' };
                return (numValue >= 0.2 && numValue <= 1.0) ? { status: 'Normal', color: 'text-status-green' } : { status: 'Abnormal', color: 'text-status-red' };
            
            case 'chem_blood':
            case 'chem_bilirubin':
            case 'chem_ketones':
            case 'chem_ascorbicAcid':
            case 'chem_nitrite':
            case 'chem_leukocytes':
            case 'chem_glucose':
                const isNeg = lowerCaseValue === 'neg' || lowerCaseValue === 'negative' || numValue === 0;
                if(isNeg) return { status: 'Negative', color: 'text-status-green' };
                return { status: 'Positive', color: 'text-status-red' };

            case 'chem_protein':
                if (lowerCaseValue === 'neg' || lowerCaseValue === 'negative' || numValue === 0) {
                    return { status: 'Negative', color: 'text-status-green' };
                }
                if (numValue > 0 && numValue <= 30) {
                     return { status: 'Trace', color: 'text-status-yellow' };
                }
                return { status: 'Positive', color: 'text-status-red' };
            
            default:
                return { status: 'Unknown', color: 'text-gray-400' };
        }
    }
    
    const ChemistryParameterCard = ({ label, value, status, color }: {label: string, value: any, status: string, color: string}) => {
        const isAbnormal = color === 'text-status-red' || color === 'text-status-yellow';
        return (
            <div className={cn(
                "bg-background/20 backdrop-blur-sm border rounded-xl p-3 text-center flex flex-col justify-between h-24 transition-all",
                isAbnormal ? "border-status-red/50" : "border-white/10"
            )}>
                <div className="flex justify-between items-start">
                    <p className="text-xs text-gray-400 font-medium truncate text-left" title={label}>{label}</p>
                    {isAbnormal && <CircleAlert className="h-4 w-4 text-status-red flex-shrink-0" />}
                </div>
                <p className="text-lg font-bold text-gray-200 my-1 truncate">{String(value)}</p>
                <p className={`text-xs font-bold ${color}`}>{status}</p>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="fixed -left-[9999px] top-0 opacity-0">
                <ChemistryReport ref={reportRef} data={reportData} />
            </div>

            <div className="animate-slide-up">
                <h1 className="text-3xl font-headline font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-glow-green via-glow-cyan to-glow-blue animate-text-gradient bg-400">LIVE DATA</h1>
                <p className="text-sm text-gray-400 flex items-center gap-2"><span className="text-status-green">●</span> Live Health &amp; Device Monitoring with Real-Time Alerts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SensorCard className={cn("flex flex-col justify-between animate-slide-up", isPhOutOfRange ? "border-status-red/70 shadow-status-red/20 animate-alert-glow" : "border-glow-teal-green/50")} style={{ animationDelay: '200ms' }}>
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

                <SensorCard className={cn("flex flex-col justify-between animate-slide-up", isSgOutOfRange ? "border-status-red/70 shadow-status-red/20 animate-alert-glow" : "border-glow-cyan-blue/50")} style={{ animationDelay: '300ms' }}>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-300">Specific Gravity</h3>
                            <StatusBadge 
                                status={sgStatus} 
                                className={isSgOutOfRange ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <p className="text-5xl font-bold text-gray-200 my-4">{sensorData?.specific_gravity_sensor || '...'}</p>
                    </div>
                    <div>
                        {isSgOutOfRange && <WarningMessage />}
                        <p className="text-xs text-gray-500 mt-1">Normal Range: 1.005 - 1.030</p>
                    </div>
                </SensorCard>

                <SensorCard 
                    className={cn(
                        "flex flex-col justify-between animate-slide-up",
                        isBloodDetected ? "border-glow-red-rose/70 animate-alert-glow" : "border-status-green/50"
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

                <SensorCard className={cn("flex flex-col justify-between animate-slide-up", isAmmoniaOutOfRange ? "border-status-red/70 shadow-status-red/20 animate-alert-glow" : "border-glow-purple-violet/50")} style={{ animationDelay: '500ms' }}>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-300">Ammonia (NH3)</h3>
                            <StatusBadge 
                                status={ammoniaStatus} 
                                className={isAmmoniaOutOfRange ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                            />
                        </div>
                        <p className="text-5xl font-bold text-gray-200 my-4">{sensorData?.ammonia_gas_ppm ?? '...'}<span className="text-2xl text-gray-400"> ppm</span></p>
                    </div>
                    <div>
                        {isAmmoniaOutOfRange && <WarningMessage />}
                        <p className="text-xs text-gray-500 mt-1">Normal Range: 5 - 500 ppm</p>
                    </div>
                </SensorCard>
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                <UrineQualityResult tdsValue={sensorData?.tds_value} turbidityValue={sensorData?.turbidity} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <SensorCard className="flex flex-col items-center justify-center animate-slide-up border-primary/50" style={{ animationDelay: '700ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4 text-center">Toilet Usage Status</h3>
                    <CircularGauge value={isToiletOccupied ? 100 : 0} label={isToiletOccupied ? "IN USE" : "NOT IN USE"} />
                    <p className="text-xs text-gray-500 mt-4">{isToiletOccupied ? 'Status: Occupied for Stool' : 'Status: Available'}</p>
                </SensorCard>

                <SensorCard className="flex flex-col items-center justify-center text-center animate-slide-up border-glow-cyan-blue/50" style={{ animationDelay: '800ms' }}>
                    <h3 className="font-semibold text-gray-300">Toilet Usage Count</h3>
                    <p className="text-5xl font-bold text-teal-400 my-1">{userCount}</p>
                    <p className="text-xs text-gray-500">used Today</p>
                </SensorCard>
                
                <SensorCard className={cn("animate-slide-up", isTempHigh ? "border-status-red/70 shadow-status-red/20 animate-alert-glow" : "border-primary/50")} style={{ animationDelay: '900ms' }}>
                    <h3 className="font-semibold text-gray-300 mb-4 text-center">Temperature &amp; Humidity</h3>
                    <div className="flex justify-around items-center h-full">
                        <div className="text-center">
                            <Thermometer className={cn("h-8 w-8 mx-auto", isTempHigh ? "text-status-red" : "text-orange-400")} />
                            <p className={cn("text-3xl font-bold mt-2", isTempHigh && "text-status-red")}>{sensorData?.temperature ?? '...'}°C</p>
                            <p className="text-xs text-gray-400">Temperature</p>
                        </div>
                        <div className="h-16 w-px bg-border"></div>
                        <div className="text-center">
                            <Droplet className="h-8 w-8 mx-auto text-sky-400" />
                            <p className="text-3xl font-bold mt-2">{sensorData?.humidity ?? '...'}%</p>
                            <p className="text-xs text-gray-400">Humidity</p>
                        </div>
                    </div>
                </SensorCard>

                 <SensorCard className="animate-slide-up border-secondary/50" style={{ animationDelay: '1000ms' }}>
                    <h3 className="font-semibold text-gray-300 text-sm mb-2 flex items-center gap-2"><Zap size={16}/>Automation Controls</h3>
                    <div className="space-y-4 mt-4 pt-4 border-t border-border/50">
                        <div className='flex justify-between items-center'>
                            <p className='text-sm text-gray-400'>Auto Flush</p>
                            <Switch 
                                checked={sensorData?.autoFlushEnable || false} 
                                onCheckedChange={(checked) => sendCommand('autoFlushEnable', checked)} 
                            />
                        </div>
                    </div>
                </SensorCard>

            </div>

             <div className="animate-slide-up" style={{ animationDelay: '1100ms' }}>
                <SensorCard className="border-glow-lime-emerald/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-300">Chemistry Results</h3>
                        <div className="flex items-center gap-2">
                           <Button onClick={handleDownload} variant="outline" size="sm" className="bg-transparent text-glow-lime-emerald border-glow-lime-emerald/50 hover:bg-glow-lime-emerald/10 hover:text-glow-lime-emerald" loading={loading}>
                                <Download className="mr-2 h-4 w-4" />
                                Report
                            </Button>
                           <FlaskConical className="h-6 w-6 text-glow-lime-emerald"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {chemistryParameters.map(param => {
                            const value = chemistryData?.[param.key] ?? '...';
                            const { status, color } = getChemStatus(param.key, value);
                            return (
                                <ChemistryParameterCard
                                    key={param.key}
                                    label={param.label}
                                    value={value}
                                    status={status}
                                    color={color}
                                />
                            )
                        })}
                    </div>
                </SensorCard>
            </div>
        </div>
    );
}

    

    