
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
       <div className="animate-slide-up">
        <h1 className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-text-gradient bg-400">Medical Profile</h1>
        <p className="text-muted-foreground mt-1">Keep your personal and medical details up to date.</p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>This information helps our AI provide personalized insights. It is kept secure and private.</CardDescription>
        </CardHeader>
        <CardContent>
            <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
