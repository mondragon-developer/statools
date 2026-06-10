/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGrey: '#2A2A2A',
        turquoise: '#4ECDC4',
        darkTeal: '#0F766E',
        accent: '#F59E0B',
        accentDark: '#B45309',
        platinum: '#E6E6E6',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover'],
    },
  },
  plugins: [],
}