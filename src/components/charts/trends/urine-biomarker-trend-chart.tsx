
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 text-sm shadow-lg">
                <p className="font-semibold text-foreground">{`${props.label}`}</p>
                <p style={{ color: '#2dd4bf' }}>{`Occurrences: ${props.payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export function UrineBiomarkerTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--primary) / 0.1)' }} />
          <defs>
             <linearGradient id="biomarkerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
          <Bar dataKey="value" fill="url(#biomarkerGradient)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground mt-2">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{background: 'linear-gradient(to bottom, #2dd4bf, #0d9488)'}} />
            <span>Biomarker Occurrences</span>
         </div>
      </div>
    </div>
  );
}
