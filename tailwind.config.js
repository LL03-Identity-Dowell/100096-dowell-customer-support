/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      screens: {
        'sm': '300px', // Customizing the small device breakpoint
        'md': '1100px',
        'lg': '1300px'
      },
    },
  },
  plugins: [],
}