/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 100deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#000000",
        background: "#FFFFFF",
        primary: "#e7821d",
        secondary: "#b4b4f3",
        accent: "#232F32"

      },
    },
  },
  plugins: [], 
};
