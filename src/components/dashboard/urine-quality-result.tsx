'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Waves } from 'lucide-react';

interface UrineQualityResultProps {
  tdsValue: number | undefined;
  turbidityValue: number | undefined;
}

export function UrineQualityResult({ tdsValue, turbidityValue }: UrineQualityResultProps) {
  // TDS Logic
  const tds = tdsValue ?? 0;
  let tdsStatus: 'Normal' | 'Slightly Abnormal' | 'Abnormal';
  if (tds <= 300) {
    tdsStatus = 'Normal';
  } else if (tds > 300 && tds <= 500) {
    tdsStatus = 'Slightly Abnormal';
  } else {
    tdsStatus = 'Abnormal';
  }

  // Turbidity Logic
  const turbidity = turbidityValue ?? 0;
  let turbidityStatus: 'Normal' | 'Slightly Abnormal' | 'Abnormal';
  let turbidityText: string;
  if (turbidity < 20) {
    turbidityStatus = 'Normal';
    turbidityText = 'Clear';
  } else if (turbidity >= 20 && turbidity <= 50) {
    turbidityStatus = 'Slightly Abnormal';
    turbidityText = 'Slightly Cloudy';
  } else {
    turbidityStatus = 'Abnormal';
    turbidityText = 'Cloudy';
  }

  // Combined Conclusion Logic
  let conclusion = '';
  let overallStatus: 'Normal' | 'Slightly Abnormal' | 'Abnormal';
  if (tdsStatus === 'Abnormal' || turbidityStatus === 'Abnormal') {
    overallStatus = 'Abnormal';
    conclusion = 'Abnormal findings are indicated, and further evaluation is recommended.';
  } else if (tdsStatus === 'Slightly Abnormal' || turbidityStatus === 'Slightly Abnormal') {
    overallStatus = 'Slightly Abnormal';
    conclusion = 'Minor variation is observed in the sample; however, no immediate concern is indicated.';
  } else {
    overallStatus = 'Normal';
    conclusion = 'The sample appears clean, and no abnormal findings are indicated.';
  }

  const getStatusClasses = (status: 'Normal' | 'Slightly Abnormal' | 'Abnormal') => {
    switch (status) {
      case 'Normal':
        return 'bg-status-green/20 text-status-green border-status-green/30';
      case 'Slightly Abnormal':
        return 'bg-status-yellow/20 text-status-yellow border-status-yellow/30';
      case 'Abnormal':
        return 'bg-status-red/20 text-status-red border-status-red/30';
    }
  };
  
  const getBorderClass = (status: 'Normal' | 'Slightly Abnormal' | 'Abnormal') => {
    switch (status) {
        case 'Normal': return 'border-status-green/50';
        case 'Slightly Abnormal': return 'border-status-yellow/50 shadow-lg shadow-status-yellow/10';
        case 'Abnormal': return 'border-status-red/50 shadow-lg shadow-status-red/10';
    }
  }

  return (
    <Card className={cn("bg-card/50 border-2 w-full transition-all duration-300", getBorderClass(overallStatus))}>
        <CardHeader className="items-center pb-4">
            <div className="flex items-center gap-3">
                <Waves className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline text-lg tracking-wider">
                    URINE QUALITY RESULT
                </CardTitle>
            </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background/30 p-4 rounded-lg border border-border/50 space-y-2">
                    <h4 className="font-semibold text-primary/90 text-center">TDS</h4>
                    <div className="flex justify-between items-baseline text-sm">
                        <p className="font-medium text-muted-foreground">Value:</p>
                        <p className="font-semibold">{tds} <span className="font-normal text-muted-foreground">ppm</span></p>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <p className="font-medium text-muted-foreground">Status:</p>
                        <Badge className={cn('font-bold', getStatusClasses(tdsStatus))} variant="outline">{tdsStatus}</Badge>
                    </div>
                </div>
                 <div className="bg-background/30 p-4 rounded-lg border border-border/50 space-y-2">
                    <h4 className="font-semibold text-primary/90 text-center">Turbidity</h4>
                    <div className="flex justify-between items-baseline text-sm">
                        <p className="font-medium text-muted-foreground">Value:</p>
                        <p className="font-semibold">{turbidityText}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <p className="font-medium text-muted-foreground">Status:</p>
                        <Badge className={cn('font-bold', getStatusClasses(turbidityStatus))} variant="outline">{turbidityStatus}</Badge>
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
