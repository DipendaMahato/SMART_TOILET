
'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { useUser, useFirestore, useDatabase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, get, onValue } from 'firebase/database';
import { DownloadableReport } from '@/components/insights/downloadable-report';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLatestCombinedSession } from "@/lib/data-helpers";

type Status = "Normal" | "Needs Attention" | "Abnormal";

const initialUrineDiagnostics = [
    { parameter: 'Bilirubin (BIL)', value: 'Negative', range: 'Negative', status: 'Normal' as Status },
    { parameter: 'Urobilinogen (UBG)', value: 'Normal', range: '0.2 – 1.0 mg/dL', status: 'Normal' as Status },
    { parameter: 'Ketone (KET)', value: 'Negative', range: 'Negative', status: 'Normal' as Status },
    { parameter: 'Ascorbic Acid (ASC)', value: 'Negative', range: 'Negative', status: 'Normal' as Status },
    { parameter: 'Glucose (GLU)', value: 'Normal', range: 'Negative', status: 'Normal' as Status },
    { parameter: 'Protein (PRO)', value: 'Negative', range: 'Negative / Trace', status: 'Normal' as Status },
    { parameter: 'Blood (BLD)', value: 'Negative', range: 'Negative (0–2 Ery/µL)', status: 'Normal' as Status },
    { parameter: 'pH Level', value: '7.0', range: '4.5 – 8.0', status: 'Normal' as Status },
    { parameter: 'Nitrite (NIT)', value: 'Negative', range: 'Negative', status: 'Normal' as Status },
    { parameter: 'Leukocytes (LEU)', value: 'Negative', range: 'Negative (0–10 Leu/µL)', status: 'Normal' as Status },
    { parameter: 'Specific Gravity (SG)', value: '1.015', range: '1.005 – 1.030', status: 'Normal' as Status },
    { parameter: 'Turbidity', value: 'Clear', range: 'Clear', status: 'Normal' as Status },
    { parameter: 'Color', value: 'Pale Yellow', range: 'Pale Yellow – Yellow', status: 'Normal' as Status }
];

const stoolDiagnostics = [
    { title: "Overall Stool Health", subtitle: "Normal risk tictor", status: "Normal" as Status },
    { title: "Stool Consistency Indicator", subtitle: "normal nak fastoe", status: "Normal" as Status },
    { title: "Bowel Regularity", subtitle: "Normal risk tisator", status: "Normal" as Status },
    { title: "Possible Infection Risk", subtitle: "normal nsk tlostor", status: "Normal" as Status },
];

const StatusBadge = ({ status }: { status: Status }) => {
    return (
        <Badge
            className={cn("text-xs font-bold", {
                "bg-status-green/20 text-status-green border-status-green/30": status === "Normal",
                "bg-status-yellow/20 text-status-yellow border-status-yellow/30": status === "Needs Attention",
                "bg-status-red/20 text-status-red border-status-red/30": status === "Abnormal",
            })}
            variant="outline"
        >
            {status}
        </Badge>
    );
};


const DiagnosticCard = ({ title, subtitle, status }: { title: string, subtitle: string, status: Status }) => (
    <div className="bg-white/5 border border-teal-500/20 rounded-2xl p-4 flex flex-col justify-between h-full hover:border-teal-500/40 transition-all">
        <div>
            <h4 className="font-semibold text-gray-300">{title}</h4>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="flex justify-end mt-2">
            <StatusBadge status={status} />
        </div>
    </div>
);


