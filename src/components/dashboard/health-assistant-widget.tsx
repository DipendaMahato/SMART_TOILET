
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, useFirestore } from "@/firebase";
import { collection, getDocs, limit, orderBy, query, doc, getDoc, Timestamp } from "firebase/firestore";
import { chatWithAi } from "@/lib/actions";

interface Message {
    role: 'user' | 'model';
    content: string;
}

// Helper to calculate age
const getAge = (dob: any) => {
    if (!dob) return null;
    const birthDate = (dob instanceof Timestamp) ? dob.toDate() : new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export function HealthAssistantWidget() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState("Hello, how can I help you today?");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (user && firestore) {
            const profileRef = doc(firestore, 'users', user.uid);
            getDoc(profileRef).then(docSnap => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            }).catch(error => {
                console.error("Error fetching user profile for widget:", error);
            });
            // Update greeting
            setResponse(`Hello ${user.displayName?.split(' ')[0] || 'there'}, how can I help you today?`);
        }
    }, [user, firestore]);

    const askHealthAI = async () => {
        if (!question) return;
        setLoading(true);
        setResponse("Processing your request...");

        try {
            // Simplified for debugging: Start with an empty history to isolate the AI call.
            const history: Message[] = [];
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

    const age = profile?.dateOfBirth ? getAge(profile.dateOfBirth) : null;
    const gender = profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'N/A';
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-card border border-border p-8 rounded-2xl">
            <div className="border-r border-muted pr-6">
                <h3 className="text-primary font-bold border-b border-primary/50 pb-2 mb-4">Health Profile</h3>
                <p><strong>Name:</strong> {profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : user?.displayName || 'Loading...'}</p>
                <p><strong>Age/Gender:</strong> {age ? `${age} Yrs / ${gender}` : `N/A / ${gender}`}</p>
                <p><strong>Blood Group:</strong> {profile?.bloodGroup || 'N/A'}</p>
                <p><strong>Contact:</strong> {profile?.phoneNumber || user?.phoneNumber || 'N/A'}</p>
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
