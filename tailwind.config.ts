import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        canvas: "#0f0e17",
        surface: "#1a1827",
        card: "#211f35",
        border: "#2e2b4a",
        accent: {
          purple: "#7c6af7",
          amber: "#f4a435",
          emerald: "#34d399",
          rose: "#f87171",
        },
      },
      boxShadow: {
        card: "0 2px 20px rgba(0,0,0,0.4)",
        glow: "0 0 30px rgba(124,106,247,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
