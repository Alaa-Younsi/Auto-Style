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
        track: "rgb(var(--c-track) / <alpha-value>)",
        "track-2": "rgb(var(--c-track-2) / <alpha-value>)",
        "car-hi": "rgb(var(--c-car-hi) / <alpha-value>)",
        "car-mid": "rgb(var(--c-car-mid) / <alpha-value>)",
        "car-lo": "rgb(var(--c-car-lo) / <alpha-value>)",
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
        "glow-sm": "0 0 24px -10px rgba(225,29,42,0.4)",
        panel: "0 1px 0 0 rgba(128,128,128,0.06) inset, 0 8px 28px -8px rgba(0,0,0,0.35)",
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
        roadDash: {
          from: { backgroundPositionX: "0" },
          to: { backgroundPositionX: "44px" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 24px -8px rgba(225,29,42,0.2)" },
          "50%": { boxShadow: "0 0 44px -8px rgba(225,29,42,0.55)" },
        },
        beamFlicker: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 12s linear infinite",
        marquee: "marquee 30s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
        "road-dash": "roadDash 700ms linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "beam-flicker": "beamFlicker 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
