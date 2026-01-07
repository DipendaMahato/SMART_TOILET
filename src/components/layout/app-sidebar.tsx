
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Bot,
  User,
  Settings,
  LogOut,
  RadioTower,
  BrainCircuit,
  FlaskConical,
  Activity,
  Heart,
  Stethoscope,
  UserCircle,
} from "lucide-react";
import { useUser, useAuth } from "@/firebase";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/live-sensor-data", icon: RadioTower, label: "Live Sensor Data" },
  { href: "/dashboard/ai-process-tracker", icon: BrainCircuit, label: "AI Process Tracker" },
  { href: "/dashboard/diagnostics", icon: FlaskConical, label: "Diagnostics" },
  { href: "/dashboard/vitals-trends", icon: Activity, label: "Vitals & Trends" },
  { href: "/dashboard/health-status", icon: Heart, label: "Health Status" },
  { href: "/dashboard/clinical-care", icon: Stethoscope, label: "Clinical Care" },
  { href: "/dashboard/insights", icon: Bot, label: "Real-Time Health Insights" },
  { href: "/dashboard/profile", icon: User, label: "Medical Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/login');
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
          <Image src="/logo.png" alt="App Logo" width={32} height={32} />
          <span className="text-sm">Smart Toilet</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
                pathname === item.href && "bg-primary/10 text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                <AvatarFallback>
                  {user?.displayName?.charAt(0) || <UserCircle className="h-10 w-10 text-muted-foreground" />}
                </AvatarFallback>
            </Avatar>
          <div>
            <p className="font-semibold">{user?.displayName || 'Welcome'}</p>
            <p className="text-xs text-muted-foreground">Premium User</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
