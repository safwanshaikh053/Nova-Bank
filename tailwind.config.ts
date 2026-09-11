import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0B1120",
        "on-mint": "#0B1120",
        surface: "#141B2E",
        "surface-raised": "#1B2438",
        border: "#2A3450",
        mint: {
          DEFAULT: "#4CD9C0",
          dim: "#2F9C8A",
        },
        violet: {
          DEFAULT: "#7C8CFF",
          dim: "#5B67C7",
        },
        danger: "#FF6B6B",
        ink: {
          DEFAULT: "#EDEFF7",
          muted: "#8A93AA",
          faint: "#5B6478",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(76, 217, 192, 0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 40px -20px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 20%, rgba(124,140,255,0.10), transparent 40%), radial-gradient(circle at 80% 0%, rgba(76,217,192,0.10), transparent 40%)",
      },
      keyframes: {
        "count-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.6" },
          "70%": { transform: "scale(1.4)", opacity: "0" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
      },
      animation: {
        "count-in": "count-in 0.5s ease-out",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
