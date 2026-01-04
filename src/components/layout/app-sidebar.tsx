"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  User,
  Settings,
  LogOut,
  HeartPulse,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { mockMedicalProfile } from "@/lib/data";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/insights", icon: Bot, label: "AI Insights" },
  { href: "/dashboard/profile", icon: User, label: "Medical Profile" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
          <HeartPulse className="h-6 w-6" />
          <span>TotoHealth</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                pathname === item.href && "bg-muted text-primary font-medium"
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
           {userAvatar && (
            <Image
              src={userAvatar.imageUrl}
              width={40}
              height={40}
              alt="User Avatar"
              className="rounded-full"
              data-ai-hint={userAvatar.imageHint}
            />
          )}
          <div>
            <p className="font-semibold">{mockMedicalProfile.name}</p>
            <p className="text-xs text-muted-foreground">Premium User</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" asChild>
            <Link href="/login">
              <>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </>
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
