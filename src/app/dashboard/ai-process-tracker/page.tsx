'use client';
import { AiAssistantChat } from '@/components/dashboard/ai-assistant-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BrainCircuit, CheckCircle, Database, Filter, FlaskConical, Camera } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const processStages = [
    {
        name: 'Data Capture',
        description: 'Sensors collect real-time urine and stool data.',
        icon: Database,
        status: 'completed',
    },
    {
        name: 'Preprocessing',
        description: 'Raw data is cleaned, normalized, and structured.',
        icon: Filter,
        status: 'completed',
    },
    {
        name: 'Inference',
        description: 'AI model analyzes data for anomalies and patterns.',
        icon: BrainCircuit,
        status: 'active',
    },
    {
        name: 'Validation',
        description: 'Results are cross-referenced with medical knowledge.',
        icon: FlaskConical,
        status: 'pending',
    },
     {
        name: 'Insight Generation',
        description: 'Actionable health insights are created for the user. You can also manually scan a dipstick below.',
        icon: CheckCircle,
        status: 'pending',
    },
];

export default function AiProcessTrackerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-8">
        <div className="animate-slide-up" style={{animationDelay: '200ms'}}>
            <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-text-gradient bg-400">AI Process Tracker</h1>
            <p className="text-muted-foreground">
                Visualize AI stages: data capture, preprocessing, inference, and validation.
            </p>
        </div>

        <div className="relative animate-slide-up" style={{animationDelay: '300ms'}}>
            {/* Dotted line connecting the stages */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border border-l-2 border-dashed ml-[1px] -z-10"></div>

            <div className="space-y-12">
            {processStages.map((stage, index) => (
                <div key={index} className="flex items-start gap-6 relative">
                    <div className={cn("flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center z-10 bg-card", 
                        stage.status === 'completed' ? 'border-2 border-status-green' : 
                        stage.status === 'active' ? 'border-2 border-primary' : 
                        'border'
                    )}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center",
                            stage.status === 'completed' ? 'bg-status-green/10' :
                            stage.status === 'active' ? 'bg-primary/10' :
                            'bg-muted'
                        )}>
                            <stage.icon className={cn("h-5 w-5",
                                stage.status === 'completed' ? 'text-status-green' :
                                stage.status === 'active' ? 'text-primary animate-pulse' :
                                'text-muted-foreground'
                            )} />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{stage.name}</h3>
                        <p className="text-muted-foreground text-sm">{stage.description}</p>
                    </div>
                </div>
            ))}
            </div>
        </div>

        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              Manual Dipstick Analysis
            </CardTitle>
            <CardDescription>
              Use your camera to scan a urine dipstick for an instant health parameter analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                
                {!hasCameraPermission && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature.
                        </AlertDescription>
                    </Alert>
                )}

                <Button className="w-full" disabled={!hasCameraPermission} onClick={() => alert("Analysis feature coming soon!")}>
                    <Camera className="mr-2 h-4 w-4" />
                    Analyze Dipstick Photo
                </Button>
            </div>
          </CardContent>
        </Card>

      </div>
      <div className="lg:col-span-1 animate-slide-up" style={{animationDelay: '400ms'}}>
        <AiAssistantChat />
      </div>
    </div>
  );
}
