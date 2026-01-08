'use client';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const generateData = () => Array.from({ length: 20 }, () => ({
    uv: Math.floor(Math.random() * 40) + 10,
}));

export function JaggedLineChart() {
    const [data, setData] = useState(generateData());

    useEffect(() => {
        const interval = setInterval(() => {
            setData(currentData => {
                const newDataPoint = {
                    uv: Math.floor(Math.random() * 40) + 10
                };
                return [...currentData.slice(1), newDataPoint];
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#F87171" // red-400
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
