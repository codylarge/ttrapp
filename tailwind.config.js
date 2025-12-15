/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        remington: ["Remington", "sans-serif"],
        impress: ["Impress", "sans-serif"],
        minnie: ["Minnie", "sans-serif"],
      },
    },
  },
  plugins: [],
}
