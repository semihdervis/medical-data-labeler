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
      boxShadow: {
        'custom': '4px 4px 12px rgba(0, 0, 0, 0.1)', // Custom shadow
      },
    },
  },
  plugins: [],
}

