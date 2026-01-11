
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
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'slide-up': {
            from: { transform: 'translateY(20px)', opacity: '0'},
            to: { transform: 'translateY(0)', opacity: '1'},
        },
        'slide-up-fast': {
            from: { transform: 'translateY(20px)', opacity: '0'},
            to: { transform: 'translateY(0)', opacity: '1'},
        },
        'text-gradient': {
          'to': {
            'background-position': '200% center',
          }
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-lr': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'mesh-flow': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'border-spin': {
            '100%': { transform: 'rotate(1turn)' },
        }
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
        'border-spin': 'border-spin 10s linear infinite',
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
