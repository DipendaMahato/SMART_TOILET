'use client';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const generateData = () => Array.from({ length: 10 }, (_, i) => ({
    name: i,
    uv: Math.floor(Math.random() * 300) + 100,
}));

export function TinyAreaChart() {
    const [data, setData] = useState(generateData());

    useEffect(() => {
        const interval = setInterval(() => {
            setData(currentData => {
                const newDataPoint = {
                    name: (currentData[currentData.length - 1].name + 1) % 10,
                    uv: Math.floor(Math.random() * 300) + 100
                };
                const newArr = [...currentData.slice(1), newDataPoint];
                return newArr;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#50C8C8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#50C8C8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Tooltip
                    contentStyle={{
                        background: 'rgba(11, 17, 32, 0.8)',
                        borderColor: 'rgba(80, 200, 200, 0.3)',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        color: '#E5E7EB'
                    }}
                    labelStyle={{ display: 'none' }}
                    itemStyle={{ color: '#50C8C8' }}
                />
                <Area type="monotone" dataKey="uv" stroke="#50C8C8" strokeWidth={2} fill="url(#colorUv)" dot={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
}
