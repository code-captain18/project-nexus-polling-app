/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B6ECA',
          light: '#5B9AD4',
        },
        secondary: {
          DEFAULT: '#49657B',
          dark: '#191A1D',
        },
        neutral: {
          DEFAULT: '#49657B',
          dark: '#191A1D',
        },
        background: '#FFFFFF',
      },
    },
  },
  plugins: [],
}