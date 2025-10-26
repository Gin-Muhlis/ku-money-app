/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06b6d4', // cyan
        secondary: '#fbbf24', // amber
        accent: '#22c55e', // green
        neutral: '#1e293b', // slate
        'base-100': '#f9fafb', // background
        info: '#3b82f6', // blue
        success: '#10b981', // emerald
        warning: '#f59e0b', // amber
        error: '#ef4444', // red
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        kumoney: {
          primary: "#06b6d4",     // cyan
          secondary: "#fbbf24",   // amber
          accent: "#22c55e",      // green
          neutral: "#1e293b",     // slate
          "base-100": "#f9fafb",  // soft background
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    darkTheme: "kumoney",
  },
}
