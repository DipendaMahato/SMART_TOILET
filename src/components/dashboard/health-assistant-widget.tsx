
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, useFirestore } from "@/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { chatWithAi } from "@/lib/actions";

interface Message {
    role: 'user' | 'model';
    content: string;
}

export function HealthAssistantWidget() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState("Hello Dipendra, how can I help you today?");
    const [loading, setLoading] = useState(false);

    const askHealthAI = async () => {
        if (!question || !user || !firestore) return;
        setLoading(true);
        setResponse("Processing your request...");

        try {
            const healthDataRef = collection(firestore, `users/${user.uid}/healthData`);
            const q = query(healthDataRef, orderBy("timestamp", "desc"), limit(1));
            const snapshot = await getDocs(q);
            
            let contextData = "No recent data found.";
            if (!snapshot.empty) {
                const d = snapshot.docs[0].data();
                 contextData = `Urine pH: ${d.urinePH || '6.5'}, Specific Gravity: ${d.urineSpecificGravity || '1.015'}, Urine Protein: ${d.urineProtein || 'Negative'}, Urine Glucose: ${d.urineGlucose || 'Negative'}, Stool Consistency: ${d.stoolConsistency || 'Type 4'}. Status: Normal.`;
            }
            
            const history: Message[] = [{ role: 'model', content: contextData }];
            const result = await chatWithAi(history, question);
            
            if (result.error) {
                throw new Error(result.error);
            }

            setResponse(result.response);
        } catch (error: any) {
            console.error(error);
            setResponse("I am sorry, I am having trouble connecting to the service right now.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-card border border-border p-8 rounded-2xl">
            <div className="border-r border-muted pr-6">
                <h3 className="text-primary font-bold border-b border-primary/50 pb-2 mb-4">Health Profile</h3>
                <p><strong>Name:</strong> {user?.displayName || 'Dipendra Mahato'}</p>
                <p><strong>Age/Gender:</strong> 28 Yrs / Male</p>
                <p><strong>Blood Group:</strong> B+</p>
                <p><strong>Contact:</strong> 6201158797</p>
                <p><strong>Status:</strong> <span className="text-green-400 font-semibold">Everything is Normal</span></p>
            </div>
            <div>
                 <h3 className="text-primary font-bold">Smart Health Assistant</h3>
                 <p className="text-sm text-muted-foreground mb-3">Ask anything about your health or your latest data.</p>
                 <div className="flex gap-2">
                    <Input 
                        type="text" 
                        id="userQuestion" 
                        placeholder="How is my hydration today?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && askHealthAI()}
                        disabled={loading}
                    />
                    <Button onClick={askHealthAI} loading={loading}>Ask</Button>
                 </div>
                 <div id="aiResponse" className="mt-4 p-4 bg-background border-l-4 border-primary rounded-lg text-sm min-h-[60px]">
                    {response}
                 </div>
            </div>
        </div>
    );
}

