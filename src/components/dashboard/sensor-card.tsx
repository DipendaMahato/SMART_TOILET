import { cn } from "@/lib/utils";
import React from "react";

export const SensorCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white/5 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-4 shadow-lg shadow-teal-500/10 transition-all duration-300 hover:border-teal-500/40 hover:shadow-teal-500/20",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SensorCard.displayName = "SensorCard";