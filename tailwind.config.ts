import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070B14",
          900: "#0B0F19",
          850: "#0D1527",
          800: "#111C38",
          700: "#1A2B56",
          600: "#243B75",
        },
        net: {
          cyan: "#06B6D4",
          blue: "#3B82F6",
          green: "#10B981",
          red: "#EF4444",
          yellow: "#F59E0B",
          orange: "#F97316",
          purple: "#A855F7",
        },
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "Fira Code", "Courier New", "monospace"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
