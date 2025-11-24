/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1E40AF',
          50: '#EFF6FF',
          100: '#DBEAFE',
        },
        secondary: {
          DEFAULT: '#64748B',
          dark: '#1E293B',
          light: '#94A3B8',
        },
        neutral: {
          DEFAULT: '#64748B',
          dark: '#1E293B',
          light: '#CBD5E1',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: {
          DEFAULT: '#F8FAFC',
          secondary: '#F1F5F9',
        },
      },
    },
  },
  plugins: [],
}