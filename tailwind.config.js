/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#12174A',
        secondary: '#282F88'
      },
      fontFamily: {
        bakersville: ['Libre Baskerville', 'serif'],
        lato: 'Lato'
      },
    },
  },
  plugins: [],
}
