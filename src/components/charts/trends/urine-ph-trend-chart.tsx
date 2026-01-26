
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 text-sm shadow-lg">
                <p className="font-semibold text-foreground">{`${props.label}`}</p>
                 {props.payload.map((p: any) => (
                    <p key={p.dataKey} style={{ color: p.color }}>{`${p.name}: ${p.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

export function UrinePhTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" stroke="#c084fc" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 0.5', 'dataMax + 0.5']}/>
          <YAxis yAxisId="right" orientation="right" stroke="#2dd4bf" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 0.005', 'dataMax + 0.005']} tickFormatter={(value) => value.toFixed(3)} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--primary) / 0.1)' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ph"
            stroke="#c084fc"
            strokeWidth={2}
            name="Urine pH"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sg"
            stroke="#2dd4bf"
            strokeWidth={2}
            name="Specific Gravity"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground mt-2">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#c084fc'}} />
            <span>Urine pH</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#2dd4bf'}} />
            <span>Specific Gravity</span>
         </div>
      </div>
    </div>
  );
}
