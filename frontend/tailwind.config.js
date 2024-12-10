/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3f51b5",
        secondary: "#303f9f",
        negative: "#d32f2f",
      },
    },
  },
  plugins: [],
}

