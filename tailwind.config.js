/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bccfff",
          300: "#8fadff",
          400: "#5e83ff",
          500: "#3a5dff",
          600: "#2540ed",
          700: "#1d31c4",
          800: "#1c2c9d",
          900: "#1b2a7a",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(29, 49, 196, 0.25)",
      },
    },
  },
  plugins: [],
};
