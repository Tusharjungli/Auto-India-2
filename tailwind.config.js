/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f1f1f",
        accent: "#3a3a3a",
        highlight: "#d1d1d1",
      },
    },
  },
  plugins: [],
}
