"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wifi, Bluetooth, Palette, Languages, Bell, FileDown, ShieldCheck, Lock, Mail, Phone, LifeBuoy } from "lucide-react";
import { useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type Preferences = {
    theme: string;
    language: string;
    units: string;
    biometric: boolean;
    appLock: boolean;
    emergencyAlerts: boolean;
    insightAlerts: boolean;
    weeklySummary: boolean;
    wifiSync: boolean;
    bluetoothSync: boolean;
    aiSensitivity: string;
};

export function SettingsTabs() {
  const { theme, setTheme } = useTheme();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<Partial<Preferences>>({
    theme: 'system',
    language: 'en',
    units: 'metric',
    aiSensitivity: 'balanced',
    appLock: true,
    emergencyAlerts: true,
    insightAlerts: true,
    wifiSync: true,
  });

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, "users", user.uid);
  }, [firestore, user?.uid]);

  useEffect(() => {
    setIsClient(true);
    if (user && !isUserLoading && profileRef) {
        const fetchPreferences = async () => {
            const docSnap = await getDoc(profileRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.preferences) {
                    setPreferences(prev => ({ ...prev, ...data.preferences }));
                    if (data.preferences.theme) {
                        setTheme(data.preferences.theme);
                    }
                }
            }
        };
        fetchPreferences();
    }
  }, [user, isUserLoading, profileRef, setTheme]);

  const handleSwitchChange = (key: keyof Preferences) => (checked: boolean) => {
      setPreferences(prev => ({...prev, [key]: checked}));
  };

  const handleSelectChange = (key: keyof Preferences) => (value: string) => {
      setPreferences(prev => ({...prev, [key]: value}));
      if (key === 'theme') {
          setTheme(value);
      }
  };

  const handleSave = async () => {
      if (!profileRef) return;
      setLoading(true);
      try {
          await setDoc(profileRef, { preferences }, { merge: true });
          toast({
              title: "Success",
              description: "Your preferences have been saved.",
          });
      } catch (error: any) {
          toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to save preferences: " + error.message,
          });
      } finally {
          setLoading(false);
      }
  };


  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="data">Data & AI</TabsTrigger>
        <TabsTrigger value="support">Support</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-headline">Account Security</CardTitle>
            <CardDescription>
              Manage your password and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><ShieldCheck/> Biometric Login</Label>
                    <p className="text-sm text-muted-foreground">Use your fingerprint or face to log in.</p>
                </div>
                {isClient && <Switch id="biometric" checked={preferences.biometric} onCheckedChange={handleSwitchChange('biometric')} />}
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Lock/> App Lock</Label>
                    <p className="text-sm text-muted-foreground">Require authentication every time you open the app.</p>
                </div>
                {isClient && <Switch id="app-lock" checked={preferences.appLock} onCheckedChange={handleSwitchChange('appLock')} />}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} loading={loading}>Save Security Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-headline">App Preferences</CardTitle>
            <CardDescription>
              Customize the look and feel of your app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2"><Palette/> Theme</Label>
                <Select onValueChange={handleSelectChange('theme')} value={preferences.theme}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2"><Languages/> Language</Label>
                <Select onValueChange={handleSelectChange('language')} value={preferences.language}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center justify-between">
                <Label>Measurement Units</Label>
                <Select onValueChange={handleSelectChange('units')} value={preferences.units}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={handleSave} loading={loading}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-headline">Notifications</CardTitle>
            <CardDescription>
              Choose what alerts you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Bell className="text-status-red"/> Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive critical health alerts immediately.</p>
                </div>
                {isClient && <Switch id="emergency-alerts" checked={preferences.emergencyAlerts} onCheckedChange={handleSwitchChange('emergencyAlerts')}/>}
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">New Insight Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new AI insights are ready.</p>
                </div>
                {isClient && <Switch id="insight-alerts" checked={preferences.insightAlerts} onCheckedChange={handleSwitchChange('insightAlerts')} />}
            </div>
             <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive a summary of your health trends every week.</p>
                </div>
                {isClient && <Switch id="weekly-summary" checked={preferences.weeklySummary} onCheckedChange={handleSwitchChange('weeklySummary')} />}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} loading={loading}>Save Notifications</Button>
          </CardFooter>
        </Card>
      </TabsContent>

       <TabsContent value="data">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-headline">Data &amp; AI</CardTitle>
            <CardDescription>
              Manage data synchronization and AI settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Wifi/> Wi-Fi Sync</Label>
                    <p className="text-sm text-muted-foreground">Sync data automatically over Wi-Fi.</p>
                </div>
                {isClient && <Switch id="wifi-sync" checked={preferences.wifiSync} onCheckedChange={handleSwitchChange('wifiSync')}/>}
            </div>
             <div className="flex items-center justify-between space-x-2 rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Bluetooth/> Bluetooth Sync</Label>
                    <p className="text-sm text-muted-foreground">Allow data sync via Bluetooth when Wi-Fi is unavailable.</p>
                </div>
                {isClient && <Switch id="bluetooth-sync" checked={preferences.bluetoothSync} onCheckedChange={handleSwitchChange('bluetoothSync')} />}
            </div>
            <div className="space-y-2">
                <Label>AI Sensitivity</Label>
                <Select onValueChange={handleSelectChange('aiSensitivity')} value={preferences.aiSensitivity}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select AI sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low - Fewer, more critical alerts.</SelectItem>
                        <SelectItem value="balanced">Balanced - A moderate level of insights.</SelectItem>
                        <SelectItem value="high">High - More detailed, proactive advice.</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} loading={loading}>Save Data & AI Settings</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="support">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="font-headline">Contact & Support</CardTitle>
            <CardDescription>
              Get help with the app or provide feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <a href="mailto:smarttoiletapp5@gmail.com" className="hover:text-primary">
                    smarttoiletapp5@gmail.com
                </a>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                 <a href="tel:+916201158797" className="hover:text-primary">
                    +916201158797
                </a>
            </div>
            <div>
                <p>Support Hours: Mon–Sat, 9 AM – 6 PM</p>
            </div>
            <div className="pt-4 text-sm">
                <p>Developed by Dipendra Mahato (Team Smart Toilet)</p>
            </div>
        </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
