
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { realTimeHealthMetrics, mockMedicalProfile } from "@/lib/data";
import { RealTimeChart } from "@/components/dashboard/real-time-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Good morning, {mockMedicalProfile.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's your real-time health overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {realTimeHealthMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                Updated just now
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Health Trends</CardTitle>
            <CardDescription>Your key vitals over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RealTimeChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">AI Health Insights</CardTitle>
            <CardDescription>
              Personalized advice based on your latest data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">
              Our AI has analyzed your recent health data and generated new insights for you.
              Review them to stay on top of your health.
            </p>
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg w-full">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">3</p>
                <p className="text-sm font-medium">New Insights</p>
              </div>
            </div>
            <Link href="/dashboard/insights" className="w-full">
              <Button className="w-full">
                View My Insights <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
