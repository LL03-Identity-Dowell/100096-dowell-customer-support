/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        sm: "300px", // Customizing the small device breakpoint
        md: "1150px",
        lg: "1300px",
      },
      keyframes: {
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(20deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(-20deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        rotate: "rotate 2s infinite",
      },
    },
  },
  plugins: [],
};
