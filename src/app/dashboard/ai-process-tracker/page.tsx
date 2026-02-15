'use client';
import { AiAssistantChat } from '@/components/dashboard/ai-assistant-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BrainCircuit, CheckCircle, Database, Filter, FlaskConical, Camera, RefreshCw, Loader2, X, Upload } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { analyzeDipstick } from '@/lib/actions';
import type { DipstickResult } from '@/ai/flows/analyze-dipstick-flow';

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
        description: 'Actionable health insights are created. You can also manually scan a dipstick below.',
        icon: CheckCircle,
        status: 'pending',
    },
];

export default function AiProcessTrackerPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DipstickResult[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const openCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(cameraStream);
        setIsCameraOpen(true);
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };
  
  useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Cleanup on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, stream]);

  const performAnalysis = async (imageDataUri: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await analyzeDipstick({ imageDataUri });

    if (result.error) {
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: result.error,
        });
        setAnalysisResult(null);
    } else {
        setAnalysisResult(result.results);
        toast({
            title: 'Analysis Complete',
            description: 'Dipstick analysis results are now available.',
        });
    }

    setIsAnalyzing(false);
  };
  
  const handleCaptureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraOpen) {
        toast({
            variant: 'destructive',
            title: 'Camera not ready',
            description: 'Please open the camera before capturing an image.',
        });
        return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const imageDataUri = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUri);
    closeCamera();
    
    await performAnalysis(imageDataUri);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUri = e.target?.result as string;
        if (imageDataUri) {
          setCapturedImage(imageDataUri);
          if (isCameraOpen) closeCamera();
          await performAnalysis(imageDataUri);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

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
              {capturedImage ? "Review the captured image and analysis results." : "Use your camera to scan or upload a photo of a urine dipstick for an instant health parameter analysis."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <canvas ref={canvasRef} className="hidden" />
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div className="relative w-full aspect-video bg-black rounded-md flex items-center justify-center">
                    {capturedImage ? (
                        <Image src={capturedImage} alt="Captured dipstick" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : isCameraOpen ? (
                        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <Camera className="h-16 w-16" />
                            <p>Camera is off</p>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {!isCameraOpen && !capturedImage ? (
                        <>
                            <Button className="flex-1 min-w-[150px]" onClick={openCamera} disabled={isAnalyzing}>
                                <Camera className="mr-2 h-4 w-4" />
                                Open Camera
                            </Button>
                            <Button variant="outline" className="flex-1 min-w-[150px]" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Photo
                            </Button>
                        </>
                    ) : null}

                    {isCameraOpen && !capturedImage ? (
                        <>
                            <Button className="w-full" disabled={!hasCameraPermission || isAnalyzing} onClick={handleCaptureAndAnalyze}>
                                <Camera className="mr-2 h-4 w-4" />
                                Capture & Analyze
                            </Button>
                            <Button variant="outline" className="w-full" onClick={closeCamera} disabled={isAnalyzing}>
                                <X className="mr-2 h-4 w-4" />
                                Close Camera
                            </Button>
                        </>
                    ) : null}
                    
                    {capturedImage ? (
                        <Button className="w-full" variant="outline" onClick={handleRetake} disabled={isAnalyzing}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retake or Upload New
                        </Button>
                    ) : null}
                </div>
                
                {isAnalyzing && (
                    <div className="flex items-center justify-center text-muted-foreground gap-2 pt-4">
                        <Loader2 className="animate-spin" />
                        <p>Our AI is analyzing your image... this may take a moment.</p>
                    </div>
                )}
                
                {analysisResult && (
                    <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">Analysis Results</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Parameter</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analysisResult.map((res, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{res.parameter}</TableCell>
                                        <TableCell>{res.value}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={
                                                res.status === 'Normal' ? 'green' : 
                                                res.status === 'Abnormal' ? 'destructive' : 'yellow'
                                            }>{res.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
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
