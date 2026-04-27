/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Skool-style brighter blue accent
        'brand-primary': '#2563eb',
        'brand-strong': '#1d4ed8',
        'brand-secondary': '#f0c10f',
        // Surfaces — clean whites & grays
        'surface-bg': '#f9fafb',
        'surface-white': '#ffffff',
        'surface-gray': '#f3f4f6',
        'surface-gray-strong': '#e5e7eb',
        'surface-success': '#dcfce7',
        'surface-info': '#dff2fe',
        'surface-warn': '#ffedd4',
        'surface-error': '#ffe2e2',
        // Text — high contrast, Skool-style
        'txt-heading': '#111827',
        'txt-body': '#374151',
        'txt-subtitle': '#6b7280',
        'txt-muted': '#9ca3af',
        'txt-disabled': '#9ca3af',
        'txt-on-primary': '#ffffff',
        'txt-success': '#008236',
        'txt-info': '#0069a8',
        'txt-warn': '#ca3500',
        'txt-error': '#c10007',
        // Borders
        'line': '#e5e7eb',
        'line-secondary': '#d1d5db',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'btn': '8px',
        'tag': '9999px',
        'container': '8px',
        'card': '12px',
        'pill': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'header': '0 1px 3px 0 rgb(0 0 0 / 0.06)',
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
