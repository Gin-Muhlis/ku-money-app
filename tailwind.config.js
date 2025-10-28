/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        kumoney: {
          primary: '#6366f1',
          'primary-content': '#ffffff',
          secondary: '#fbbf24',
          'secondary-content': '#ffffff',
          accent: '#22c55e',
          'accent-content': '#ffffff',
          neutral: '#1e293b',
          'neutral-content': '#ffffff',
          'base-100': '#f9fafb',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          'base-content': '#1e293b',
          info: '#3b82f6',
          'info-content': '#ffffff',
          success: '#10b981',
          'success-content': '#ffffff',
          warning: '#f59e0b',
          'warning-content': '#ffffff',
          error: '#ef4444',
          'error-content': '#ffffff',
        },
      },
    ],
    defaultTheme: 'kumoney',
  },
}
