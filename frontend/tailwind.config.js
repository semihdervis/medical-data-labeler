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
        lightblue: "#5c6bc0",
        hoverblue: "#0f1b65",
        negative: "#d32f2f",
        authbutton: "#1976d2",
        authbuttonhover: "#1565c0",
      },
      boxShadow:{
        'custom-negative': '0 4px 6px rgba(211, 47, 47, 0.5)',
      }
    },
  },
  plugins: [],
}

