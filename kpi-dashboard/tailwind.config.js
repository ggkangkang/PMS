/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        'brand-primary': '#03439a',
        'brand-strong': '#02367b',
        'brand-secondary': '#f0c10f',
        // Surfaces
        'surface-bg': '#f9fafb',
        'surface-white': '#ffffff',
        'surface-dark': '#1d293d',
        'surface-darker': '#020618',
        'surface-gray': '#f3f4f6',
        'surface-gray-strong': '#e5e7eb',
        'surface-success': '#dcfce7',
        'surface-info': '#dff2fe',
        'surface-warn': '#ffedd4',
        'surface-error': '#ffe2e2',
        // Text
        'txt-heading': '#020618',
        'txt-body': '#1d293d',
        'txt-subtitle': '#45556c',
        'txt-muted': '#62748e',
        'txt-disabled': '#90a1b9',
        'txt-on-primary': '#ffffff',
        'txt-success': '#008236',
        'txt-info': '#0069a8',
        'txt-warn': '#ca3500',
        'txt-error': '#c10007',
        // Borders
        'line': '#e5e7eb',
        'line-secondary': '#cad5e2',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'btn': '6px',
        'tag': '6px',
        'container': '8px',
        'card': '12px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
