'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

type Status = "Normal" | "Needs Attention" | "Abnormal";

const urineDiagnostics = [
    { title: "Overall Urine Health Status", subtitle: "Hydration Status", status: "Normal" as Status },
    { title: "pH Balance Status", subtitle: "Mheds Attention", status: "Normal" as Status },
    { title: "Possible UTI Risk Indicator", subtitle: "Harmal risk wator", status: "Abnormal" as Status },
    { title: "Kidney Stress Indicator", subtitle: "Hsewred rick factor", status: "Abnormal" as Status },
    { title: "Urine Clarity Status", subtitle: "Normal nak tisator", status: "Normal" as Status },
    { title: "Urine Concentration", subtitle: "Normal nak tistor", status: "Normal" as Status },
];

const stoolDiagnostics = [
    { title: "Overall Stool Health", subtitle: "Normal risk tictor", status: "Abnormal" as Status },
    { title: "Stool Consistency Indicator", subtitle: "normal nak fastoe", status: "Normal" as Status },
    { title: "Bowel Regularity", subtitle: "Normal risk tisator", status: "Normal" as Status },
    { title: "Possible Infection Risk", subtitle: "normal nsk tlostor", status: "Abnormal" as Status },
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
    const handleDownload = () => {
        alert('PDF download functionality is not yet implemented.');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="animate-slide-up">
                <h1 className="text-3xl font-headline font-bold">Urine & Stool Diagnostics</h1>
                <p className="text-muted-foreground">
                    Diagnostic dashboards for urine and stool analysis, classifications, and risk indicators.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-xl font-headline font-semibold text-gray-300">Urine Diagnosis Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {urineDiagnostics.map((item, index) => (
                            <DiagnosticCard key={index} {...item} />
                        ))}
                    </div>
                </div>
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
                    <h2 className="text-xl font-headline font-semibold text-gray-300">Stool Diagnosis Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stoolDiagnostics.map((item, index) => (
                            <DiagnosticCard key={index} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <h2 className="text-xl font-headline font-semibold text-gray-300">AI Health Summary & Combined Diagnostics</h2>
                <div className="bg-white/5 border border-teal-500/30 rounded-2xl p-6 shadow-lg shadow-teal-500/10 relative">
                    <div className="absolute inset-0 rounded-2xl border-2 border-teal-500/50 animate-pulse" style={{ pointerEvents: 'none' }}></div>
                    <p className="text-gray-400">
                        Based on recent sensor health data, your trending stable, but, your nitroo detected, but of uinds ph imbaleke and yourhe paulle atth Al recommends inceaitir a physician if a yınstoms pereist. Detected risk patterns includes...
                    </p>
                    <div className="text-center mt-6">
                        <Button onClick={handleDownload} size="lg" className="bg-primary/80 hover:bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40">
                            <Download className="mr-2 h-5 w-5" />
                            Download Health Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
