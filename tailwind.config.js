/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16b4f3',
          light: '#accced',
        },
        secondary: {
          DEFAULT: '#2d2e9b',
          dark: '#1e1f3f',
        },
        neutral: {
          DEFAULT: '#a1a3ae',
          dark: '#53536c',
        },
        background: '#fdfdfe',
      },
    },
  },
  plugins: [],
}