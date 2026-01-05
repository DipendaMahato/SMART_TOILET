
"use client";

import { useState } from "react";
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
import { Wifi, Bluetooth, Palette, Languages, Bell, FileDown, ShieldCheck, Lock } from "lucide-react";

export function SettingsTabs() {
  const [biometric, setBiometric] = useState(false);
  const [appLock, setAppLock] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [insightAlerts, setInsightAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [wifiSync, setWifiSync] = useState(true);
  const [bluetoothSync, setBluetoothSync] = useState(false);

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="data">Data & AI</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <Card>
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
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><ShieldCheck/> Biometric Login</Label>
                    <p className="text-sm text-muted-foreground">Use your fingerprint or face to log in.</p>
                </div>
                <Switch id="biometric" checked={biometric} onCheckedChange={setBiometric} />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Lock/> App Lock</Label>
                    <p className="text-sm text-muted-foreground">Require authentication every time you open the app.</p>
                </div>
                <Switch id="app-lock" checked={appLock} onCheckedChange={setAppLock} />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Password</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">App Preferences</CardTitle>
            <CardDescription>
              Customize the look and feel of your app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2"><Palette/> Theme</Label>
                <Select defaultValue="system">
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
                <Select defaultValue="en">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center justify-between">
                <Label>Measurement Units</Label>
                <Select defaultValue="metric">
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
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Notifications</CardTitle>
            <CardDescription>
              Choose what alerts you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Bell/> Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive critical health alerts immediately.</p>
                </div>
                <Switch id="emergency-alerts" checked={emergencyAlerts} onCheckedChange={setEmergencyAlerts}/>
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">New Insight Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new AI insights are ready.</p>
                </div>
                <Switch id="insight-alerts" checked={insightAlerts} onCheckedChange={setInsightAlerts} />
            </div>
             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive a summary of your health trends every week.</p>
                </div>
                <Switch id="weekly-summary" checked={weeklySummary} onCheckedChange={setWeeklySummary} />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Notifications</Button>
          </CardFooter>
        </Card>
      </TabsContent>

       <TabsContent value="data">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Data &amp; AI</CardTitle>
            <CardDescription>
              Manage data synchronization and AI settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Wifi/> Wi-Fi Sync</Label>
                    <p className="text-sm text-muted-foreground">Sync data automatically over Wi-Fi.</p>
                </div>
                <Switch id="wifi-sync" checked={wifiSync} onCheckedChange={setWifiSync}/>
            </div>
             <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2"><Bluetooth/> Bluetooth Sync</Label>
                    <p className="text-sm text-muted-foreground">Allow data sync via Bluetooth when Wi-Fi is unavailable.</p>
                </div>
                <Switch id="bluetooth-sync" checked={bluetoothSync} onCheckedChange={setBluetoothSync} />
            </div>
            <div className="space-y-2">
                <Label>AI Sensitivity</Label>
                <Select defaultValue="balanced">
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
          <CardFooter className="flex-col items-start gap-4">
            <Button><FileDown className="mr-2"/> Export My Health Report</Button>
            <p className="text-xs text-muted-foreground">Export a PDF of your complete health data and insights.</p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
