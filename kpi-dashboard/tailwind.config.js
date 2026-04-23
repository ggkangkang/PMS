/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette — Deep ocean teal
        ocean: {
          50:  '#eefbf7',
          100: '#d5f5eb',
          200: '#aeead9',
          300: '#79d9c2',
          400: '#47c1a7',
          500: '#27a78e',
          600: '#1a8774',
          700: '#176c5f',
          800: '#16564d',
          900: '#154740',
          950: '#072925',
        },
        // Accent — Warm coral
        coral: {
          50:  '#fff4f1',
          100: '#ffe7e0',
          200: '#ffd3c6',
          300: '#ffb39e',
          400: '#ff8566',
          500: '#f75e3b',
          600: '#e4421d',
          700: '#c03414',
          800: '#9e2e14',
          900: '#832b18',
          950: '#471207',
        },
        // Warm neutrals
        sand: {
          50:  '#faf9f7',
          100: '#f3f1ed',
          200: '#e6e2da',
          300: '#d4cec2',
          400: '#bfb6a6',
          500: '#ab9f8c',
          600: '#9a8b77',
          700: '#807363',
          800: '#695f53',
          900: '#574f46',
          950: '#2e2924',
        },
        // Semantic states
        emerge: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        caution: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
        'glow-ocean': '0 0 20px rgb(39 167 142 / 0.15)',
        'glow-coral': '0 0 20px rgb(247 94 59 / 0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'progress-fill': 'progressFill 1s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        progressFill: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--progress-offset)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
