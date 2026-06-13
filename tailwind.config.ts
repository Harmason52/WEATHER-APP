import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        verse: {
          ink: "#05060f",
          fog: "#0c1024",
          mist: "#141a36",
          glow: "#7c5cff",
          aurora: "#5ce0ff",
          ember: "#ff7a59",
          sun: "#ffd166",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass:
          "0 10px 40px -10px rgba(124,92,255,0.35), inset 0 1px 0 0 rgba(255,255,255,0.08)",
        ring: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -20px rgba(0,0,0,0.45)",
        glow: "0 0 60px -10px rgba(92,224,255,0.6)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        rise: "rise 0.8s cubic-bezier(0.22,1,0.36,1) both",
        pulseSoft: "pulseSoft 3.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%": { transform: "translateX(-10%) translateY(0)" },
          "50%": { transform: "translateX(10%) translateY(-12px)" },
          "100%": { transform: "translateX(-10%) translateY(0)" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
