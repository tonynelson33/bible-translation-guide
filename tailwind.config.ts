import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3f9",
          100: "#d9e5f2",
          200: "#b6cce3",
          300: "#8caed0",
          400: "#5c88b3",
          500: "#3c6896",
          600: "#2c5079",
          700: "#213f61",
          800: "#1c3350",
          900: "#182a42",
          950: "#0e1a2b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
