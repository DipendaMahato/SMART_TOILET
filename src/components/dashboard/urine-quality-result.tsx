'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Waves, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface UrineQualityResultProps {
  turbidityValue: number | undefined;
}

export function UrineQualityResult({ turbidityValue }: UrineQualityResultProps) {
  let status: 'Normal' | 'Slightly Abnormal' | 'Abnormal' = 'Normal';
  let conclusion = '';
  let statusClasses = {
    badge: 'bg-status-green/20 text-status-green border-status-green/30',
    border: 'border-status-green/50',
    icon: <CheckCircle className="h-10 w-10 text-status-green" />,
    gradient: 'from-status-green/10 to-transparent',
  };

  const value = turbidityValue ?? 0;

  if (value > 50) {
    status = 'Abnormal';
    conclusion = 'The sample is cloudy or murky, which may indicate an issue. Further evaluation is recommended.';
    statusClasses = {
      badge: 'bg-status-red/20 text-status-red border-status-red/30',
      border: 'border-status-red/50 shadow-lg shadow-status-red/10',
      icon: <XCircle className="h-10 w-10 text-status-red" />,
      gradient: 'from-status-red/10 to-transparent',
    };
  } else if (value >= 20) {
    status = 'Slightly Abnormal';
    conclusion = 'The sample is slightly cloudy. This is generally not a concern but should be monitored.';
    statusClasses = {
      badge: 'bg-status-yellow/20 text-status-yellow border-status-yellow/30',
      border: 'border-status-yellow/50 shadow-lg shadow-status-yellow/10',
      icon: <AlertTriangle className="h-10 w-10 text-status-yellow" />,
      gradient: 'from-status-yellow/10 to-transparent',
    };
  } else {
    status = 'Normal';
    conclusion = 'The sample appears clear, and no abnormal turbidity is indicated.';
  }

  // Visual meter
  const meterPercentage = Math.min((value / 100) * 100, 100);

  return (
    <Card className={cn(
        "bg-card/50 border-2 w-full transition-all duration-300",
        statusClasses.border
    )}>
        <CardHeader className={cn("items-center rounded-t-xl bg-gradient-to-b pb-4", statusClasses.gradient)}>
            <div className="flex items-center gap-3">
                <Waves className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-lg tracking-wider">
                    URINE QUALITY RESULT
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <p className="font-medium text-muted-foreground">Parameter</p>
                        <p className="text-xl font-semibold">Turbidity</p>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <p className="font-medium text-muted-foreground">Value</p>
                        <p className="text-xl font-semibold">{value} <span className="text-base font-normal text-muted-foreground">NTU</span></p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-muted-foreground">Status</p>
                        <Badge className={cn('font-bold', statusClasses.badge)} variant="outline">
                            {status}
                        </Badge>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-background/50 rounded-lg border border-border/50">
                    {statusClasses.icon}
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                            className={cn(
                                "h-2.5 rounded-full transition-all duration-500",
                                status === 'Normal' && 'bg-status-green',
                                status === 'Slightly Abnormal' && 'bg-status-yellow',
                                status === 'Abnormal' && 'bg-status-red'
                            )}
                            style={{ width: `${meterPercentage}%`}}
                        ></div>
                    </div>
                </div>
            </div>
            
            <div className="bg-background/30 p-4 rounded-lg border border-border/50">
                <h3 className="font-semibold text-primary/90">Conclusion:</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    {conclusion}
                </p>
            </div>
        </CardContent>
    </Card>
  );
}
