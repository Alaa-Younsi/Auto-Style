import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        panel: "rgb(var(--c-panel) / <alpha-value>)",
        "panel-2": "rgb(var(--c-panel-2) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        brand: {
          DEFAULT: "rgb(var(--c-brand) / <alpha-value>)",
          dark: "#B5121E",
          light: "#F2434F",
        },
      },
      fontFamily: {
        mono: ["Rajdhani", "ui-sans-serif", "system-ui", "sans-serif"],
        ar: ["IBM Plex Sans Arabic", "system-ui", "sans-serif"],
        display: ["Rajdhani", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        bento: "28px",
        "bento-lg": "40px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(225,29,42,0.45)",
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 20px 50px -20px rgba(0,0,0,0.8)",
      },
      keyframes: {
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 12s linear infinite",
        marquee: "marquee 30s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
