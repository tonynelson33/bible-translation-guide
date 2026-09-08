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
        // Warm off-white page ground and a warm near-black. Replaces bare
        // white / neutral-900 so the site reads as considered rather than default.
        paper: "#fcfbf8",
        ink: "#20242c",
        // Structural colour — the navy the site was already built on.
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
        // The one warm accent: a deep old-gold, used sparingly for calls to
        // action, active nav, "worth knowing" callouts, and the spectrum motif.
        // gild-700 on paper and gild-300 on brand-900 both clear WCAG AA.
        gild: {
          50: "#faf6ec",
          100: "#f3e8cf",
          200: "#e5d1a3",
          300: "#d3b571",
          400: "#c0973f",
          500: "#a87c27",
          600: "#8a6018",
          700: "#6f4c14",
          800: "#5a3e16",
          900: "#4c3517",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Quoted scripture only.
        serif: ["var(--font-lora)", "Georgia", "serif"],
        // Headings and the landing hero.
        display: ["var(--font-newsreader)", "Lora", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
