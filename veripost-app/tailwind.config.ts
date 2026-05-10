import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#070b16', soft: '#0d1424', card: 'rgba(20, 28, 48, 0.55)' },
        ink: { DEFAULT: '#f8fafc', muted: '#94a3b8', dim: '#64748b' },
        border: { DEFAULT: 'rgba(148, 163, 184, 0.12)', strong: 'rgba(148, 163, 184, 0.22)' },
        primary: { DEFAULT: '#3b82f6', soft: '#60a5fa', deep: '#1d4ed8' },
        success: { DEFAULT: '#10b981', soft: 'rgba(16, 185, 129, 0.12)' },
        danger: { DEFAULT: '#ef4444', soft: 'rgba(239, 68, 68, 0.12)' },
        warning: { DEFAULT: '#f59e0b', soft: 'rgba(245, 158, 11, 0.12)' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)',
        'glow-primary':
          'radial-gradient(circle at top right, rgba(59,130,246,0.15), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,130,246,0.15), 0 20px 60px -20px rgba(59,130,246,0.45)',
        card: '0 25px 50px -12px rgba(0, 0, 0, 0.55)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
