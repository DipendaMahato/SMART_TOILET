
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
  { href: "/dashboard", icon: Home, label: "Dashboard", color: "text-glow-cyan-blue" },
  { href: "/dashboard/live-sensor-data", icon: RadioTower, label: "Live Sensor Data", color: "text-glow-cyan-blue" },
  { href: "/dashboard/ai-process-tracker", icon: BrainCircuit, label: "AI Process Tracker", color: "text-glow-purple-violet" },
  { href: "/dashboard/diagnostics", icon: FlaskConical, label: "Diagnostics", color: "text-glow-teal-green" },
  { href: "/dashboard/vitals-trends", icon: Activity, label: "Vitals & Trends", color: "text-glow-lime-emerald" },
  { href: "/dashboard/health-status", icon: Heart, label: "Health Status", color: "text-glow-sky-royal-blue" },
  { href: "/dashboard/clinical-care", icon: Stethoscope, label: "Clinical Care", color: "text-glow-red-rose" },
  { href: "/dashboard/profile", icon: User, label: "Medical Profile", color: "text-primary" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", color: "text-muted-foreground" },
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
    <aside className="hidden md:flex w-64 flex-col border-r bg-card/80 backdrop-blur-sm border-border/20">
      <div className="flex h-16 items-center justify-center border-b border-border/20 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
          <Image src="/logo.png" alt="App Logo" width={32} height={32} />
          <span className="text-sm">Smart Toilet</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary relative",
                isActive && item.color
              )}
            >
              {isActive && (
                 <div className={cn(
                    "absolute inset-0 rounded-lg animate-pulse-glow-soft",
                    `bg-${item.color.replace('text-','')}/10`,
                    `border border-${item.color.replace('text-','')}/50`,
                 )}></div>
              )}
              <item.icon className={cn("h-5 w-5 transition-all", isActive ? `${item.color} drop-shadow-[0_0_5px_currentColor]` : 'group-hover:text-primary')} />
              <span className="relative">{item.label}</span>
            </Link>
          )})}
        </nav>
      </div>
      <div className="mt-auto border-t border-border/20 p-4 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-glow-green via-glow-cyan to-glow-blue animate-flow-border bg-[length:400%_100%]" />
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
