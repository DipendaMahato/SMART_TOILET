
'use client';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
        return (
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2 text-sm shadow-lg">
                <p className="font-semibold text-foreground">{`${props.label}`}</p>
                <p style={{ color: '#67e8f9' }}>{`Bristol Type: ${props.payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export function StoolConsistencyTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false}/>
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--primary) / 0.1)' }} />
           <defs>
             <linearGradient id="stoolBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <Bar dataKey="bristol" fill="url(#stoolBarGradient)" barSize={20} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="highRisk" stroke="#67e8f9" strokeWidth={2} dot={false} activeDot={false} name="High Risk"/>
          <Line type="monotone" dataKey="bristol" stroke="#67e8f9" strokeWidth={2} name="Bristol Type" />
        </ComposedChart>
      </ResponsiveContainer>
       <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground mt-2">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#67e8f9'}} />
            <span>Bristol Type</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-0.5" style={{backgroundColor: '#67e8f9'}} />
            <span>High Risk (Type 3-4)</span>
         </div>
      </div>
    </div>
  );
}
