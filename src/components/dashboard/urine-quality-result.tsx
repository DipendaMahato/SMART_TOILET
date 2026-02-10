
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UrineQualityResultProps {
  turbidityValue: number | undefined;
}

export function UrineQualityResult({ turbidityValue }: UrineQualityResultProps) {
  let status: 'Normal' | 'Slightly Abnormal' | 'Abnormal' = 'Normal';
  let conclusion = '';
  let statusColor = 'bg-status-green/20 text-status-green border-status-green/30';

  const value = turbidityValue ?? 0;

  if (value > 50) {
    status = 'Abnormal';
    conclusion = 'The sample is cloudy or murky, which may indicate an issue. Further evaluation is recommended.';
    statusColor = 'bg-status-red/20 text-status-red border-status-red/30';
  } else if (value >= 20) {
    status = 'Slightly Abnormal';
    conclusion = 'The sample is slightly cloudy. This is generally not a concern but should be monitored.';
    statusColor = 'bg-status-yellow/20 text-status-yellow border-status-yellow/30';
  } else {
    status = 'Normal';
    conclusion = 'The sample appears clear, and no abnormal turbidity is indicated.';
    statusColor = 'bg-status-green/20 text-status-green border-status-green/30';
  }

  return (
    <Card className="bg-card/50 border-primary/20 w-full">
        <CardHeader className="items-center">
            <CardTitle className="font-headline text-lg">
                URINE QUALITY RESULT
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center border-y border-border/50 py-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Parameter</p>
                    <p className="text-lg font-semibold mt-1">Turbidity</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">Value</p>
                    <p className="text-lg font-semibold mt-1">{value} NTU</p>
                </div>
                 <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-1">
                        <Badge className={cn('font-bold', statusColor)} variant="outline">
                            {status}
                        </Badge>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-primary/90">Conclusion:</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    {conclusion}
                </p>
            </div>
        </CardContent>
    </Card>
  );
}
