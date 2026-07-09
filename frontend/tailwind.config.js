/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        primary: "#312E81", // Indigo 900 for premium brand color
        secondary: "#4F46E5", // Indigo 600
        success: "#16A34A", // Green 600
        warning: "#D97706", // Amber 600
        danger: "#DC2626", // Red 600
        border: "#E2E8F0", // Slate 200
        ink: "#0F172A", // Slate 900
        muted: "#475569", // Slate 600
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.03)",
        glow: "0 0 0 2px rgba(79, 70, 229, 0.1), 0 4px 12px rgba(79, 70, 229, 0.08)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 0%, rgba(79, 102, 241, 0.06), transparent 50%), radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.04), transparent 45%)",
      },
    },
  },
  plugins: [],
};
