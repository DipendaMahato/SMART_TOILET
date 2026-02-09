
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  Search,
  Home,
  User,
  Settings,
  RadioTower,
  BrainCircuit,
  FlaskConical,
  Activity,
  Heart,
  Stethoscope,
  UserCircle,
} from "lucide-react";
import { useUser, useAuth } from "@/firebase";

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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NotificationPanel } from "./notification-panel";


const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/live-sensor-data", icon: RadioTower, label: "Live Data" },
  { href: "/dashboard/ai-process-tracker", icon: BrainCircuit, label: "AI Process Tracker" },
  { href: "/dashboard/diagnostics", icon: FlaskConical, label: "Diagnostics" },
  { href: "/dashboard/vitals-trends", icon: Activity, label: "Vitals & Trends" },
  { href: "/dashboard/health-status", icon: Heart, label: "Health Status" },
  { href: "/dashboard/clinical-care", icon: Stethoscope, label: "Clinical Care" },
  { href: "/dashboard/profile", icon: User, label: "Medical Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function getPageTitle(pathname: string) {
    const navItemsForTitle = [
      { href: "/dashboard", icon: Home, label: "Dashboard" },
      { href: "/dashboard/live-sensor-data", icon: RadioTower, label: "Live Data" },
      { href: "/dashboard/ai-process-tracker", icon: BrainCircuit, label: "AI Process Tracker" },
      { href: "/dashboard/diagnostics", icon: FlaskConical, label: "Diagnostics" },
      { href: "/dashboard/vitals-trends", icon: Activity, label: "Vitals & Trends" },
      { href: "/dashboard/health-status", icon: Heart, label: "Health Status" },
      { href: "/dashboard/clinical-care", icon: Stethoscope, label: "Clinical Care" },
      { href: "/dashboard/profile", icon: User, label: "Medical Profile" },
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ];
    const matchedItem = navItemsForTitle.find(item => pathname === item.href);
    if (matchedItem) return matchedItem.label;
    if (pathname.startsWith('/dashboard')) {
        const parentPath = '/dashboard';
        const parentItem = navItemsForTitle.find(item => item.href === parentPath);
        if (parentItem && pathname !== parentPath) {
             const subItem = navItemsForTitle.find(item => pathname.startsWith(item.href) && item.href !== parentPath);
             if (subItem) return subItem.label;
        }
        return parentItem?.label ?? 'Dashboard';
    }
    return 'Dashboard';
}

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user } = useUser();
  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    if (!auth) return;
    await auth.signOut();
    router.push('/login');
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-card/90 backdrop-blur-lg border-r-0">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold mb-4 font-headline text-primary"
            >
              <Image src="/logo.png" alt="App Logo" width={32} height={32} />
              <span className="text-sm">Smart Toilet</span>
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
        <h1 className="text-xl font-semibold font-headline text-transparent bg-clip-text bg-gradient-to-r from-glow-mint to-glow-cyan animate-text-gradient bg-400">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
            <NotificationPanel />
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0) || <UserCircle className="h-full w-full text-muted-foreground" />}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.displayName || 'My Account'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/dashboard/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
