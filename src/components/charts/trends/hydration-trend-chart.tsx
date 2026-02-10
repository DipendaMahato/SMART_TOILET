
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

const CustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
        const { payload, label } = props;
        return (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 text-sm shadow-lg">
                <p className="font-semibold text-foreground">{`${label}`}</p>
                <p style={{ color: payload[0].color }}>{`Hydration: ${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};

export function HydrationTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--primary) / 0.1)' }} />
          <defs>
            <linearGradient id="hydrationGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="hydration"
            stroke="url(#hydrationGradient)"
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6' }}
            activeDot={{ r: 8, fill: '#3b82f6' }}
            name="Hydration"
            connectNulls
          />
          <ReferenceArea y1={80} y2={100} fill="hsl(var(--status-green) / 0.1)" stroke="hsl(var(--status-green) / 0.3)" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
       <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground mt-2">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{background: 'linear-gradient(to right, #818cf8, #3b82f6)'}} />
            <span>Hydration</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-status-green/30" />
            <span>Optimal Range (80-100%)</span>
         </div>
      </div>
    </div>
  );
}

// Custom component to render a reference area behind the chart lines
const ReferenceArea = (props: any) => {
    const { y1, y2, ...rest } = props;
    if (y1 === undefined || y2 === undefined) return null;
    return <Rectangle {...rest} y={y2} height={y1-y2} />;
};
