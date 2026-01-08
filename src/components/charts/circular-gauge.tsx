'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface CircularGaugeProps {
  value: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({ value, label, size = 'md', className }) => {
  const sizeClasses = {
    sm: { dimension: 80, stroke: 6 },
    md: { dimension: 120, stroke: 10 },
    lg: { dimension: 160, stroke: 12 },
  };

  const { dimension, stroke } = sizeClasses[size];
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: dimension, height: dimension }}
    >
      <svg className="absolute inset-0" width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <circle
          className="text-gray-700/50"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={dimension / 2}
          cy={dimension / 2}
        />
        <circle
          className="text-teal-400 drop-shadow-[0_0_3px_#50C8C8]"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={dimension / 2}
          cy={dimension / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      {label && (
        <div className="absolute flex items-center justify-center w-full h-full">
            <div className="bg-teal-400/10 border border-teal-400/30 rounded-full flex items-center justify-center px-4 py-2">
                <span className="text-teal-300 text-sm font-bold">{label}</span>
            </div>
        </div>
      )}
      {!label && (
         <span className="text-2xl font-bold text-gray-200">{Math.round(value)}<span className='text-lg'>%</span></span>
      )}
    </div>
  );
};
