import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0B",
        panel: "#111113",
        "panel-2": "#161618",
        line: "#26262A",
        ink: "#F4F4F5",
        muted: "#8A8A90",
        brand: {
          DEFAULT: "#E11D2A",
          dark: "#B5121E",
          light: "#F2434F",
        },
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
        ar: ["IBM Plex Sans Arabic", "system-ui", "sans-serif"],
        display: ["IBM Plex Mono", "ui-monospace", "monospace"],
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
