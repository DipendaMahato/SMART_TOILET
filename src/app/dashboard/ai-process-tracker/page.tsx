'use client';
import { AiAssistantChat } from '@/components/dashboard/ai-assistant-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BrainCircuit, CheckCircle, Database, Filter, FlaskConical } from 'lucide-react';

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
        description: 'Actionable health insights are created for the user.',
        icon: CheckCircle,
        status: 'pending',
    },
];

export default function AiProcessTrackerPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
            <h1 className="text-3xl font-headline font-bold">AI Process Tracker</h1>
            <p className="text-muted-foreground">
                Visualize AI stages: data capture, preprocessing, inference, and validation.
            </p>
        </div>

        <div className="relative">
            {/* Dotted line connecting the stages */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border border-l-2 border-dashed ml-[1px]"></div>

            <div className="space-y-12">
            {processStages.map((stage, index) => (
                <div key={index} className="flex items-start gap-6 relative">
                    <div className={cn("flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center z-10", 
                        stage.status === 'completed' ? 'bg-green-100 dark:bg-green-900' : 
                        stage.status === 'active' ? 'bg-primary/20' : 
                        'bg-muted'
                    )}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center",
                            stage.status === 'completed' ? 'bg-green-200 dark:bg-green-800' :
                            stage.status === 'active' ? 'bg-primary/30' :
                            'bg-muted'
                        )}>
                            <stage.icon className={cn("h-5 w-5",
                                stage.status === 'completed' ? 'text-green-600 dark:text-green-300' :
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

      </div>
      <div className="lg:col-span-1">
        <AiAssistantChat />
      </div>
    </div>
  );
}
