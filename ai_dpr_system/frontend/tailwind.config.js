/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // RiskGuard AI theme colors
        "dpr-ai": {
          primary: "#0A4EBF", // Modern Royal Blue (trustworthy, professional)
          secondary: "#12B0A5", // Teal (innovation and intelligence)
          background: "#F8FAFC", // Soft White (clean and accessible)
          accent: "#FBB13C", // Warm Orange (alerts and highlights)
          text: "#334155", // Charcoal Gray (for strong readability)
          white: "#FFFFFF",
          "blue-50": "#EEF5FF",
          "blue-100": "#DEEAFF",
          "blue-200": "#BCD5FE",
          "blue-300": "#90BCFE",
          "blue-400": "#5D9DFC",
          "blue-500": "#3B82F6",
          "blue-600": "#0A4EBF", // Our primary blue
          "blue-700": "#0A44A9",
          "blue-800": "#0A3A93",
          "blue-900": "#0A307D",
          "green-50": "#EDFCFB",
          "green-100": "#D0F7F5",
          "green-200": "#A3EFEA",
          "green-300": "#66E2DC",
          "green-400": "#33D1C9",
          "green-500": "#12B0A5", // Our teal color
          "green-600": "#0E8F87",
          "green-700": "#0B6F69",
          "green-800": "#09504C",
          "green-900": "#063B37",
          "gold-50": "#FFF8EB",
          "gold-100": "#FFEDC7",
          "gold-200": "#FFDB94",
          "gold-300": "#FEC96A",
          "gold-400": "#FCBB4A",
          "gold-500": "#FBB13C", // Our warm orange
          "gold-600": "#E09723",
          "gold-700": "#C27D1A",
          "gold-800": "#996211",
          "gold-900": "#71490D",
          "gray-50": "#F8FAFC",
          "gray-100": "#F1F5F9",
          "gray-200": "#E2E8F0",
          "gray-300": "#CBD5E1",
          "gray-400": "#94A3B8",
          "gray-500": "#64748B",
          "gray-600": "#475569",
          "gray-700": "#334155",
          "gray-800": "#1E293B",
          "gray-900": "#0F172A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "pulse-glow": {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "slide-in-right": {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        "slide-in-left": {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        "fade-in": {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}