
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'mesh-gradient': 'linear-gradient(120deg, #e0f2fe 0%, #f0fdf4 50%, #fef2f2 100%)',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
        xl: `calc(var(--radius) + 4px)`,
        '2xl': `calc(var(--radius) + 10px)`,
        '3xl': `calc(var(--radius) + 16px)`,
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['"Space Grotesk"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        navy: '#0B1120',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        'glass-white': 'rgba(255, 255, 255, 0.5)',
        status: {
          green: 'hsl(var(--status-green))',
          yellow: 'hsl(var(--status-yellow))',
          orange: 'hsl(var(--status-orange))',
          red: 'hsl(var(--status-red))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        'clinical-title': '#0B3C5D',
        'clinical-subtitle': '#5F6F81',
        'clinical-highlight': '#1FA2A8',
        'glow-green': '#3CFF9E',
        'glow-cyan': '#3ADFFF',
        'glow-blue': '#5B9DFF',
        'glow-mint': '#5CFFB1',
        'glow-cyan-blue': { DEFAULT: '#4DDFFF', start: '#4DDFFF', end: '#1BA6C9' },
        'glow-purple-violet': { DEFAULT: '#B983FF', start: '#B983FF', end: '#7A4DFF' },
        'glow-teal-green': '#3AFFD8',
        'glow-lime-emerald': { DEFAULT: '#9BFF57', start: '#9BFF57', end: '#3AFF75' },
        'glow-sky-royal-blue': { DEFAULT: '#6BCBFF', start: '#6BCBFF', end: '#4A90E2' },
        'glow-red-rose': { DEFAULT: '#FF6B6B', start: '#FF6B6B', end: '#FF8E8E' },
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'float': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'slide-up': { from: { transform: 'translateY(20px)', opacity: '0'}, to: { transform: 'translateY(0)', opacity: '1'} },
        'slide-up-fast': { from: { transform: 'translateY(20px)', opacity: '0'}, to: { transform: 'translateY(0)', opacity: '1'} },
        'text-gradient': { 'to': { 'background-position': '200% center' } },
        'marquee': { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
        'marquee-lr': { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        'mesh-flow': { '0%': { 'background-position': '0% 50%' }, '50%': { 'background-position': '100% 50%' }, '100%': { 'background-position': '0% 50%' } },
        'flow-border': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'pulse-glow-soft': {
          '0%, 100%': { opacity: '0.7', 'box-shadow': '0 0 8px 2px hsl(var(--glow-mint) / 0.4)' },
          '50%': { opacity: '1', 'box-shadow': '0 0 12px 4px hsl(var(--glow-mint) / 0.6)' },
        },
        'light-trace': {
          '0%': { 'background-position': '-100% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'rotate-glow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-glow': {
          '0%': { 'border-color': 'hsl(var(--glow-teal-green) / 0.2)', transform: 'scale(1)' },
          '50%': { 'border-color': 'hsl(var(--glow-teal-green) / 1)', transform: 'scale(1.02)' },
          '100%': { 'border-color': 'hsl(var(--glow-teal-green) / 0.2)', transform: 'scale(1)' },
        },
        'heartbeat-pulse': {
          '0%': { 'box-shadow': '0 0 0 0 hsl(var(--glow-lime-emerald) / 0.7)' },
          '70%': { 'box-shadow': '0 0 0 10px hsl(var(--glow-lime-emerald) / 0)' },
          '100%': { 'box-shadow': '0 0 0 0 hsl(var(--glow-lime-emerald) / 0)' },
        },
        'breathing-glow': {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'alert-glow': {
          '0%, 100%': { 'box-shadow': '0 0 5px hsl(var(--glow-red-rose))', 'border-color': 'hsl(var(--glow-red-rose) / 0.5)'},
          '50%': { 'box-shadow': '0 0 15px hsl(var(--glow-red-rose))', 'border-color': 'hsl(var(--glow-red-rose) / 1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'slide-up-fast': 'slide-up-fast 0.3s ease-out forwards',
        'text-gradient': 'text-gradient 3s linear infinite',
        'marquee': 'marquee 20s linear infinite',
        'marquee-lr': 'marquee-lr 30s linear infinite',
        'mesh-flow': 'mesh-flow 15s ease infinite',
        'flow-border': 'flow-border 4s ease-in-out infinite',
        'pulse-glow-soft': 'pulse-glow-soft 3s ease-in-out infinite',
        'light-trace': 'light-trace 4s linear infinite',
        'rotate-glow': 'rotate-glow 10s linear infinite',
        'orbit-glow': 'orbit-glow 5s ease-in-out infinite',
        'heartbeat-pulse': 'heartbeat-pulse 2s infinite',
        'breathing-glow': 'breathing-glow 4s ease-in-out infinite',
        'alert-glow': 'alert-glow 3s ease-in-out infinite',
      },
      boxShadow: {
        'soft': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'glow-teal': '0 0 15px 0 rgba(80, 200, 200, 0.3)',
      },
       backgroundSize: {
        '400': '400% 400%',
      },
    },
  },
  plugins: [
      require('tailwindcss-animate'),
      function({ addUtilities }: { addUtilities: any }) {
        addUtilities({
            '.pause': {
                'animation-play-state': 'paused',
            },
        });
      },
  ],
} satisfies Config;
