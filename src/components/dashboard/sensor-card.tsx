
import { cn } from "@/lib/utils";
import React from "react";

export const SensorCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card/80 backdrop-blur-lg border rounded-2xl p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SensorCard.displayName = "SensorCard";
