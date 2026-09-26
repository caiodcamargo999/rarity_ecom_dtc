import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#000820",
          900: "#00103A",
          850: "#001244",
          800: "#001754",
          700: "#002070",
          600: "#0A2E8C",
          DEFAULT: "#001244",
        },
        brand: {
          teal: "#0FE3B3",
          tealLight: "#38F8CC",
          magenta: "#D80064",
          magentaHover: "#BF0058",
          darkBlue: "#001244",
          navyDark: "#000D30",
          lightGray: "#F3F4F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        instrument: ["var(--font-instrument)", "var(--font-serif)", "serif"],
      },
      boxShadow: {
        "glow-magenta": "0 0 25px rgba(216, 0, 100, 0.45)",
        "glow-teal": "0 0 20px rgba(15, 227, 179, 0.35)",
        "card-soft": "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
