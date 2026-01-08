'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SemiCircleGaugeProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SemiCircleGauge: React.FC<SemiCircleGaugeProps> = ({ value, size = 'md', className }) => {
  const sizeClasses = {
    sm: { dimension: 80, stroke: 8 },
    md: { dimension: 120, stroke: 12 },
    lg: { dimension: 160, stroke: 16 },
  };

  const { dimension, stroke } = sizeClasses[size];
  const radius = (dimension - stroke) / 2;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn('relative flex flex-col items-center justify-end', className)}
      style={{ width: dimension, height: dimension / 2 }}
    >
      <svg className="absolute bottom-0 left-0" width={dimension} height={dimension / 2} viewBox={`0 0 ${dimension} ${dimension / 2}`}>
        <path
          d={`M ${stroke / 2} ${dimension / 2} A ${radius} ${radius} 0 0 1 ${dimension - stroke / 2} ${dimension / 2}`}
          className="text-gray-700/50"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${dimension / 2} A ${radius} ${radius} 0 0 1 ${dimension - stroke / 2} ${dimension / 2}`}
          className="text-lime-400 drop-shadow-[0_0_3px_#A3E635]"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="relative text-center">
        <span className={cn(
            "font-bold text-gray-200",
            size === 'sm' && 'text-xl',
            size === 'md' && 'text-3xl',
            size === 'lg' && 'text-4xl',
        )}>
            {Math.round(value)}
            <span className={cn(
                "text-gray-400",
                size === 'sm' && 'text-sm',
                size === 'md' && 'text-lg',
                size === 'lg' && 'text-xl',
            )}>%</span>
        </span>
      </div>
    </div>
  );
};
