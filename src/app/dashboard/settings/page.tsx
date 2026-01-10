import { SettingsTabs } from "@/components/settings/settings-tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">App Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>
      <SettingsTabs />

      <Card>
        <CardHeader>
          <CardTitle>Contact & Support</CardTitle>
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
                <span>+91 6201158797</span>
            </div>
            <div>
                <p>Support Hours: Mon–Sat, 9 AM – 6 PM</p>
            </div>
            <div className="pt-4 text-sm">
                <p>Developed by Dipendra Mahato (Team Smart Toilet)</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
