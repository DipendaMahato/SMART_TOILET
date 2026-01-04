"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Home,
  Bot,
  User,
  Settings,
  HeartPulse,
  RadioTower,
  BrainCircuit,
  FlaskConical,
  Activity,
  Heart,
  Stethoscope,
  UserCircle,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mockMedicalProfile } from "@/lib/data";
import { Avatar, AvatarFallback } from "../ui/avatar";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/live-sensor-data", icon: RadioTower, label: "Live Sensor Data" },
  { href: "/dashboard/ai-process-tracker", icon: BrainCircuit, label: "AI Process Tracker" },
  { href: "/dashboard/diagnostics", icon: FlaskConical, label: "Diagnostics" },
  { href: "/dashboard/vitals-trends", icon: Activity, label: "Vitals & Trends" },
  { href: "/dashboard/health-status", icon: Heart, label: "Health Status" },
  { href: "/dashboard/clinical-care", icon: Stethoscope, label: "Clinical Care" },
  { href: "/dashboard/insights", icon: Bot, label: "AI Insights" },
  { href: "/dashboard/profile", icon: User, label: "Medical Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function getPageTitle(pathname: string) {
    const matchedItem = navItems.find(item => pathname === item.href);
    if (matchedItem) return matchedItem.label;
    if (pathname.startsWith('/dashboard')) {
        const parentPath = '/dashboard';
        const parentItem = navItems.find(item => item.href === parentPath);
        if (parentItem && pathname !== parentPath) {
             const subItem = navItems.find(item => pathname.startsWith(item.href) && item.href !== parentPath);
             if (subItem) return subItem.label;
        }
        return parentItem?.label ?? 'Dashboard';
    }
    return 'Dashboard';
}

export default function AppHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold mb-4 font-headline text-primary"
            >
              <HeartPulse className="h-6 w-6" />
              <span className="text-sm">Smart Toilet for Real time Health Monitoring</span>
            </Link>
            {navItems.map((item) => (
                 <Link key={item.label} href={item.href} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                 </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
        <h1 className="text-xl font-semibold font-headline">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
            <div className="relative">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
            </div>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <UserCircle className="h-full w-full text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/login">Logout</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
