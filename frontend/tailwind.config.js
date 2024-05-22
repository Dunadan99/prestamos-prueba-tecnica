/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moni: {
          gray: '#a0b4be',
          blue: '#4193EF',
          lightblue: '#70A4EB',
          error: '#ff6363'
        }
      }
    },
  },
  plugins: [],
}