export default function DiagnosticsPage() {
    const reportRef = useRef<HTMLDivElement>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const database = useDatabase();
    const [urineDiagnostics, setUrineDiagnostics] = useState(initialUrineDiagnostics);

    useEffect(() => {
        if (!user?.uid || !database) return;

        const userRef = ref(database, `Users/${user.uid}`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const { latestCombinedSession } = getLatestCombinedSession(data);
                
                const sensorData = latestCombinedSession?.sensorData;
                const chemistry = latestCombinedSession?.Chemistry_Result;

                setUrineDiagnostics(prevDiagnostics => {
                    const newDiagnostics = JSON.parse(JSON.stringify(prevDiagnostics));

                    const updateRow = (parameter:string, value:any, normalCheck: (v:any) => boolean, valueFormatter = (v:any) => String(v)) => {
                        const row = newDiagnostics.find((r: any) => r.parameter === parameter);
                        if (row && value !== undefined && value !== null) {
                            row.value = valueFormatter(value);
                            row.status = normalCheck(value) ? "Normal" : "Abnormal";
                        }
                    };

                    if(chemistry) {
                        const isNegative = (v: any) => v === 0 || v === false || String(v).toLowerCase() === 'negative' || String(v).toLowerCase() === 'neg' || String(v).toLowerCase() === 'normal';
                        const formatNegative = (v: any) => isNegative(v) ? "Negative" : v;
                        
                        updateRow('Bilirubin (BIL)', chemistry.chem_bilirubin, isNegative, formatNegative);
                        updateRow('Urobilinogen (UBG)', chemistry.chem_urobilinogen, v => { 
                            if(String(v).toLowerCase() === 'normal' || String(v).toLowerCase() === 'norm') return true;
                            const f = parseFloat(v); return !isNaN(f) && f >= 0.2 && f <= 1.0; 
                        });
                        updateRow('Ketone (KET)', chemistry.chem_ketones, isNegative, formatNegative);
                        updateRow('Ascorbic Acid (ASC)', chemistry.chem_ascorbicAcid, isNegative, formatNegative);
                        updateRow('Glucose (GLU)', chemistry.chem_glucose, v => isNegative(v), v => isNegative(v) ? "Normal" : v);
                        updateRow('Protein (PRO)', chemistry.chem_protein, v => isNegative(v) || parseFloat(v) <= 30, v => {
                            if (isNegative(v)) return "Negative";
                            const val = parseFloat(v);
                            if (!isNaN(val) && val <= 30) return "Trace";
                            return String(val);
                        });
                        updateRow('Blood (BLD)', chemistry.chem_blood, isNegative, v => isNegative(v) ? "Negative" : `${v} Ery/µL`);
                        updateRow('Nitrite (NIT)', chemistry.chem_nitrite, isNegative, v => isNegative(v) ? 'Negative' : 'Positive');
                        updateRow('Leukocytes (LEU)', chemistry.chem_leukocytes, isNegative, v => isNegative(v) ? "Negative" : `${v} Leu/µL`);
                    }
                    
                    if (sensorData) {
                         const turbidityRow = newDiagnostics.find((r: any) => r.parameter === 'Turbidity');
                        if (turbidityRow && sensorData.turbidity !== undefined) {
                            const turbidityValue = parseFloat(sensorData.turbidity);
                            turbidityRow.value = isNaN(turbidityValue) ? '...' : `${turbidityValue.toFixed(1)} NTU`;
                            turbidityRow.status = turbidityValue < 20 ? "Normal" : "Abnormal";
                        }
                         updateRow('pH Level', sensorData.ph_value_sensor, v => { const f = parseFloat(v); return !isNaN(f) && f >= 4.5 && f <= 8.0; }, v => parseFloat(v).toFixed(2));
                         updateRow('Specific Gravity (SG)', sensorData.specific_gravity_sensor, v => { const f = parseFloat(v); return !isNaN(f) && f >= 1.005 && f <= 1.030; }, v => parseFloat(v).toFixed(3));
                    }

                    return newDiagnostics;
                });
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user, database]);

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

            // Fetch latest health data (sensor and chemistry) from Realtime Database
            const rtdbRef = ref(database, `Users/${user.uid}`);
            const rtdbSnap = await get(rtdbRef);
            const rtdbData = rtdbSnap.exists() ? rtdbSnap.val() : {};

            const { latestCombinedSession } = getLatestCombinedSession(rtdbData);
            
            const parsedHealthData = {
                sensorData: latestCombinedSession?.sensorData,
                Chemistry_Result: latestCombinedSession?.Chemistry_Result,
            };

            const combinedData = { user: userData, health: parsedHealthData };
            setReportData(combinedData);

            // Wait for state to update and component to re-render
            setTimeout(() => {
                const element = reportRef.current;
                if (element && window.html2pdf) {
                    const opt = {
                        margin: 0,
                        filename: `Urine_Diagnostics_Report_${userData.firstName || 'User'}.pdf`,
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


    return (
        <div className="space-y-8 animate-fade-in">
            <div className="fixed -left-[9999px] top-0 opacity-0">
                <DownloadableReport ref={reportRef} data={reportData} />
            </div>

            <div className="animate-slide-up">
                <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-teal-green to-glow-lime-emerald animate-text-gradient bg-400">Urine & Stool Diagnostics</h1>
                <p className="text-muted-foreground">
                    Diagnostic dashboards for urine and stool analysis, classifications, and risk indicators.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-teal-green to-glow-lime-emerald animate-text-gradient bg-400">Urine Diagnosis Results</h2>
                    <div className="bg-white/5 border border-teal-500/20 rounded-2xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b-teal-500/20">
                                    <TableHead className="text-gray-300 font-semibold">TEST PARAMETER</TableHead>
                                    <TableHead className="text-gray-300 font-semibold">VALUE</TableHead>
                                    <TableHead className="text-gray-300 font-semibold">REFERENCE RANGE</TableHead>
                                    <TableHead className="text-right text-gray-300 font-semibold">STATUS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {urineDiagnostics.map((item, index) => (
                                    <TableRow key={index} className="border-teal-500/10">
                                        <TableCell className="font-medium text-gray-300">{item.parameter}</TableCell>
                                        <TableCell className="text-gray-400">{item.value}</TableCell>
                                        <TableCell className="text-gray-400">{item.range}</TableCell>
                                        <TableCell className="text-right">
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                     <h2 className="text-xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-glow-lime-emerald to-glow-teal-green animate-text-gradient bg-400">Stool Diagnosis Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stoolDiagnostics.map((item, index) => (
                            <DiagnosticCard key={index} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <h2 className="text-xl font-headline font-semibold text-gray-300">Health Summary & Combined Diagnostics</h2>
                <div className="bg-white/5 border border-teal-500/30 rounded-2xl p-6 shadow-lg shadow-teal-500/10 relative">
                    <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/50 animate-pulse" style={{ pointerEvents: 'none' }}></div>
                    <p className="text-gray-400">
                        Based on the latest Dipstics Result , your health indicators are within normal ranges. Minor variations are common and not clinically significant at this time. Please continue maintaining healthy habits and regular hydration. This report is for routine monitoring only; consult a physician if symptoms persist.
                    </p>
                    <div className="text-center mt-6">
                        <Button onClick={handleDownload} size="lg" className="bg-primary/80 hover:bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40" loading={loading}>
                            <Download className="mr-2 h-5 w-5" />
                            Urine & Stool Diagnostics Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
