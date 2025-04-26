
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
        yellow: '#FFFF00',
        platinum: '#E6E6E6',
      }
    },
  },
  plugins: [],
}